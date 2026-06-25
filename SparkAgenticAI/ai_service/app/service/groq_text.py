from typing import Any
import httpx
from app.config import settings


async def summarize_employee_answer(
    user_message: str,
    safe_employee_data: dict[str, Any],
) -> str:
    if not settings.groq_api_key:
        raise RuntimeError("GROQ_API_KEY is not configured")

    payload = {
        "model": settings.groq_model,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are an HRMS assistant. Explain only the provided HRMS data. "
                    "Do not invent policy, salary, legal, or private information."
                ),
            },
            {
                "role": "user",
                "content": f"Question: {user_message}\nSafe HRMS data: {safe_employee_data}",
            },
        ],
        "temperature": 0.2,
    }

    headers = {"Authorization": f"Bearer {settings.groq_api_key}"}
    url = f"{settings.groq_base_url}/chat/completions"

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]