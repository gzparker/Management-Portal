import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatAccountPage } from './chat-account';

@NgModule({
  declarations: [
    ChatAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatAccountPage),
  ],
})
export class ChatAccountPageModule {}
