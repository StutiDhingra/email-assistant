import json
from typing import List, Optional
from app.models.email import Email
import os

class EmailService:
    def __init__(self, mock_file_path: str = "mock_inbox.json"):
        self.mock_file_path = mock_file_path
        self.emails: List[Email] = []
        self.load_emails()

    def load_emails(self):
        if os.path.exists(self.mock_file_path):
            with open(self.mock_file_path, "r") as f:
                data = json.load(f)
                self.emails = [Email(**item) for item in data]
        else:
            print(f"Warning: Mock file {self.mock_file_path} not found.")

    def get_emails(self) -> List[Email]:
        return self.emails

    def get_email(self, email_id: str) -> Optional[Email]:
        for email in self.emails:
            if email.id == email_id:
                return email
        return None

    def update_email(self, email: Email):
        for i, e in enumerate(self.emails):
            if e.id == email.id:
                self.emails[i] = email
                self.save_emails()
                return

    def save_emails(self):
        with open(self.mock_file_path, "w") as f:
            # Convert Pydantic models to dicts
            data = [email.model_dump() for email in self.emails]
            json.dump(data, f, indent=2, default=str)

    def process_email(self, email_id: str, llm_service):
        email = self.get_email(email_id)
        if not email:
            return None
        
        # 1. Categorize
        # Simple prompt for now, can be enhanced with user-defined prompts later
        cat_prompt = "Categorize this email into one of: Work, Personal, Newsletter, Spam, Urgent."
        category = llm_service.categorize_email(email.body, cat_prompt)
        email.category = category

        # 2. Extract Action Items
        action_prompt = "Extract action items with deadlines."
        actions = llm_service.extract_action_items(email.body, action_prompt)
        email.action_items = actions

        self.update_email(email)
        return email

    def process_all_emails(self, llm_service):
        print("Starting process_all_emails...")
        from app.api.prompts import get_prompt_template
        
        # Fetch configured prompts
        cat_template = get_prompt_template("1") # Categorization
        if not cat_template: cat_template = "Categorize this email into one of: Work, Personal, Newsletter, Spam, Urgent."
        print(f"Using Categorization Template: {cat_template}")
        
        action_template = get_prompt_template("2") # Action Extraction
        if not action_template: action_template = "Extract action items with deadlines."
        print(f"Using Action Template: {action_template}")

        processed_count = 0
        for email in self.emails:
            print(f"Processing email {email.id}...")
            # Optional: Skip if already processed? For now, re-process all to ensure updates
            # if email.category: continue 
            
            # 1. Categorize
            try:
                category = llm_service.categorize_email(email.body, cat_template)
                print(f"  Category: {category}")
                email.category = category
            except Exception as e:
                print(f"  Error categorizing email {email.id}: {e}")

            # 2. Extract Action Items
            try:
                actions = llm_service.extract_action_items(email.body, action_template)
                print(f"  Actions: {actions}")
                email.action_items = actions
            except Exception as e:
                print(f"  Error extracting actions for email {email.id}: {e}")
            
            processed_count += 1
        
        self.save_emails()
        print(f"Finished processing {processed_count} emails. Saved to file.")
        return processed_count
