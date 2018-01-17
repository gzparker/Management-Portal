import { Component } from '@angular/core';

/**
 * Generated class for the HomeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'home',
  templateUrl: 'home.html'
})
export class HomeComponent {

  text: string;

  constructor() {
    console.log('Hello HomeComponent Component');
    this.text = 'Hello World';
  }

}
