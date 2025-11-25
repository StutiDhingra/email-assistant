# Email Productivity Agent

A prompt-driven Email Productivity Agent built with **Angular**, **FastAPI**, and **LangChain**.

## Features
- **Smart Inbox**: Auto-categorization of emails.
- **Action Extraction**: Automatically identifies tasks and deadlines.
- **Prompt Brain**: Customizable prompts that drive the agent's behavior.
- **Agent Chat**: RAG-powered chat interface to query your inbox.
- **Draft Generation**: Auto-draft replies based on context.

## Setup Instructions

### Backend
1. Navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Create virtual environment and install dependencies:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. Ensure `.env` has your `GROQ_API_KEY`.
4. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```
5. Ingest mock data (optional, done automatically on first chat use or via endpoint):
   ```bash
   curl -X POST http://localhost:8000/api/chat/ingest
   ```

### Frontend
1. Navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npx ng serve
   ```
4. Open `http://localhost:4200` in your browser.

## Project Structure
- `backend/app`: FastAPI application code.
- `backend/mock_inbox.json`: Sample email data.
- `frontend/src/app`: Angular application code.
