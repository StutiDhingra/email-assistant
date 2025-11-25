import { Component, ElementRef, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface Message {
  role: 'user' | 'agent';
  content: string;
}

@Component({
  selector: 'app-agent-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agent-chat.html',
  styleUrl: './agent-chat.css'
})
export class AgentChatComponent implements AfterViewChecked {
  messages: Message[] = [
    { role: 'agent', content: 'Hello! I am your Email Productivity Agent. How can I help you today?' }
  ];
  newMessage = '';
  loading = false;

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) { }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const userMsg = this.newMessage;
    this.messages.push({ role: 'user', content: userMsg });
    this.newMessage = '';
    this.loading = true;
    this.cdr.detectChanges(); // Force update for user message

    this.apiService.chat(userMsg).subscribe({
      next: (res) => {
        console.log('Chat response received:', res);
        this.messages.push({ role: 'agent', content: res.response });
        this.loading = false;
        this.cdr.detectChanges(); // Force update for agent response
      },
      error: (err) => {
        console.error('Error sending message', err);
        const fullError = JSON.stringify(err, null, 2);
        this.messages.push({ role: 'agent', content: `Error: ${fullError}` });
        this.loading = false;
        this.cdr.detectChanges(); // Force update for error
      }
    });
  }
}
