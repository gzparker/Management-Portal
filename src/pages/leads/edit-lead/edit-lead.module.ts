import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditLeadPage } from './edit-lead';

@NgModule({
  declarations: [
    EditLeadPage,
  ],
  imports: [
    IonicPageModule.forChild(EditLeadPage),
  ],
})
export class EditLeadPageModule {}
