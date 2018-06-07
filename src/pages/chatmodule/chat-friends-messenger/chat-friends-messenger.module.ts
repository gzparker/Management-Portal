import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatFriendsMessengerPage } from './chat-friends-messenger';

@NgModule({
  declarations: [
    ChatFriendsMessengerPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatFriendsMessengerPage),
  ],
})
export class ChatFriendsMessengerPageModule {}
