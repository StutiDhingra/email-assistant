import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService, Email } from '../../services/api.service';
import { ComposeModalComponent } from '../compose-modal/compose-modal';

@Component({
  selector: 'app-email-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ComposeModalComponent],
  templateUrl: './email-detail.html',
  styleUrl: './email-detail.css'
})
export class EmailDetailComponent implements OnInit {
  email: Email | null = null;
  loading = true;

  // Modal state
  isComposeOpen = false;
  isDrafting = false;
  draftRecipient = '';
  draftSubject = '';
  draftBody = '';

  // Agent state
  agentResponse = '';
  isAgentLoading = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadEmail(id);
      }
    });
  }

  loadEmail(id: string) {
    console.log('Loading email with ID:', id);
    this.loading = true;
    this.cdr.detectChanges();

    this.apiService.getEmail(id).subscribe({
      next: (data) => {
        console.log('Email loaded successfully:', data);
        this.email = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading email:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openReply() {
    if (!this.email) return;

    this.isComposeOpen = true;
    this.isDrafting = true;
    this.draftRecipient = this.email.sender;
    this.draftSubject = `Re: ${this.email.subject}`;
    this.cdr.detectChanges();

    this.apiService.generateDraft(this.email.id, "Draft a polite and professional reply.").subscribe({
      next: (res) => {
        this.draftBody = res.draft;
        this.isDrafting = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error generating draft', err);
        this.draftBody = "Error generating draft. Please try again.";
        this.isDrafting = false;
        this.cdr.detectChanges();
      }
    });
  }

  closeCompose() {
    this.isComposeOpen = false;
    this.draftBody = '';
  }

  sendReply(content: string) {
    alert(`Reply sent! (Simulated)\n\nContent:\n${content}`);
    this.closeCompose();
  }

  askAgent(query: string) {
    if (!this.email) return;
    this.isAgentLoading = true;
    this.agentResponse = '';
    this.cdr.detectChanges();

    this.apiService.chat(query, this.email.id).subscribe({
      next: (res) => {
        this.agentResponse = res.response;
        this.isAgentLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Agent error', err);
        this.agentResponse = "Error communicating with Agent.";
        this.isAgentLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
