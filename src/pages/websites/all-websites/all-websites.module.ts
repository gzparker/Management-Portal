import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllWebsitesPage } from './all-websites';

@NgModule({
  declarations: [
    AllWebsitesPage,
  ],
  imports: [
    IonicPageModule.forChild(AllWebsitesPage),
  ],
})
export class AllWebsitesPageModule {}
