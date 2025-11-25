from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Email Productivity Agent")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api import emails, prompts, chat

app.include_router(emails.router, prefix="/api/emails", tags=["emails"])
app.include_router(prompts.router, prefix="/api/prompts", tags=["prompts"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])

@app.get("/")
def read_root():
    return {"message": "Email Productivity Agent API is running"}
