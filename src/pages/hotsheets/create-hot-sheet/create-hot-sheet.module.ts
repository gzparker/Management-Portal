import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateHotSheetPage } from './create-hot-sheet';

@NgModule({
  declarations: [
    CreateHotSheetPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateHotSheetPage),
  ],
})
export class CreateHotSheetPageModule {}
