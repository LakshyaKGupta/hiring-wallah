import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.recruiter import router as recruiter_router
from app.api.candidate import router as candidate_router
from app.api.jobs import router as jobs_router
from app.api.auth import router as auth_router
import logging

logger = logging.getLogger("hiring_wallah.main")

app = FastAPI(
    title="Hiring Wallah Backend",
    description="Autonomous Hiring Intelligence API for JD analysis, resume evaluation, ranking, and reports.",
    version="1.0.0"
)

# Configure CORS
origins = settings.cors_origins_list
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(recruiter_router)
app.include_router(candidate_router)
app.include_router(jobs_router)
app.include_router(auth_router)

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "Hiring Wallah Backend API",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    logger.info("Starting Hiring Wallah backend service...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
