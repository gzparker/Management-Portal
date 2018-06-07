import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatActivitiesPage } from './chat-activities';

@NgModule({
  declarations: [
    ChatActivitiesPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatActivitiesPage),
  ],
})
export class ChatActivitiesPageModule {}
