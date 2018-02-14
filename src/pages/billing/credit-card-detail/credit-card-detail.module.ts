import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreditCardDetailPage } from './credit-card-detail';

@NgModule({
  declarations: [
    CreditCardDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(CreditCardDetailPage),
  ],
})
export class CreditCardDetailPageModule {}
