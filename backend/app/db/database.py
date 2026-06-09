import os
import sqlite3
import json
import uuid
import asyncio
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.config import settings

logger = logging.getLogger("hiring_wallah.database")

class DatabaseManager:
    def __init__(self):
        self.use_supabase = bool(settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY)
        self.supabase_client = None
        
        if self.use_supabase:
            try:
                from supabase import create_client
                # Prefer service role key for backend operations to bypass RLS if configured
                key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY
                self.supabase_client = create_client(settings.SUPABASE_URL, key)
                logger.info("Database: Connected successfully to Supabase PostgreSQL.")
            except Exception as e:
                logger.error(f"Database: Supabase connection failed: {e}. Falling back to SQLite.")
                self.use_supabase = False
                
        if not self.use_supabase:
            logger.info(f"Database: Running in SQLite mode (File: {settings.SQLITE_DB_PATH})")
            self._init_sqlite_db()

    def _init_sqlite_db(self):
        conn = sqlite3.connect(settings.SQLITE_DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS candidates (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT,
            parsed_profile TEXT,
            raw_resume_text TEXT,
            created_at TEXT
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS jobs (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            company TEXT,
            description TEXT NOT NULL,
            requirement_analysis TEXT,
            evaluation_framework TEXT,
            created_at TEXT
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS evaluations (
            id TEXT PRIMARY KEY,
            candidate_id TEXT,
            job_id TEXT,
            score INTEGER,
            breakdown TEXT,
            strengths TEXT,
            weaknesses TEXT,
            evidence TEXT,
            devils_advocate TEXT,
            created_at TEXT,
            FOREIGN KEY(candidate_id) REFERENCES candidates(id),
            FOREIGN KEY(job_id) REFERENCES jobs(id)
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS decisions (
            id TEXT PRIMARY KEY,
            candidate_id TEXT,
            job_id TEXT,
            verdict TEXT,
            confidence INTEGER,
            explanation TEXT,
            interview_questions TEXT,
            ranking INTEGER,
            created_at TEXT,
            FOREIGN KEY(candidate_id) REFERENCES candidates(id),
            FOREIGN KEY(job_id) REFERENCES jobs(id)
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS candidate_sessions (
            id TEXT PRIMARY KEY,
            candidate_id TEXT,
            target_role TEXT,
            fit_score INTEGER,
            skill_gaps TEXT,
            tailored_resume_suggestions TEXT,
            cover_letter TEXT,
            interview_prep TEXT,
            job_recommendations TEXT,
            created_at TEXT,
            FOREIGN KEY(candidate_id) REFERENCES candidates(id)
        )
        """)
        
        conn.commit()
        conn.close()
        logger.info("Database: SQLite schemas verified/created.")

    # --- JOB OPERATIONS ---
    async def create_job(self, title: str, company: str, description: str, 
                         requirement_analysis: Optional[Dict[str, Any]] = None, 
                         evaluation_framework: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        job_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        
        if self.use_supabase:
            data = {
                "id": job_id,
                "title": title,
                "company": company,
                "description": description,
                "requirement_analysis": requirement_analysis or {},
                "evaluation_framework": evaluation_framework or {},
                "created_at": created_at
            }
            def _insert():
                return self.supabase_client.table("jobs").insert(data).execute()
            
            res = await asyncio.to_thread(_insert)
            return res.data[0]
        else:
            def _insert_sqlite():
                conn = sqlite3.connect(settings.SQLITE_DB_PATH)
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO jobs (id, title, company, description, requirement_analysis, evaluation_framework, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    (job_id, title, company, description, json.dumps(requirement_analysis or {}), json.dumps(evaluation_framework or {}), created_at)
                )
                conn.commit()
                conn.close()
            await asyncio.to_thread(_insert_sqlite)
            return {
                "id": job_id, "title": title, "company": company, "description": description,
                "requirement_analysis": requirement_analysis or {}, "evaluation_framework": evaluation_framework or {},
                "created_at": created_at
            }

    async def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        if self.use_supabase:
            def _select():
                return self.supabase_client.table("jobs").select("*").eq("id", job_id).execute()
            res = await asyncio.to_thread(_select)
            return res.data[0] if res.data else None
        else:
            def _select_sqlite():
                conn = sqlite3.connect(settings.SQLITE_DB_PATH)
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM jobs WHERE id = ?", (job_id,))
                row = cursor.fetchone()
                conn.close()
                if row:
                    job = dict(row)
                    job["requirement_analysis"] = json.loads(job["requirement_analysis"] or "{}")
                    job["evaluation_framework"] = json.loads(job["evaluation_framework"] or "{}")
                    return job
                return None
            return await asyncio.to_thread(_select_sqlite)

    async def get_all_jobs(self) -> List[Dict[str, Any]]:
        if self.use_supabase:
            def _select():
                return self.supabase_client.table("jobs").select("*").order("created_at", desc=True).execute()
            res = await asyncio.to_thread(_select)
            return res.data
        else:
            def _select_sqlite():
                conn = sqlite3.connect(settings.SQLITE_DB_PATH)
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM jobs ORDER BY created_at DESC")
                rows = cursor.fetchall()
                conn.close()
                results = []
                for row in rows:
                    job = dict(row)
                    job["requirement_analysis"] = json.loads(job["requirement_analysis"] or "{}")
                    job["evaluation_framework"] = json.loads(job["evaluation_framework"] or "{}")
                    results.append(job)
                return results
            return await asyncio.to_thread(_select_sqlite)

    # --- CANDIDATE OPERATIONS ---
    async def create_candidate(self, name: str, email: str, parsed_profile: Dict[str, Any], raw_resume_text: str) -> Dict[str, Any]:
        candidate_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        
        if self.use_supabase:
            data = {
                "id": candidate_id,
                "name": name,
                "email": email,
                "parsed_profile": parsed_profile,
                "raw_resume_text": raw_resume_text,
                "created_at": created_at
            }
            def _insert():
                return self.supabase_client.table("candidates").insert(data).execute()
            res = await asyncio.to_thread(_insert)
            return res.data[0]
        else:
            def _insert_sqlite():
                conn = sqlite3.connect(settings.SQLITE_DB_PATH)
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO candidates (id, name, email, parsed_profile, raw_resume_text, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                    (candidate_id, name, email, json.dumps(parsed_profile), raw_resume_text, created_at)
                )
                conn.commit()
                conn.close()
            await asyncio.to_thread(_insert_sqlite)
            return {
                "id": candidate_id, "name": name, "email": email, "parsed_profile": parsed_profile,
                "raw_resume_text": raw_resume_text, "created_at": created_at
            }

    async def get_candidate(self, candidate_id: str) -> Optional[Dict[str, Any]]:
        if self.use_supabase:
            def _select():
                return self.supabase_client.table("candidates").select("*").eq("id", candidate_id).execute()
            res = await asyncio.to_thread(_select)
            return res.data[0] if res.data else None
        else:
            def _select_sqlite():
                conn = sqlite3.connect(settings.SQLITE_DB_PATH)
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM candidates WHERE id = ?", (candidate_id,))
                row = cursor.fetchone()
                conn.close()
                if row:
                    candidate = dict(row)
                    candidate["parsed_profile"] = json.loads(candidate["parsed_profile"] or "{}")
                    return candidate
                return None
            return await asyncio.to_thread(_select_sqlite)

    # --- EVALUATION OPERATIONS ---
    async def create_evaluation(self, candidate_id: str, job_id: str, score: int, breakdown: Dict[str, Any], 
                                strengths: List[str], weaknesses: List[str], evidence: List[str], 
                                devils_advocate: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        eval_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        
        if self.use_supabase:
            data = {
                "id": eval_id,
                "candidate_id": candidate_id,
                "job_id": job_id,
                "score": score,
                "breakdown": breakdown,
                "strengths": strengths,
                "weaknesses": weaknesses,
                "evidence": evidence,
                "devils_advocate": devils_advocate or {},
                "created_at": created_at
            }
            def _insert():
                return self.supabase_client.table("evaluations").insert(data).execute()
            res = await asyncio.to_thread(_insert)
            return res.data[0]
        else:
            def _insert_sqlite():
                conn = sqlite3.connect(settings.SQLITE_DB_PATH)
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO evaluations (id, candidate_id, job_id, score, breakdown, strengths, weaknesses, evidence, devils_advocate, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (eval_id, candidate_id, job_id, score, json.dumps(breakdown), json.dumps(strengths), json.dumps(weaknesses), json.dumps(evidence), json.dumps(devils_advocate or {}), created_at)
                )
                conn.commit()
                conn.close()
            await asyncio.to_thread(_insert_sqlite)
            return {
                "id": eval_id, "candidate_id": candidate_id, "job_id": job_id, "score": score, "breakdown": breakdown,
                "strengths": strengths, "weaknesses": weaknesses, "evidence": evidence, "devils_advocate": devils_advocate or {},
                "created_at": created_at
            }

    async def get_evaluation(self, eval_id: str) -> Optional[Dict[str, Any]]:
        if self.use_supabase:
            def _select():
                return self.supabase_client.table("evaluations").select("*").eq("id", eval_id).execute()
            res = await asyncio.to_thread(_select)
            return res.data[0] if res.data else None
        else:
            def _select_sqlite():
                conn = sqlite3.connect(settings.SQLITE_DB_PATH)
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM evaluations WHERE id = ?", (eval_id,))
                row = cursor.fetchone()
                conn.close()
                if row:
                    evaluation = dict(row)
                    evaluation["breakdown"] = json.loads(evaluation["breakdown"] or "{}")
                    evaluation["strengths"] = json.loads(evaluation["strengths"] or "[]")
                    evaluation["weaknesses"] = json.loads(evaluation["weaknesses"] or "[]")
                    evaluation["evidence"] = json.loads(evaluation["evidence"] or "[]")
                    evaluation["devils_advocate"] = json.loads(evaluation["devils_advocate"] or "{}")
                    return evaluation
                return None
            return await asyncio.to_thread(_select_sqlite)

    # --- DECISION OPERATIONS ---
    async def create_decision(self, candidate_id: str, job_id: str, verdict: str, confidence: int, 
                              explanation: str, interview_questions: List[str], ranking: int = 1) -> Dict[str, Any]:
        decision_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        
        if self.use_supabase:
            data = {
                "id": decision_id,
                "candidate_id": candidate_id,
                "job_id": job_id,
                "verdict": verdict,
                "confidence": confidence,
                "explanation": explanation,
                "interview_questions": interview_questions,
                "ranking": ranking,
                "created_at": created_at
            }
            def _insert():
                return self.supabase_client.table("decisions").insert(data).execute()
            res = await asyncio.to_thread(_insert)
            return res.data[0]
        else:
            def _insert_sqlite():
                conn = sqlite3.connect(settings.SQLITE_DB_PATH)
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO decisions (id, candidate_id, job_id, verdict, confidence, explanation, interview_questions, ranking, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (decision_id, candidate_id, job_id, verdict, confidence, explanation, json.dumps(interview_questions), ranking, created_at)
                )
                conn.commit()
                conn.close()
            await asyncio.to_thread(_insert_sqlite)
            return {
                "id": decision_id, "candidate_id": candidate_id, "job_id": job_id, "verdict": verdict,
                "confidence": confidence, "explanation": explanation, "interview_questions": interview_questions,
                "ranking": ranking, "created_at": created_at
            }

    async def get_job_results(self, job_id: str) -> List[Dict[str, Any]]:
        """
        Retrieves and matches candidates, evaluations, and decisions for a job.
        """
        if self.use_supabase:
            def _select_evals():
                return self.supabase_client.table("evaluations").select("*").eq("job_id", job_id).execute()
            def _select_decisions():
                return self.supabase_client.table("decisions").select("*").eq("job_id", job_id).execute()
            def _select_candidates():
                return self.supabase_client.table("candidates").select("*").execute()
            
            evals_res, decs_res, cands_res = await asyncio.gather(
                asyncio.to_thread(_select_evals),
                asyncio.to_thread(_select_decisions),
                asyncio.to_thread(_select_candidates)
            )
            
            evals = evals_res.data
            decs = {d["candidate_id"]: d for d in decs_res.data}
            cands = {c["id"]: c for c in cands_res.data}
            
            results = []
            for ev in evals:
                c_id = ev["candidate_id"]
                results.append({
                    "evaluation_id": ev["id"],
                    "profile": cands.get(c_id, {}),
                    "evaluation": ev,
                    "critique": ev.get("devils_advocate", {}),
                    "decision": decs.get(c_id, {})
                })
            
            # Sort by ranking if available, else by confidence
            return sorted(results, key=lambda x: x["decision"].get("ranking") or 999)
        else:
            def _select_sqlite():
                conn = sqlite3.connect(settings.SQLITE_DB_PATH)
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                # Fetch evaluations joined with candidates and decisions
                cursor.execute("""
                    SELECT 
                        e.id as evaluation_id, e.score, e.breakdown, e.strengths, e.weaknesses, e.evidence, e.devils_advocate, e.created_at as eval_created_at,
                        c.id as candidate_id, c.name as candidate_name, c.email as candidate_email, c.parsed_profile, c.raw_resume_text,
                        d.id as decision_id, d.verdict, d.confidence, d.explanation, d.interview_questions, d.ranking
                    FROM evaluations e
                    JOIN candidates c ON e.candidate_id = c.id
                    LEFT JOIN decisions d ON (e.candidate_id = d.candidate_id AND e.job_id = d.job_id)
                    WHERE e.job_id = ?
                """, (job_id,))
                
                rows = cursor.fetchall()
                conn.close()
                
                results = []
                for row in rows:
                    r = dict(row)
                    
                    profile = {
                        "id": r["candidate_id"],
                        "name": r["candidate_name"],
                        "email": r["candidate_email"],
                        "parsed_profile": json.loads(r["parsed_profile"] or "{}"),
                        "raw_resume_text": r["raw_resume_text"]
                    }
                    
                    evaluation = {
                        "id": r["evaluation_id"],
                        "candidate_id": r["candidate_id"],
                        "job_id": job_id,
                        "score": r["score"],
                        "breakdown": json.loads(r["breakdown"] or "{}"),
                        "strengths": json.loads(r["strengths"] or "[]"),
                        "weaknesses": json.loads(r["weaknesses"] or "[]"),
                        "evidence": json.loads(r["evidence"] or "[]"),
                        "devils_advocate": json.loads(r["devils_advocate"] or "{}"),
                        "created_at": r["eval_created_at"]
                    }
                    
                    decision = {
                        "id": r["decision_id"],
                        "candidate_id": r["candidate_id"],
                        "job_id": job_id,
                        "verdict": r["verdict"],
                        "confidence": r["confidence"],
                        "explanation": r["explanation"],
                        "interview_questions": json.loads(r["interview_questions"] or "[]"),
                        "ranking": r["ranking"]
                    }
                    
                    results.append({
                        "evaluation_id": r["evaluation_id"],
                        "profile": profile,
                        "evaluation": evaluation,
                        "critique": evaluation["devils_advocate"],
                        "decision": decision
                    })
                    
                return sorted(results, key=lambda x: x["decision"].get("ranking") or 999)
            return await asyncio.to_thread(_select_sqlite)

    # --- CANDIDATE SESSION OPERATIONS ---
    async def create_candidate_session(self, candidate_id: str, target_role: str, fit_score: int, 
                                       skill_gaps: Dict[str, Any], tailored_resume_suggestions: Dict[str, Any], 
                                       cover_letter: str, interview_prep: Dict[str, Any], 
                                       job_recommendations: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        session_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        
        if self.use_supabase:
            data = {
                "id": session_id,
                "candidate_id": candidate_id,
                "target_role": target_role,
                "fit_score": fit_score,
                "skill_gaps": skill_gaps,
                "tailored_resume_suggestions": tailored_resume_suggestions,
                "cover_letter": cover_letter,
                "interview_prep": interview_prep,
                "job_recommendations": job_recommendations or {},
                "created_at": created_at
            }
            def _insert():
                return self.supabase_client.table("candidate_sessions").insert(data).execute()
            res = await asyncio.to_thread(_insert)
            return res.data[0]
        else:
            def _insert_sqlite():
                conn = sqlite3.connect(settings.SQLITE_DB_PATH)
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO candidate_sessions (id, candidate_id, target_role, fit_score, skill_gaps, tailored_resume_suggestions, cover_letter, interview_prep, job_recommendations, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (session_id, candidate_id, target_role, fit_score, json.dumps(skill_gaps), json.dumps(tailored_resume_suggestions), cover_letter, json.dumps(interview_prep), json.dumps(job_recommendations or {}), created_at)
                )
                conn.commit()
                conn.close()
            await asyncio.to_thread(_insert_sqlite)
            return {
                "id": session_id, "candidate_id": candidate_id, "target_role": target_role, "fit_score": fit_score,
                "skill_gaps": skill_gaps, "tailored_resume_suggestions": tailored_resume_suggestions,
                "cover_letter": cover_letter, "interview_prep": interview_prep, "job_recommendations": job_recommendations or {},
                "created_at": created_at
            }

    async def get_candidate_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        if self.use_supabase:
            def _select():
                return self.supabase_client.table("candidate_sessions").select("*").eq("id", session_id).execute()
            res = await asyncio.to_thread(_select)
            return res.data[0] if res.data else None
        else:
            def _select_sqlite():
                conn = sqlite3.connect(settings.SQLITE_DB_PATH)
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM candidate_sessions WHERE id = ?", (session_id,))
                row = cursor.fetchone()
                conn.close()
                if row:
                    sess = dict(row)
                    sess["skill_gaps"] = json.loads(sess["skill_gaps"] or "{}")
                    sess["tailored_resume_suggestions"] = json.loads(sess["tailored_resume_suggestions"] or "{}")
                    sess["interview_prep"] = json.loads(sess["interview_prep"] or "{}")
                    sess["job_recommendations"] = json.loads(sess["job_recommendations"] or "{}")
                    return sess
                return None
            return await asyncio.to_thread(_select_sqlite)

# Instantiate single global manager instance
db = DatabaseManager()
