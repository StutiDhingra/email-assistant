import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-compose-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './compose-modal.html'
})
// Force re-compile
export class ComposeModalComponent {
    @Input() isOpen = false;
    @Input() loading = false;
    @Input() isAiLoading = false;
    @Input() recipient = '';
    @Input() subject = '';
    @Input() body = '';

    @Output() closeEvent = new EventEmitter<void>();
    @Output() sendEvent = new EventEmitter<string>();
    @Output() aiGenerateEvent = new EventEmitter<string>();

    aiInstructions = '';
    // isGenerating removed, use isAiLoading input

    close() {
        this.closeEvent.emit();
    }

    send() {
        this.sendEvent.emit(this.body);
    }

    generate() {
        if (!this.aiInstructions) return;
        this.aiGenerateEvent.emit(this.aiInstructions);
    }
}
