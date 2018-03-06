import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCreditCardPage } from './add-credit-card';

@NgModule({
  declarations: [
    AddCreditCardPage,
  ],
  imports: [
    IonicPageModule.forChild(AddCreditCardPage),
  ],
})
export class AddCreditCardPageModule {}
