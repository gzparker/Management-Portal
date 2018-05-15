import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateRolePage } from './create-role';

@NgModule({
  declarations: [
    CreateRolePage,
  ],
  imports: [
    IonicPageModule.forChild(CreateRolePage),
  ],
})
export class CreateRolePageModule {}
