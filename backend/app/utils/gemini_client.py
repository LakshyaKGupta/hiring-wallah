import os
import asyncio
import json
import logging
import google.generativeai as genai
from app.config import settings

logger = logging.getLogger("hiring_wallah.gemini")
logging.basicConfig(level=logging.INFO)

class GeminiClient:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        if not self.api_key:
            logger.warning("GEMINI_API_KEY is not configured in settings. Checking environment variables...")
            self.api_key = os.environ.get("GEMINI_API_KEY", "")
        
        if self.api_key:
            genai.configure(api_key=self.api_key)
        else:
            logger.error("No Gemini API key found. API calls will fail.")
            
        self.model = genai.GenerativeModel("gemini-2.5-flash")

    async def generate(self, prompt: str, retry_count: int = 1) -> str:
        """
        Generates content from the Gemini model asynchronously.
        Enforces JSON response and retries once on JSON parsing errors.
        """
        if not self.api_key:
            raise ValueError("Gemini API key is not configured. Please set GEMINI_API_KEY.")

        generation_config = genai.GenerationConfig(
            response_mime_type="application/json"
        )

        def _call_sdk(p):
            return self.model.generate_content(
                p,
                generation_config=generation_config
            )

        try:
            logger.info("Calling Gemini 2.5 Flash API...")
            response = await asyncio.to_thread(_call_sdk, prompt)
            text = response.text.strip()
            
            # Simple check to make sure it's valid JSON
            json.loads(text)
            return text
        except (json.JSONDecodeError, Exception) as e:
            if retry_count > 0:
                logger.warning(f"Gemini call or JSON parsing failed: {e}. Retrying once with a stricter JSON prompt...")
                stricter_prompt = (
                    f"{prompt}\n\n"
                    "CRITICAL REQUIREMENT: Your response must be 100% valid, parsable JSON matching the requested structure. "
                    "Do not include any extra text, commentary, or markdown formatting (do not wrap in ```json)."
                )
                return await self.generate(stricter_prompt, retry_count=0)
            else:
                logger.error(f"Gemini generation failed after retry: {e}")
                # Return a basic valid JSON structure if we completely fail, or raise the error
                raise e
