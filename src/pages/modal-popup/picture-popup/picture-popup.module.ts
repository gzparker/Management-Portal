import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PicturePopupPage } from './picture-popup';

@NgModule({
  declarations: [
    PicturePopupPage,
  ],
  imports: [
    IonicPageModule.forChild(PicturePopupPage),
  ],
})
export class PicturePopupPageModule {}
