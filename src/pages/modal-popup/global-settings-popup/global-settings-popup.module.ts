import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GlobalSettingsPopupPage } from './global-settings-popup';

@NgModule({
  declarations: [
    GlobalSettingsPopupPage,
  ],
  imports: [
    IonicPageModule.forChild(GlobalSettingsPopupPage),
  ],
})
export class GlobalSettingsPopupPageModule {}
