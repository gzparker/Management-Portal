import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
  MenuController,LoadingController,ToastController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';

import { AlertController } from 'ionic-angular';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';

/**
 * Generated class for the UpgradeCenterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-upgrade-center',
  templateUrl: 'upgrade-center.html',
})
export class UpgradeCenterPage {
  public allAvailablePackages: any[] = [];
  public intervalBasedAvailablePackages: any[] = [];
  public allSubscribedPackages: any[] = [];
  public intervalBasedSubscribedPackages: any[] = [];
  public selectedPackagesList: any[] = [];
  public selectedSubscribedPackagesList: any[] = [];
  public finalUpgradedSelectedPlans: any[]=[];
  public finaldownGradedSelectedPlans: any[]=[];
  public userId:string="";
  public upgradePlans:any[]=[];
  public current_upgrade:any[]=[];
  public upgradeFilteredPlans:any[]=[];
  public currentFilteredPlans:any[]=[];
  public selectedSegment:any="1";
  public totalAmount:number=0;
  public totalSubscribedAmount:number=0;
  public pay_yearly:boolean=false;
  public upgradeCenterSegment:string="1";
  public interval:string="month";
  public notificationMsg:string="";
  public notificationError:string="";
  public parentId:string="";
  public isOwner:boolean=false;
  public selectedCurrentPlans:string="";
  public stripe_customer_id:string="";
  public subscription_id:string="";
  public isUpgradeDowngradeAccess:boolean=false;
  public loader:any;
  public totalSubscribedPackages:number=0;
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController,public subscribtionObj:SubscriptionProvider, 
    public platform: Platform,public loadingCtrl: LoadingController,private toastCtrl: ToastController) {
      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 5000
      });
  }
  ionViewDidLoad() {
    this.sharedServiceObj.updateColorThemeMethod(null);
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
       this.upgradeDowngradeList('1','','0','');
       this.setAccessLevels();  
    });
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  setAccessLevels()
  {
    let parent_id = this.storage.get('parent_id');
      parent_id.then((data) => {
        if(data!=null)
        {  
      this.parentId=data;
      this.isOwner=false;
        }
       else
       {
      this.isOwner=true;
       }
       this.allowMenuOptions();
      });
  }
  allowMenuOptions()
  {
    if(this.isOwner==false)
    {
      this.isUpgradeDowngradeAccess=false;
    let allowed_access_options = this.storage.get('allowed_access_options');
    allowed_access_options.then((data) => {
      if(data!=null)
      {
        if(data!=false)
        {
        let savedAccessLevels:any[]=data;
      let editAgentAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="upgrade-downgrades");
    });
    if(editAgentAccesLevels.length>0)
      {
        this.isUpgradeDowngradeAccess=true;
      }
      else
      {
        this.isUpgradeDowngradeAccess=false;
      }
    }
      }
    });
  }
  else
  {
    this.isUpgradeDowngradeAccess=true;
  }
  }
  listIntervalBasedPackages()
  {
    let that=this;
    that.selectedPackagesList=[];
    that.totalAmount=0;
    let pay_yearly_dummy="";
  if(that.pay_yearly)
  {
    pay_yearly_dummy="year";
  }
  else
  {
    pay_yearly_dummy="month";
  }
  that.intervalBasedAvailablePackages=that.allAvailablePackages.filter(
    packageList => packageList.plan_price_interval === pay_yearly_dummy);
    that.intervalBasedSubscribedPackages=that.allSubscribedPackages.filter(
    packageList => packageList.plan_interval === pay_yearly_dummy);
    that.totalSubscribedPackages=that.intervalBasedAvailablePackages.length;
    this.calculateTotalSubscribedPrice();
  }
  setSelectedPackage(packageItem:any,option:string) {
    let that=this;
    if(option=='2')
    {
      let packageExists=that.intervalBasedSubscribedPackages.filter(packageList => packageList.plan_id === packageItem.plan_id);
      if(packageExists.length>0)
      {
        let alert = that.alertCtrl.create({
          title: 'Plan Exists',
          subTitle: "Sorry this plan already exists.",
          buttons: [{
            text: 'Ok',
            handler: () => {
              
            }
          }]
        });
        alert.present();
      }
      else
      {
        let selectedIndex = that.selectedPackagesList.indexOf(packageItem);
        if (selectedIndex >= 0) {
          this.selectedPackagesList.splice(selectedIndex, 1);
        }
        else {
          debugger;
          if(that.selectedPackagesList.length==that.totalSubscribedPackages-1)
          {
            that.ngZone.run(() => {
              let toast = that.toastCtrl.create({
                message: "You cannot downgrade from all subscribed packages.",
                duration: 3000,
                position: 'top',
                cssClass:'errorToast'
              });
            
              toast.onDidDismiss(() => {
                //console.log('Dismissed toast');
              });
            
              toast.present();
              
              //this.navCtrl.push(AccountOptionPage,{notificationMsg:"New plan has been subscribed."});
            });
          }
          else{
            that.selectedPackagesList.push(packageItem);
          }
          
        }
        that.calculateTotalPrice();
      }
    }
    else if(option=='1'){
      let selectedIndex = that.selectedSubscribedPackagesList.indexOf(packageItem);
      if (selectedIndex >= 0) {
        that.selectedSubscribedPackagesList.splice(selectedIndex, 1);
      }else {
        debugger;
        if(that.selectedSubscribedPackagesList.length==that.totalSubscribedPackages-1)
          {
            that.ngZone.run(() => {
              let toast = that.toastCtrl.create({
                message: "You cannot downgrade from all subscribed packages.",
                duration: 3000,
                position: 'top',
                cssClass:'errorToast'
              });
            
              toast.onDidDismiss(() => {
                //console.log('Dismissed toast');
              });
            
              toast.present();
              
              //this.navCtrl.push(AccountOptionPage,{notificationMsg:"New plan has been subscribed."});
            });
          }
          else{
            that.selectedSubscribedPackagesList.push(packageItem);
          }
      }
    }

  }
  calculateTotalSubscribedPrice()
  {
    this.totalSubscribedAmount=0;
    this.intervalBasedSubscribedPackages.forEach(element => {
      this.totalSubscribedAmount=this.totalSubscribedAmount+element.plan_amount;
    });
  }
  calculateTotalPrice()
  {
      this.totalAmount=0;
      if(this.selectedPackagesList!=undefined)
      {
        if(this.selectedPackagesList.length>0)
      {
        for(let i=0;i<this.selectedPackagesList.length;i++)
        {
            this.totalAmount=this.totalAmount+parseFloat(this.selectedPackagesList[i].plan_price);
        }
      }
      }
  }
  upgradeDowngradeList(option:string,action:string,showMsg:string,successMsg:string)
  {
    const that=this;
    //debugger;
    let generalWebsiteSettings = that.storage.get('generalWebsiteSettings');
    generalWebsiteSettings.then((data) => {
    if(option=="1")
    {
     // debugger;
      that.subscribtionObj.upgradeDowngradePlan(that.userId.toString(),data.service_id,"","")
      .subscribe((result) => that.upgradeDowngradePlanResp(result,option,action,showMsg,successMsg));
    }
    else
    {
if(action=='upgrade')
{
  //debugger;
  that.finalUpgradedSelectedPlans=[];
  that.selectedPackagesList.forEach(element=>{
    let planObj={plan_id:"",subscription_item_id:"",interval:""};
planObj.interval=element.plan_price_interval;
planObj.plan_id=element.plan_id;
planObj.subscription_item_id="";
that.finalUpgradedSelectedPlans.push(planObj);
//debugger;
});
//debugger;
that.selectedPackagesList=[];
//debugger;
that.subscribtionObj.upgradeDowngradePlan(that.userId.toString(),data.service_id,that.finalUpgradedSelectedPlans,action)
  .subscribe((result) => that.upgradeDowngradePlanResp(result,option,action,showMsg,successMsg));
}
else if(action=='downgrade')
{
  that.finaldownGradedSelectedPlans=[];
  //debugger;
  that.selectedSubscribedPackagesList.forEach(element=>{
    //debugger;
    let planObj={plan_id:"",subscription_item_id:"",interval:""};
planObj.interval=element.plan_price_interval;
planObj.plan_id=element.plan_id;
planObj.subscription_item_id=element.subscription_item_id;
that.finaldownGradedSelectedPlans.push(planObj);
});
//debugger;
that.selectedSubscribedPackagesList=[];
that.subscribtionObj.upgradeDowngradePlan(that.userId.toString(),data.service_id,that.finaldownGradedSelectedPlans,action)
  .subscribe((result) => that.upgradeDowngradePlanResp(result,option,action,showMsg,successMsg));
}
    }
    });  
  }
  upgradeDowngradePlanResp(resp:any,option:string,action:string,showMsg:string,successMsg:string)
  {
    //debugger;  
    let msgDowngrade="";
    if(action=="upgrade"){
      msgDowngrade="New plan has been subscribed.";
    }
    else{
      msgDowngrade="Plan has been un-subscribed.";
    }
    //debugger;
this.allSubscribedPackages=[];
this.allAvailablePackages=[];
if(resp.status==true)
{
  if(option=="1")
  {
    this.stripe_customer_id=resp.results.stripe_customer_id;
    this.subscription_id=resp.results.subscription_id;
    //this.allAvailablePackages=resp.results.available_products;
    this.allSubscribedPackages=resp.results.customer_subscription.customer_subscribed_products;
    if(this.allSubscribedPackages[0].plan_interval=="month"){
      this.pay_yearly=false;
    }else{
      this.pay_yearly=true;
    }
    //debugger;
    resp.results.available_products.forEach(element => {
      element.product_plans.forEach(element => {
        let foundSubscribedPackage=this.allSubscribedPackages.filter(
          packageList => packageList.plan_id === element.plan_id);
          if(foundSubscribedPackage.length<=0)
          {
            this.allAvailablePackages.push(element);
          }
        
      });
    }); 
    this.listIntervalBasedPackages();
    if(showMsg=="1")
    {
    this.ngZone.run(() => {
      let toast = this.toastCtrl.create({
        message: successMsg,
        duration: 3000,
        position: 'top',
        cssClass:'successToast'
      });
    
      toast.onDidDismiss(() => {
        //console.log('Dismissed toast');
      });
    
      toast.present();
      
      //this.navCtrl.push(AccountOptionPage,{notificationMsg:"New plan has been subscribed."});
    });
  }
  }
 else
 {
  this.upgradeDowngradeList("1","",'1',msgDowngrade);
 }
}
}
  loadCurrentUpgrades(currentUpgradePlan:any)
  {
    let currentPlan=this.upgradePlans.filter((item) => {
    if(item.id!=null)
    {
     return (item.id).indexOf(currentUpgradePlan) > -1;
    }
    else
    {
      if(currentUpgradePlan==null||currentUpgradePlan=="")
      {
        return this.upgradePlans[0];
      }
    }
  });
  if(currentPlan.length>0)
  {
    this.current_upgrade=currentPlan[0];
    this.selectedCurrentPlans=currentPlan[0].id.toString();
  }
  }
  filterPlansList()
  {
    this.upgradeFilteredPlans=this.filterUpgradeItems(this.interval);
  }
  filterCurrentItems(searchTerm){
    return this.current_upgrade.filter((item) => {
        return (item.interval.toLowerCase()).indexOf(searchTerm.toLowerCase()) > -1;
    });
}
filterUpgradeItems(searchTerm){
  return this.upgradePlans.filter((item) => {
      return (item.interval.toLowerCase()).indexOf(searchTerm.toLowerCase()) > -1;
  });
}

  segmentChanged(event:any)
  {
    if(event.value=="1")
    {
this.selectedSegment="1";
    }
    else if(event.value=="2")
    {
      this.selectedSegment="2";
    }
   
  }
}
