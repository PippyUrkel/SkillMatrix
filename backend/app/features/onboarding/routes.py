import json
import uuid
import httpx
from fastapi import APIRouter, HTTPException, Depends
from json_repair import repair_json
from ...middleware.auth_middleware import get_current_user
from ...config import get_settings
from .schemas import OnboardingPathsRequest, OnboardingPathsResponse

router = APIRouter(prefix="/api/onboarding", tags=["Onboarding Generation"])
settings = get_settings()

PATHS_PROMPT = """You are an expert career counselor and curriculum architect. 
Create exactly 4 to 6 personalized learning career paths for a user based on their profile.

User Interest Scores (RIASEC): {riasec}
User Current Target Role: {target_role}
User Current Skills: {skills}

CRITICAL INSTRUCTIONS:
1. Return ONLY valid JSON in an array format. No markdown, no ```json or ``` blocks.
2. Each career path object must have the exact properties specified below.
3. The 'icon' property must be one of: "Code", "Server", "Database", "Shield", "Smartphone", "TrendingUp", "Layout", "Activity", "BookOpen".
4. The 'color' property must be a tailwind background class like: "bg-brutal-blue", "bg-brutal-green", "bg-brutal-purple", "bg-brutal-orange", "bg-brutal-pink", "bg-brutal-yellow", "bg-red-500".
5. The 'difficulty' must be one of: "beginner", "intermediate", "advanced".

Format your response exactly like this array of objects:
[
  {{
    "id": "frontend-dev",
    "title": "Frontend Developer",
    "description": "Master modern web development with React and build beautiful UIs.",
    "duration": "3 months",
    "courses": 8,
    "skills": ["React", "TypeScript", "CSS", "Tailwind"],
    "difficulty": "beginner",
    "icon": "Code",
    "color": "bg-brutal-blue",
    "riasec": ["I", "A"]
  }}
]
"""

@router.post("/career-paths", response_model=OnboardingPathsResponse)
async def generate_career_paths(request: OnboardingPathsRequest):
    try:
        riasec_str = str(request.riasec_scores) if request.riasec_scores else "None provided (assume balanced or general)"
        target_role_str = request.target_role if request.target_role else "Software Developer (General)"
        skills_str = ", ".join(request.skills) if request.skills else "None explicitly listed"

        prompt = PATHS_PROMPT.format(
            riasec=riasec_str,
            target_role=target_role_str,
            skills=skills_str
        )
        
        # Make HTTP request to Ollama endpoint
        ollama_url = f"{settings.ollama_endpoint.rstrip('/')}/api/generate"
        payload = {
            "model": settings.ollama_model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.4
            }
        }
        
        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(ollama_url, json=payload)
            resp.raise_for_status()
            response_data = resp.json()
            
        raw_json = response_data.get('response', '')
        
        # Repair and parse the JSON since LLMs can be flaky
        try:
            parsed_paths = json.loads(repair_json(raw_json))
        except Exception as e:
            print(f"JSON Parse Error: {e}")
            print(f"Raw Response: {raw_json}")
            raise HTTPException(status_code=500, detail="Failed to parse career paths from LLM.")
        
        if not isinstance(parsed_paths, list):
            # Sometimes models return {{ "paths": [...] }}
            if isinstance(parsed_paths, dict) and "paths" in parsed_paths:
                 parsed_paths = parsed_paths["paths"]
            else:
                raise HTTPException(status_code=500, detail="Expected list of paths.")
            
        for path in parsed_paths:
            if "id" not in path:
                path["id"] = path.get("title", str(uuid.uuid4())).lower().replace(" ", "-")
            if "riasec" not in path:
                path["riasec"] = ["I", "A"]
            
            # Coerce courses if LLM returned a list of strings instead of course count
            c = path.get("courses")
            if isinstance(c, list):
                path["courses"] = len(c)
            elif isinstance(c, str):
                try:
                    path["courses"] = int(c)
                except ValueError:
                    path["courses"] = 8
            elif not isinstance(c, int):
                path["courses"] = 8
                
        return OnboardingPathsResponse(paths=parsed_paths)
        
    except httpx.ConnectError:
        raise HTTPException(status_code=503, detail="Cannot connect to AI Model (Ollama).")
    except Exception as e:
        print(f"Error generating paths: {e}")
        raise HTTPException(status_code=500, detail=str(e))
