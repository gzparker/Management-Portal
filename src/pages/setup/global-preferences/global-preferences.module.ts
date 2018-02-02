import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GlobalPreferencesPage } from './global-preferences';

@NgModule({
  declarations: [
    GlobalPreferencesPage,
  ],
  imports: [
    IonicPageModule.forChild(GlobalPreferencesPage),
  ],
})
export class GlobalPreferencesPageModule {}
