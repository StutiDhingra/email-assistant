from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime

class Email(BaseModel):
    id: str
    sender: str
    subject: str
    body: str
    timestamp: datetime
    read: bool = False
    category: Optional[str] = None
    action_items: Optional[List[dict]] = None

    @field_validator('action_items', mode='before')
    @classmethod
    def parse_action_items(cls, v):
        # Handle case where LLM or user saves action_items as a nested dict
        if isinstance(v, dict) and 'action_items' in v:
            return v['action_items']
        return v
