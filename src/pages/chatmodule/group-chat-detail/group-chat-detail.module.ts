import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupChatDetailPage } from './group-chat-detail';

@NgModule({
  declarations: [
    GroupChatDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupChatDetailPage),
  ],
})
export class GroupChatDetailPageModule {}
