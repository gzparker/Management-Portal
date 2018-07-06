import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,MenuController,ActionSheetController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../dashboard/dashboard';
import { DashboardTabsPage } from '../tabs/dashboard-tabs/dashboard-tabs';
import { FbConfirmPage } from '../fb-confirm/fb-confirm';
//import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
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
  public intervalBasedPackages: any[] = [];
  public selectedPackagesList: any[] = [];
  public yearValues:any[]=[];
  public monthValues:any[]=[];
  public selectedCoupon:string="";
  public full_name: string;
  public cc_number: string;
  public expiryDate: string="";
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
  public promo_code:string="";
  public totalAmount:number=0;
  public service_id:string="";
  public mls_server_id:any[]=[];
  public allMls:any[]=[];
  public selectedPlanStringListString:string="";
  public selectedPromoCode:any;
  public tos_url:string="http://www.idxcompany.com/terms-of-service/";
  public loader:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController) {
      this.setYearMonthValues();
      //this.expiryDate=new Date(new Date().getFullYear().toString()+"-"+(new Date().getMonth().toString())).toISOString();
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
  setYearMonthValues()
  {
    let currentYear=parseInt(new Date().getFullYear().toString());
    for(let i=currentYear;i<=currentYear+50;i++)
    {
      this.yearValues.push(i);
    }
    for(let i=1;i<=12;i++)
    {
      this.monthValues.push(i);
    }
    this.expiryDate=new Date(new Date().getFullYear().toString()+"-"+(new Date().getMonth().toString())).toISOString();
  }
  listAllPackages() {
    //debugger;
    
    this.subscriptionObj.getServicePackagesList()
      .subscribe((result) => this.packagesResp(result)); 
  }
  packagesResp(resp: any) {
    //this.loader.present();
    if (resp.status == true) {
     // debugger;
      this.tos_url=resp.tos_url;
      if (resp.plans != undefined) {
      // debugger;
        this.allAvailablePackages = resp.plans;
        this.listIntervalBasedPackages();
       //debugger;
      }
    }
  }
  listIntervalBasedPackages()
  {
    this.selectedPackagesList=[];
    //this.loader = this.loadingCtrl.create({
      //content: "Please wait...",
      //duration: 1000
    //});
    //debugger;
    this.totalAmount=0;
    let pay_yearly_dummy="";
  if(this.pay_yearly)
  {
    pay_yearly_dummy="year";
  }
  else
  {
    pay_yearly_dummy="month";
  }
  //this.allAvailablePackages.filter()
  this.intervalBasedPackages=this.allAvailablePackages.filter(
    packageList => packageList.interval === pay_yearly_dummy);
//debugger;
  }
  loadAllAvailableMLS()
  {
    this.subscriptionObj.loadAllAvailableMLS()
    .subscribe((result) => this.allAvailableMLSResp(result)); 
  }
  allAvailableMLSResp(resp: any)
  {

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
    window.open(this.tos_url, '_black');
    
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
    mls_service_id:[],
    stripe_coupon_code:""
  };
 // this.selectedPackagesList.forEach(element => {
   // dataObj.service_plans_array.push(element.id);
//});
for(let i=0;i<this.selectedPackagesList.length;i++)
{
  dataObj.service_plans_array.push(this.selectedPackagesList[i].id);
 // debugger;
}
  dataObj.full_name = this.full_name;
  dataObj.cc_number = this.cc_number;
  dataObj.exp_month = this.expiryDate.split("-")[1];
  dataObj.exp_year = this.expiryDate.split("-")[0];
  dataObj.cvc = this.cvc;
  //dataObj.service_plans_array = this.selectedPackagesList;
  //dataObj.service_plans_array=this.selectedPlanStringListString;
  dataObj.mls_service_id=this.mls_server_id;
  dataObj.stripe_coupon_code=this.selectedCoupon;
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
    if (data.status == true) {
      this.sharedServiceObj.setPaidStatus(true);
      this.ngZone.run(() => {
        this.navCtrl.setRoot(DashboardTabsPage,{notificationMsg:data.message.toUpperCase()});
      });
    }
    else {
      this.sharedServiceObj.setPaidStatus(false);
      this.subscriptionMsg=data.message.toUpperCase();
    }
  }
  checkPromoCode()
  {
    if(this.promo_code!="")
    {
      this.subscriptionObj.checkPromoCode(this.promo_code).
      subscribe((result) => this.checkPromoCodeResp(result));
    }
  }
  checkPromoCodeResp(resp:any)
  {
    if(resp.status==true)
    {
      this.selectedPromoCode=resp;
      this.calculateTotalPrice();
    }
  }
  setSelectedPackage(packageItem:any) {
    let selectedIndex = this.selectedPackagesList.indexOf(packageItem);
    if (selectedIndex >= 0) {
      this.selectedPackagesList.splice(selectedIndex, 1);
    }
    else {
      this.selectedPackagesList.push(packageItem);
    }
    this.calculateTotalPrice();
  }
  calculateTotalPrice()
  {
    this.totalAmount=0;
    this.selectedCoupon="";
//debugger;
//this.selectedPackagesList.forEach((item)=>{
//debugger;
//})
if(this.selectedPackagesList!=undefined)
{
  if(this.selectedPackagesList.length>0)
{
  for(let i=0;i<this.selectedPackagesList.length;i++)
  {
    if(this.selectedPromoCode!=undefined&&this.selectedPromoCode.coupon==this.promo_code)
    {
      //debugger;
      if(this.selectedPromoCode.id==this.selectedPackagesList[i].id&&this.selectedPromoCode.coupon==this.promo_code)
      {
        this.selectedCoupon=this.selectedPromoCode.coupon;
        this.totalAmount=this.totalAmount+parseFloat(this.selectedPromoCode.subtract_amount);
      }
      else
      {
        this.totalAmount=this.totalAmount+parseFloat(this.selectedPackagesList[i].amount);
      }
    }
    else
    {
      this.totalAmount=this.totalAmount+parseFloat(this.selectedPackagesList[i].amount);
    }
   /* if(this.selectedPlanStringListString!="")
    {
      this.selectedPlanStringListString=this.selectedPlanStringListString+","+this.selectedPackagesList[i].stripe_dev_plan_id.toString();
    }
    else
    {
      this.selectedPlanStringListString=this.selectedPlanStringListString;
    }*/
  //debugger;
  }
}
}

  }
}
