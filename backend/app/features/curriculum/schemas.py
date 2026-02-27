from pydantic import BaseModel, Field
from enum import Enum


# ---------- Enums ----------

class PlacementReason(str, Enum):
    intro = "intro"
    concept = "concept"
    demo = "demo"
    practice = "practice"


# ---------- Request Models ----------

class UserProfile(BaseModel):
    strong_subskills: list[str] = Field(
        default_factory=list,
        description="Skills the user is already proficient in",
    )
    weak_subskills: list[str] = Field(
        default_factory=list,
        description="Skills the user needs to improve",
    )
    current_level: str = Field(
        default="beginner",
        description="Current proficiency level: beginner, intermediate, or advanced",
    )


class Constraints(BaseModel):
    daily_time_minutes: int = Field(
        default=60,
        ge=15,
        le=480,
        description="Maximum study time per day in minutes",
    )
    target_course_duration_days: int = Field(
        default=7,
        ge=1,
        le=90,
        description="Total number of days to complete the course",
    )


class CurriculumRequest(BaseModel):
    user_profile: UserProfile
    constraints: Constraints
    course_topic: str = Field(
        ...,
        min_length=3,
        max_length=200,
        description="The main topic for the course",
    )
    pace_adjustment: float = Field(
        default=1.0,
        ge=0.5,
        le=2.0,
        description="FL-predicted pace factor: <1.0 = accelerate, >1.0 = slow down",
    )


# ---------- Response Models ----------

class VideoItem(BaseModel):
    title: str
    youtube_url: str
    duration_minutes: int
    placement_reason: PlacementReason


class ModuleItem(BaseModel):
    module_number: int
    module_title: str
    learning_objective: str
    total_duration_minutes: int
    videos: list[VideoItem]


class CurriculumResponse(BaseModel):
    course_title: str
    level: str
    total_modules: int
    estimated_completion_days: int
    modules: list[ModuleItem]
