import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,MenuController,ActionSheetController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../dashboard/dashboard';
import { DashboardTabsPage } from '../tabs/dashboard-tabs/dashboard-tabs';
import { FbConfirmPage } from '../fb-confirm/fb-confirm';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
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
  public select_interval:boolean=true;
  public pay_yearly:boolean=false;
  public subscriptionMsg: string = "";
  public cvc: string;
  public calendarMinDate:any;
  public calendarMaxDate:any;
  public agree_terms:boolean=false;
  public totalAmount:number=0;
  public service_id:string="";
  public mls_server_id:any[]=[];
  public allMls:any[]=[];
  public tos_url:string="http://www.idxcompany.com/terms-of-service/";
  public loader:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,public iab: InAppBrowser,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController) {
      this.calendarMinDate=new Date();
      this.calendarMinDate.setFullYear(this.calendarMinDate.getFullYear(),0);
      this.calendarMinDate=this.calendarMinDate.toISOString();
      this.calendarMaxDate=new Date();
      this.calendarMaxDate.setFullYear(this.calendarMaxDate.getFullYear() + 50);
      this.calendarMaxDate=this.calendarMaxDate.toISOString();
      this.service_id=this.sharedServiceObj.service_id;
   //   this.expiryDate=new Date(this.expiryDate).toISOString();
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.full_name = this.navParams.get('full_name');
      this.listAllPackages();
      this.loadAllAvailableMLS();
      //debugger;
    });
    ///debugger;
  }
  listAllPackages() {
    //debugger;
    this.selectedPackagesList=[];
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 1000
    });
    this.totalAmount=0;
    let pay_yearly_dummy="";
  if(this.pay_yearly)
  {
    pay_yearly_dummy="YEAR";
  }
  else
  {
    pay_yearly_dummy="MONTH";
  }
    this.subscriptionObj.getServicePackagesList(pay_yearly_dummy)
      .subscribe((result) => this.packagesResp(result)); 
  }
  packagesResp(resp: any) {
    this.loader.present();
    if (resp.status == true) {
      //debugger;
      this.tos_url=resp.tos_url;
      if (resp.plans != undefined) {
      // debugger;
        this.allAvailablePackages = resp.plans;
       //debugger;
      }
    }
  }
  loadAllAvailableMLS()
  {
    this.subscriptionObj.loadAllAvailableMLS()
    .subscribe((result) => this.allAvailableMLSResp(result)); 
  }
  allAvailableMLSResp(resp: any)
  {
//debugger;
if(resp.status==true)
{
  this.allMls=resp.available_mls;
}
else
{
  this.allMls=[];
}
  }
  openInAppBrowser()
  {
   // debugger;
    const options: InAppBrowserOptions = {
      zoom: 'no'
    }

    // Opening a URL and returning an InAppBrowserObject
    const browser = this.iab.create(this.tos_url, '_blank',options);
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
    service_plans_array: [],
    mls_service_id:[]
  };

  dataObj.full_name = this.full_name;
  dataObj.cc_number = this.cc_number;
  dataObj.exp_month = this.expiryDate.split("-")[1];
  dataObj.exp_year = this.expiryDate.split("-")[0];
  dataObj.cvc = this.cvc;
  dataObj.service_plans_array = this.selectedPackagesList;
  dataObj.mls_service_id=this.mls_server_id;
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
      this.sharedServiceObj.setPaidStatus(true);
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
      this.sharedServiceObj.setPaidStatus(false);
      this.subscriptionMsg=data.message.toUpperCase();
    }
  }
  setSelectedPackage(packageId: any,price:any) {
    //debugger;
    let selectedIndex = this.selectedPackagesList.indexOf(packageId);
    //debugger;
    
    if (selectedIndex >= 0) {
      this.totalAmount=this.totalAmount-parseFloat(price);
      this.selectedPackagesList.splice(selectedIndex, 1);
    }
    else {
      this.totalAmount=this.totalAmount+parseFloat(price);
      this.selectedPackagesList.push(packageId);
    }
   //debugger;

  }
}
