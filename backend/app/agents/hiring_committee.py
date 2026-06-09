import json
from app.agents.base import BaseAgent

class HiringCommittee(BaseAgent):
    def build_prompt(self, input_data: dict) -> str:
        evaluation = input_data.get("evaluation", {})
        critique = input_data.get("critique", {})

        if isinstance(evaluation, dict):
            eval_str = json.dumps(evaluation, indent=2)
        else:
            eval_str = str(evaluation)

        if isinstance(critique, dict):
            critique_str = json.dumps(critique, indent=2)
        else:
            critique_str = str(critique)

        return f"""You are the chair of a hiring committee.
You have been presented with:
1. A structured candidate evaluation report.
2. An adversarial critique of that evaluation (from the Devil's Advocate agent).

Your job is to synthesize these inputs, reconcile the differences, and make a final, balanced hiring decision.

Structured Evaluation:
{eval_str}

Adversarial Critique:
{critique_str}

Return ONLY valid JSON in this exact structure:
{{
  "verdict": "Strong Hire", 
  "confidence": 0,
  "final_explanation": "A balanced, professional reconciliation explanation summarizing candidate fit, addressable critique claims, and final rationale.",
  "key_deciding_factors": ["critical points or evidence that determined the verdict"],
  "suggested_interview_questions": ["questions designed to test the contested claims or risk factors in an interview"],
  "risk_summary": "Summary of unresolved risks, gaps, or flags"
}}

CRITICAL INSTRUCTIONS:
1. "verdict" MUST be exactly one of: "Strong Hire", "Consider", or "Reject".
2. "confidence" must be an integer between 0 and 100 representing your degree of certainty in this verdict. Apply the confidence adjustment from the adversarial critique (e.g. if original score was 84 and critique adjustment is -5, adjust confidence accordingly).
"""
