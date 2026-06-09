import json
from app.agents.base import BaseAgent

class CandidateEvaluator(BaseAgent):
    def build_prompt(self, input_data: dict) -> str:
        candidate_profile = input_data.get("profile", {})
        evaluation_framework = input_data.get("framework", {})

        if isinstance(candidate_profile, dict):
            profile_str = json.dumps(candidate_profile, indent=2)
        else:
            profile_str = str(candidate_profile)

        if isinstance(evaluation_framework, dict):
            framework_str = json.dumps(evaluation_framework, indent=2)
        else:
            framework_str = str(evaluation_framework)

        return f"""You are a structured hiring evaluator.
Your task is to evaluate the candidate profile against the provided evaluation framework.
Base your scores ONLY on the concrete evidence listed in the candidate profile. Do not extrapolate.

Candidate Profile:
{profile_str}

Evaluation Framework:
{framework_str}

Return ONLY valid JSON in this exact structure:
{{
  "overall_score": 0,
  "breakdown": {{
    "dimension_name": {{
      "score": 0,
      "evidence": ["explicit bullet points of evidence from candidate profile"],
      "justification": "why this score was given based on the evidence"
    }}
  }},
  "strengths": ["key evidence-backed candidate strengths"],
  "weaknesses": ["areas where candidate lacks evidence or falls short of rubric"],
  "evidence_quality": "strong/moderate/weak"
}}

CRITICAL INSTRUCTIONS:
1. Score range for each dimension and overall_score is 0-100.
2. Be extremely strict. A score above 80 requires strong, direct, explicit evidence of high-impact achievement or expertise.
3. Every dimension listed in the "evaluation_framework" MUST be evaluated as a key in the "breakdown" dictionary.
4. Calculate the overall_score as the weighted sum of the dimension scores (i.e. Sum of (dimension_score * dimension_weight) / 100).
"""
