import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_model: str = os.getenv("OPENAI_MODEL", "gpt-4o")
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    groq_model: str = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
    groq_base_url: str = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
    hrms_api_base_url: str = os.getenv("HRMS_API_BASE_URL", "http://localhost:7000")
    ai_service_port: str = os.getenv("AI_SERVICE_PORT", "8002")
    audit_log_file: str = os.getenv("AUDIT_LOG_FILE", "audit.log")

settings = Settings()