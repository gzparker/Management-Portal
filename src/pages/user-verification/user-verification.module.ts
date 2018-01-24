import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserVerificationPage } from './user-verification';

@NgModule({
  declarations: [
    UserVerificationPage,
  ],
  imports: [
    IonicPageModule.forChild(UserVerificationPage),
  ],
})
export class UserVerificationPageModule {}
