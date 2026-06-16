import asyncio
import json
import logging
import sqlite3
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from app.config import settings

logger = logging.getLogger("hiring_wallah.database")

JSON_COLUMNS = {
    "requirement_analysis", "evaluation_framework", "parsed_profile", "breakdown",
    "strengths", "weaknesses", "evidence", "devils_advocate", "interview_questions",
    "report_data", "skill_gaps", "tailored_resume_suggestions", "interview_prep",
    "job_recommendations", "structured_profile", "criteria", "weights", "concerns",
    "unsupported_claims", "risk_factors", "potential_bias", "rationale",
}

JSON_ARRAY_COLUMNS = {
    "strengths", "weaknesses", "evidence", "interview_questions", "criteria",
    "concerns", "unsupported_claims", "risk_factors", "potential_bias",
}


class DatabaseManager:
    def __init__(self):
        self.database_url = settings.DATABASE_URL
        self.use_postgres = bool(self.database_url)
        if self.use_postgres:
            try:
                import psycopg  # noqa: F401
                logger.info("Database: Using PostgreSQL via DATABASE_URL.")
                self._init_postgres_db()
            except Exception as exc:
                logger.error("Database: PostgreSQL init failed: %s. Falling back to SQLite.", exc)
                self.use_postgres = False
                self._init_sqlite_db()
        else:
            logger.info("Database: Running in SQLite mode (File: %s)", settings.SQLITE_DB_PATH)
            self._init_sqlite_db()

    def _connect_sqlite(self):
        conn = sqlite3.connect(settings.SQLITE_DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn

    def _connect_postgres(self):
        import psycopg
        from psycopg.rows import dict_row
        return psycopg.connect(self.database_url, row_factory=dict_row)

    def _init_postgres_db(self):
        statements = self._schema_statements(postgres=True)
        with self._connect_postgres() as conn:
            with conn.cursor() as cur:
                for statement in statements:
                    cur.execute(statement)
            conn.commit()

    def _init_sqlite_db(self):
        conn = self._connect_sqlite()
        cursor = conn.cursor()
        for statement in self._schema_statements(postgres=False):
            try:
                cursor.execute(statement)
            except sqlite3.OperationalError as exc:
                if "duplicate column" not in str(exc).lower():
                    raise
        conn.commit()
        conn.close()
        logger.info("Database: SQLite schemas verified/created.")

    def _schema_statements(self, postgres: bool) -> List[str]:
        text = "TEXT" if not postgres else "TEXT"
        json_type = "JSONB" if postgres else "TEXT"
        ts = "TIMESTAMPTZ" if postgres else "TEXT"
        return [
            f"""
            CREATE TABLE IF NOT EXISTS companies (
                id {text} PRIMARY KEY,
                name TEXT NOT NULL,
                created_at {ts} NOT NULL
            )
            """,
            f"""
            CREATE TABLE IF NOT EXISTS users (
                id {text} PRIMARY KEY,
                firebase_uid TEXT UNIQUE NOT NULL,
                email TEXT,
                display_name TEXT,
                photo_url TEXT,
                role TEXT NOT NULL CHECK(role IN ('recruiter', 'candidate')),
                company_id TEXT,
                created_at {ts} NOT NULL,
                updated_at {ts},
                FOREIGN KEY(company_id) REFERENCES companies(id)
            )
            """,
            f"""
            CREATE TABLE IF NOT EXISTS jobs (
                id {text} PRIMARY KEY,
                title TEXT NOT NULL,
                company TEXT,
                location TEXT,
                experience_range TEXT,
                description TEXT NOT NULL,
                requirement_analysis {json_type},
                evaluation_framework {json_type},
                ai_status TEXT NOT NULL DEFAULT 'not_configured',
                owner_uid TEXT,
                company_id TEXT,
                created_at {ts} NOT NULL
            )
            """,
            "ALTER TABLE jobs ADD COLUMN location TEXT" if not postgres else "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS location TEXT",
            "ALTER TABLE jobs ADD COLUMN experience_range TEXT" if not postgres else "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS experience_range TEXT",
            "ALTER TABLE jobs ADD COLUMN ai_status TEXT NOT NULL DEFAULT 'not_configured'" if not postgres else "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS ai_status TEXT NOT NULL DEFAULT 'not_configured'",
            "ALTER TABLE jobs ADD COLUMN owner_uid TEXT" if not postgres else "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS owner_uid TEXT",
            "ALTER TABLE jobs ADD COLUMN company_id TEXT" if not postgres else "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_id TEXT",
            f"""
            CREATE TABLE IF NOT EXISTS candidates (
                id {text} PRIMARY KEY,
                name TEXT,
                email TEXT,
                parsed_profile {json_type},
                raw_resume_text TEXT,
                created_at {ts} NOT NULL
            )
            """,
            f"""
            CREATE TABLE IF NOT EXISTS resumes (
                id {text} PRIMARY KEY,
                candidate_id TEXT,
                job_id TEXT,
                file_name TEXT,
                file_type TEXT,
                raw_text TEXT,
                parse_status TEXT NOT NULL DEFAULT 'parsed',
                error_message TEXT,
                created_at {ts} NOT NULL,
                FOREIGN KEY(candidate_id) REFERENCES candidates(id),
                FOREIGN KEY(job_id) REFERENCES jobs(id)
            )
            """,
            f"""
            CREATE TABLE IF NOT EXISTS evaluations (
                id {text} PRIMARY KEY,
                candidate_id TEXT,
                job_id TEXT,
                resume_id TEXT,
                score INTEGER,
                breakdown {json_type},
                strengths {json_type},
                weaknesses {json_type},
                evidence {json_type},
                devils_advocate {json_type},
                status TEXT NOT NULL DEFAULT 'completed',
                error_message TEXT,
                created_at {ts} NOT NULL,
                FOREIGN KEY(candidate_id) REFERENCES candidates(id),
                FOREIGN KEY(job_id) REFERENCES jobs(id),
                FOREIGN KEY(resume_id) REFERENCES resumes(id)
            )
            """,
            f"""
            CREATE TABLE IF NOT EXISTS candidate_profiles (
                id {text} PRIMARY KEY,
                candidate_id TEXT,
                resume_id TEXT,
                structured_profile {json_type},
                created_at {ts} NOT NULL,
                FOREIGN KEY(candidate_id) REFERENCES candidates(id),
                FOREIGN KEY(resume_id) REFERENCES resumes(id)
            )
            """,
            f"""
            CREATE TABLE IF NOT EXISTS rubrics (
                id {text} PRIMARY KEY,
                job_id TEXT,
                criteria {json_type},
                weights {json_type},
                created_at {ts} NOT NULL,
                FOREIGN KEY(job_id) REFERENCES jobs(id)
            )
            """,
            f"""
            CREATE TABLE IF NOT EXISTS evidence (
                id {text} PRIMARY KEY,
                candidate_profile_id TEXT,
                candidate_id TEXT,
                resume_id TEXT,
                claim TEXT,
                evidence TEXT,
                resume_section TEXT,
                evidence_type TEXT,
                quality TEXT,
                created_at {ts} NOT NULL,
                FOREIGN KEY(candidate_profile_id) REFERENCES candidate_profiles(id),
                FOREIGN KEY(candidate_id) REFERENCES candidates(id),
                FOREIGN KEY(resume_id) REFERENCES resumes(id)
            )
            """,
            "ALTER TABLE evaluations ADD COLUMN resume_id TEXT" if not postgres else "ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS resume_id TEXT",
            "ALTER TABLE evaluations ADD COLUMN status TEXT NOT NULL DEFAULT 'completed'" if not postgres else "ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'completed'",
            "ALTER TABLE evaluations ADD COLUMN error_message TEXT" if not postgres else "ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS error_message TEXT",
            f"""
            CREATE TABLE IF NOT EXISTS critiques (
                id {text} PRIMARY KEY,
                evaluation_id TEXT,
                concerns {json_type},
                unsupported_claims {json_type},
                risk_factors {json_type},
                potential_bias {json_type},
                created_at {ts} NOT NULL,
                FOREIGN KEY(evaluation_id) REFERENCES evaluations(id)
            )
            """,
            f"""
            CREATE TABLE IF NOT EXISTS decisions (
                id {text} PRIMARY KEY,
                candidate_id TEXT,
                job_id TEXT,
                verdict TEXT,
                confidence INTEGER,
                explanation TEXT,
                interview_questions {json_type},
                ranking INTEGER,
                created_at {ts} NOT NULL,
                FOREIGN KEY(candidate_id) REFERENCES candidates(id),
                FOREIGN KEY(job_id) REFERENCES jobs(id)
            )
            """,
            f"""
            CREATE TABLE IF NOT EXISTS rankings (
                id {text} PRIMARY KEY,
                job_id TEXT,
                candidate_id TEXT,
                score INTEGER,
                rank INTEGER,
                verdict TEXT,
                confidence INTEGER,
                rationale {json_type},
                created_at {ts} NOT NULL,
                FOREIGN KEY(job_id) REFERENCES jobs(id),
                FOREIGN KEY(candidate_id) REFERENCES candidates(id)
            )
            """,
            f"""
            CREATE TABLE IF NOT EXISTS committee_decisions (
                id {text} PRIMARY KEY,
                job_id TEXT,
                candidate_id TEXT,
                evaluation_id TEXT,
                critique_id TEXT,
                verdict TEXT,
                confidence INTEGER,
                final_reasoning TEXT,
                created_at {ts} NOT NULL,
                FOREIGN KEY(job_id) REFERENCES jobs(id),
                FOREIGN KEY(candidate_id) REFERENCES candidates(id),
                FOREIGN KEY(evaluation_id) REFERENCES evaluations(id),
                FOREIGN KEY(critique_id) REFERENCES critiques(id)
            )
            """,
            f"""
            CREATE TABLE IF NOT EXISTS comparisons (
                id {text} PRIMARY KEY,
                job_id TEXT,
                candidate_a_id TEXT,
                candidate_b_id TEXT,
                winner_candidate_id TEXT,
                rationale {json_type},
                created_at {ts} NOT NULL,
                FOREIGN KEY(job_id) REFERENCES jobs(id),
                FOREIGN KEY(candidate_a_id) REFERENCES candidates(id),
                FOREIGN KEY(candidate_b_id) REFERENCES candidates(id),
                FOREIGN KEY(winner_candidate_id) REFERENCES candidates(id)
            )
            """,
            f"""
            CREATE TABLE IF NOT EXISTS reports (
                id {text} PRIMARY KEY,
                evaluation_id TEXT,
                candidate_id TEXT,
                job_id TEXT,
                report_data {json_type},
                created_at {ts} NOT NULL,
                FOREIGN KEY(evaluation_id) REFERENCES evaluations(id),
                FOREIGN KEY(candidate_id) REFERENCES candidates(id),
                FOREIGN KEY(job_id) REFERENCES jobs(id)
            )
            """,
            f"""
            CREATE TABLE IF NOT EXISTS candidate_sessions (
                id {text} PRIMARY KEY,
                candidate_id TEXT,
                target_role TEXT,
                fit_score INTEGER,
                skill_gaps {json_type},
                tailored_resume_suggestions {json_type},
                cover_letter TEXT,
                interview_prep {json_type},
                job_recommendations {json_type},
                created_at {ts} NOT NULL,
                FOREIGN KEY(candidate_id) REFERENCES candidates(id)
            )
            """,
            "CREATE INDEX IF NOT EXISTS idx_candidate_profiles_resume ON candidate_profiles(resume_id)",
            "CREATE INDEX IF NOT EXISTS idx_rubrics_job ON rubrics(job_id)",
            "CREATE INDEX IF NOT EXISTS idx_evidence_candidate ON evidence(candidate_id)",
            "CREATE INDEX IF NOT EXISTS idx_evidence_resume ON evidence(resume_id)",
            "CREATE INDEX IF NOT EXISTS idx_critiques_evaluation ON critiques(evaluation_id)",
            "CREATE INDEX IF NOT EXISTS idx_rankings_job ON rankings(job_id)",
            "CREATE INDEX IF NOT EXISTS idx_committee_decisions_job ON committee_decisions(job_id)",
            "CREATE INDEX IF NOT EXISTS idx_comparisons_job ON comparisons(job_id)",
        ]

    def _encode(self, value: Any) -> Any:
        if self.use_postgres:
            try:
                from psycopg.types.json import Jsonb
                return Jsonb(value)
            except Exception:
                return json.dumps(value)
        return json.dumps(value)

    def _decode_row(self, row: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        if not row:
            return None
        data = dict(row)
        for key in JSON_COLUMNS:
            if key in data and isinstance(data[key], str):
                try:
                    data[key] = json.loads(data[key] or ("[]" if key in JSON_ARRAY_COLUMNS else "{}"))
                except json.JSONDecodeError:
                    data[key] = [] if key in JSON_ARRAY_COLUMNS else {}
        return data

    async def _fetchone(self, sql: str, params: tuple = ()) -> Optional[Dict[str, Any]]:
        def run():
            if self.use_postgres:
                with self._connect_postgres() as conn:
                    with conn.cursor() as cur:
                        cur.execute(sql, params)
                        row = cur.fetchone()
                        conn.commit()
                        return self._decode_row(row)
            conn = self._connect_sqlite()
            cur = conn.cursor()
            cur.execute(sql.replace("%s", "?"), params)
            row = cur.fetchone()
            conn.commit()
            conn.close()
            return self._decode_row(dict(row) if row else None)
        return await asyncio.to_thread(run)

    async def _fetchall(self, sql: str, params: tuple = ()) -> List[Dict[str, Any]]:
        def run():
            if self.use_postgres:
                with self._connect_postgres() as conn:
                    with conn.cursor() as cur:
                        cur.execute(sql, params)
                        rows = cur.fetchall()
                        conn.commit()
                        return [self._decode_row(row) for row in rows]
            conn = self._connect_sqlite()
            cur = conn.cursor()
            cur.execute(sql.replace("%s", "?"), params)
            rows = cur.fetchall()
            conn.commit()
            conn.close()
            return [self._decode_row(dict(row)) for row in rows]
        return await asyncio.to_thread(run)

    async def _execute(self, sql: str, params: tuple = ()) -> None:
        def run():
            if self.use_postgres:
                with self._connect_postgres() as conn:
                    with conn.cursor() as cur:
                        cur.execute(sql, params)
                    conn.commit()
                    return
            conn = self._connect_sqlite()
            cur = conn.cursor()
            cur.execute(sql.replace("%s", "?"), params)
            conn.commit()
            conn.close()
        await asyncio.to_thread(run)

    async def get_user_profile(self, firebase_uid: str) -> Optional[Dict[str, Any]]:
        return await self._fetchone(
            """
            SELECT users.*, companies.name as company_name
            FROM users LEFT JOIN companies ON companies.id = users.company_id
            WHERE users.firebase_uid = %s
            """,
            (firebase_uid,),
        )

    async def upsert_user_profile(self, firebase_uid: str, email: Optional[str], display_name: Optional[str], photo_url: Optional[str], role: str, company_name: Optional[str] = None) -> Dict[str, Any]:
        existing = await self.get_user_profile(firebase_uid)
        now = datetime.utcnow().isoformat()
        company_id = existing.get("company_id") if existing else None
        if role == "recruiter" and not company_id:
            company_id = str(uuid.uuid4())
            await self._execute(
                "INSERT INTO companies (id, name, created_at) VALUES (%s, %s, %s)",
                (company_id, company_name or (f"{display_name}'s Company" if display_name else "Hiring Wallah Workspace"), now),
            )
        user_id = existing.get("id") if existing else str(uuid.uuid4())
        if existing:
            await self._execute(
                """
                UPDATE users SET email=%s, display_name=%s, photo_url=%s, role=%s, company_id=%s, updated_at=%s
                WHERE firebase_uid=%s
                """,
                (email, display_name, photo_url, role, company_id, now, firebase_uid),
            )
        else:
            await self._execute(
                """
                INSERT INTO users (id, firebase_uid, email, display_name, photo_url, role, company_id, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (user_id, firebase_uid, email, display_name, photo_url, role, company_id, now, now),
            )
        return await self.get_user_profile(firebase_uid) or {}

    async def create_job(self, title: str, company: str, description: str, requirement_analysis: Optional[Dict[str, Any]] = None, evaluation_framework: Optional[Dict[str, Any]] = None, owner_uid: Optional[str] = None, company_id: Optional[str] = None, location: Optional[str] = None, experience_range: Optional[str] = None, ai_status: str = "not_configured") -> Dict[str, Any]:
        job_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        await self._execute(
            """
            INSERT INTO jobs (id, title, company, location, experience_range, description, requirement_analysis, evaluation_framework, ai_status, owner_uid, company_id, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (job_id, title, company, location, experience_range, description, self._encode(requirement_analysis or {}), self._encode(evaluation_framework or {}), ai_status, owner_uid, company_id, created_at),
        )
        return await self.get_job(job_id) or {}

    async def update_job_ai(self, job_id: str, requirement_analysis: Dict[str, Any], evaluation_framework: Dict[str, Any], ai_status: str) -> None:
        await self._execute(
            "UPDATE jobs SET requirement_analysis=%s, evaluation_framework=%s, ai_status=%s WHERE id=%s",
            (self._encode(requirement_analysis), self._encode(evaluation_framework), ai_status, job_id),
        )

    async def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        return await self._fetchone("SELECT * FROM jobs WHERE id = %s", (job_id,))

    async def get_all_jobs(self, owner_uid: Optional[str] = None) -> List[Dict[str, Any]]:
        if owner_uid:
            return await self._fetchall("SELECT * FROM jobs WHERE owner_uid=%s ORDER BY created_at DESC", (owner_uid,))
        return await self._fetchall("SELECT * FROM jobs ORDER BY created_at DESC")

    async def create_candidate(self, name: str, email: str, parsed_profile: Dict[str, Any], raw_resume_text: str) -> Dict[str, Any]:
        candidate_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        await self._execute(
            "INSERT INTO candidates (id, name, email, parsed_profile, raw_resume_text, created_at) VALUES (%s, %s, %s, %s, %s, %s)",
            (candidate_id, name, email, self._encode(parsed_profile), raw_resume_text, created_at),
        )
        return await self.get_candidate(candidate_id) or {}

    async def get_candidate(self, candidate_id: str) -> Optional[Dict[str, Any]]:
        return await self._fetchone("SELECT * FROM candidates WHERE id = %s", (candidate_id,))

    async def create_resume(self, job_id: str, candidate_id: str, file_name: str, file_type: str, raw_text: str, parse_status: str = "parsed", error_message: Optional[str] = None) -> Dict[str, Any]:
        resume_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        await self._execute(
            """
            INSERT INTO resumes (id, candidate_id, job_id, file_name, file_type, raw_text, parse_status, error_message, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (resume_id, candidate_id, job_id, file_name, file_type, raw_text, parse_status, error_message, created_at),
        )
        return await self.get_resume(resume_id) or {}

    async def get_resume(self, resume_id: str) -> Optional[Dict[str, Any]]:
        return await self._fetchone("SELECT * FROM resumes WHERE id=%s", (resume_id,))

    async def get_job_resumes(self, job_id: str) -> List[Dict[str, Any]]:
        return await self._fetchall(
            """
            SELECT resumes.*, candidates.name as candidate_name, candidates.email as candidate_email
            FROM resumes LEFT JOIN candidates ON candidates.id = resumes.candidate_id
            WHERE resumes.job_id=%s ORDER BY resumes.created_at DESC
            """,
            (job_id,),
        )

    async def create_candidate_profile(self, candidate_id: str, resume_id: str, structured_profile: Dict[str, Any]) -> Dict[str, Any]:
        profile_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        await self._execute(
            """
            INSERT INTO candidate_profiles (id, candidate_id, resume_id, structured_profile, created_at)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (profile_id, candidate_id, resume_id, self._encode(structured_profile), created_at),
        )
        return await self.get_candidate_profile(profile_id) or {}

    async def get_candidate_profile(self, profile_id: str) -> Optional[Dict[str, Any]]:
        return await self._fetchone("SELECT * FROM candidate_profiles WHERE id=%s", (profile_id,))

    async def get_candidate_profile_by_resume(self, resume_id: str) -> Optional[Dict[str, Any]]:
        return await self._fetchone(
            "SELECT * FROM candidate_profiles WHERE resume_id=%s ORDER BY created_at DESC LIMIT 1",
            (resume_id,),
        )

    async def create_evidence_items(self, candidate_profile_id: str, candidate_id: str, resume_id: str, items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        created = []
        for item in items:
            evidence_id = str(uuid.uuid4())
            created_at = datetime.utcnow().isoformat()
            await self._execute(
                """
                INSERT INTO evidence (id, candidate_profile_id, candidate_id, resume_id, claim, evidence, resume_section, evidence_type, quality, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    evidence_id,
                    candidate_profile_id,
                    candidate_id,
                    resume_id,
                    str(item.get("claim") or ""),
                    str(item.get("evidence") or ""),
                    str(item.get("resume_section") or "Resume"),
                    str(item.get("evidence_type") or "experience"),
                    str(item.get("quality") or "moderate"),
                    created_at,
                ),
            )
            row = await self.get_evidence_item(evidence_id)
            if row:
                created.append(row)
        return created

    async def get_evidence_item(self, evidence_id: str) -> Optional[Dict[str, Any]]:
        return await self._fetchone("SELECT * FROM evidence WHERE id=%s", (evidence_id,))

    async def get_candidate_evidence(self, candidate_id: str) -> List[Dict[str, Any]]:
        return await self._fetchall(
            "SELECT * FROM evidence WHERE candidate_id=%s ORDER BY created_at ASC",
            (candidate_id,),
        )

    async def create_rubric(self, job_id: str, criteria: List[Dict[str, Any]], weights: Dict[str, int]) -> Dict[str, Any]:
        rubric_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        await self._execute("DELETE FROM rubrics WHERE job_id=%s", (job_id,))
        await self._execute(
            """
            INSERT INTO rubrics (id, job_id, criteria, weights, created_at)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (rubric_id, job_id, self._encode(criteria), self._encode(weights), created_at),
        )
        return await self.get_job_rubric(job_id) or {}

    async def get_job_rubric(self, job_id: str) -> Optional[Dict[str, Any]]:
        return await self._fetchone(
            "SELECT * FROM rubrics WHERE job_id=%s ORDER BY created_at DESC LIMIT 1",
            (job_id,),
        )

    async def create_evaluation(self, candidate_id: str, job_id: str, score: int, breakdown: Dict[str, Any], strengths: List[Any], weaknesses: List[Any], evidence: List[Any], devils_advocate: Optional[Dict[str, Any]] = None, resume_id: Optional[str] = None, status: str = "completed", error_message: Optional[str] = None) -> Dict[str, Any]:
        eval_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        await self._execute(
            """
            INSERT INTO evaluations (id, candidate_id, job_id, resume_id, score, breakdown, strengths, weaknesses, evidence, devils_advocate, status, error_message, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (eval_id, candidate_id, job_id, resume_id, score, self._encode(breakdown), self._encode(strengths), self._encode(weaknesses), self._encode(evidence), self._encode(devils_advocate or {}), status, error_message, created_at),
        )
        return await self.get_evaluation(eval_id) or {}

    async def get_evaluation(self, eval_id: str) -> Optional[Dict[str, Any]]:
        return await self._fetchone("SELECT * FROM evaluations WHERE id = %s", (eval_id,))

    async def create_critique(self, evaluation_id: str, concerns: List[Any], unsupported_claims: List[Any], risk_factors: List[Any], potential_bias: List[Any]) -> Dict[str, Any]:
        critique_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        await self._execute(
            """
            INSERT INTO critiques (id, evaluation_id, concerns, unsupported_claims, risk_factors, potential_bias, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (critique_id, evaluation_id, self._encode(concerns), self._encode(unsupported_claims), self._encode(risk_factors), self._encode(potential_bias), created_at),
        )
        return await self.get_critique(critique_id) or {}

    async def get_critique(self, critique_id: str) -> Optional[Dict[str, Any]]:
        return await self._fetchone("SELECT * FROM critiques WHERE id=%s", (critique_id,))

    async def get_critique_by_evaluation(self, evaluation_id: str) -> Optional[Dict[str, Any]]:
        return await self._fetchone(
            "SELECT * FROM critiques WHERE evaluation_id=%s ORDER BY created_at DESC LIMIT 1",
            (evaluation_id,),
        )

    async def create_decision(self, candidate_id: str, job_id: str, verdict: str, confidence: int, explanation: str, interview_questions: List[str], ranking: int = 1) -> Dict[str, Any]:
        decision_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        await self._execute(
            """
            INSERT INTO decisions (id, candidate_id, job_id, verdict, confidence, explanation, interview_questions, ranking, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (decision_id, candidate_id, job_id, verdict, confidence, explanation, self._encode(interview_questions), ranking, created_at),
        )
        return await self.get_decision(decision_id) or {}

    async def get_decision(self, decision_id: str) -> Optional[Dict[str, Any]]:
        return await self._fetchone("SELECT * FROM decisions WHERE id=%s", (decision_id,))

    async def update_decision_ranking(self, decision_id: str, ranking: int) -> None:
        await self._execute("UPDATE decisions SET ranking=%s WHERE id=%s", (ranking, decision_id))

    async def create_committee_decision(self, job_id: str, candidate_id: str, evaluation_id: str, critique_id: Optional[str], verdict: str, confidence: int, final_reasoning: str) -> Dict[str, Any]:
        committee_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        await self._execute(
            """
            INSERT INTO committee_decisions (id, job_id, candidate_id, evaluation_id, critique_id, verdict, confidence, final_reasoning, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (committee_id, job_id, candidate_id, evaluation_id, critique_id, verdict, confidence, final_reasoning, created_at),
        )
        return await self.get_committee_decision(committee_id) or {}

    async def get_committee_decision(self, committee_id: str) -> Optional[Dict[str, Any]]:
        return await self._fetchone("SELECT * FROM committee_decisions WHERE id=%s", (committee_id,))

    async def create_ranking(self, job_id: str, candidate_id: str, score: int, rank: int, verdict: str, confidence: int, rationale: Dict[str, Any]) -> Dict[str, Any]:
        ranking_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        await self._execute(
            """
            INSERT INTO rankings (id, job_id, candidate_id, score, rank, verdict, confidence, rationale, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (ranking_id, job_id, candidate_id, score, rank, verdict, confidence, self._encode(rationale), created_at),
        )
        return await self.get_ranking(ranking_id) or {}

    async def replace_job_rankings(self, job_id: str, rankings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        await self._execute("DELETE FROM rankings WHERE job_id=%s", (job_id,))
        created = []
        for item in rankings:
            row = await self.create_ranking(
                job_id=job_id,
                candidate_id=item["candidate_id"],
                score=item.get("score") or 0,
                rank=item.get("rank") or 999,
                verdict=item.get("verdict") or "Reject",
                confidence=item.get("confidence") or 0,
                rationale=item.get("rationale") or {},
            )
            created.append(row)
        return created

    async def get_ranking(self, ranking_id: str) -> Optional[Dict[str, Any]]:
        return await self._fetchone("SELECT * FROM rankings WHERE id=%s", (ranking_id,))

    async def get_job_rankings(self, job_id: str) -> List[Dict[str, Any]]:
        return await self._fetchall(
            "SELECT * FROM rankings WHERE job_id=%s ORDER BY rank ASC, created_at DESC",
            (job_id,),
        )

    async def create_comparison(self, job_id: str, candidate_a_id: str, candidate_b_id: str, winner_candidate_id: str, rationale: Dict[str, Any]) -> Dict[str, Any]:
        comparison_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        await self._execute(
            """
            INSERT INTO comparisons (id, job_id, candidate_a_id, candidate_b_id, winner_candidate_id, rationale, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (comparison_id, job_id, candidate_a_id, candidate_b_id, winner_candidate_id, self._encode(rationale), created_at),
        )
        return await self.get_comparison(comparison_id) or {}

    async def replace_job_comparisons(self, job_id: str, comparisons: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        await self._execute("DELETE FROM comparisons WHERE job_id=%s", (job_id,))
        created = []
        for item in comparisons:
            row = await self.create_comparison(
                job_id=job_id,
                candidate_a_id=item["candidate_a_id"],
                candidate_b_id=item["candidate_b_id"],
                winner_candidate_id=item["winner_candidate_id"],
                rationale=item.get("rationale") or {},
            )
            created.append(row)
        return created

    async def get_comparison(self, comparison_id: str) -> Optional[Dict[str, Any]]:
        return await self._fetchone("SELECT * FROM comparisons WHERE id=%s", (comparison_id,))

    async def get_job_comparisons(self, job_id: str) -> List[Dict[str, Any]]:
        return await self._fetchall(
            "SELECT * FROM comparisons WHERE job_id=%s ORDER BY created_at ASC",
            (job_id,),
        )

    async def create_report(self, evaluation_id: str, candidate_id: str, job_id: str, report_data: Dict[str, Any]) -> Dict[str, Any]:
        report_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        await self._execute(
            "INSERT INTO reports (id, evaluation_id, candidate_id, job_id, report_data, created_at) VALUES (%s, %s, %s, %s, %s, %s)",
            (report_id, evaluation_id, candidate_id, job_id, self._encode(report_data), created_at),
        )
        return await self.get_report(report_id) or {}

    async def get_report(self, report_id: str) -> Optional[Dict[str, Any]]:
        return await self._fetchone("SELECT * FROM reports WHERE id=%s", (report_id,))

    async def get_job_reports(self, job_id: str) -> List[Dict[str, Any]]:
        return await self._fetchall(
            """
            SELECT reports.*, candidates.name as candidate_name, evaluations.score as score,
                   COALESCE(rankings.rank, decisions.ranking) as ranking,
                   COALESCE(rankings.verdict, decisions.verdict) as verdict,
                   rankings.confidence as ranking_confidence,
                   rankings.rationale as ranking_rationale
            FROM reports
            LEFT JOIN candidates ON candidates.id = reports.candidate_id
            LEFT JOIN evaluations ON evaluations.id = reports.evaluation_id
            LEFT JOIN decisions ON decisions.candidate_id = reports.candidate_id AND decisions.job_id = reports.job_id
            LEFT JOIN rankings ON rankings.candidate_id = reports.candidate_id AND rankings.job_id = reports.job_id
            WHERE reports.job_id=%s ORDER BY COALESCE(rankings.rank, decisions.ranking, 999), reports.created_at DESC
            """,
            (job_id,),
        )

    async def get_job_results(self, job_id: str) -> List[Dict[str, Any]]:
        rows = await self._fetchall(
            """
            SELECT e.id as evaluation_id, e.score, e.breakdown, e.strengths, e.weaknesses, e.evidence, e.devils_advocate, e.status, e.error_message, e.created_at as eval_created_at,
                   c.id as candidate_id, c.name as candidate_name, c.email as candidate_email, c.parsed_profile, c.raw_resume_text,
                   d.id as decision_id, d.verdict, d.confidence, d.explanation, d.interview_questions, d.ranking
            FROM evaluations e
            JOIN candidates c ON e.candidate_id = c.id
            LEFT JOIN decisions d ON (e.candidate_id = d.candidate_id AND e.job_id = d.job_id)
            WHERE e.job_id = %s
            ORDER BY COALESCE(d.ranking, 999), e.created_at DESC
            """,
            (job_id,),
        )
        results = []
        rankings = {row["candidate_id"]: row for row in await self.get_job_rankings(job_id)}
        comparisons = await self.get_job_comparisons(job_id)
        for r in rows:
            candidate_evidence = await self.get_candidate_evidence(r["candidate_id"])
            critique = await self.get_critique_by_evaluation(r["evaluation_id"])
            evaluation = {
                "id": r["evaluation_id"], "candidate_id": r["candidate_id"], "job_id": job_id,
                "score": r.get("score") or 0, "breakdown": r.get("breakdown") or {},
                "strengths": r.get("strengths") or [], "weaknesses": r.get("weaknesses") or [],
                "evidence": r.get("evidence") or [], "evidence_items": candidate_evidence,
                "devils_advocate": r.get("devils_advocate") or {},
                "status": r.get("status"), "error_message": r.get("error_message"), "created_at": r.get("eval_created_at"),
            }
            ranking = rankings.get(r["candidate_id"], {})
            decision = {
                "id": r.get("decision_id"), "candidate_id": r["candidate_id"], "job_id": job_id,
                "verdict": ranking.get("verdict") or r.get("verdict"), "confidence": ranking.get("confidence") or r.get("confidence") or 0,
                "explanation": r.get("explanation") or "", "interview_questions": r.get("interview_questions") or [],
                "ranking": ranking.get("rank") or r.get("ranking"),
                "ranking_rationale": ranking.get("rationale") or {},
            }
            results.append({
                "evaluation_id": r["evaluation_id"],
                "profile": {"id": r["candidate_id"], "name": r.get("candidate_name"), "email": r.get("candidate_email"), "parsed_profile": r.get("parsed_profile") or {}, "raw_resume_text": r.get("raw_resume_text")},
                "evaluation": evaluation,
                "critique": critique or evaluation["devils_advocate"],
                "decision": decision,
                "comparisons": [
                    comparison for comparison in comparisons
                    if comparison.get("candidate_a_id") == r["candidate_id"] or comparison.get("candidate_b_id") == r["candidate_id"]
                ],
            })
        return results

    async def create_candidate_session(self, candidate_id: str, target_role: str, fit_score: int, skill_gaps: Dict[str, Any], tailored_resume_suggestions: Dict[str, Any], cover_letter: str, interview_prep: Dict[str, Any], job_recommendations: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        session_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        await self._execute(
            """
            INSERT INTO candidate_sessions (id, candidate_id, target_role, fit_score, skill_gaps, tailored_resume_suggestions, cover_letter, interview_prep, job_recommendations, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (session_id, candidate_id, target_role, fit_score, self._encode(skill_gaps), self._encode(tailored_resume_suggestions), cover_letter, self._encode(interview_prep), self._encode(job_recommendations or {}), created_at),
        )
        return await self.get_candidate_session(session_id) or {}

    async def get_candidate_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        return await self._fetchone("SELECT * FROM candidate_sessions WHERE id=%s", (session_id,))


db = DatabaseManager()
