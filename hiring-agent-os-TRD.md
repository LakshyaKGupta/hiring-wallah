# Hiring Agent OS — Technical Requirements Document (TRD)

**Version:** 1.0  
**Author:** Raja  
**Date:** June 2026  
**Status:** Ready for Implementation

---

## 1. System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                    │
│  Landing | Recruiter Dashboard | Candidate Dashboard |       │
│  Evaluation Results | Rankings | Job Recommendations         │
└─────────────────────────┬────────────────────────────────────┘
                          │ HTTP / REST
┌─────────────────────────▼────────────────────────────────────┐
│                     BACKEND (FastAPI)                        │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              ORCHESTRATOR                           │    │
│  │  Chains agents, manages state, handles retries      │    │
│  └──────┬──────┬──────┬──────┬──────┬─────────────────┘    │
│         │      │      │      │      │                        │
│    Req  │  Str │  Inv │  Eval│  DA  │  Committee            │
│   Analyst Strat  estig  uator  Adv   Agent                  │
│   Agent  Agent  ator   Agent  Agent  Agent                  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │          PDF PARSER (PyMuPDF + pdfplumber)          │    │
│  └─────────────────────────────────────────────────────┘    │
└────────────────────────┬─────────────────────────────────────┘
                         │
           ┌─────────────┼──────────────┐
           │             │              │
    ┌──────▼──────┐ ┌───▼────┐  ┌──────▼──────┐
    │  PostgreSQL  │ │ Gemini │  │  File Store │
    │  (Supabase)  │ │  2.5   │  │  (Supabase  │
    │              │ │ Flash  │  │   Storage)  │
    └──────────────┘ └────────┘  └─────────────┘
```

---

## 2. Backend — FastAPI

### 2.1 Project Structure

```
backend/
├── main.py
├── requirements.txt
├── .env
├── app/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── recruiter.py        # /recruiter/* endpoints
│   │   ├── candidate.py        # /candidate/* endpoints
│   │   └── jobs.py             # /jobs/* endpoints
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── orchestrator.py     # Master chain manager
│   │   ├── requirement_analyst.py
│   │   ├── hiring_strategist.py
│   │   ├── resume_investigator.py
│   │   ├── candidate_evaluator.py
│   │   ├── devils_advocate.py
│   │   └── hiring_committee.py
│   ├── parsers/
│   │   ├── __init__.py
│   │   └── resume_parser.py    # PyMuPDF + pdfplumber
│   ├── db/
│   │   ├── __init__.py
│   │   ├── database.py         # Supabase client
│   │   └── models.py           # Pydantic models
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── gemini_client.py    # Gemini API wrapper
│   │   └── validators.py
│   └── config.py
```

---

### 2.2 API Endpoints

#### Recruiter Routes (`/recruiter`)

| Method | Path | Description |
|---|---|---|
| POST | `/recruiter/job` | Create job, trigger Agent 1 + 2 |
| POST | `/recruiter/evaluate` | Upload resumes, trigger Agent 3–6 |
| GET | `/recruiter/job/{job_id}/results` | Get ranked candidates |
| GET | `/recruiter/evaluation/{eval_id}` | Get single evaluation detail |

#### Candidate Routes (`/candidate`)

| Method | Path | Description |
|---|---|---|
| POST | `/candidate/analyze` | Upload resume + target role |
| GET | `/candidate/report/{session_id}` | Get full application strategy report |

#### Jobs Routes (`/jobs`)

| Method | Path | Description |
|---|---|---|
| GET | `/jobs` | List available jobs |
| POST | `/jobs` | Add a job manually |

---

### 2.3 Agent Implementation Pattern

Every agent follows the same contract:

```python
class BaseAgent:
    def __init__(self, gemini_client):
        self.client = gemini_client

    async def run(self, input_data: dict) -> dict:
        prompt = self.build_prompt(input_data)
        raw = await self.client.generate(prompt)
        return self.parse_output(raw)

    def build_prompt(self, input_data: dict) -> str:
        raise NotImplementedError

    def parse_output(self, raw: str) -> dict:
        # Strip ```json fences, parse, validate
        raise NotImplementedError
```

---

### 2.4 Orchestrator Logic

```python
class Orchestrator:
    async def run_recruiter_pipeline(self, job_description: str, resumes: list[str]):
        # Step 1: Analyze requirements
        req_analysis = await requirement_analyst.run({"jd": job_description})

        # Step 2: Create framework
        framework = await hiring_strategist.run({"requirements": req_analysis})

        results = []
        for resume_text in resumes:
            # Step 3: Investigate resume
            profile = await resume_investigator.run({"resume": resume_text})

            # Step 4: Score candidate
            evaluation = await candidate_evaluator.run({
                "profile": profile,
                "framework": framework
            })

            # Step 5: Challenge evaluation
            critique = await devils_advocate.run({"evaluation": evaluation})

            # Step 6: Final decision
            decision = await hiring_committee.run({
                "evaluation": evaluation,
                "critique": critique
            })

            results.append({
                "profile": profile,
                "evaluation": evaluation,
                "critique": critique,
                "decision": decision
            })

        # Sort by decision confidence × score
        return sorted(results, key=lambda x: x["decision"]["confidence"], reverse=True)
