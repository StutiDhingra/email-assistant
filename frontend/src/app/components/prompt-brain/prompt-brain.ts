import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Prompt } from '../../services/api.service';

@Component({
  selector: 'app-prompt-brain',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prompt-brain.html',
  styleUrl: './prompt-brain.css'
})
export class PromptBrainComponent implements OnInit {
  prompts: Prompt[] = [];
  loading = true;
  saving: { [key: string]: boolean } = {};
  saved: { [key: string]: boolean } = {};

  // Create Modal
  isCreateOpen = false;
  newPrompt: Prompt = { id: '', name: '', description: '', template: '' };
  creating = false;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadPrompts();
  }

  loadPrompts() {
    this.loading = true;
    this.apiService.getPrompts().subscribe({
      next: (data) => {
        this.prompts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading prompts', err);
        this.loading = false;
      }
    });
  }

  savePrompt(prompt: Prompt) {
    this.saving[prompt.id] = true;
    this.saved[prompt.id] = false;
    this.cdr.detectChanges();
    this.apiService.updatePrompt(prompt.id, prompt).subscribe({
      next: () => {
        this.saving[prompt.id] = false;
        this.saved[prompt.id] = true;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.saved[prompt.id] = false;
          this.cdr.detectChanges();
        }, 2000);
      },
      error: (err) => {
        console.error('Error saving prompt', err);
        this.saving[prompt.id] = false;
        this.cdr.detectChanges();
      }
    });
  }

  openCreate() {
    this.newPrompt = { id: '', name: '', description: '', template: '' };
    this.isCreateOpen = true;
  }

  closeCreate() {
    this.isCreateOpen = false;
  }

  createPrompt() {
    if (!this.newPrompt.id || !this.newPrompt.name) return;

    this.creating = true;
    this.cdr.detectChanges();

    this.apiService.createPrompt(this.newPrompt).subscribe({
      next: (res) => {
        this.prompts.push(res);
        this.creating = false;
        this.isCreateOpen = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error creating prompt', err);
        this.creating = false;
        this.cdr.detectChanges();
      }
    });
  }
}
