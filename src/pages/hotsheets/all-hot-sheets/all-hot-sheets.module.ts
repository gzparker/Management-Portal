import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllHotSheetsPage } from './all-hot-sheets';

@NgModule({
  declarations: [
    AllHotSheetsPage,
  ],
  imports: [
    IonicPageModule.forChild(AllHotSheetsPage),
  ],
})
export class AllHotSheetsPageModule {}
