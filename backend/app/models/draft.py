from pydantic import BaseModel
from typing import Optional

class Draft(BaseModel):
    id: Optional[str] = None
    email_id: Optional[str] = None # ID of the email being replied to
    recipient: str
    subject: str
    body: str
    saved_at: Optional[str] = None
