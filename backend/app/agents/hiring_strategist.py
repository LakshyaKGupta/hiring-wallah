import json
from app.agents.base import BaseAgent

class HiringStrategist(BaseAgent):
    def build_prompt(self, input_data: dict) -> str:
        requirement_analysis = input_data.get("requirements", {})
        if isinstance(requirement_analysis, dict):
            req_str = json.dumps(requirement_analysis, indent=2)
        else:
            req_str = str(requirement_analysis)

        return f"""You are a hiring committee chair designing an evaluation rubric.
Based on these requirements, create a weighted scoring framework.

Requirements:
{req_str}

Return ONLY valid JSON in this exact structure:
{{
  "criteria": [
    {{
      "name": "AI Experience",
      "weight": 40,
      "signals": ["specific evidence that proves the candidate is strong on this criterion"]
    }}
  ],
  "rationale": "detailed explanation of why these weights and dimensions were chosen"
}}

CRITICAL: The sum of all criteria weights must equal exactly 100.
"""
