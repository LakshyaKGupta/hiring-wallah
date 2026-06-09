from fastapi import APIRouter, HTTPException
from typing import List
from app.db.models import JobCreate, JobResponse
from app.db.database import db
from app.agents.orchestrator import orchestrator
import logging

logger = logging.getLogger("hiring_wallah.api.jobs")

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.get("", response_model=List[JobResponse])
async def list_jobs_endpoint():
    """
    Returns a list of all jobs configured in the database, including their evaluation criteria.
    """
    try:
        jobs = await db.get_all_jobs()
        return jobs
    except Exception as e:
        logger.error(f"Error fetching jobs: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve jobs list.")

@router.post("", response_model=JobResponse)
async def create_simple_job_endpoint(job: JobCreate):
    """
    Manually creates a new job profile and triggers its evaluation framework setup.
    """
    try:
        new_job = await orchestrator.run_job_setup(
            title=job.title,
            company=job.company or "",
            description=job.description
        )
        return new_job
    except Exception as e:
        logger.error(f"Error setting up job: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create job: {str(e)}")
