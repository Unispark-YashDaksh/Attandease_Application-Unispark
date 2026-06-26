from __future__ import annotations

from typing import Any
import httpx
from app.config import settings


async def summarize_employee_answer(
    user_message: str,
    safe_employee_data: dict[str, Any],
) -> str:
    if not settings.groq_api_key:
        return "I'm sorry, the AI assistant is not fully configured yet. Please Contact IT Team."

    system_prompt = (
        "Yor are an HRMS assistant. Explain only the provided HRMS data. "
        "Do not invent policy, salary, leagal, or private information. "
        "If the data shows an error tell the user politely that the information is currently unavailable."
    )

    payload = {
        "model": settings.groq_model,
        "messages": [
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": f"Question: {user_message}\nSafe HRMS data: {safe_employee_data}",
            },
        ],
        "temperature": 0.2,
        "max_tokens": 512,
    }

    headers = {"Authorization": f"Bearer {settings.groq_api_key}"}
    url = f"{settings.groq_base_url}/chat/completions"

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
    except httpx.HTTPStatusError as e:
        return(
            f"Here is the data from HRMS, but I couldn't format it nicely "
            f"(AI service returned {e.response.status_code}):\n{safe_employee_data}"
        )
    except httpx.TimeoutException:
        return (
            f"Here is the data from Hrms (AI formatting timed out):\n"
            f"{safe_employee_data}"
        )
    except httpx.HTTPError:
        return (
            f"Here is the raw data from HRMS:\n{safe_employee_data}"
        )