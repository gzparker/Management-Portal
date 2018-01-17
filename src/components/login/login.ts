import { Component } from '@angular/core';

/**
 * Generated class for the LoginComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginComponent {

  text: string;

  constructor() {
    console.log('Hello LoginComponent Component');
    this.text = 'Hello World';
  }

}
