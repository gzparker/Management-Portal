import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, 
  MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import jstz from 'jstz';
import { Storage } from '@ionic/storage';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";
import { PicturePopupPage } from '../../../pages/modal-popup/picture-popup/picture-popup';

import 'moment';
import * as moment from 'moment-timezone';
import { AlertController } from 'ionic-angular';
import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';
import { ColorSelectionPopupPage } from '../../modal-popup/color-selection-popup/color-selection-popup';
import { DashboardPage } from '../../dashboard/dashboard';
import { DashboardTabsPage } from '../../tabs/dashboard-tabs/dashboard-tabs';
import { trigger } from '@angular/core/src/animation/dsl';


/**
 * Generated class for the NotificationSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification-settings',
  templateUrl: 'notification-settings.html',
})
export class NotificationSettingsPage {
  public isApp=false;
  public userId:string="";
  public receive_messages:any[]=[];
  public receive_reminders:any[]=[];
  public receive_promotions_and_tips:any[]=[];
  public receive_policy_and_community:any[]=[];
  public receive_account_support:any[]=[];
  public notificationOptions:any[]=[{id:"sms",name:"SMS"},{id:"email",name:"Email"},{id:"push",name:"Push Notification"}];
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController,
    private crop: Crop,private camera: Camera,private imagePicker: ImagePicker) {
      this.isApp = (!document.URL.startsWith("http"));
  }

  ionViewDidLoad() {
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
      this.loadNotificationSettings();
     // this.sharedServiceObj.updateColorThemeMethod(null);
    });
  }

  loadNotificationSettings()
  {
    this.userServiceObj.loadNotificationSettings(this.userId)
      .subscribe((result) => this.loadNotificationSettingsResp(result));
  }
  loadNotificationSettingsResp(result:any)
  {
    //debugger;
    if(result.status!=false)
    {
      let notificationSettingsData=result.results[0];
this.receive_account_support=notificationSettingsData.receive_account_support.split(',');
this.receive_reminders=notificationSettingsData.receive_reminders.split(',');
this.receive_messages=notificationSettingsData.receive_messages.split(',');
this.receive_policy_and_community=notificationSettingsData.receive_policy_and_community.split(',');
this.receive_promotions_and_tips=notificationSettingsData.receive_promotions_and_tips.split(',');
    }
  }
  updateNotificationSettings()
  {
    this.userServiceObj.updateNotificationSettings(this.userId,this.receive_account_support,
      this.receive_messages,this.receive_policy_and_community,this.receive_promotions_and_tips,this.receive_reminders)
    .subscribe((result) => this.updateNotificationSettingsResp(result));
  }
  updateNotificationSettingsResp(result:any)
  {
    if(result.status!=false)
    {
     // debugger;
     this.ngZone.run(() => {
      
       this.navCtrl.setRoot(DashboardTabsPage,{notificationMsg:"Notification Settings have been updated successfully.".toUpperCase()});
     });
    }
  } 
}
