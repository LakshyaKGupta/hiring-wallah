import json
import logging
from app.utils.gemini_client import GeminiClient

logger = logging.getLogger("hiring_wallah.agent.base")

class BaseAgent:
    def __init__(self, gemini_client: GeminiClient):
        self.client = gemini_client

    async def run(self, input_data: dict) -> dict:
        """
        Executes the agent logic by building the prompt, invoking the Gemini model,
        and parsing the response.
        """
        prompt = self.build_prompt(input_data)
        raw = await self.client.generate(prompt)
        return self.parse_output(raw)

    def build_prompt(self, input_data: dict) -> str:
        """
        Builds the system/user prompt for the Gemini model.
        Should be overridden by subclasses.
        """
        raise NotImplementedError("Subclasses must implement build_prompt")

    def parse_output(self, raw: str) -> dict:
        """
        Parses the raw Gemini response string into a structured dictionary.
        Standard implementation assumes the output is a valid JSON string.
        """
        try:
            # Strip markdown code blocks if any (e.g. ```json ... ```)
            cleaned = raw.strip()
            if cleaned.startswith("```"):
                # find the first newline to skip "```json" or similar
                lines = cleaned.splitlines()
                if len(lines) >= 2:
                    # check if the last line is also part of the backticks
                    if lines[-1].strip() == "```":
                        cleaned = "\n".join(lines[1:-1]).strip()
                    else:
                        # try to find the next ```
                        cleaned = "\n".join(lines[1:]).strip()
            
            # Remove inline backticks if they wrap the whole thing
            if cleaned.startswith("`") and cleaned.endswith("`"):
                cleaned = cleaned.strip("`").strip()
                
            return json.loads(cleaned)
        except Exception as e:
            logger.error(f"Failed to parse agent JSON response. Raw output: {raw}. Error: {e}")
            raise e
