import { NgModule } from '@angular/core';

import { DashboardPage } from '../pages/dashboard/dashboard';
import { ContactusPage } from '../pages/contactus/contactus';
import { DashboardTabsComponent } from './dashboard-tabs/dashboard-tabs';
@NgModule({
	declarations: [
    DashboardTabsComponent],
    imports: [],
    entryComponents: [DashboardPage,ContactusPage],
	exports: [
    DashboardTabsComponent]
})
export class ComponentsModule {}
