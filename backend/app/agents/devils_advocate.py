import json
from app.agents.base import BaseAgent

class DevilsAdvocate(BaseAgent):
    def build_prompt(self, input_data: dict) -> str:
        evaluation = input_data.get("evaluation", {})
        if isinstance(evaluation, dict):
            eval_str = json.dumps(evaluation, indent=2)
        else:
            eval_str = str(evaluation)

        return f"""You are an adversarial evaluator. Your job is to find weaknesses in the following candidate evaluation.
Try to prove the evaluation is too generous or has made assumptions. Look for:
- Claims without explicit concrete evidence in the resume profile.
- Over-scoring based on candidate buzzwords rather than hard metrics/actions.
- Potential resume inflation.
- Critical gaps in skill or experience that the evaluator ignored or downplayed.

Evaluation Report:
{eval_str}

Return ONLY valid JSON in this exact structure:
{{
  "concerns": [
    {{
      "claim": "The specific claim made in the evaluation",
      "concern": "Adversarial counter-argument detailing why this claim is weak or lacks evidence",
      "severity": "low/medium/high"
    }}
  ],
  "unsupported_claims": ["claims that are not sufficiently supported by resume evidence"],
  "risk_factors": ["critical items or red flags that remain unverified or represent hiring risks"],
  "potential_bias": ["ways the evaluation may be overvaluing prestige, keywords, confidence, or writing style"],
  "overall_confidence_adjustment": -5,
  "recommendation": "approve/flag/reject_evaluation"
}}

CRITICAL INSTRUCTIONS:
1. Be critical. It is your job to find fault.
2. The "overall_confidence_adjustment" should be a negative integer (e.g. -5, -10) representing how much we should decrease our confidence in the evaluator's score. If the evaluation is near-flawless, it can be 0.
"""
