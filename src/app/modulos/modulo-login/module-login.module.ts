import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { LoginRoutingModule } from './modulo-login-routing.module';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';

@NgModule({
    declarations: [LoginComponent],
    imports: [ CommonModule, LoginRoutingModule, ReactiveFormsModule, MessageModule, MessagesModule, DialogModule, ProgressBarModule ],
    exports: [],
    providers: [MessageService],
})
export class LoginModule {}