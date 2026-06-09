from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.db.database import db
from app.agents.orchestrator import orchestrator
import logging

logger = logging.getLogger("hiring_wallah.api.candidate")

router = APIRouter(prefix="/candidate", tags=["Candidate"])

@router.post("/analyze")
async def analyze_candidate_profile_endpoint(
    target_role: str = Form(...),
    resume: UploadFile = File(...)
):
    """
    Analyzes a candidate resume against their target role. Returns the generated
    application preparation session details.
    """
    try:
        content = await resume.read()
        result = await orchestrator.run_candidate_analysis(
            target_role=target_role,
            resume_bytes=content,
            filename=resume.filename
        )
        return result
    except Exception as e:
        logger.error(f"Error executing candidate analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Candidate analysis failed: {str(e)}")

@router.get("/report/{session_id}")
async def get_candidate_report_endpoint(session_id: str):
    """
    Retrieves a candidate's previous application strategy and preparation report.
    """
    try:
        session = await db.get_candidate_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Candidate session report not found.")
            
        candidate = await db.get_candidate(session["candidate_id"])
        
        return {
            "session": session,
            "candidate": candidate
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching candidate report {session_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve candidate report.")
