import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpcomingSubscriptionPage } from './upcoming-subscription';

@NgModule({
  declarations: [
    UpcomingSubscriptionPage,
  ],
  imports: [
    IonicPageModule.forChild(UpcomingSubscriptionPage),
  ],
})
export class UpcomingSubscriptionPageModule {}
