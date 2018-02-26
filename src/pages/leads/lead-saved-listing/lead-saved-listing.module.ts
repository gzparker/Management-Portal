import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeadSavedListingPage } from './lead-saved-listing';

@NgModule({
  declarations: [
    LeadSavedListingPage,
  ],
  imports: [
    IonicPageModule.forChild(LeadSavedListingPage),
  ],
})
export class LeadSavedListingPageModule {}
