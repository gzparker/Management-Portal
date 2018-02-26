import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeadSavedSearchesPage } from './lead-saved-searches';

@NgModule({
  declarations: [
    LeadSavedSearchesPage,
  ],
  imports: [
    IonicPageModule.forChild(LeadSavedSearchesPage),
  ],
})
export class LeadSavedSearchesPageModule {}
