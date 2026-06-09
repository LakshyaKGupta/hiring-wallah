from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from typing import List, Optional
from app.db.models import JobCreate, JobResponse, EvaluationResponse, DecisionResponse
from app.db.database import db
from app.agents.orchestrator import orchestrator
import logging

logger = logging.getLogger("hiring_wallah.api.recruiter")

router = APIRouter(prefix="/recruiter", tags=["Recruiter"])

@router.post("/job", response_model=JobResponse)
async def create_job_endpoint(job: JobCreate):
    """
    Creates a job, runs Agent 1 (Requirement Analyst) and Agent 2 (Hiring Strategist),
    and stores the resulting analysis and rubric framework in the database.
    """
    try:
        new_job = await orchestrator.run_job_setup(
            title=job.title,
            company=job.company or "",
            description=job.description
        )
        return new_job
    except Exception as e:
        logger.error(f"Error creating job rubric: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create job rubric: {str(e)}")

@router.post("/evaluate")
async def evaluate_resumes_endpoint(
    job_id: str = Form(...),
    resumes: List[UploadFile] = File(...)
):
    """
    Uploads candidate resumes, runs the 4-stage assessment pipeline (Agents 3 to 6)
    against the job's framework, and returns the list of ranked candidate recommendations.
    """
    if not resumes:
        raise HTTPException(status_code=400, detail="No resumes uploaded.")
        
    # Check if job exists
    job = await db.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job with ID {job_id} not found.")

    resumes_data = []
    for file in resumes:
        try:
            content = await file.read()
            resumes_data.append((content, file.filename))
        except Exception as e:
            logger.error(f"Failed to read file {file.filename}: {e}")
            
    if not resumes_data:
        raise HTTPException(status_code=400, detail="Failed to read any of the uploaded resumes.")
        
    try:
        # Run orchestrator evaluations synchronously for the API response
        results = await orchestrator.evaluate_multiple_candidates(job_id, resumes_data)
        return {"results": results}
    except Exception as e:
        logger.error(f"Error evaluating candidates: {e}")
        raise HTTPException(status_code=500, detail=f"Evaluation pipeline failed: {str(e)}")

@router.get("/job/{job_id}/results")
async def get_job_results_endpoint(job_id: str):
    """
    Returns all candidate evaluations and final decisions for a specific job description.
    """
    job = await db.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job with ID {job_id} not found.")
        
    try:
        results = await db.get_job_results(job_id)
        return {"results": results}
    except Exception as e:
        logger.error(f"Error fetching results for job {job_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve job results.")

@router.get("/evaluation/{eval_id}")
async def get_single_evaluation_endpoint(eval_id: str):
    """
    Returns a single evaluation with its breakdown, candidate profile, and decision details.
    """
    try:
        evaluation = await db.get_evaluation(eval_id)
        if not evaluation:
            raise HTTPException(status_code=404, detail="Evaluation details not found.")
            
        candidate = await db.get_candidate(evaluation["candidate_id"])
        
        # Get decisions for this candidate and job
        job_id = evaluation["job_id"]
        results = await db.get_job_results(job_id)
        decision = {}
        for r in results:
            if r["evaluation_id"] == eval_id:
                decision = r["decision"]
                break
                
        return {
            "evaluation": evaluation,
            "candidate": candidate,
            "decision": decision
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching evaluation {eval_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve evaluation details.")
