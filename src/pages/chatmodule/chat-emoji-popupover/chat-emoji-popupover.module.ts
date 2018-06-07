import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatEmojiPopupoverPage } from './chat-emoji-popupover';

@NgModule({
  declarations: [
    ChatEmojiPopupoverPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatEmojiPopupoverPage),
  ],
})
export class ChatEmojiPopupoverPageModule {}
