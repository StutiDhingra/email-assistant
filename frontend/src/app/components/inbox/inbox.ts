import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, Email } from '../../services/api.service';
import { ComposeModalComponent } from '../compose-modal/compose-modal';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, RouterLink, ComposeModalComponent],
  templateUrl: './inbox.html',
  styleUrl: './inbox.css'
})
// Force re-compile
export class InboxComponent implements OnInit {
  emails: Email[] = [];
  loading = true;
  error: string | null = null;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadEmails();
  }

  loadEmails() {
    this.loading = true;
    this.cdr.detectChanges();

    this.apiService.getEmails().subscribe({
      next: (data) => {
        console.log('Emails loaded:', data.length);
        this.emails = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading emails', err);
        this.error = `Failed to load emails: ${err.message || JSON.stringify(err)}`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  processAll() {
    this.loading = true;
    this.cdr.detectChanges();

    this.apiService.runPipeline().subscribe({
      next: (res) => {
        console.log(res.message);
        // Reload emails to show updates
        this.loadEmails();
      },
      error: (err) => {
        console.error('Pipeline error', err);
        this.error = "Pipeline failed to run.";
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Compose State
  isComposeOpen = false;
  isDrafting = false;
  draftRecipient = '';
  draftSubject = '';
  draftBody = '';

  openCompose() {
    this.isComposeOpen = true;
    this.draftRecipient = '';
    this.draftSubject = '';
    this.draftBody = '';
  }

  closeCompose() {
    this.isComposeOpen = false;
  }

  handleAiGenerate(instructions: string) {
    this.isDrafting = true;
    this.cdr.detectChanges();

    this.apiService.generateNewDraft(instructions).subscribe({
      next: (res) => {
        this.draftBody = res.draft;
        this.isDrafting = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isDrafting = false;
        this.cdr.detectChanges();
      }
    });
  }

  sendEmail(content: string) {
    alert(`Email sent! (Simulated)\n\nTo: ${this.draftRecipient}\nSubject: ${this.draftSubject}\nContent:\n${content}`);
    this.closeCompose();
  }
}
