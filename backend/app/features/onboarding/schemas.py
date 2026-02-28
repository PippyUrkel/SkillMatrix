from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class CareerPath(BaseModel):
    id: str
    title: str
    description: str
    duration: str
    courses: Any = 8
    skills: List[str]
    difficulty: str  # 'beginner' | 'intermediate' | 'advanced'
    icon: str  # A string identifier for an icon, e.g. "Code", "Server", "Database", "Shield"
    color: str # A tailwind color string e.g., "bg-brutal-blue"
    riasec: Optional[List[str]] = []

class OnboardingPathsRequest(BaseModel):
    riasec_scores: Optional[Dict[str, float]] = None
    target_role: Optional[str] = None
    # We can accept the summary array or plain text of skills
    skills: Optional[List[str]] = None

class OnboardingPathsResponse(BaseModel):
    paths: List[CareerPath]