```

---

### 2.5 Gemini Client

```python
import google.generativeai as genai

class GeminiClient:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-2.5-flash")

    async def generate(self, prompt: str) -> str:
        response = self.model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json"
            )
        )
        return response.text
```

---

### 2.6 Resume Parser

```python
import fitz  # PyMuPDF
import pdfplumber

def parse_resume(pdf_bytes: bytes) -> str:
    # Try pdfplumber first (better for structured PDFs)
    try:
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            text = "\n".join(page.extract_text() or "" for page in pdf.pages)
            if len(text.strip()) > 100:
                return text
    except:
        pass

    # Fallback to PyMuPDF
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    return "\n".join(page.get_text() for page in doc)
```

---

## 3. Frontend — Next.js

### 3.1 Project Structure

```
frontend/
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── public/
│   └── assets/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Landing
│   │   ├── recruiter/
│   │   │   ├── page.tsx                # Recruiter Dashboard
│   │   │   ├── results/[jobId]/page.tsx
│   │   │   └── candidate/[evalId]/page.tsx
│   │   └── candidate/
│   │       ├── page.tsx                # Candidate Dashboard
│   │       └── report/[sessionId]/page.tsx
│   ├── components/
│   │   ├── ui/                         # Reusable atoms
│   │   ├── agents/                     # Agent pipeline visualizer
│   │   ├── recruiter/
│   │   └── candidate/
│   ├── lib/
│   │   ├── api.ts                      # API calls to FastAPI
│   │   └── types.ts                    # TypeScript interfaces
│   └── styles/
│       └── globals.css
```

---

### 3.2 Pages

| Page | Route | Description |
|---|---|---|
| Landing | `/` | Hero, product value prop, CTA |
| Recruiter Dashboard | `/recruiter` | Upload JD + resumes, trigger pipeline |
| Candidate Dashboard | `/candidate` | Upload resume + target role |
| Evaluation Results | `/recruiter/results/[jobId]` | Ranked list with scores |
| Candidate Detail | `/recruiter/candidate/[evalId]` | Full evaluation, evidence, DA report |
| Candidate Report | `/candidate/report/[sessionId]` | Skill gaps, resume tips, cover letter |

---

### 3.3 Key Components

**AgentPipelineVisualizer** — Shows the 6-agent chain animating in real-time as each step completes. Each node glows when active.

**CandidateScoreCard** — 3D card flip to reveal scores per dimension, with evidence drawer.

**VerdictBadge** — Strong Hire (green) / Consider (amber) / Reject (red) with confidence ring.

**DevilsAdvocatePanel** — Collapsible red panel showing contested claims.

**InterviewQuestionsPanel** — Generated questions with copy-to-clipboard.

---

## 4. Database (Supabase / PostgreSQL)

### 4.1 Full Schema SQL

```sql
-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Candidates
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    email TEXT,
    parsed_profile JSONB,
    raw_resume_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company TEXT,
    description TEXT NOT NULL,
    requirement_analysis JSONB,    -- Agent 1 output
    evaluation_framework JSONB,    -- Agent 2 output
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evaluations
CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidates(id),
    job_id UUID REFERENCES jobs(id),
    score INTEGER CHECK (score >= 0 AND score <= 100),
    breakdown JSONB,
    strengths JSONB,
    weaknesses JSONB,
    evidence JSONB,
    devils_advocate JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Decisions
CREATE TABLE decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidates(id),
    job_id UUID REFERENCES jobs(id),
    verdict TEXT CHECK (verdict IN ('Strong Hire', 'Consider', 'Reject')),
    confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
    explanation TEXT,
    interview_questions JSONB,
    ranking INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidate Sessions (for candidate-side flow)
CREATE TABLE candidate_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidates(id),
    target_role TEXT,
    fit_score INTEGER,
    skill_gaps JSONB,
    tailored_resume_suggestions JSONB,
    cover_letter TEXT,
    interview_prep JSONB,
    job_recommendations JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_evaluations_job_id ON evaluations(job_id);
CREATE INDEX idx_evaluations_candidate_id ON evaluations(candidate_id);
CREATE INDEX idx_decisions_job_id ON decisions(job_id);
```

---

## 5. Environment Variables

```env
# Backend (.env)
GEMINI_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CORS_ORIGINS=http://localhost:3000,https://your-frontend.vercel.app

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 6. Deployment

| Service | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Auto-deploy from main branch |
| Backend | Render (free tier) | Docker or uvicorn start |
| Database | Supabase | Free tier sufficient for MVP |
| File Storage | Supabase Storage | PDF uploads |

---

## 7. Tech Stack Summary

