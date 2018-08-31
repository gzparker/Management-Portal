import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
   MenuController,ActionSheetController,Tabs, ViewController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { ISubscription } from "rxjs/Subscription";
import { AlertController,ToastController } from 'ionic-angular';

import { DashboardTabsPage } from '../../tabs/dashboard-tabs/dashboard-tabs';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';


/**
 * Generated class for the ColorSelectionPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-color-selection-popup',
  templateUrl: 'color-selection-popup.html',
})
export class ColorSelectionPopupPage {
  public colorOptions:any[]=[{id:"base_color",name:"1st Color"},{id:"secondary_color",name:"2nd Color"},
  {id:"tertiary_color",name:"3rd Color"}];
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, 
    public platform: Platform,public actionSheetCtrl: ActionSheetController,
    public viewCtrl: ViewController,private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ColorSelectionPopupPage');
  }
  closePopUp()
  {
    this.viewCtrl.dismiss();
  }
}
