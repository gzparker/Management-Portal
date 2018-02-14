import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditCreditCardPage } from './edit-credit-card';

@NgModule({
  declarations: [
    EditCreditCardPage,
  ],
  imports: [
    IonicPageModule.forChild(EditCreditCardPage),
  ],
})
export class EditCreditCardPageModule {}
