import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BillingHistoryPage } from './billing-history';

@NgModule({
  declarations: [
    BillingHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(BillingHistoryPage),
  ],
})
export class BillingHistoryPageModule {}
