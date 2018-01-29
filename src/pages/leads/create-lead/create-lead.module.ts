import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateLeadPage } from './create-lead';

@NgModule({
  declarations: [
    CreateLeadPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateLeadPage),
  ],
})
export class CreateLeadPageModule {}
