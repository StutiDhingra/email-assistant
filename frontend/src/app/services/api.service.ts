import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Email {
    id: string;
    sender: string;
    subject: string;
    body: string;
    timestamp: string;
    read: boolean;
    category?: string;
    action_items?: any[];
}

export interface Prompt {
    id: string;
    name: string;
    template: string;
    description: string;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = 'https://email-assistant-production-7818.up.railway.app/api';

    constructor(private http: HttpClient) { }

    getEmails(): Observable<Email[]> {
        return this.http.get<Email[]>(`${this.apiUrl}/emails/`);
    }

    getEmail(id: string): Observable<Email> {
        return this.http.get<Email>(`${this.apiUrl}/emails/${id}`);
    }

    getPrompts(): Observable<Prompt[]> {
        return this.http.get<Prompt[]>(`${this.apiUrl}/prompts/`);
    }

    updatePrompt(id: string, prompt: Prompt): Observable<Prompt> {
        return this.http.put<Prompt>(`${this.apiUrl}/prompts/${id}`, prompt);
    }

    createPrompt(prompt: Prompt): Observable<Prompt> {
        return this.http.post<Prompt>(`${this.apiUrl}/prompts/`, prompt);
    }

    chat(query: string, email_id?: string): Observable<{ response: string }> {
        return this.http.post<{ response: string }>(`${this.apiUrl}/chat/`, { query, email_id });
    }

    processEmail(id: string): Observable<Email> {
        return this.http.post<Email>(`${this.apiUrl}/emails/${id}/process`, {});
    }

    generateDraft(id: string, instructions: string): Observable<{ draft: string }> {
        return this.http.post<{ draft: string }>(`${this.apiUrl}/emails/${id}/draft`, null, {
            params: { instructions }
        });
    }

    generateNewDraft(instructions: string): Observable<{ draft: string }> {
        return this.http.post<{ draft: string }>(`${this.apiUrl}/emails/generate-draft`, null, {
            params: { instructions }
        });
    }

    runPipeline(): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${this.apiUrl}/emails/pipeline`, {});
    }
}
