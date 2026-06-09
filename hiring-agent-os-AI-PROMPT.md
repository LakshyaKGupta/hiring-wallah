# PROMPT FOR AI CODING AGENT

---

You are an expert full-stack engineer specializing in AI agent systems, FastAPI, and Next.js 3D interfaces.

Build the complete **Hiring Agent OS** — an autonomous hiring intelligence platform.

---

## WHAT THIS PROJECT IS

A multi-agent system that converts hiring goals into evidence-backed, self-critiqued hiring decisions. It is NOT a resume scorer. It is a 6-agent reasoning pipeline that:
1. Analyzes job requirements
2. Creates a weighted evaluation framework
3. Extracts evidence from resumes (not keywords)
4. Scores candidates against the framework
5. Challenges its own conclusions (Devil's Advocate agent)
6. Makes a final hiring committee decision

---

## TECH STACK

Backend: FastAPI + Python
LLM: Gemini 2.5 Flash (google-generativeai SDK)
PDF Parsing: PyMuPDF + pdfplumber
Database: PostgreSQL via Supabase (use supabase-py)
Frontend: Next.js 14 (App Router) + TypeScript
Styling: Tailwind CSS + Framer Motion
3D: React Three Fiber (@react-three/fiber + @react-three/drei)
Charts: Recharts
Deployment Target: Vercel (frontend) + Render (backend)

---

## BACKEND — BUILD THIS FIRST

### Folder Structure
```
backend/
├── main.py
├── requirements.txt
├── app/
│   ├── api/
│   │   ├── recruiter.py
│   │   ├── candidate.py
│   │   └── jobs.py
│   ├── agents/
│   │   ├── orchestrator.py
│   │   ├── requirement_analyst.py
│   │   ├── hiring_strategist.py
│   │   ├── resume_investigator.py
│   │   ├── candidate_evaluator.py
│   │   ├── devils_advocate.py
│   │   └── hiring_committee.py
│   ├── parsers/
│   │   └── resume_parser.py
│   ├── db/
│   │   ├── database.py
│   │   └── models.py
│   ├── utils/
│   │   └── gemini_client.py
│   └── config.py
```

### Base Agent Pattern
Every agent must follow this contract:
```python
class BaseAgent:
    def __init__(self, gemini_client):
        self.client = gemini_client

    async def run(self, input_data: dict) -> dict:
        prompt = self.build_prompt(input_data)
        raw = await self.client.generate(prompt)
        return self.parse_output(raw)
```

### Gemini Client
Use `gemini-2.5-flash` model. Force JSON output using `response_mime_type="application/json"`. Always wrap response parsing in try/except and retry once on parse failure with a stricter prompt.

### Orchestrator Logic
```python
async def run_recruiter_pipeline(job_description: str, resumes: list[str]):
    req_analysis = await requirement_analyst.run({"jd": job_description})
    framework = await hiring_strategist.run({"requirements": req_analysis})
    
    results = []
    for resume_text in resumes:
        profile = await resume_investigator.run({"resume": resume_text})
        evaluation = await candidate_evaluator.run({"profile": profile, "framework": framework})
        critique = await devils_advocate.run({"evaluation": evaluation})
        decision = await hiring_committee.run({"evaluation": evaluation, "critique": critique})
        results.append({
            "profile": profile, "evaluation": evaluation,
            "critique": critique, "decision": decision
        })
    
    return sorted(results, key=lambda x: x["decision"]["confidence"], reverse=True)
```

### API Endpoints (implement all of these)

POST /recruiter/job — Create job, trigger Agent 1 + 2, store in DB
POST /recruiter/evaluate — Upload resumes (multipart/form-data), run full pipeline, return ranked results
GET /recruiter/job/{job_id}/results — Return all evaluations + decisions for a job
GET /recruiter/evaluation/{eval_id} — Return single evaluation with full breakdown
POST /candidate/analyze — Upload resume + target role, run candidate pipeline
GET /candidate/report/{session_id} — Return candidate report

### Resume Parser
```python
import fitz
import pdfplumber

def parse_resume(pdf_bytes: bytes) -> str:
    # Try pdfplumber first
    # Fallback to PyMuPDF
    # Return plain text
```

### Database Schema
Run this SQL in Supabase:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT, email TEXT, parsed_profile JSONB,
    raw_resume_text TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL, company TEXT, description TEXT NOT NULL,
    requirement_analysis JSONB, evaluation_framework JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidates(id),
    job_id UUID REFERENCES jobs(id),
    score INTEGER, breakdown JSONB, strengths JSONB,
    weaknesses JSONB, evidence JSONB, devils_advocate JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidates(id),
    job_id UUID REFERENCES jobs(id),
    verdict TEXT CHECK (verdict IN ('Strong Hire', 'Consider', 'Reject')),
    confidence INTEGER, explanation TEXT,
    interview_questions JSONB, ranking INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE candidate_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidates(id),
    target_role TEXT, fit_score INTEGER, skill_gaps JSONB,
    tailored_resume_suggestions JSONB, cover_letter TEXT,
    interview_prep JSONB, job_recommendations JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Agent Prompts

Agent 1 — Requirement Analyst:
```
You are a senior talent acquisition specialist.
Analyze the following job description and extract structured hiring requirements.
Job Description: {job_description}
Return ONLY valid JSON:
{
  "must_have": [],
  "good_to_have": [],
  "red_flags": [],
  "priorities": [],
  "role_level": "intern/junior/mid/senior",
  "domain": "engineering/product/design/etc"
}
```

Agent 2 — Hiring Strategist:
```
You are a hiring committee chair designing an evaluation rubric.
Based on these requirements, create a weighted scoring framework.
Requirements: {requirement_analysis}
Return ONLY valid JSON:
{
  "evaluation_framework": {"dimension_name": weight_integer},
  "total_weight": 100,
  "rationale": "",
  "criteria_per_dimension": {"dimension_name": "what scores high vs low"}
}
Weights must sum to exactly 100.
```

Agent 3 — Resume Investigator:
```
You are a forensic resume analyst. Extract EVIDENCE, not keywords.
Resume Text: {resume_text}
Return ONLY valid JSON:
{
  "name": "",
  "experience_years": 0,
  "projects": [{"name": "", "description": "", "evidence": [], "impact": "", "technologies": []}],
  "skills_demonstrated": [],
  "quantified_achievements": [],
  "education": [],
  "missing_evidence": [],
  "career_trajectory": ""
}
Do NOT infer. Only extract what is explicitly stated.
```

Agent 4 — Candidate Evaluator:
```
You are a structured hiring evaluator.
Candidate Profile: {candidate_profile}
Evaluation Framework: {evaluation_framework}
Return ONLY valid JSON:
{
  "overall_score": 0,
  "breakdown": {"dimension_name": {"score": 0, "evidence": [], "justification": ""}},
  "strengths": [],
  "weaknesses": [],
  "evidence_quality": "strong/moderate/weak"
}
Score range: 0-100. Above 80 requires strong direct evidence.
```

Agent 5 — Devil's Advocate:
```
You are an adversarial evaluator. Find weaknesses in this evaluation.
Evaluation Report: {evaluation_report}
Return ONLY valid JSON:
{
  "contested_claims": [{"original_claim": "", "counter": "", "severity": "low/medium/high"}],
  "risk_factors": [],
  "overall_confidence_adjustment": -5,
  "recommendation": "approve/flag/reject_evaluation"
}
```

Agent 6 — Hiring Committee:
```
You are the chair of a hiring committee.
Evaluation: {evaluation}
Critique: {critique}
Return ONLY valid JSON:
{
  "verdict": "Strong Hire | Consider | Reject",
  "confidence": 0,
  "final_explanation": "",
  "key_deciding_factors": [],
  "suggested_interview_questions": [],
  "risk_summary": ""
}
```

---

## FRONTEND — BUILD AFTER BACKEND WORKS

### Design System

```css
/* CSS Variables */
--bg-deep: #050A14;
--bg-surface: #0A1628;
--bg-raised: #0F2040;
--accent-primary: #00E5FF;     /* electric cyan */
--accent-secondary: #7C3AED;   /* deep violet */
--accent-green: #10B981;       /* Strong Hire */
--accent-amber: #F59E0B;       /* Consider */
--accent-red: #EF4444;         /* Reject */
--accent-da: #FF3D71;          /* Devil's Advocate */
--text-primary: #F0F6FF;
--text-secondary: #8BA0C0;
--text-tertiary: #4A6080;
--border: #1A3050;
```

Typography:
- Display/Headlines: Syne (Google Font) 700 weight
- Body: Inter
- Data/Scores/Code: JetBrains Mono

Import from Google Fonts: Syne, Inter, JetBrains Mono

### Pages to Build

1. Landing Page (`/`)
   - Full-screen hero with Three.js floating agent node network background (nodes connected by thin lines, slowly rotating)
   - Headline: "Your AI Hiring Committee. Always On. Never Biased." in Syne 700
   - Two CTAs: "Start Hiring" → /recruiter | "Upload Resume" → /candidate
   - Below fold: animated 6-agent pipeline visualization showing nodes lighting up in sequence
   - "For Recruiters" / "For Candidates" two-column section

2. Recruiter Dashboard (`/recruiter`)
   - Left sidebar: job list + "New Job" button
   - Main panel: Job creation form (title, company, description textarea)
   - Below: Drag-and-drop PDF upload zone (multiple files)
   - "Run Pipeline" button
   - When pipeline runs: show animated 6-agent pipeline with each step lighting up as it completes (polling /recruiter/job/{id}/results)

3. Results Page (`/recruiter/results/[jobId]`)
   - 3D perspective ranking: candidates shown as cards with CSS 3D depth (rank 1 is closest, rank 4 is furthest)
   - Each card: name, score (JetBrains Mono, large), verdict badge, score bars per dimension, DA flag count
   - Click card to navigate to detail

4. Candidate Detail (`/recruiter/candidate/[evalId]`)
   - Three columns: Profile | Evaluation | DA Report
   - DA panel has hot pink/red border (#FF3D71), animated "CONTESTED" label
   - Interview questions with copy button
   - Score bars animated on load

5. Candidate Dashboard (`/candidate`)
   - Clean upload zone + target role input
   - "Analyze My Profile" button

6. Candidate Report (`/candidate/report/[sessionId]`)
   - Tab navigation: Fit Score | Skill Gaps | Resume | Cover Letter | Interview Prep
   - Fit Score: circular animated gauge
   - Skill Gaps: radar chart (Recharts)
   - Resume: side-by-side before/after bullets
   - Cover Letter: textarea with copy
   - Interview Prep: flip cards (question front, answer structure back)

### Signature Animation — The Verdict Reveal

When Hiring Committee decision arrives, execute this sequence:
1. All 6 agent nodes light up simultaneously with cyan glow
2. Expanding glow ring from center (scale 0 → 2, fade out)
3. Verdict text types in character by character: "STRONG HIRE"
4. Confidence percentage counts up (0 → 92%)
5. Confidence ring fills as arc animation
6. Explanation text fades in below

Use Framer Motion for all animations.

### Key Components to Build

```
<AgentNode state="waiting|active|complete" label="Requirement Analyst" />
<ScoreCard candidate={...} rank={1} />
<VerdictBadge verdict="Strong Hire" confidence={92} />
<DAPanel claims={[...]} />
<ScoreBar label="Technical" score={88} max={100} />
<PipelineVisualizer agents={[...]} activeIndex={3} />
<VerdictReveal verdict={...} />  // The signature animation
```

### 3D Implementation

Use React Three Fiber for:
1. Landing hero background — floating connected nodes (use Points + LineSegments)
2. Results page depth — use CSS perspective transform, NOT Three.js (simpler)

For Three.js landing scene:
```jsx
// ~50 nodes at random positions, connected if distance < threshold
// Slow rotation: useFrame(() => { mesh.rotation.y += 0.001 })
// Color: #00E5FF for nodes, rgba(0,229,255,0.2) for connections
// Camera position: [0, 0, 15]
```

---

## ENVIRONMENT VARIABLES

Backend .env:
```
GEMINI_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CORS_ORIGINS=http://localhost:3000
```

Frontend .env.local:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## IMPORTANT CONSTRAINTS

1. No LangChain. No CrewAI. No AutoGen. Raw Gemini API calls only.
2. Every agent returns strict JSON. Validate and handle parse errors.
3. All pipeline calls are async. Don't block the event loop.
4. The Devil's Advocate agent is what makes this impressive — implement it fully, not as a formality.
5. Resume parsing must try pdfplumber first, PyMuPDF as fallback.
6. Frontend polling: use setInterval to poll results endpoint every 3 seconds while pipeline is running.
7. The verdict reveal animation is the demo moment — build it properly.
8. CORS must be properly configured on FastAPI.
9. Use Pydantic models for all request/response shapes.
10. Handle empty resumes and failed Gemini calls gracefully — return partial state with error flags.

---

## SUCCESS CRITERIA

Recruiter flow: JD + 5 resumes → ranked output in < 2 minutes
Candidate flow: Resume + role → report in < 2 minutes
UI: 3D depth visible, verdict animation runs, no layout breaks

Build backend first, test with curl/Postman, then build frontend.
