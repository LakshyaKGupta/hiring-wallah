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
  "name": "Candidate Name (if available, otherwise set empty string)",
  "experience_years": 0.0,
  "projects": [
    {{
      "name": "Project name",
      "description": "Short description of what the project does",
      "evidence": ["list of explicit actions, implementations, or architectures verified from text"],
      "impact": "any stated metrics or business output of this project",
      "technologies": ["languages, frameworks, tools explicitly mentioned for this project"]
    }}
  ],
  "skills_demonstrated": ["languages, frameworks, concepts explicitly demonstrated through experience/projects"],
  "quantified_achievements": ["explicit metrics, growth, savings, or numbers achieved"],
  "education": ["degrees, universities, graduation years explicitly mentioned"],
  "missing_evidence": ["what critical details or evidence are conspicuously missing in this resume (e.g. scale, duration, github links, specific roles)"],
  "career_trajectory": "short summary describing candidate's career growth, transition, or consistency"
}}
"""
