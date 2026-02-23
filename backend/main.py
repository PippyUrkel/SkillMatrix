from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.features.auth.routes import router as auth_router

settings = get_settings()

app = FastAPI(
    title="SkillMatrix API",
    description="Skill Gap Analyser Backend",
    version="0.1.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)


@app.get("/")
async def root():
    return {"message": "SkillMatrix API is running"}
