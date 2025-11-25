from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser, StrOutputParser
import os
from dotenv import load_dotenv
import json

load_dotenv()

class LLMService:
    def __init__(self):
        # Initialize LLM (Groq)
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            print("Warning: GROQ_API_KEY not found in environment variables.")
            self.llm = None
        else:
            self.llm = ChatGroq(temperature=0, model_name="llama-3.3-70b-versatile", api_key=api_key)

    def categorize_email(self, email_content: str, prompt_template: str):
        if not self.llm:
            return "Uncategorized (Missing API Key)"
        
        prompt = PromptTemplate(
            template=prompt_template + "\n\nEmail Content:\n{email_content}\n\nCategory:",
            input_variables=["email_content"]
        )
        chain = prompt | self.llm | StrOutputParser()
        try:
            result = chain.invoke({"email_content": email_content}).strip()
            # Clean up result
            if result.lower().startswith("category:"):
                result = result[9:].strip()
            # Remove reasoning if present (simple heuristic: take first line or split by newline)
            if "\n" in result:
                result = result.split("\n")[0].strip()
            return result
        except Exception as e:
            print(f"Error categorizing email: {e}")
            return "Error"

    def extract_action_items(self, email_content: str, prompt_template: str):
        if not self.llm:
            return []
            
        prompt = PromptTemplate(
            template=prompt_template + "\n\nEmail Content:\n{email_content}\n\nJSON Output:",
            input_variables=["email_content"]
        )
        chain = prompt | self.llm | JsonOutputParser()
        try:
            return chain.invoke({"email_content": email_content})
        except Exception as e:
            print(f"Error extracting action items: {e}")
            return []

    def generate_draft(self, email_content: str, instructions: str, prompt_template: str):
        if not self.llm:
            return "Draft generation unavailable (Missing API Key)"
            
        prompt = PromptTemplate(
            template=prompt_template + "\n\nInstructions: {instructions}\n\nEmail Context:\n{email_content}\n\nDraft:",
            input_variables=["instructions", "email_content"]
        )
        chain = prompt | self.llm | StrOutputParser()
        try:
            return chain.invoke({"instructions": instructions, "email_content": email_content}).strip()
        except Exception as e:
            print(f"Error generating draft: {e}")
            return "Error generating draft."
