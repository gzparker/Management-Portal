import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FbConfirmPage } from './fb-confirm';

@NgModule({
  declarations: [
    FbConfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(FbConfirmPage),
  ],
})
export class FbConfirmPageModule { }
