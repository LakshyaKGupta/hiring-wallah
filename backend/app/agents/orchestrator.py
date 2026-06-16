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

    def _clamp(self, value: Any, low: int = 0, high: int = 100) -> int:
        try:
            number = int(round(float(value)))
        except (TypeError, ValueError):
            number = low
        return max(low, min(high, number))

    def _as_list(self, value: Any) -> List[Any]:
        if value is None:
            return []
        if isinstance(value, list):
            return value
        return [value]

    def _normalize_requirement_analysis(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "must_have": self._as_list(analysis.get("must_have")),
            "preferred": self._as_list(analysis.get("preferred") or analysis.get("good_to_have")),
            "red_flags": self._as_list(analysis.get("red_flags")),
            "success_signals": self._as_list(analysis.get("success_signals") or analysis.get("priorities")),
            "role_level": analysis.get("role_level") or "",
            "domain": analysis.get("domain") or "",
        }

    def _normalize_framework(self, framework: Dict[str, Any]) -> Dict[str, Any]:
        raw_criteria = framework.get("criteria")
        if not raw_criteria and isinstance(framework.get("evaluation_framework"), dict):
            criteria_per_dimension = framework.get("criteria_per_dimension") or {}
            raw_criteria = [
                {
                    "name": name,
                    "weight": weight,
                    "signals": self._as_list(criteria_per_dimension.get(name)),
                }
                for name, weight in framework["evaluation_framework"].items()
            ]

        criteria: List[Dict[str, Any]] = []
        for item in self._as_list(raw_criteria):
            if isinstance(item, dict):
                name = str(item.get("name") or item.get("dimension") or "").strip()
                if not name:
                    continue
                criteria.append({
                    "name": name,
                    "weight": self._clamp(item.get("weight"), 0, 100),
                    "signals": [str(signal) for signal in self._as_list(item.get("signals")) if str(signal).strip()],
                })

        if not criteria:
            criteria = [
                {"name": "Role Fit", "weight": 40, "signals": ["Evidence directly matches must-have requirements"]},
                {"name": "Execution Evidence", "weight": 35, "signals": ["Resume shows shipped work or measurable outcomes"]},
                {"name": "Risk Control", "weight": 25, "signals": ["Resume has enough evidence to reduce hiring uncertainty"]},
            ]

        total = sum(item["weight"] for item in criteria)
        if total <= 0:
            equal = 100 // len(criteria)
            for item in criteria:
                item["weight"] = equal
            criteria[-1]["weight"] += 100 - sum(item["weight"] for item in criteria)
        elif total != 100:
            running = 0
            for item in criteria[:-1]:
                item["weight"] = max(1, round((item["weight"] / total) * 100))
                running += item["weight"]
            criteria[-1]["weight"] = max(1, 100 - running)

        weights = {item["name"]: item["weight"] for item in criteria}
        return {
            "criteria": criteria,
            "weights": weights,
            "rationale": framework.get("rationale") or "",
        }

    def _normalize_evidence_item(self, item: Any, default_type: str = "experience") -> Dict[str, str]:
        if isinstance(item, dict):
            claim = str(item.get("claim") or item.get("name") or item.get("title") or item.get("evidence") or "").strip()
            evidence = str(item.get("evidence") or item.get("detail") or item.get("description") or claim).strip()
            return {
                "claim": claim or evidence,
                "evidence": evidence or claim,
                "resume_section": str(item.get("resume_section") or item.get("source") or "Resume"),
                "evidence_type": str(item.get("evidence_type") or default_type),
                "quality": str(item.get("quality") or "moderate"),
            }
        text = str(item or "").strip()
        return {
            "claim": text,
            "evidence": text,
            "resume_section": "Resume",
            "evidence_type": default_type,
            "quality": "moderate",
        }

    def _normalize_profile(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        projects = self._as_list(profile.get("projects"))
        achievements = self._as_list(profile.get("achievements") or profile.get("quantified_achievements"))
        evidence_items = [self._normalize_evidence_item(item) for item in self._as_list(profile.get("evidence"))]

        for project in projects:
            if isinstance(project, dict):
                for evidence in self._as_list(project.get("evidence")):
                    evidence_items.append(self._normalize_evidence_item({
                        "claim": project.get("name") or evidence,
                        "evidence": evidence,
                        "resume_section": "Projects",
                        "evidence_type": "project",
                        "quality": "strong" if project.get("impact") else "moderate",
                    }))
                if project.get("impact"):
                    evidence_items.append(self._normalize_evidence_item({
                        "claim": f"Impact from {project.get('name') or 'project'}",
                        "evidence": project.get("impact"),
                        "resume_section": "Projects",
                        "evidence_type": "impact",
                        "quality": "strong",
                    }))
        for achievement in achievements:
            evidence_items.append(self._normalize_evidence_item({
                "claim": str(achievement),
                "evidence": str(achievement),
                "resume_section": "Achievements",
                "evidence_type": "achievement",
                "quality": "strong" if any(char.isdigit() for char in str(achievement)) else "moderate",
            }))

        deduped = []
        seen = set()
        for item in evidence_items:
            key = (item["claim"], item["evidence"])
            if item["claim"] and item["evidence"] and key not in seen:
                deduped.append(item)
                seen.add(key)

        return {
            "candidate_name": profile.get("candidate_name") or profile.get("name") or "",
            "skills": self._as_list(profile.get("skills") or profile.get("skills_demonstrated")),
            "experience": self._as_list(profile.get("experience") or profile.get("career_trajectory")),
            "projects": projects,
            "achievements": achievements,
            "evidence": deduped,
            "missing_evidence": self._as_list(profile.get("missing_evidence")),
        }

    def _normalize_evaluation(self, evaluation: Dict[str, Any], profile: Dict[str, Any], framework: Dict[str, Any]) -> Dict[str, Any]:
        evidence_fallback = profile.get("evidence") or []
        if not evidence_fallback:
            raise ValueError("Resume Investigator produced no evidence. Evaluation rejected.")

        criteria = framework.get("criteria") or []
        breakdown = evaluation.get("breakdown") or {}
        normalized_breakdown: Dict[str, Any] = {}
        for criterion in criteria:
            name = criterion.get("name")
            raw = breakdown.get(name) if isinstance(breakdown, dict) else {}
            raw = raw if isinstance(raw, dict) else {}
            raw_evidence = self._as_list(raw.get("evidence")) or evidence_fallback[:1]
            normalized_breakdown[name] = {
                "score": self._clamp(raw.get("score")),
                "evidence": [self._normalize_evidence_item(item) for item in raw_evidence],
                "justification": raw.get("justification") or "Scored from available resume evidence.",
            }

        if not normalized_breakdown and isinstance(breakdown, dict):
            for name, raw in breakdown.items():
                raw = raw if isinstance(raw, dict) else {}
                normalized_breakdown[str(name)] = {
                    "score": self._clamp(raw.get("score")),
                    "evidence": [self._normalize_evidence_item(item) for item in (self._as_list(raw.get("evidence")) or evidence_fallback[:1])],
                    "justification": raw.get("justification") or "Scored from available resume evidence.",
                }

        strengths = []
        for item in self._as_list(evaluation.get("strengths")):
            if isinstance(item, dict):
                normalized = self._normalize_evidence_item(item)
            else:
                fallback = evidence_fallback[0]
                normalized = {
                    "claim": str(item),
                    "evidence": fallback.get("evidence") if isinstance(fallback, dict) else str(fallback),
                    "resume_section": fallback.get("resume_section", "Resume") if isinstance(fallback, dict) else "Resume",
                }
            if normalized.get("evidence"):
                strengths.append(normalized)

        weaknesses = []
        for item in self._as_list(evaluation.get("weaknesses")):
            if isinstance(item, dict):
                weaknesses.append({
                    "claim": str(item.get("claim") or item.get("weakness") or item.get("area") or ""),
                    "missing_or_weak_evidence": str(item.get("missing_or_weak_evidence") or item.get("evidence") or item.get("reason") or ""),
                })
            else:
                weaknesses.append({"claim": str(item), "missing_or_weak_evidence": str(item)})

        if not strengths:
            raise ValueError("Candidate Evaluator produced no evidence-backed strengths. Evaluation rejected.")

        return {
            "overall_score": self._clamp(evaluation.get("overall_score")),
            "breakdown": normalized_breakdown,
            "strengths": strengths,
            "weaknesses": [item for item in weaknesses if item.get("claim") or item.get("missing_or_weak_evidence")],
            "evidence_quality": evaluation.get("evidence_quality") or "moderate",
        }

    def _normalize_critique(self, critique: Dict[str, Any]) -> Dict[str, Any]:
        concerns = critique.get("concerns") or critique.get("contested_claims") or []
        normalized_concerns = []
        for item in self._as_list(concerns):
            if isinstance(item, dict):
                normalized_concerns.append({
                    "claim": item.get("claim") or item.get("original_claim") or "",
                    "concern": item.get("concern") or item.get("counter") or "",
                    "severity": item.get("severity") or "medium",
                })
            else:
                normalized_concerns.append({"claim": str(item), "concern": str(item), "severity": "medium"})
        return {
            "concerns": normalized_concerns,
            "unsupported_claims": self._as_list(critique.get("unsupported_claims")),
            "risk_factors": self._as_list(critique.get("risk_factors") or critique.get("risks")),
            "potential_bias": self._as_list(critique.get("potential_bias")),
            "overall_confidence_adjustment": self._clamp(critique.get("overall_confidence_adjustment"), -40, 0),
            "recommendation": critique.get("recommendation") or "flag",
        }

    def _calculate_confidence(self, evaluation: Dict[str, Any], critique: Dict[str, Any], framework: Dict[str, Any], model_confidence: Any) -> int:
        criteria_count = max(1, len(framework.get("criteria") or []))
        covered = sum(1 for item in (evaluation.get("breakdown") or {}).values() if item.get("evidence"))
        coverage_score = min(100, round((covered / criteria_count) * 100))
        evidence_quality = str(evaluation.get("evidence_quality") or "moderate").lower()
        quality_score = {"strong": 100, "moderate": 70, "weak": 40}.get(evidence_quality, 60)
        risk_penalty = min(35, len(critique.get("risk_factors") or []) * 7 + len(critique.get("unsupported_claims") or []) * 8)
        adjustment = critique.get("overall_confidence_adjustment") or 0
        base = (
            self._clamp(evaluation.get("overall_score")) * 0.35
            + self._clamp(model_confidence or evaluation.get("overall_score")) * 0.25
            + coverage_score * 0.25
            + quality_score * 0.15
            + adjustment
            - risk_penalty
        )
        return self._clamp(base)

    def _ranking_rationale(self, item: Dict[str, Any]) -> Dict[str, Any]:
        evaluation = item["evaluation"]
        decision = item["decision"]
        strengths = evaluation.get("strengths") or []
        weaknesses = evaluation.get("weaknesses") or []
        critique = item.get("critique") or {}
        return {
            "summary": f"{decision.get('verdict', 'Candidate')} with {decision.get('confidence', 0)}% confidence based on evidence coverage and unresolved risks.",
            "why_hire": [entry.get("claim") if isinstance(entry, dict) else str(entry) for entry in strengths[:3]],
            "why_not_hire": [entry.get("claim") if isinstance(entry, dict) else str(entry) for entry in weaknesses[:3]],
            "risks": critique.get("risk_factors") or [],
            "evidence_count": len(evaluation.get("evidence_items") or evaluation.get("evidence") or []),
        }

    def _comparison_rationale(self, winner: Dict[str, Any], runner_up: Dict[str, Any]) -> Dict[str, Any]:
        winner_name = winner["profile"].get("name") or "Candidate A"
        runner_name = runner_up["profile"].get("name") or "Candidate B"
        winner_strengths = winner["evaluation"].get("strengths") or []
        runner_risks = (runner_up.get("critique") or {}).get("risk_factors") or runner_up["evaluation"].get("weaknesses") or []
        return {
            "summary": f"{winner_name} outranks {runner_name} because the evidence produced a stronger verdict, score, or confidence for this role.",
            "winner_edge": [entry.get("claim") if isinstance(entry, dict) else str(entry) for entry in winner_strengths[:2]],
            "runner_up_risks": [entry.get("claim") if isinstance(entry, dict) else str(entry) for entry in runner_risks[:2]],
        }

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
        if not self.gemini_client.api_key:
            await db.update_job_ai(job["id"], {}, {}, "unavailable")
            return await db.get_job(job["id"]) or job
        try:
            req_analysis = self._normalize_requirement_analysis(await self.requirement_analyst.run({"jd": description}))
            framework = self._normalize_framework(await self.hiring_strategist.run({"requirements": req_analysis}))
            await db.create_rubric(job["id"], framework["criteria"], framework["weights"])
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
            
        rubric = await db.get_job_rubric(job_id)
        framework = self._normalize_framework({
            "criteria": (rubric or {}).get("criteria") or (job.get("evaluation_framework") or {}).get("criteria"),
            "evaluation_framework": job.get("evaluation_framework", {}).get("evaluation_framework") if isinstance(job.get("evaluation_framework"), dict) else {},
            "rationale": (job.get("evaluation_framework") or {}).get("rationale") if isinstance(job.get("evaluation_framework"), dict) else "",
        })
        
        # Step 3: Extract resume text
        resume_text = parse_resume(resume_bytes, filename)
        if not resume_text:
            raise ValueError(f"Unable to parse or extract text from file {filename}")
            
        # Run Agent 3: Resume Investigator
        profile = self._normalize_profile(await self.resume_investigator.run({"resume": resume_text}))
        if not profile["evidence"]:
            raise ValueError("Resume Investigator did not extract evidence. Evaluation stopped.")
        
        # Extract candidate details if parsed
        name = profile.get("candidate_name") or filename or "Unknown Candidate"
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
        candidate_profile = await db.create_candidate_profile(
            candidate_id=candidate_id,
            resume_id=resume["id"],
            structured_profile=profile,
        )
        evidence_items = await db.create_evidence_items(
            candidate_profile_id=candidate_profile["id"],
            candidate_id=candidate_id,
            resume_id=resume["id"],
            items=profile["evidence"],
        )
        
        # Run Agent 4: Candidate Evaluator
        evaluation = self._normalize_evaluation(await self.candidate_evaluator.run({
            "profile": profile,
            "framework": framework
        }), profile, framework)
        
        # Run Agent 5: Devil's Advocate
        critique = self._normalize_critique(await self.devils_advocate.run({"evaluation": evaluation}))
        
        # Run Agent 6: Hiring Committee
        decision = await self.hiring_committee.run({
            "evaluation": evaluation,
            "critique": critique
        })
        confidence = self._calculate_confidence(evaluation, critique, framework, decision.get("confidence"))
        
        # Save evaluation in DB
        eval_record = await db.create_evaluation(
            candidate_id=candidate_id,
            job_id=job_id,
            score=evaluation.get("overall_score") or 0,
            breakdown=evaluation.get("breakdown") or {},
            strengths=evaluation.get("strengths") or [],
            weaknesses=evaluation.get("weaknesses") or [],
            evidence=evidence_items,
            devils_advocate=critique,
            resume_id=resume.get("id"),
        )
        critique_record = await db.create_critique(
            evaluation_id=eval_record["id"],
            concerns=critique.get("concerns") or [],
            unsupported_claims=critique.get("unsupported_claims") or [],
            risk_factors=critique.get("risk_factors") or [],
            potential_bias=critique.get("potential_bias") or [],
        )
        
        # Save decision in DB
        decision_record = await db.create_decision(
            candidate_id=candidate_id,
            job_id=job_id,
            verdict=decision.get("verdict") or "Reject",
            confidence=confidence,
            explanation=decision.get("final_explanation") or "",
            interview_questions=decision.get("suggested_interview_questions") or [],
            ranking=999 # Placeholder, will be updated during global sorting
        )
        committee_decision = await db.create_committee_decision(
            job_id=job_id,
            candidate_id=candidate_id,
            evaluation_id=eval_record["id"],
            critique_id=critique_record.get("id"),
            verdict=decision_record.get("verdict") or "Reject",
            confidence=confidence,
            final_reasoning=decision_record.get("explanation") or "",
        )
        report = await db.create_report(
            evaluation_id=eval_record["id"],
            candidate_id=candidate_id,
            job_id=job_id,
            report_data={
                "candidate_name": candidate.get("name"),
                "candidate_score": eval_record.get("score", 0),
                "verdict": decision_record.get("verdict"),
                "confidence": confidence,
                "strengths": eval_record.get("strengths", []),
                "weaknesses": eval_record.get("weaknesses", []),
                "evidence": eval_record.get("evidence", []),
                "risk_factors": critique.get("risk_factors") or [],
                "final_recommendation": decision_record.get("verdict"),
                "interview_questions": decision_record.get("interview_questions", []),
                "explanation": decision_record.get("explanation", ""),
                "why_hire": [item.get("claim") for item in evaluation.get("strengths", []) if isinstance(item, dict)],
                "why_not_hire": [item.get("claim") for item in evaluation.get("weaknesses", []) if isinstance(item, dict)],
            },
        )
        
        return {
            "candidate": candidate,
            "candidate_profile": candidate_profile,
            "evaluation": eval_record,
            "critique": critique_record,
            "decision": decision_record,
            "committee_decision": committee_decision,
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
        
        # Rank candidates based on verdict, score, confidence, and evidence coverage.
        verdict_weights = {"Strong Hire": 3, "Consider": 2, "Reject": 1}
        
        def _get_sort_key(res):
            verdict = res["decision"].get("verdict", "Reject")
            score = res["evaluation"].get("score", 0)
            confidence = res["decision"].get("confidence", 0)
            evidence_count = len(res["evaluation"].get("evidence_items") or res["evaluation"].get("evidence") or [])
            return (verdict_weights.get(verdict, 1), score, confidence, evidence_count)
            
        results_sorted = sorted(results, key=_get_sort_key, reverse=True)
        
        ranking_rows = []
        for index, item in enumerate(results_sorted):
            rank = index + 1
            item["decision"]["ranking"] = rank
            item["decision"]["ranking_rationale"] = self._ranking_rationale(item)
            
            d_id = item["decision"]["id"]
            if d_id:
                await db.update_decision_ranking(d_id, rank)
            ranking_rows.append({
                "candidate_id": item["profile"]["id"],
                "score": item["evaluation"].get("score", 0),
                "rank": rank,
                "verdict": item["decision"].get("verdict") or "Reject",
                "confidence": item["decision"].get("confidence") or 0,
                "rationale": item["decision"]["ranking_rationale"],
            })

        await db.replace_job_rankings(job_id, ranking_rows)

        comparisons = []
        for index in range(len(results_sorted) - 1):
            winner = results_sorted[index]
            runner_up = results_sorted[index + 1]
            comparisons.append({
                "candidate_a_id": winner["profile"]["id"],
                "candidate_b_id": runner_up["profile"]["id"],
                "winner_candidate_id": winner["profile"]["id"],
                "rationale": self._comparison_rationale(winner, runner_up),
            })
        await db.replace_job_comparisons(job_id, comparisons)
                
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
