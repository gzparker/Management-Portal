import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditBillingPage } from './edit-billing';

@NgModule({
  declarations: [
    EditBillingPage,
  ],
  imports: [
    IonicPageModule.forChild(EditBillingPage),
  ],
})
export class EditBillingPageModule {}
