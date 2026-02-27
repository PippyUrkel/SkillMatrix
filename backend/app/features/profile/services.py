import logging
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.query import Query
from appwrite.id import ID
from appwrite.exception import AppwriteException

from app.config import get_settings
from app.features.profile.schemas import (
    ProfileResponse,
    ProfileUpdateRequest,
    UserSkill,
)

logger = logging.getLogger(__name__)


class ProfileService:
    def __init__(self, appwrite_client: Client):
        self.client = appwrite_client
        self.databases = Databases(self.client)
        settings = get_settings()
        self.db_id = settings.appwrite_database_id
        self.profiles_coll = settings.appwrite_profiles_collection_id
        self.skills_coll = settings.appwrite_skills_collection_id

    def get_profile(self, user_id: str) -> dict:
        """Fetch user profile and associated skills."""
        try:
            # Try getting the document, if it fails, create it (upsert pattern)
            try:
                profile_resp = self.databases.get_document(
                    database_id=self.db_id,
                    collection_id=self.profiles_coll,
                    document_id=user_id
                )
            except AppwriteException as e:
                # 404 means the profile doesn't exist yet
                if e.code == 404:
                    profile_resp = self.databases.create_document(
                        database_id=self.db_id,
                        collection_id=self.profiles_coll,
                        document_id=user_id,
                        data={"user_id": user_id}
                    )
                else:
                    raise

            # Fetch skills
            skills_resp = self.databases.list_documents(
                database_id=self.db_id,
                collection_id=self.skills_coll,
                queries=[Query.equal("user_id", user_id)]
            )

            # Structure the response
            return {
                "id": profile_resp.get("user_id", user_id),
                "name": profile_resp.get("name"),
                "target_job": profile_resp.get("target_job"),
                "skills": [
                    {
                        "id": s.get("$id"),
                        "skill_name": s.get("skill_name"),
                        "proficiency_level": s.get("proficiency_level"),
                        "created_at": s.get("$createdAt"),
                    }
                    for s in skills_resp.get("documents", [])
                ],
            }
        except Exception as e:
            logger.error(f"Error fetching profile: {e}")
            raise ValueError("Failed to fetch profile data")

    def update_profile(self, user_id: str, data: ProfileUpdateRequest) -> dict:
        """Update profile fields (name, target_job)."""
        update_data = {k: v for k, v in data.model_dump().items() if v is not None}
        if not update_data:
            return self.get_profile(user_id)
            
        try:
            self.databases.update_document(
                database_id=self.db_id,
                collection_id=self.profiles_coll,
                document_id=user_id,
                data=update_data
            )
            return self.get_profile(user_id)
        except Exception as e:
            logger.error(f"Error updating profile: {e}")
            raise ValueError("Failed to update profile data")

    def add_skill(self, user_id: str, skill_name: str, proficiency_level: str | None = None) -> dict:
        """Add a skill to the user's profile."""
        try:
            skill_name_lower = skill_name.strip().lower()
            # Check if skill already exists for user
            existing = self.databases.list_documents(
                database_id=self.db_id,
                collection_id=self.skills_coll,
                queries=[
                    Query.equal("user_id", user_id),
                    Query.equal("skill_name", skill_name_lower)
                ]
            )
            
            data = {"user_id": user_id, "skill_name": skill_name_lower}
            if proficiency_level:
                data["proficiency_level"] = proficiency_level

            if existing.get("total", 0) > 0:
                doc_id = existing["documents"][0]["$id"]
                self.databases.update_document(
                    database_id=self.db_id,
                    collection_id=self.skills_coll,
                    document_id=doc_id,
                    data=data
                )
            else:
                self.databases.create_document(
                    database_id=self.db_id,
                    collection_id=self.skills_coll,
                    document_id=ID.unique(),
                    data=data
                )
                
            return self.get_profile(user_id)
        except Exception as e:
            logger.error(f"Error adding skill: {e}")
            raise ValueError(f"Failed to add skill: {skill_name}")

    def remove_skill(self, user_id: str, skill_name: str) -> dict:
        """Remove a skill from the user's profile."""
        try:
            skill_name_lower = skill_name.strip().lower()
            existing = self.databases.list_documents(
                database_id=self.db_id,
                collection_id=self.skills_coll,
                queries=[
                    Query.equal("user_id", user_id),
                    Query.equal("skill_name", skill_name_lower)
                ]
            )
            
            for doc in existing.get("documents", []):
                self.databases.delete_document(
                    database_id=self.db_id,
                    collection_id=self.skills_coll,
                    document_id=doc["$id"]
                )
                
            return self.get_profile(user_id)
        except Exception as e:
            logger.error(f"Error removing skill: {e}")
            raise ValueError("Failed to remove skill")
