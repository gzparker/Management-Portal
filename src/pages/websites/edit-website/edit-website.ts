import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
  MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { AllWebsitesPage } from '../../websites/all-websites/all-websites';
import { FbConfirmPage } from '../../fb-confirm/fb-confirm';
import { AlertController } from 'ionic-angular';

import { UserVerificationPage } from '../../user-verification/user-verification';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';

/**
 * Generated class for the EditWebsitePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-website',
  templateUrl: 'edit-website.html',
})
export class EditWebsitePage {
  public domainAccess:any;
  public website_domain:string="";
  public websiteUpdateMsg:string="";
  public isActive:boolean=true;
  public websiteId:string="";
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
      if(this.navParams.get('websiteId')!=undefined)
      {
       this.websiteId = this.navParams.get('websiteId');
       this.editWebsite();
       }
      
    });
  }
  editWebsite():void{
    //this.websiteId
    if(this.userId!=""){
  //debugger;
  this.userServiceObj.editWebsite(this.userId.toString(),this.websiteId)
    .subscribe((result) => this.editWebsiteResp(result));
    }
  }
  editWebsiteResp(result:any):void{
 
    if(result.result.status==true)
    {
     // debugger;
      this.website_domain=result.result.website;
      if(result.result.status=="1")
      {
        this.isActive=true;
      }
      else
      {
        this.isActive=false;
      }
    }
  }
  updateWebsite():void{
   // this.domainAccess=this.localStorageService.get('domainAccess');
    let isActiveFinal="1";
  if(this.userId!="")
    {
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
       
  this.userServiceObj.updateWebsite(this.userId,isActiveFinal,this.website_domain,this.websiteId)
    .subscribe((result) => this.updateWebsiteResp(result));
     //}
      
    }
  }
  updateWebsiteResp(result:any):void{
  this.websiteUpdateMsg="Website has been updated successfully.";
  this.ngZone.run(() => {
    this.navCtrl.push(AllWebsitesPage,{notificationMsg:this.websiteUpdateMsg.toUpperCase()});
    });
  }
}
