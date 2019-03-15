import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,MenuController,
  ActionSheetController,LoadingController,ToastController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
//import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { AlertController } from 'ionic-angular';
import { GlobalPreferencesPage } from '../setup/global-preferences/global-preferences';


import { SharedProvider } from '../../providers/shared/shared';
import { UserProvider } from '../../providers/user/user';
import { SubscriptionProvider } from '../../providers/subscription/subscription';

/**
 * Generated class for the SubscriptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-subscription',
  templateUrl: 'subscription.html',
})
export class SubscriptionPage {
  //@ViewChild('expiryDateCtrl') expiryDateCtrl;
  public allAvailablePackages: any[] = [];
  public intervalBasedPackages: any[] = [];
  public selectedPackagesList: any[] = [];
  public selected_packageIds:any[]=[];
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
    public loadingCtrl: LoadingController,private toastCtrl: ToastController) {
      this.setYearMonthValues();
      //this.expiryDate=new Date(new Date().getFullYear().toString()+"-"+(new Date().getMonth().toString())).toISOString();
      this.calendarMinDate=new Date();
      this.calendarMinDate.setFullYear(this.calendarMinDate.getFullYear(),0);
      this.calendarMinDate=this.calendarMinDate.toISOString();
      this.calendarMaxDate=new Date();
      this.calendarMaxDate.setFullYear(this.calendarMaxDate.getFullYear() + 50);
      this.calendarMaxDate=this.calendarMaxDate.toISOString();
      
   //   this.expiryDate=new Date(this.expiryDate).toISOString();
  }

  ionViewDidLoad() {
    this.sharedServiceObj.updateColorThemeMethod(null);
    this.platform.ready().then(() => {
      
      this.full_name = this.navParams.get('full_name');
      let generalWebsiteSettings = this.storage.get('generalWebsiteSettings');
    generalWebsiteSettings.then((data) => {
      //debugger;
      this.service_id=data.service_id;
      this.listAllPackages();
      this.loadAllAvailableMLS();
    });
      
      //debugger;
    });
    ///debugger;
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  setYearMonthValues()
  {
    //debugger;
    let currentYear=parseInt(new Date().getFullYear().toString());
    for(let i=currentYear;i<=currentYear+50;i++)
    {
      this.yearValues.push(i);
    }
    for(let i=1;i<=12;i++)
    {
      this.monthValues.push(i);
    }
    //debugger;
    this.expiryDate=new Date(new Date().getFullYear().toString()+"-"+((new Date().getMonth()+1).toString())).toISOString();
  }
  listAllPackages() {
    //debugger;
    
    this.subscriptionObj.getServicePackagesList(this.service_id)
      .subscribe((result) => this.packagesResp(result)); 
  }
  packagesResp(resp: any) {
    //debugger;
    //this.loader.present();
    if (resp.status == true) {
     //debugger;
      this.tos_url=resp.tos_url;
      if (resp.plans != undefined) {
      // debugger;
      resp.plans.available_products.forEach(element => {
        element.product_plans.forEach(element => {
          this.allAvailablePackages.push(element);
        });
        
        
      });
      //debugger;
        //this.allAvailablePackages = resp.plans;
        this.listIntervalBasedPackages();
       //debugger;
      }
    }
  }
  listIntervalBasedPackages()
  {
    //debugger;
    this.selectedPackagesList=[];
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
  let requiredPlan="";
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
  dataObj.service_plans_array.push(this.selectedPackagesList[i][0].id);
  if(this.selectedPackagesList[i][0].required=="true")
  {
    requiredPlan="1";
  }
 // debugger;
}
if(requiredPlan=="1")
{
  dataObj.full_name = this.full_name;
  dataObj.cc_number = this.cc_number;
  dataObj.exp_month = this.expiryDate.split("-")[1];
  dataObj.exp_year = this.expiryDate.split("-")[0];
  dataObj.cvc = this.cvc;
 
  dataObj.mls_service_id=this.mls_server_id;
  dataObj.stripe_coupon_code=this.selectedCoupon;

  let member_id = this.storage.get('userId');
  member_id.then((memberResp) => {
  
    dataObj.member_id = memberResp;

   this.subscriptionObj.saveUserSubscription(dataObj,this.service_id).
     subscribe((result) => this.saveSubscribeUserResp(result));
    });
}
else
{
  let alert = this.alertCtrl.create({
    title: 'Select Plan',
    subTitle: "You must need to select one required product plan.",
    buttons: ['Ok']
  });
  alert.present();
}  
  
}
else
{
  this.subscriptionMsg="Please select package list.";
  /*let alert = this.alertCtrl.create({
    title: 'Error',
    subTitle: this.subscriptionMsg,
    buttons: ['Ok']
  });
  alert.present();*/
  let toast = this.toastCtrl.create({
    message: this.subscriptionMsg,
    duration: 3000,
    position: 'top',
    cssClass:'errorToast'
  });
  
  toast.onDidDismiss(() => {
    //console.log('Dismissed toast');
  });
  toast.present();
}
  }
  
  saveSubscribeUserResp(data: any) {
    if (data.status == true) {
      this.sharedServiceObj.setPaidStatus(true);
      this.ngZone.run(() => {
        let confirm = this.alertCtrl.create({
          title: 'Sign Up',
          message: 'Thank you for signing up with us!',
          buttons: [
           
            {
              text: 'Continue',
              handler: () => {
                this.navCtrl.push(GlobalPreferencesPage);
                  }
                }
              ]
              });
              confirm.present();  
        //this.navCtrl.setRoot(DashboardTabsPage,{notificationMsg:data.message.toUpperCase()});
      });
    }
    else {
      this.sharedServiceObj.setPaidStatus(false);
      this.subscriptionMsg=data.message.toUpperCase();
      /*let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: this.subscriptionMsg,
        buttons: ['Ok']
      });
      alert.present();*/
      let toast = this.toastCtrl.create({
        message: this.subscriptionMsg,
        duration: 3000,
        position: 'top',
        cssClass:'errorToast'
      });
      
      toast.onDidDismiss(() => {
        //console.log('Dismissed toast');
      });
      toast.present();
    }
  }
  checkPromoCode()
  {
    if(this.promo_code!="")
    {
      this.subscriptionObj.checkPromoCode(this.promo_code,this.service_id).
      subscribe((result) => this.checkPromoCodeResp(result));
    }
  }
  checkPromoCodeResp(resp:any)
  {
    //debugger;
    if(resp.status==true)
    {
      this.selectedPromoCode=resp;
      this.calculateTotalPrice();
    }
  }
  setSelectedPackage(packageItem:any) {
    this.selectedPackagesList=[];
    this.selected_packageIds.forEach(element => {
      let foundPackage=this.intervalBasedPackages.filter(
        packageList => packageList.id === element);
        this.selectedPackagesList.push(foundPackage);
    });
    
    /*let selectedIndex = this.selectedPackagesList.indexOf(packageItem);
    if (selectedIndex >= 0) {
      this.selectedPackagesList.splice(selectedIndex, 1);
    }
    else {
      this.selectedPackagesList.push(packageItem);
    }*/
    //debugger;
    this.calculateTotalPrice();
  }
  calculateTotalPrice()
  {
    this.totalAmount=0;
    this.selectedCoupon="";
if(this.selectedPackagesList!=undefined)
{
  if(this.selectedPackagesList.length>0)
{
  for(let i=0;i<this.selectedPackagesList.length;i++)
  {
    if(this.selectedPromoCode!=undefined&&this.selectedPromoCode.coupon==this.promo_code)
    {
      if(this.selectedPackagesList[i][0].required=="true"&&this.selectedPromoCode.coupon==this.promo_code)
      {
        this.selectedCoupon=this.selectedPromoCode.coupon;
        this.totalAmount=this.totalAmount+parseFloat(this.selectedPromoCode.subtract_amount);
      }
      else
      {
        this.totalAmount=this.totalAmount+parseFloat(this.selectedPackagesList[i][0].amount);
      }
    }
    else
    {
      this.totalAmount=this.totalAmount+parseFloat(this.selectedPackagesList[i][0].amount);
    }
  }
}
}
  }
}
