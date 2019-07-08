import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
   MenuController,ActionSheetController,Tabs, ViewController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { ISubscription } from "rxjs/Subscription";
import { AlertController,ToastController } from 'ionic-angular';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';

/**
 * Generated class for the EmailContactModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
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
    }
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  ionViewDidLoad() {
    this.sharedServiceObj.updateColorThemeMethod(null);
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
    let generalWebsiteSettings = this.storage.get('generalWebsiteSettings');
    generalWebsiteSettings.then((data) => {
    this.userServiceObj.sendEmailToContact(this.leadInfo.lead_id,subject,this.emailMessage,data.service_id.toString(),'https://s3-us-west-2.amazonaws.com/central-system/usr/6193c4f73a9ad64c/assets/static/people/company_photocQIu.jpg')
    .subscribe((result) => this.sendEmailToContactResp(result));
    });
  }
  sendEmailToContactResp(result:any)
  {
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
