import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MlsSettingsPage } from './mls-settings';

@NgModule({
  declarations: [
    MlsSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(MlsSettingsPage),
  ],
})
export class MlsSettingsPageModule {}
