import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllLeadsPage } from './all-leads';

@NgModule({
  declarations: [
    AllLeadsPage,
  ],
  imports: [
    IonicPageModule.forChild(AllLeadsPage),
  ],
})
export class AllLeadsPageModule {}
