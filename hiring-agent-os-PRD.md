# Hiring Agent OS — Product Requirements Document (PRD)

**Version:** 1.0  
**Author:** Raja (AgentShield / AI Projects)  
**Date:** June 2026  
**Status:** Ready for Engineering

---

## 1. Vision

Build an autonomous hiring intelligence system that behaves like a seasoned hiring committee — not a chatbot, not a resume scorer.

The system converts goals into plans, plans into evaluation frameworks, and frameworks into defensible hiring decisions — through multi-stage reasoning, evidence extraction, and adversarial self-critique.

**Tagline:** *"Your AI hiring committee. Always on. Never biased."*

---

## 2. Problem Statement

### Current State
Existing tools follow a single-hop logic:
```
Resume → LLM → Score
```
This produces:
- Keyword-based matching (not evidence-based)
- No reasoning transparency
- No self-correction or bias detection
- Generic outputs that don't reflect hiring priorities

### Desired State
```
Goal → Planning → Evidence Collection → Evaluation → Self-Critique → Decision
```
This produces:
- Evidence-backed scores
- Reasoning chains visible to users
- Devil's advocate challenge at every step
- Structured, explainable verdicts

---

## 3. Users

### 3.1 Recruiter
**Who:** HR professionals, startup founders, hiring managers  
**Goal:** Screen N candidates against a job description and get a ranked hiring recommendation  
**Pain Points:** Manual screening takes hours; evaluation is inconsistent across reviewers; no documentation of reasoning

**Inputs:**
- Job Description (text or paste)
- Multiple resumes (PDF upload, up to 10)

**Outputs:**
- Ranked candidate list with scores
- Per-candidate: strengths, weaknesses, evidence, risk flags
- Interview question bank per candidate
- Final verdict: Strong Hire / Consider / Reject
- Hiring committee reasoning

---

### 3.2 Candidate
**Who:** Students, early-career professionals, job switchers  
**Goal:** Understand where they stand, improve their application, and prepare for interviews  
**Pain Points:** Don't know what recruiters actually value; generic cover letters don't work; no feedback loop

**Inputs:**
- Resume (PDF)
- Target role (text)

**Outputs:**
- Job fit score
- Skill gap analysis
- Tailored resume suggestions
- Cover letter draft
- Interview preparation guide

---

## 4. Core Agent Architecture

### Philosophy
Each agent has ONE job. No agent does everything. Orchestrator chains them.

```
Orchestrator
    ├── Agent 1: Requirement Analyst
    ├── Agent 2: Hiring Strategist
    ├── Agent 3: Resume Investigator
    ├── Agent 4: Candidate Evaluator
    ├── Agent 5: Devil's Advocate
    └── Agent 6: Hiring Committee
```

---

### Agent 1 — Requirement Analyst
**Input:** Job description (raw text)  
**Output:**
```json
{
  "must_have": ["2+ years Python", "ML model deployment experience"],
  "good_to_have": ["Startup experience", "Open source contributions"],
  "red_flags": ["No AI background", "Gaps > 6 months unexplained"],
  "priorities": ["technical depth over communication"]
}
```

---

### Agent 2 — Hiring Strategist
**Input:** Requirement Analyst output  
**Output:**
```json
{
  "evaluation_framework": {
    "technical_skills": 35,
    "product_thinking": 25,
    "communication": 20,
    "leadership_or_ownership": 20
  },
  "rationale": "Technical skills weighted highest because role requires independent scoping..."
}
```
This agent creates the rubric. Not the user. Not hardcoded logic.

---

### Agent 3 — Resume Investigator
**Input:** Parsed resume text  
**Task:** Extract EVIDENCE, not keywords  
**Output:**
```json
{
  "name": "Raja Sharma",
  "experience_years": 1.5,
  "projects": [
    {
      "name": "AgentShield",
      "description": "AI agent governance platform with runtime protection",
      "evidence": ["FastAPI + PostgreSQL backend", "Firebase auth", "Deployed on Render/Neon"],
      "impact": "Hackathon project, production-ready"
    }
  ],
  "skills_demonstrated": ["Python", "FastAPI", "React", "Agent systems"],
  "quantified_achievements": ["Recruited 50+ recruiters at Pankh Handicrafts"],
  "missing_evidence": ["No formal PM internship", "No team leadership at scale"]
}
```

---

