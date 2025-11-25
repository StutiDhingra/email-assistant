from fastapi import APIRouter, HTTPException
from typing import List
from app.models.email import Email
from app.services.email_service import EmailService

router = APIRouter()
email_service = EmailService()

@router.get("/", response_model=List[Email])
def get_emails():
    return email_service.get_emails()

@router.get("/{email_id}", response_model=Email)
def get_email(email_id: str):
    email = email_service.get_email(email_id)
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    return email

@router.post("/{email_id}/process", response_model=Email)
def process_email(email_id: str):
    from app.services.llm_service import LLMService
    llm_service = LLMService()
    email = email_service.process_email(email_id, llm_service)
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    return email

@router.post("/{email_id}/draft")
def generate_draft(email_id: str, instructions: str = "Draft a polite reply"):
    from app.services.llm_service import LLMService
    llm_service = LLMService()
    email = email_service.get_email(email_id)
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    
    from app.api.prompts import get_prompt_template
    
    # ID 3 is Auto-Reply
    prompt_template = get_prompt_template("3")
    if not prompt_template:
        prompt_template = "You are a helpful email assistant. Draft a polite reply."

    draft_content = llm_service.generate_draft(
        email_content=f"Subject: {email.subject}\nBody: {email.body}",
        instructions=instructions,
        prompt_template=prompt_template
    )
    return {"draft": draft_content}

    return {"draft": draft_content}

@router.post("/generate-draft")
def generate_new_draft(instructions: str = "Draft a new email"):
    from app.services.llm_service import LLMService
    llm_service = LLMService()
    
    # Use a generic prompt or the auto-reply one (ID 3) as a base, 
    # but for new emails we might want a specific "New Email" prompt.
    # For now, let's use a simple default or fetch ID 3 if appropriate.
    # Actually, let's just use a helpful assistant prompt for new drafts.
    
    draft_content = llm_service.generate_draft(
        email_content="New Email Draft", # No context
        instructions=instructions,
        prompt_template="You are a helpful email assistant. Draft a professional email based on the instructions."
    )
    return {"draft": draft_content}

@router.post("/pipeline")
def run_pipeline():
    from app.services.llm_service import LLMService
    llm_service = LLMService()
    count = email_service.process_all_emails(llm_service)
    return {"message": f"Pipeline processed {count} emails successfully."}
