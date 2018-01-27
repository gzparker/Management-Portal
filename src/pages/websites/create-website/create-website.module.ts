import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateWebsitePage } from './create-website';

@NgModule({
  declarations: [
    CreateWebsitePage,
  ],
  imports: [
    IonicPageModule.forChild(CreateWebsitePage),
  ],
})
export class CreateWebsitePageModule {}
