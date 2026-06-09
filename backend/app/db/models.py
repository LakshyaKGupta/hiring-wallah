from pydantic import BaseModel, EmailStr, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
from uuid import UUID

# Job Models
class JobCreate(BaseModel):
    title: str = Field(..., example="Software Engineer")
    company: Optional[str] = Field(None, example="Hiring Wallah")
    description: str = Field(..., example="Looking for a Python developer with FastAPI experience.")

class JobResponse(BaseModel):
    id: UUID
    title: str
    company: Optional[str]
    description: str
    requirement_analysis: Optional[Dict[str, Any]] = None
    evaluation_framework: Optional[Dict[str, Any]] = None
    created_at: datetime

# Candidate Models
class CandidateResponse(BaseModel):
    id: UUID
    name: Optional[str]
    email: Optional[str]
    parsed_profile: Optional[Dict[str, Any]] = None
    raw_resume_text: Optional[str]
    created_at: datetime

# Evaluation Models
class EvaluationResponse(BaseModel):
    id: UUID
    candidate_id: UUID
    job_id: UUID
    score: int
    breakdown: Dict[str, Any]
    strengths: List[str]
    weaknesses: List[str]
    evidence: List[str]
    devils_advocate: Optional[Dict[str, Any]] = None
    created_at: datetime

# Decision Models
class DecisionResponse(BaseModel):
    id: UUID
    candidate_id: UUID
    job_id: UUID
    verdict: str
    confidence: int
    explanation: str
    interview_questions: List[str]
    ranking: Optional[int] = None
    created_at: datetime

# Candidate Session Models
class CandidateSessionResponse(BaseModel):
    id: UUID
    candidate_id: UUID
    target_role: str
    fit_score: int
    skill_gaps: Dict[str, Any]
    tailored_resume_suggestions: Dict[str, Any]
    cover_letter: str
    interview_prep: Dict[str, Any]
    job_recommendations: Optional[Dict[str, Any]] = None
    created_at: datetime

# API Pipeline Requests & Responses
class RecruiterEvaluateResponse(BaseModel):
    job: JobResponse
    candidates: List[Dict[str, Any]] # Combined profile, evaluation, critique, decision

class CandidateAnalyzeRequest(BaseModel):
    target_role: str
