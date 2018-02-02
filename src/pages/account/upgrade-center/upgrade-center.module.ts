import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpgradeCenterPage } from './upgrade-center';

@NgModule({
  declarations: [
    UpgradeCenterPage,
  ],
  imports: [
    IonicPageModule.forChild(UpgradeCenterPage),
  ],
})
export class UpgradeCenterPageModule {}
