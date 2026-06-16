from app.agents.base import BaseAgent

class ResumeInvestigator(BaseAgent):
    def build_prompt(self, input_data: dict) -> str:
        resume_text = input_data.get("resume", "")
        return f"""You are a forensic resume analyst. Extract EVIDENCE, not keywords.
Do NOT infer or extrapolate. Only extract what is explicitly stated or directly demonstrated in the resume text.

Resume Text:
{resume_text}

Return ONLY valid JSON in this exact structure:
{{
  "candidate_name": "Candidate Name (if available, otherwise set empty string)",
  "skills": ["skills explicitly demonstrated by project or work evidence, not keyword stuffing"],
  "experience": ["work experience entries or roles explicitly stated in the resume"],
  "projects": ["project outcomes explicitly stated in the resume"],
  "achievements": ["quantified achievements, metrics, awards, shipped outcomes, or business results"],
  "evidence": [
    {{
      "claim": "short hiring-relevant claim",
      "evidence": "exact supporting fact from the resume, preferably action + outcome",
      "resume_section": "Experience/Projects/Education/Achievements/Skills/Unknown",
      "evidence_type": "achievement|project|experience|leadership|impact|technical",
      "quality": "strong|moderate|weak"
    }}
  ],
  "missing_evidence": ["critical details missing from the resume, such as scale, ownership, duration, metrics, team size, links, or stakeholder proof"]
}}

Evidence examples are "Built AI hiring platform", "Onboarded 50 recruiters", "Reduced screening time 6x".
Do not return generic evidence like "Python", "Leadership", or "Communication" unless tied to a concrete action or outcome.
"""
