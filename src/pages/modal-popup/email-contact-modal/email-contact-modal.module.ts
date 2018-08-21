import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmailContactModalPage } from './email-contact-modal';

@NgModule({
  declarations: [
    EmailContactModalPage,
  ],
  imports: [
    IonicPageModule.forChild(EmailContactModalPage),
  ],
})
export class EmailContactModalPageModule {}