| Layer | Technology | Version |
|---|---|---|
| Frontend | Next.js | 14+ (App Router) |
| Styling | Tailwind CSS + Framer Motion | Latest |
| 3D | Three.js / React Three Fiber | Latest |
| Backend | FastAPI | 0.111+ |
| LLM | Gemini 2.5 Flash | Latest |
| PDF Parse | PyMuPDF + pdfplumber | Latest |
| Database | PostgreSQL via Supabase | Latest |
| Auth | Supabase Auth | (optional for MVP) |

---

## 8. Agent Prompts

### Agent 1 — Requirement Analyst Prompt
```
You are a senior talent acquisition specialist.

Analyze the following job description and extract structured hiring requirements.

Job Description:
{job_description}

Return ONLY valid JSON in this exact format:
{
  "must_have": ["list of non-negotiable requirements"],
  "good_to_have": ["list of preferred but not required"],
  "red_flags": ["signals that would disqualify a candidate"],
  "priorities": ["what matters most for this role, ranked"],
  "role_level": "intern/junior/mid/senior",
  "domain": "engineering/product/design/etc"
}
```

### Agent 2 — Hiring Strategist Prompt
```
You are a hiring committee chair designing an evaluation rubric.

Based on these requirements, create a weighted scoring framework.

Requirements:
{requirement_analysis}

Return ONLY valid JSON:
{
  "evaluation_framework": {
    "dimension_name": weight_integer
  },
  "total_weight": 100,
  "rationale": "why these weights were chosen",
  "criteria_per_dimension": {
    "dimension_name": "what evidence would score high vs low"
  }
}

Weights must sum to exactly 100.
```

### Agent 3 — Resume Investigator Prompt
```
You are a forensic resume analyst. Your job is to extract EVIDENCE, not keywords.

Resume Text:
{resume_text}

Return ONLY valid JSON:
{
  "name": "",
  "experience_years": 0,
  "projects": [
    {
      "name": "",
      "description": "",
      "evidence": [],
      "impact": "",
      "technologies": []
    }
  ],
  "skills_demonstrated": [],
  "quantified_achievements": [],
  "education": [],
  "missing_evidence": [],
  "career_trajectory": ""
}

Do NOT infer. Only extract what is explicitly stated or demonstrated in the resume.
```

### Agent 4 — Candidate Evaluator Prompt
```
You are a structured hiring evaluator.

Candidate Profile:
{candidate_profile}

Evaluation Framework:
{evaluation_framework}

Score this candidate on each dimension. Use only evidence from the profile.

Return ONLY valid JSON:
{
  "overall_score": 0,
  "breakdown": {
    "dimension_name": {
      "score": 0,
      "evidence": [],
      "justification": ""
    }
  },
  "strengths": [],
  "weaknesses": [],
  "evidence_quality": "strong/moderate/weak"
}

Score range: 0–100. Be strict. A score above 80 requires strong direct evidence.
```

### Agent 5 — Devil's Advocate Prompt
```
You are an adversarial evaluator. Your job is to find weaknesses in the following evaluation.

Try to prove the evaluation is too generous. Look for:
- Assumptions with no evidence
- Over-scoring based on keywords not actions
- Missing context that would change the verdict
- Potential bias or inflation

Evaluation Report:
{evaluation_report}

Return ONLY valid JSON:
{
  "contested_claims": [
    {
      "original_claim": "",
      "counter": "",
      "severity": "low/medium/high"
    }
  ],
  "risk_factors": [],
  "overall_confidence_adjustment": -5,
  "recommendation": "approve/flag/reject_evaluation"
}
```

### Agent 6 — Hiring Committee Prompt
```
You are the chair of a hiring committee. You have:
1. A structured candidate evaluation
2. An adversarial critique of that evaluation

Your job: make a final, balanced hiring decision.

Evaluation:
{evaluation}

Critique:
{critique}

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

## 9. Error Handling

| Scenario | Handling |
|---|---|
| PDF parse failure | Return error, ask for text paste fallback |
| Gemini JSON parse failure | Retry once with stricter prompt, then return partial result |
| Agent timeout (> 30s) | Return partial pipeline state, mark incomplete |
| Empty resume | Return validation error before pipeline starts |
| Invalid JD | Agent 1 returns low-confidence flag, proceed with warning |

---

## 10. 15-Day Build Plan

| Days | Tasks |
|---|---|
| 1–2 | Repo setup, FastAPI skeleton, Supabase schema, Gemini client |
| 3–4 | Agent 1 + 2 (Requirement Analyst + Strategist) with tests |
| 5–6 | PDF parser + Agent 3 (Resume Investigator) |
| 7–8 | Agent 4 (Evaluator) + Orchestrator chain |
| 9–10 | Agent 5 (Devil's Advocate) + Agent 6 (Committee) |
| 11–12 | Candidate-side flow |
| 13 | Next.js frontend — core pages |
| 14 | 3D UI polish, animations, deploy |
| 15 | Demo video, README, case study |
