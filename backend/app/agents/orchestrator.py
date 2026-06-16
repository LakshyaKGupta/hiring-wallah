import logging
from typing import List, Dict, Any, Tuple
from app.utils.gemini_client import GeminiClient
from app.parsers.resume_parser import parse_resume
from app.db.database import db

from app.agents.requirement_analyst import RequirementAnalyst
from app.agents.hiring_strategist import HiringStrategist
from app.agents.resume_investigator import ResumeInvestigator
from app.agents.candidate_evaluator import CandidateEvaluator
from app.agents.devils_advocate import DevilsAdvocate
from app.agents.hiring_committee import HiringCommittee
from app.agents.candidate_analyst import CandidateAnalyst

logger = logging.getLogger("hiring_wallah.orchestrator")

class Orchestrator:
    def __init__(self):
        self.gemini_client = GeminiClient()
        self.requirement_analyst = RequirementAnalyst(self.gemini_client)
        self.hiring_strategist = HiringStrategist(self.gemini_client)
        self.resume_investigator = ResumeInvestigator(self.gemini_client)
        self.candidate_evaluator = CandidateEvaluator(self.gemini_client)
        self.devils_advocate = DevilsAdvocate(self.gemini_client)
        self.hiring_committee = HiringCommittee(self.gemini_client)
        self.candidate_analyst = CandidateAnalyst(self.gemini_client)

    async def run_job_setup(
        self,
        title: str,
        company: str,
        description: str,
        owner_uid: str | None = None,
        company_id: str | None = None,
        location: str | None = None,
        experience_range: str | None = None,
    ) -> Dict[str, Any]:
        """
        Runs Agent 1 (Requirement Analyst) and Agent 2 (Hiring Strategist) on a new job
        description, then creates a job record in the database.
        """
        logger.info(f"Orchestration: Creating job '{title}'...")
        job = await db.create_job(
            title=title,
            company=company,
            location=location,
            experience_range=experience_range,
            description=description,
            requirement_analysis={},
            evaluation_framework={},
            ai_status="pending",
            owner_uid=owner_uid,
            company_id=company_id,
        )
        try:
            req_analysis = await self.requirement_analyst.run({"jd": description})
            framework = await self.hiring_strategist.run({"requirements": req_analysis})
            await db.update_job_ai(job["id"], req_analysis, framework, "ready")
            job = await db.get_job(job["id"]) or job
        except Exception as exc:
            logger.warning("Job saved but AI rubric generation failed: %s", exc)
            await db.update_job_ai(job["id"], {}, {}, "unavailable")
            job = await db.get_job(job["id"]) or job
        return job

    async def run_candidate_evaluation(self, job_id: str, resume_bytes: bytes, filename: str = "") -> Dict[str, Any]:
        """
        Runs the full candidate pipeline (Agents 3 to 6) against a job's framework.
        """
        # Fetch the job to get the evaluation framework
        job = await db.get_job(job_id)
        if not job:
            raise ValueError(f"Job with ID {job_id} not found.")
            
        framework = job.get("evaluation_framework", {})
        
        # Step 3: Extract resume text
        resume_text = parse_resume(resume_bytes, filename)
        if not resume_text:
            raise ValueError(f"Unable to parse or extract text from file {filename}")
            
        # Run Agent 3: Resume Investigator
        profile = await self.resume_investigator.run({"resume": resume_text})
        
        # Extract candidate details if parsed
        name = profile.get("name") or filename or "Unknown Candidate"
        email = profile.get("email") or ""
        
        # Store Candidate in DB
        candidate = await db.create_candidate(
            name=name,
            email=email,
            parsed_profile=profile,
            raw_resume_text=resume_text
        )
        candidate_id = candidate["id"]
        resume = await db.create_resume(
            job_id=job_id,
            candidate_id=candidate_id,
            file_name=filename,
            file_type=filename.rsplit(".", 1)[-1].lower() if "." in filename else "pdf",
            raw_text=resume_text,
        )
        
        # Run Agent 4: Candidate Evaluator
        evaluation = await self.candidate_evaluator.run({
            "profile": profile,
            "framework": framework
        })
        
        # Run Agent 5: Devil's Advocate
        critique = await self.devils_advocate.run({"evaluation": evaluation})
        
        # Run Agent 6: Hiring Committee
        decision = await self.hiring_committee.run({
            "evaluation": evaluation,
            "critique": critique
        })
        
        # Save evaluation in DB
        eval_record = await db.create_evaluation(
            candidate_id=candidate_id,
            job_id=job_id,
            score=evaluation.get("overall_score") or 0,
            breakdown=evaluation.get("breakdown") or {},
            strengths=evaluation.get("strengths") or [],
            weaknesses=evaluation.get("weaknesses") or [],
            evidence=profile.get("skills_demonstrated") or [],
            devils_advocate=critique,
            resume_id=resume.get("id"),
        )
        
        # Save decision in DB
        decision_record = await db.create_decision(
            candidate_id=candidate_id,
            job_id=job_id,
            verdict=decision.get("verdict") or "Reject",
            confidence=decision.get("confidence") or 0,
            explanation=decision.get("final_explanation") or "",
            interview_questions=decision.get("suggested_interview_questions") or [],
            ranking=999 # Placeholder, will be updated during global sorting
        )
        report = await db.create_report(
            evaluation_id=eval_record["id"],
            candidate_id=candidate_id,
            job_id=job_id,
            report_data={
                "candidate_score": eval_record.get("score", 0),
                "strengths": eval_record.get("strengths", []),
                "weaknesses": eval_record.get("weaknesses", []),
                "evidence": eval_record.get("evidence", []),
                "risk_factors": critique.get("risks") or critique.get("risk_factors") or critique,
                "final_recommendation": decision_record.get("verdict"),
                "interview_questions": decision_record.get("interview_questions", []),
                "explanation": decision_record.get("explanation", ""),
            },
        )
        
        return {
            "candidate": candidate,
            "evaluation": eval_record,
            "critique": critique,
            "decision": decision_record,
            "report": report,
        }

    async def evaluate_multiple_candidates(self, job_id: str, resumes: List[Tuple[bytes, str]]) -> List[Dict[str, Any]]:
        """
        Evaluates multiple candidates, updates their database ranks, and returns sorted results.
        """
        logger.info(f"Orchestration: Evaluating {len(resumes)} resumes for job {job_id}...")
        
        for resume_bytes, filename in resumes:
            try:
                await self.run_candidate_evaluation(job_id, resume_bytes, filename)
            except Exception as e:
                logger.error(f"Failed to evaluate candidate from {filename}: {e}")
                
        # Re-fetch all job results from DB
        results = await db.get_job_results(job_id)
        
        # Rank candidates based on confidence x score
        # Sort by verdict severity (Strong Hire > Consider > Reject) and score
        verdict_weights = {"Strong Hire": 3, "Consider": 2, "Reject": 1}
        
        def _get_sort_key(res):
            verdict = res["decision"].get("verdict", "Reject")
            score = res["evaluation"].get("score", 0)
            confidence = res["decision"].get("confidence", 0)
            # Higher verdict weight, higher score, higher confidence
            return (verdict_weights.get(verdict, 1), score, confidence)
            
        results_sorted = sorted(results, key=_get_sort_key, reverse=True)
        
        # Update rankings in database
        for index, item in enumerate(results_sorted):
            rank = index + 1
            item["decision"]["ranking"] = rank
            
            # Update ranking in the configured SQL database.
            d_id = item["decision"]["id"]
            if d_id:
                await db.update_decision_ranking(d_id, rank)
                
        return results_sorted

    async def run_candidate_analysis(self, target_role: str, resume_bytes: bytes, filename: str = "") -> Dict[str, Any]:
        """
        Runs the Candidate-Side flow: parses resume, runs CandidateAnalyst agent,
        and saves candidate session data.
        """
        logger.info(f"Orchestration: Running candidate flow for target role '{target_role}'...")
        
        # Step 1: Parse resume
        resume_text = parse_resume(resume_bytes, filename)
        if not resume_text:
            raise ValueError(f"Unable to parse or extract text from resume.")
            
        # Step 2: Run investigator to build structured profile
        profile = await self.resume_investigator.run({"resume": resume_text})
        name = profile.get("name") or filename or "Candidate"
        email = profile.get("email") or ""
        
        # Create candidate record
        candidate = await db.create_candidate(
            name=name,
            email=email,
            parsed_profile=profile,
            raw_resume_text=resume_text
        )
        candidate_id = candidate["id"]
        
        # Step 3: Run Candidate Analyst Agent
        analysis = await self.candidate_analyst.run({
            "profile": profile,
            "target_role": target_role
        })
        
        # Save session in DB
        session = await db.create_candidate_session(
            candidate_id=candidate_id,
            target_role=target_role,
            fit_score=analysis.get("fit_score") or 0,
            skill_gaps=analysis.get("skill_gaps") or {},
            tailored_resume_suggestions=analysis.get("tailored_resume_suggestions") or {},
            cover_letter=analysis.get("cover_letter") or "",
            interview_prep=analysis.get("interview_prep") or {},
            job_recommendations=analysis.get("job_recommendations") or {}
        )
        
        return {
            "candidate": candidate,
            "session": session
        }

# Instantiate global orchestrator
orchestrator = Orchestrator()
