import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Email Productivity Agent"
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY")

settings = Settings()
