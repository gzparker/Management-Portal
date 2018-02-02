import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SetupOptionPage } from './setup-option';

@NgModule({
  declarations: [
    SetupOptionPage,
  ],
  imports: [
    IonicPageModule.forChild(SetupOptionPage),
  ],
})
export class SetupOptionPageModule {}
