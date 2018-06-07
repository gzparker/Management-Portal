import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatFriendsPage } from './chat-friends';

@NgModule({
  declarations: [
    ChatFriendsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatFriendsPage),
  ],
})
export class ChatFriendsPageModule {}
