from fastapi import APIRouter, HTTPException
from typing import List
from app.models.prompt import Prompt

router = APIRouter()

import json
import os

PROMPTS_FILE = "prompts.json"

def load_prompts_from_file():
    if os.path.exists(PROMPTS_FILE):
        with open(PROMPTS_FILE, "r") as f:
            data = json.load(f)
            return [Prompt(**item) for item in data]
    return [
        Prompt(id="1", name="categorization", template="Categorize emails into: Important, Newsletter, Spam, To-Do. To-Do emails must include a direct request requiring user action.", description="Categorizes emails"),
        Prompt(id="2", name="action_extraction", template="Extract tasks from the email. Respond in JSON: { \"task\": \"...\", \"deadline\": \"...\" }.", description="Extracts action items"),
        Prompt(id="3", name="auto_reply", template="If an email is a meeting request, draft a polite reply asking for an agenda.", description="Generates auto-replies")
    ]

def save_prompts_to_file():
    with open(PROMPTS_FILE, "w") as f:
        data = [p.model_dump() for p in prompts]
        json.dump(data, f, indent=2)

prompts = load_prompts_from_file()

def get_prompt_template(prompt_id: str) -> str:
    for p in prompts:
        if p.id == prompt_id:
            return p.template
    return ""

@router.get("/", response_model=List[Prompt])
def get_prompts():
    return prompts

@router.post("/", response_model=Prompt)
def create_prompt(prompt: Prompt):
    prompts.append(prompt)
    save_prompts_to_file()
    return prompt

@router.put("/{prompt_id}", response_model=Prompt)
def update_prompt(prompt_id: str, prompt: Prompt):
    for i, p in enumerate(prompts):
        if p.id == prompt_id:
            prompts[i] = prompt
            save_prompts_to_file()
            return prompt
    raise HTTPException(status_code=404, detail="Prompt not found")
