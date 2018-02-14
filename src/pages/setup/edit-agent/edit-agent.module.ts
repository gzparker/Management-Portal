import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditAgentPage } from './edit-agent';

@NgModule({
  declarations: [
    EditAgentPage,
  ],
  imports: [
    IonicPageModule.forChild(EditAgentPage),
  ],
})
export class EditAgentPageModule {}
