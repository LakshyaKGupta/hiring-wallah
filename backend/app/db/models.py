from pydantic import BaseModel, EmailStr, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
from uuid import UUID

class UserProfileUpsert(BaseModel):
    role: str = Field(..., pattern="^(recruiter|candidate)$")
    display_name: Optional[str] = None
    company_name: Optional[str] = None

class UserProfileResponse(BaseModel):
    firebase_uid: str
    email: Optional[EmailStr] = None
    display_name: Optional[str] = None
    photo_url: Optional[str] = None
    role: str
    company_id: Optional[UUID] = None
    company_name: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

# Job Models
class JobCreate(BaseModel):
    title: str = Field(..., example="Software Engineer")
    company: Optional[str] = Field(None, example="Hiring Wallah")
    location: Optional[str] = Field(None, example="Remote")
    experience_range: Optional[str] = Field(None, example="2-5 years")
    description: str = Field(..., example="Looking for a Python developer with FastAPI experience.")

class JobResponse(BaseModel):
    id: UUID
    title: str
    company: Optional[str]
    location: Optional[str] = None
    experience_range: Optional[str] = None
    description: str
    requirement_analysis: Optional[Dict[str, Any]] = None
    evaluation_framework: Optional[Dict[str, Any]] = None
    ai_status: Optional[str] = None
    owner_uid: Optional[str] = None
    company_id: Optional[UUID] = None
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
