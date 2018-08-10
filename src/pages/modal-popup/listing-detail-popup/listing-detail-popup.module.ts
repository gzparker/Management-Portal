import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListingDetailPopupPage } from './listing-detail-popup';

@NgModule({
  declarations: [
    ListingDetailPopupPage,
  ],
  imports: [
    IonicPageModule.forChild(ListingDetailPopupPage),
  ],
})
export class ListingDetailPopupPageModule {}
