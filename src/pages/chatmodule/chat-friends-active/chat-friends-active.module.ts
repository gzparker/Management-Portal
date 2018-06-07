import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatFriendsActivePage } from './chat-friends-active';

@NgModule({
  declarations: [
    ChatFriendsActivePage,
  ],
  imports: [
    IonicPageModule.forChild(ChatFriendsActivePage),
  ],
})
export class ChatFriendsActivePageModule {}
