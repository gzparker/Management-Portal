import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateAgentPage } from './create-agent';

@NgModule({
  declarations: [
    CreateAgentPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateAgentPage),
  ],
})
export class CreateAgentPageModule {}
