import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageAgentsPage } from './manage-agents';

@NgModule({
  declarations: [
    ManageAgentsPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageAgentsPage),
  ],
})
export class ManageAgentsPageModule {}
