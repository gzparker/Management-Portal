import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewMessagePopupPage } from './new-message-popup';

@NgModule({
  declarations: [
    NewMessagePopupPage,
  ],
  imports: [
    IonicPageModule.forChild(NewMessagePopupPage),
  ],
})
export class NewMessagePopupPageModule {}
