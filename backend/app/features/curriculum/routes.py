from fastapi import APIRouter, HTTPException

from app.features.curriculum.schemas import CurriculumRequest, CurriculumResponse
from app.features.curriculum.services import CurriculumService

router = APIRouter(prefix="/api/curriculum", tags=["curriculum"])


# ---------- Routes ----------


@router.post("/generate", response_model=CurriculumResponse)
async def generate_curriculum(body: CurriculumRequest):
    """
    Generate a structured course curriculum based on the user's skill gaps.

    Accepts a user profile (with weak/strong subskills), constraints
    (daily time, duration), and a course topic. Returns a modular,
    progressive course roadmap with real YouTube video links.
    """
    try:
        service = CurriculumService()
        result = await service.generate_curriculum(body)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Curriculum generation failed: {e}")
