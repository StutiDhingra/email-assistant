from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.llm_service import LLMService
from app.services.rag_service import RAGService
from app.services.email_service import EmailService

router = APIRouter()
llm_service = LLMService()
rag_service = RAGService()
email_service = EmailService()

from typing import Optional

class ChatRequest(BaseModel):
    query: str
    email_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str

@router.post("/", response_model=ChatResponse)
def chat_agent(request: ChatRequest):
    context = ""
    
    # 1. Determine context
    if request.email_id:
        email = email_service.get_email(request.email_id)
        if not email:
            raise HTTPException(status_code=404, detail="Email not found")
        context = f"Sender: {email.sender}\nSubject: {email.subject}\nBody: {email.body}\nTimestamp: {email.timestamp}"
    else:
        # Retrieve relevant emails via RAG
        relevant_docs = rag_service.query_emails(request.query)
        context = "\n\n".join(relevant_docs)
    
    # 2. Construct prompt for LLM
    prompt_template = """
    You are an intelligent Email Productivity Agent. Answer the user's query based on the following email context.
    
    Context:
    {context}
    
    User Query: {query}
    
    Answer:
    """
    
    # 3. Call LLM
    if not llm_service.llm:
         return ChatResponse(response="LLM not initialized. Please check API Key.")

    from langchain_core.prompts import PromptTemplate
    from langchain_core.output_parsers import StrOutputParser

    prompt = PromptTemplate(
        template=prompt_template,
        input_variables=["context", "query"]
    )
    chain = prompt | llm_service.llm | StrOutputParser()
    
    try:
        response = chain.invoke({"context": context, "query": request.query})
        return ChatResponse(response=response)
    except Exception as e:
        return ChatResponse(response=f"Error processing request: {str(e)}")

@router.post("/ingest")
def ingest_emails():
    emails = email_service.get_emails()
    for email in emails:
        content = f"Sender: {email.sender}\nSubject: {email.subject}\nBody: {email.body}\nTimestamp: {email.timestamp}"
        rag_service.ingest_email(
            email_id=email.id,
            email_content=content,
            metadata={"sender": email.sender, "subject": email.subject}
        )
    return {"message": f"Ingested {len(emails)} emails into RAG system."}
