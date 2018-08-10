import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HotsheetDetailPopupPage } from './hotsheet-detail-popup';

@NgModule({
  declarations: [
    HotsheetDetailPopupPage,
  ],
  imports: [
    IonicPageModule.forChild(HotsheetDetailPopupPage),
  ],
})
export class HotsheetDetailPopupPageModule {}
