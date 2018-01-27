import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
  MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../../dashboard/dashboard';
import { FbConfirmPage } from '../../fb-confirm/fb-confirm';
import { AllWebsitesPage } from '../../websites/all-websites/all-websites';
import { AlertController } from 'ionic-angular';

import { UserVerificationPage } from '../../user-verification/user-verification';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';
/**
 * Generated class for the CreateWebsitePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-website',
  templateUrl: 'create-website.html',
})
export class CreateWebsitePage {
  public website_domain:string="";
  public websiteCreateMsg:string="";
  public isActive:boolean=true;
  public userId:string="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    let member_id = this.storage.get('userId');
    //debugger;
    member_id.then((data) => {
      this.userId=data;
    });
  }
  createWebsite():void{
    if(this.userId!=""){
    //this.domainAccess=this.localStorageService.get('domainAccess');
    let isActiveFinal="1";
  
     //if(this.domainAccess)
     //{
       if(this.isActive==true)
       {
         isActiveFinal="1";
       }
       else
       {
         isActiveFinal="0";
       }
       
  
  this.userServiceObj.createWebsite(this.userId,isActiveFinal,this.website_domain)
    .subscribe((result) => this.createWebsiteResp(result));
    // }
      }
  }
  createWebsiteResp(result:any):void{
  
  this.websiteCreateMsg="Website has been created successfully.";
  this.ngZone.run(() => {
  this.navCtrl.push(DashboardPage,{notificationMsg:this.websiteCreateMsg.toUpperCase()});
  });
  }
}
