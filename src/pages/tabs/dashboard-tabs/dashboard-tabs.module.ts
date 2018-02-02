import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardTabsPage } from './dashboard-tabs';

@NgModule({
  declarations: [
    DashboardTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardTabsPage),
  ],
})
export class DashboardTabsPageModule {}
