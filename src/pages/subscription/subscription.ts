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
  public selectedPromoId:string='';
  public selected_pricingPlan:any;
  public selected_pricingPlan_Modal:any;
  public yearValues:any[]=[];
  public monthValues:any[]=[];
  public startUpPlansList:any[]=[];
  public selectedCoupon:string="";
  public full_name: string;
  public cc_number: string;
  public expiryDate: string="";
  public exp_month: string;
  public exp_year: string;
  public userSubscribed: boolean = false;
  public select_interval:boolean=true;
  public pay_yearly:boolean=false;
  public coupon_used:boolean=false;
  public startup_coupon_used:boolean=false;
  public subscriptionMsg: string = "";
  public cvc: string;
  public calendarMinDate:any;
  public calendarMaxDate:any;
  public agree_terms:boolean=false;
  public promo_code:string="";
  public totalAmount:number=0;
  public subscriptionTotalAmount:number=0;
  public startUpTotalAmount:number=0;
  public service_id:string="";
  public mls_server_id:any[]=[];
  public allMls:any[]=[];
  public selectedPlanStringListString:string="";
  public selectedPromoCode:any;
  public selectedStartupPromoCode:any;
  public userId:string="";
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
      this.service_id=data.service_id;
      if(data.startup_cost_req=="1")
      {
        this.listAllStartUpPlans();
      }
      this.listAllPackages();
      this.loadAllAvailableMLS();
    });
    });
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
    //debugger;
  }
  listAllStartUpPlans(){
    //debugger;
    this.subscriptionObj.getServiceStartUpPlanList(this.service_id)
      .subscribe((result) => this.listAllStartUpPlansResp(result)); 
  }
  listAllStartUpPlansResp(resp: any){
    if (resp.status == true) {
      //debugger;
      this.startUpPlansList=resp.result;
    }
  }
  listAllPackages() {
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
    this.intervalBasedPackages=this.intervalBasedPackages.reverse();
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
  //let requiredPlan="";
  let dataObj = {
    member_id: "",
    full_name: "",
    cc_number: "",
    exp_month: "",
    exp_year: "",
    cvc: "",
    service_plans_array: [],
    mls_service_id:[],
    stripe_coupon_code:"",
    startupCost:"",
    startupPromoCodeId:""
  };
  for(let i=0;i<this.selectedPackagesList.length;i++)
{
  dataObj.service_plans_array.push(this.selectedPackagesList[i][0].id);
  /*if(this.selectedPackagesList[i][0].required=="true")
  {
    requiredPlan="1";
  }*/
}
/*if(requiredPlan=="1")
{*/
  dataObj.full_name = this.full_name;
  dataObj.cc_number = this.cc_number;
  dataObj.exp_month = this.expiryDate.split("-")[1];
  dataObj.exp_year = this.expiryDate.split("-")[0];
  dataObj.cvc = this.cvc;
  dataObj.startupCost=this.startUpTotalAmount.toString();
  dataObj.startupPromoCodeId=this.selectedPromoId;
 
  dataObj.mls_service_id=this.mls_server_id;
  dataObj.stripe_coupon_code=this.selectedCoupon;
//debugger;
  let member_id = this.storage.get('userId');
  member_id.then((memberResp) => {
  this.userId=memberResp;
    dataObj.member_id = memberResp;
    //debugger;
   this.subscriptionObj.saveUserSubscription(dataObj,this.service_id).
     subscribe((result) => this.saveSubscribeUserResp(result));
    });
/*}
else
{
  let alert = this.alertCtrl.create({
    title: 'Select Plan',
    subTitle: "You must need to select one required product plan.",
    buttons: ['Ok']
  });
  alert.present();
}*/  
  
}
else
{
  this.subscriptionMsg="Please select package list.";
  
  let toast = this.toastCtrl.create({
    message: this.subscriptionMsg,
    duration: 3000,
    position: 'top',
    cssClass:'errorToast'
  });
  
  toast.onDidDismiss(() => {
  });
  toast.present();
}
  }
  
  saveSubscribeUserResp(data: any) {
    if (data.status == true) {
      this.sharedServiceObj.setPaidStatus(true);
      this.storage.set('paid_status', '1');
      this.setSubscribedPackages();
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
      });
    }
    else {
      this.sharedServiceObj.setPaidStatus(false);
      this.storage.set('paid_status', '0');
      this.subscriptionMsg=data.message.toUpperCase();

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
  setSubscribedPackages(){
    this.subscriptionObj.upgradeDowngradePlan(this.userId.toString(),this.service_id,"","")
        .subscribe((result) => this.upgradeDowngradePlanResp(result,"1",'','0',''));
  }
  upgradeDowngradePlanResp(resp:any,option:string,action:string,showMsg:string,successMsg:string)
  {
  let allSubscribedPackages=[];
  let intervalBasedSubscribedPackages=[];
  if(resp.status==true)
  {
    //debugger;
    allSubscribedPackages=resp.results.customer_subscription.customer_subscribed_products;
    if(allSubscribedPackages[0].plan_interval=="month"){
      intervalBasedSubscribedPackages=allSubscribedPackages.filter(
        packageList => packageList.plan_interval === "month");
        this.storage.remove('subscribedPlans');
        //debugger;
        this.storage.set('subscribedPlans',intervalBasedSubscribedPackages);
    }else{
      intervalBasedSubscribedPackages=allSubscribedPackages.filter(
        packageList => packageList.plan_interval === "year");
        this.storage.remove('subscribedPlans');
        //debugger;
        this.storage.set('subscribedPlans',intervalBasedSubscribedPackages);
    }
  }
  }
  checkPromoCode()
  {
    this.selectedPromoCode=null;
    this.selectedStartupPromoCode=null;
    this.selectedCoupon='';
    this.coupon_used=false;
    this.startup_coupon_used=false;
    this.selectedPromoId='';
    if(this.coupon_used==false||this.startup_coupon_used==false){
      if(this.selected_pricingPlan_Modal!=undefined&&this.selected_pricingPlan_Modal!=''){
if(this.startup_coupon_used==false){
        this.subscriptionObj.checkStartUpPromoCode(this.selected_pricingPlan_Modal,this.promo_code,this.service_id).
        subscribe((result) => this.checkPromoCodeResp(result,'2'));
}
      }
    if(this.promo_code!="")
    {
      if(this.coupon_used==false)
      {
        this.subscriptionObj.checkPromoCode(this.promo_code,this.service_id).
        subscribe((result) => this.checkPromoCodeResp(result,'1'));
      }
    }
}
else{
  this.packageSelectionMsg('2');
}
  }
  packageSelectionMsg(type:string){
    if(type=='1')
    {
      let toast = this.toastCtrl.create({
        message: "Please select atleast one package to apply promo code.",
        duration: 3000,
        position: 'top',
        cssClass:'errorToast'
      });
      toast.onDidDismiss(() => {
        //console.log('Dismissed toast');
      });
      toast.present();
    }
   else if(type=='2'){
    let toast = this.toastCtrl.create({
      message: "Promo Code has already been used.",
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
  checkPromoCodeResp(resp:any,type:any)
  {
    //debugger;
    if(resp.status==true)
    {
      if(type=='1') 
      {
        this.selectedPromoCode=resp;
      if(this.selectedPromoCode!=undefined&&this.selectedPromoCode.coupon==this.promo_code)
      {
          this.selectedCoupon=this.selectedPromoCode.coupon;
      }
      }
     else if(type=='2'){
this.selectedStartupPromoCode=resp;
     }
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
    this.calculateTotalPrice();
  }
  calculateTotalPrice()
  {
    //debugger;
    let that=this;
    that.totalAmount=0;
    that.subscriptionTotalAmount=0;
    that.startUpTotalAmount=0;
    that.selectedCoupon="";
    let packageCounter=0;
if(that.selectedPackagesList!=undefined)
{
  if(that.selectedPackagesList.length>0)
{
  for(let i=0;i<that.selectedPackagesList.length;i++)
  {
    packageCounter=packageCounter+1;
    
    that.subscriptionTotalAmount=that.subscriptionTotalAmount+parseFloat(that.selectedPackagesList[i][0].amount);
    that.totalAmount=that.totalAmount+parseFloat(that.selectedPackagesList[i][0].amount);
    if(that.selectedPackagesList.length==packageCounter)
    {
      //debugger;
      if(that.coupon_used==false)
      {
        if(that.selectedPromoCode!=undefined&&that.selectedPromoCode.coupon==that.promo_code)
    {
if(that.totalAmount>parseFloat(that.selectedPromoCode.subtract_amount)){
  that.totalAmount=that.totalAmount-parseFloat(that.selectedPromoCode.subtract_amount);
  that.subscriptionTotalAmount=that.subscriptionTotalAmount-parseFloat(that.selectedPromoCode.subtract_amount);
  that.coupon_used=true;
}
else{
  let alert = this.alertCtrl.create({
    title: 'PromoCode',
    subTitle: "PromoCode token discount amount cannot be greater then total selected package amount.",
    buttons: ['Ok']
  });
  alert.present();
}      

    }
      }
    }
  }
}
}
if(that.selected_pricingPlan_Modal!=undefined&&that.selected_pricingPlan_Modal!=''){
  var foundStartUpPlan = that.startUpPlansList.filter(startUpPlan => startUpPlan.id === that.selected_pricingPlan_Modal);
  that.startUpTotalAmount=that.startUpTotalAmount+parseFloat(foundStartUpPlan[0].plan_cost);
  that.totalAmount=that.totalAmount+parseFloat(foundStartUpPlan[0].plan_cost);
  //debugger;
  if(that.startup_coupon_used==false)
      {
  if(that.selectedStartupPromoCode!=undefined)
  {
    if(that.totalAmount>parseFloat(that.selectedStartupPromoCode.result.discount_amount)){
    that.startUpTotalAmount=that.startUpTotalAmount-that.selectedStartupPromoCode.result.discount_amount;
    that.totalAmount=that.totalAmount-that.selectedStartupPromoCode.result.discount_amount;
    that.selectedPromoId=that.selectedStartupPromoCode.result.id
    that.startup_coupon_used=true;
    }else{
      let alert = this.alertCtrl.create({
        title: 'Start-Up PromoCode',
        subTitle: "Start-Up PromoCode token discount amount cannot be greater then total selected package amount.",
        buttons: ['Ok']
      });
      alert.present();
    }
    //debugger;
  }
}
}
  }
  roundFloatNumbers(numberToBeFixed:any){
    return numberToBeFixed.toFixed(2)
  }
}
