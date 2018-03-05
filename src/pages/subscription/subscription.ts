import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,MenuController,ActionSheetController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../dashboard/dashboard';
import { DashboardTabsPage } from '../tabs/dashboard-tabs/dashboard-tabs';
import { FbConfirmPage } from '../fb-confirm/fb-confirm';
import { AlertController } from 'ionic-angular';
import { GlobalPreferencesPage } from '../setup/global-preferences/global-preferences';

import { UserVerificationPage } from '../user-verification/user-verification';

import { SharedProvider } from '../../providers/shared/shared';
import { UserProvider } from '../../providers/user/user';
import { SubscriptionProvider } from '../../providers/subscription/subscription';

/**
 * Generated class for the SubscriptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-subscription',
  templateUrl: 'subscription.html',
})
export class SubscriptionPage {
  //@ViewChild('expiryDateCtrl') expiryDateCtrl;
  public allAvailablePackages: any[] = [];
  public selectedPackagesList: any[] = [];
  public full_name: string;
  public cc_number: string;
  public expiryDate: string=new Date("2010-12").toISOString();
  public exp_month: string;
  public exp_year: string;
  public userSubscribed: boolean = false;
  public subscriptionMsg: string = "";
  public cvc: string;
  public calendarMinDate:any;
  public calendarMaxDate:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public actionSheetCtrl: ActionSheetController) {
      this.calendarMinDate=new Date();
      this.calendarMinDate.setFullYear(this.calendarMinDate.getFullYear(),0);
      this.calendarMinDate=this.calendarMinDate.toISOString();
      this.calendarMaxDate=new Date();
      this.calendarMaxDate.setFullYear(this.calendarMaxDate.getFullYear() + 50);
      this.calendarMaxDate=this.calendarMaxDate.toISOString();
   //   this.expiryDate=new Date(this.expiryDate).toISOString();
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.full_name = this.navParams.get('full_name');
      this.listAllPackages();
      debugger;
    });
    ///debugger;
  }
  listAllPackages() {
    this.subscriptionObj.getServicePackagesList()
      .subscribe((result) => this.packagesResp(result)); 
  }
  packagesResp(resp: any) {
    if (resp.status == true) {
      if (resp.plans != undefined) {
        this.allAvailablePackages = resp.plans;
        // debugger;
      }
    }

  }
  openMenu() {
    //debugger;
   // this.menuCtrl.open();
    this.menuCtrl.enable(true);
    this.menuCtrl.toggle();
  }
  onPackageSelection($event: any) {
    //debugger;
  }
  saveSubscribeUser() {
if(this.selectedPackagesList.length>0)
{
  let dataObj = {
    member_id: "",
    full_name: "",
    cc_number: "",
    exp_month: "",
    exp_year: "",
    cvc: "",
    service_plans_array: []

  };

  dataObj.full_name = this.full_name;
  dataObj.cc_number = this.cc_number;
  dataObj.exp_month = this.expiryDate.split("-")[1];
  dataObj.exp_year = this.expiryDate.split("-")[0];
  dataObj.cvc = this.cvc;
  dataObj.service_plans_array = this.selectedPackagesList;
  //debugger;
  let member_id = this.storage.get('userId');
  member_id.then((memberResp) => {
    //debugger;
    dataObj.member_id = memberResp;

    this.subscriptionObj.saveUserSubscription(dataObj).
      subscribe((result) => this.saveSubscribeUserResp(result));
  });
}
else
{
  this.subscriptionMsg="Please select package list.";
}
  }
  saveSubscribeUserResp(data: any) {
    //debugger;
    if (data.status == true) {
      this.ngZone.run(() => {
        this.navCtrl.setRoot(DashboardTabsPage,{notificationMsg:data.message.toUpperCase()});
        /*let actionSheet = this.actionSheetCtrl.create({
          title: 'Select any option',
          buttons: [
            {
              text: 'Upload Company Picture',
              handler: () => {
                this.navCtrl.setRoot(GlobalPreferencesPage, { route: "subscribe" });
              }
            },
            {
              text: "No Thanks",
              handler: () => {
                this.storage.set('showGlobalPopUp','no');
                this.navCtrl.setRoot(DashboardTabsPage,{notificationMsg:data.message.toUpperCase()});
              }
            },
            {
              text: 'Cancel',
              handler: () => {
                this.navCtrl.setRoot(DashboardTabsPage,{notificationMsg:data.message.toUpperCase()});
              }
            }
          ]
        });
        actionSheet.present();*/
      
      });
    }
    else {
      this.subscriptionMsg=data.message.toUpperCase();
    }
  }
  setSelectedPackage(packageId: any) {
    //debugger;
    let selectedIndex = this.selectedPackagesList.indexOf(packageId);
    //debugger;
    if (selectedIndex >= 0) {
      this.selectedPackagesList.splice(selectedIndex, 1);
    }
    else {
      this.selectedPackagesList.push(packageId);
    }
    //debugger;
    /*let selectedPackage=this.selectedPackagesList.filter(
      packageObj => packageObj.id === packageId);
      if(selectedPackage.length>0)
      {
    
      }
      else
      {
        this.selectedPackagesList.push(packageId);
      }*/


  }
}
