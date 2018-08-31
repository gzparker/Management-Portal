import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ColorSelectionPopupPage } from './color-selection-popup';

@NgModule({
  declarations: [
    ColorSelectionPopupPage,
  ],
  imports: [
    IonicPageModule.forChild(ColorSelectionPopupPage),
  ],
})
export class ColorSelectionPopupPageModule {}
