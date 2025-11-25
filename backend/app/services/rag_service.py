import chromadb
from chromadb.utils import embedding_functions
import os
from typing import List

class RAGService:
    def __init__(self):
        # Initialize ChromaDB
        self.client = chromadb.PersistentClient(path="./chroma_db")
        # Use a simple embedding function (default is all-MiniLM-L6-v2)
        self.embedding_fn = embedding_functions.DefaultEmbeddingFunction()
        self.collection = self.client.get_or_create_collection(
            name="emails",
            embedding_function=self.embedding_fn
        )

    def ingest_email(self, email_id: str, email_content: str, metadata: dict):
        self.collection.upsert(
            ids=[email_id],
            documents=[email_content],
            metadatas=[metadata]
        )

    def query_emails(self, query: str, n_results: int = 5) -> List[str]:
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results
        )
        if results and results['documents']:
            return results['documents'][0]
        return []
