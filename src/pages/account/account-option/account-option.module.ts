import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountOptionPage } from './account-option';

@NgModule({
  declarations: [
    AccountOptionPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountOptionPage),
  ],
})
export class AccountOptionPageModule {}