### Agent 4 — Candidate Evaluator
**Input:** Resume Investigator output + Hiring Strategist framework  
**Output:**
```json
{
  "candidate_id": "uuid",
  "overall_score": 84,
  "breakdown": {
    "technical_skills": { "score": 88, "evidence": ["..."], "justification": "..." },
    "product_thinking": { "score": 82, "evidence": ["..."], "justification": "..." },
    "communication": { "score": 78, "evidence": ["..."], "justification": "..." },
    "leadership_or_ownership": { "score": 72, "evidence": ["..."], "justification": "..." }
  },
  "strengths": ["Deep technical execution", "Ship bias visible from projects"],
  "weaknesses": ["No formal PM experience", "Academic-only leadership examples"]
}
```

---

### Agent 5 — Devil's Advocate
**Input:** Agent 4 evaluation report  
**Task:** Attempt to disprove the evaluation. Find over-scoring. Find assumptions.  
**Output:**
```json
{
  "contested_claims": [
    {
      "original_claim": "Strong leadership (score: 72)",
      "counter": "All leadership examples are academic. No evidence of managing professionals or cross-functional teams.",
      "severity": "medium"
    }
  ],
  "risk_factors": ["High technical score may be resume-inflated — no GitHub links provided"],
  "overall_confidence_adjustment": -4,
  "final_recommendation": "Consider with caution on leadership axis"
}
```

---

### Agent 6 — Hiring Committee
**Input:** Evaluator report + Devil's Advocate report  
**Task:** Synthesize, reconcile, decide  
**Output:**
```json
{
  "verdict": "Strong Hire",
  "confidence": 88,
  "ranking": 1,
  "final_explanation": "Candidate demonstrates strong technical depth and evidence of product ownership through AgentShield. Devil's Advocate concerns around leadership are valid but acceptable for an internship role. Recommend interview to assess communication in real-time.",
  "suggested_interview_questions": [
    "Walk me through how you designed the agent orchestration for AgentShield.",
    "Give me an example where you led a decision in a team setting.",
    "How would you prioritize features for a hiring product with 10,000 users?"
  ]
}
```

---

## 5. Candidate-Side Flow

```
Resume + Target Role
       ↓
Resume Parser (Agent 3)
       ↓
Job Search (API or curated dataset)
       ↓
Fit Evaluator (Agent 4, candidate mode)
       ↓
Skill Gap Analyzer
       ↓
Resume Tailoring Agent
       ↓
Cover Letter Generator
       ↓
Interview Prep Generator
       ↓
Application Strategy Report
```

---

## 6. Database Schema

### `candidates`
| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | TEXT | |
| parsed_profile | JSONB | Full Agent 3 output |
| raw_resume_text | TEXT | |
| created_at | TIMESTAMP | |

### `jobs`
| Field | Type | Notes |
|---|---|---|
| id | UUID | |
| title | TEXT | |
| company | TEXT | |
| description | TEXT | |
| requirement_analysis | JSONB | Agent 1 output |
| evaluation_framework | JSONB | Agent 2 output |
| created_at | TIMESTAMP | |

### `evaluations`
| Field | Type | Notes |
|---|---|---|
| id | UUID | |
| candidate_id | UUID | FK → candidates |
| job_id | UUID | FK → jobs |
| score | INTEGER | 0–100 |
| breakdown | JSONB | Per-dimension scores |
| strengths | JSONB | |
| weaknesses | JSONB | |
| evidence | JSONB | |
| devils_advocate | JSONB | Agent 5 output |
| created_at | TIMESTAMP | |

### `decisions`
| Field | Type | Notes |
|---|---|---|
| id | UUID | |
| candidate_id | UUID | FK |
| job_id | UUID | FK |
| verdict | TEXT | Strong Hire / Consider / Reject |
| confidence | INTEGER | 0–100 |
| explanation | TEXT | |
| interview_questions | JSONB | |
| ranking | INTEGER | |
| created_at | TIMESTAMP | |

---

## 7. MVP Success Criteria

### Recruiter Flow
- JD + 5 resumes → full ranked output in < 2 minutes
- Each candidate has: score, verdict, strengths, weaknesses, 3 interview questions
- Devil's Advocate flag visible per candidate

### Candidate Flow
- Resume + role → skill gap + tailored resume suggestions in < 2 minutes

---

## 8. Out of Scope (v1)
- Real-time job scraping (use curated dataset or manual job entry)
- ATS integrations (Greenhouse, Lever)
- Team collaboration / multi-recruiter workflows
- Video / voice interview analysis
- Payments / monetization

---

## 9. Portfolio Deliverables
1. Live deployed app (Vercel + Render)
2. GitHub repo with clean README
3. Architecture diagram
4. Demo video (< 3 min)
5. Case study write-up
6. Metrics: avg pipeline time, accuracy vs manual review (self-reported)
