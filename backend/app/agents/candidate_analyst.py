import json
from app.agents.base import BaseAgent

class CandidateAnalyst(BaseAgent):
    def build_prompt(self, input_data: dict) -> str:
        parsed_profile = input_data.get("profile", {})
        target_role = input_data.get("target_role", "")

        if isinstance(parsed_profile, dict):
            profile_str = json.dumps(parsed_profile, indent=2)
        else:
            profile_str = str(parsed_profile)

        return f"""You are an expert career coach and talent acquisition advisor.
Your job is to analyze the candidate's parsed resume profile against their target role, and provide actionable feedback, a cover letter, and interview prep guides.

Candidate Resume Profile:
{profile_str}

Target Role:
{target_role}

Return ONLY valid JSON in this exact structure:
{{
  "fit_score": 85,
  "skill_gaps": {{
    "Skill Name": "Description of the gap and how to bridge it"
  }},
  "tailored_resume_suggestions": {{
    "Original Bullet Point from Resume": "Improved Bullet Point with high-impact action verbs and quantified achievements"
  }},
  "cover_letter": "A professional, compelling cover letter tailored to the target role and highlighting the candidate's achievements.",
  "interview_prep": {{
    "Suggested Interview Question": "Recommended answer structure (e.g. STAR method details specific to the candidate's experience)"
  }},
  "job_recommendations": {{
    "roles": ["List of alternative roles matching their skillset"],
    "industries": ["List of target industries"]
  }}
}}

CRITICAL INSTRUCTIONS:
1. "fit_score" must be an integer between 0 and 100. Be realistic but encouraging.
2. In "tailored_resume_suggestions", find 3-4 bullet points from their projects or experience and show how to make them stronger.
3. In "interview_prep", provide 3-4 highly relevant questions for the target role.
"""
