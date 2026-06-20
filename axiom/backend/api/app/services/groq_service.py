import httpx

from app.core.config import settings


class GroqService:
    async def _complete(self, prompt: str) -> str:
        if not settings.groq_api_key:
            return prompt[:500]
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.groq_api_key}"},
                json={
                    "model": settings.groq_model,
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.2,
                },
            )
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]

    async def incident_to_summary(self, incident: dict) -> str:
        return await self._complete(f"Summarize this software incident for engineers: {incident}")

    async def explain_fingerprint(self, fingerprint: dict) -> str:
        return await self._complete(f"Explain this failure fingerprint clearly: {fingerprint}")

    async def summarize_fix(self, fix: dict) -> str:
        return await self._complete(f"Summarize this fix and when to apply it: {fix}")

    async def generate_root_cause(self, incident: dict) -> str:
        return await self._complete(f"Generate a concise root-cause explanation for: {incident}")
