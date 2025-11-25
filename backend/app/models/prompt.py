from pydantic import BaseModel

class Prompt(BaseModel):
    id: str
    name: str # e.g., "categorization", "action_extraction"
    template: str
    description: str
