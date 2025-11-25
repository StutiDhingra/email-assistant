from pydantic import BaseModel
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
