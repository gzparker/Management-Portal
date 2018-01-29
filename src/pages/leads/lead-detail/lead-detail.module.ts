import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeadDetailPage } from './lead-detail';

@NgModule({
  declarations: [
    LeadDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(LeadDetailPage),
  ],
})
export class LeadDetailPageModule {}
