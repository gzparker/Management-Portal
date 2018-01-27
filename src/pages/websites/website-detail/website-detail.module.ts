import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WebsiteDetailPage } from './website-detail';

@NgModule({
  declarations: [
    WebsiteDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(WebsiteDetailPage),
  ],
})
export class WebsiteDetailPageModule {}
