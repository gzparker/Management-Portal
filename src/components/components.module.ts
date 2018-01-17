import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home';
import { LoginComponent } from './login/login';
@NgModule({
	declarations: [HomeComponent,
    LoginComponent],
	imports: [],
	exports: [HomeComponent,
    LoginComponent]
})
export class ComponentsModule {}
