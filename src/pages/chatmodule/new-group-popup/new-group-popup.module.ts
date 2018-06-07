import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewGroupPopupPage } from './new-group-popup';

@NgModule({
  declarations: [
    NewGroupPopupPage,
  ],
  imports: [
    IonicPageModule.forChild(NewGroupPopupPage),
  ],
})
export class NewGroupPopupPageModule {}
