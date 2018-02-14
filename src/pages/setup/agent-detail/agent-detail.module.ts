import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgentDetailPage } from './agent-detail';

@NgModule({
  declarations: [
    AgentDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(AgentDetailPage),
  ],
})
export class AgentDetailPageModule {}
