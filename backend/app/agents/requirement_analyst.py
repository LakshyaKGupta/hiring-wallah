from app.agents.base import BaseAgent

class RequirementAnalyst(BaseAgent):
    def build_prompt(self, input_data: dict) -> str:
        job_description = input_data.get("jd", "")
        return f"""You are a senior talent acquisition specialist.
Analyze the following job description and extract structured hiring requirements.

Job Description:
{job_description}

Return ONLY valid JSON in this exact structure:
{{
  "must_have": ["list of non-negotiable requirements (e.g. specific skills, years of experience)"],
  "good_to_have": ["list of preferred but not strictly required skills/experience"],
  "red_flags": ["signals or missing items that would disqualify a candidate"],
  "priorities": ["what matters most for this role, listed in order of priority"],
  "role_level": "intern/junior/mid/senior",
  "domain": "engineering/product/design/etc"
}}
"""
