import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout';
import { InboxComponent } from './components/inbox/inbox';
import { EmailDetailComponent } from './components/email-detail/email-detail';
import { PromptBrainComponent } from './components/prompt-brain/prompt-brain';
import { AgentChatComponent } from './components/agent-chat/agent-chat';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'inbox', pathMatch: 'full' },
            { path: 'inbox', component: InboxComponent },
            { path: 'email/:id', component: EmailDetailComponent },
            { path: 'brain', component: PromptBrainComponent },
            { path: 'chat', component: AgentChatComponent }
        ]
    }
];
