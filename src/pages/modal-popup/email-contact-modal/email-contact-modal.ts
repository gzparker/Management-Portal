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
 * Generated class for the EmailContactModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-email-contact-modal',
  templateUrl: 'email-contact-modal.html',
})
export class EmailContactModalPage {
public leadInfo:any
public first_name:string="";
 public last_name:string="";
 public emailMessage:string="";
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, 
    public platform: Platform,public actionSheetCtrl: ActionSheetController,
    public viewCtrl: ViewController,private toastCtrl: ToastController) {
      if(this.navParams.get('lead')!=undefined)
   {
    this.leadInfo = this.navParams.get('lead');
    //debugger;
    }
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  ionViewDidLoad() {
   
    let first_name_dummy=this.storage.get('first_name');
    first_name_dummy.then((data) => {
      this.first_name=data;
    });
    let last_name_dummy=this.storage.get('last_name');
    last_name_dummy.then((data) => {
      this.last_name=data;
    });
  }
  sendContactEmail()
  {
    let subject="Email From : "+this.first_name+" "+this.last_name;
    this.userServiceObj.sendEmailToContact(this.leadInfo.lead_id,subject,this.emailMessage,this.sharedServiceObj.service_id.toString())
    .subscribe((result) => this.sendEmailToContactResp(result));
  }
  sendEmailToContactResp(result:any)
  {
   //debugger;
    if(result.status)
{
  let toast = this.toastCtrl.create({
    message: result.message,
    duration: 3000,
    position: 'top',
    cssClass:'successToast'
  });
  
  toast.onDidDismiss(() => {
  });
  toast.present();
  this.ngZone.run(() => {
   this.closePopUp();
  });
}
  }
  closePopUp()
  {
    this.viewCtrl.dismiss();
  }
}
