import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatGroupsPage } from './chat-groups';

@NgModule({
  declarations: [
    ChatGroupsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatGroupsPage),
  ],
})
export class ChatGroupsPageModule {}
