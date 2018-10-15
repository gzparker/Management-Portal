import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
  MenuController,LoadingController,ToastController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Storage } from '@ionic/storage';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
//import { AllWebsitesPage } from '../../websites/all-websites/all-websites';
//import { WebsitesWebsiteLinksPage } from '../../websites/websites-website-links/websites-website-links';
import { FbConfirmPage } from '../../fb-confirm/fb-confirm';
import { AlertController } from 'ionic-angular';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";

import { UserVerificationPage } from '../../user-verification/user-verification';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';

/**
 * Generated class for the UpgradeCenterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-upgrade-center',
  templateUrl: 'upgrade-center.html',
})
export class UpgradeCenterPage {
  public userId:string="";
  public upgradePlans:any[]=[];
  public current_upgrade:any[]=[];
  public upgradeFilteredPlans:any[]=[];
  public currentFilteredPlans:any[]=[];
  public selectedSegment:any="1";
  public upgradeCenterSegment:string="1";
  public interval:string="month";
  public notificationMsg:string="";
  public notificationError:string="";
  public parentId:string="";
  public isOwner:boolean=false;
  public selectedCurrentPlans:string="";
  public isUpgradeDowngradeAccess:boolean=false;
  public loader:any;
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController,public subscribtionObj:SubscriptionProvider, 
    public platform: Platform,public loadingCtrl: LoadingController,private toastCtrl: ToastController) {
      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 5000
      });
      //debugger;
  }

  ionViewDidLoad() {
    this.sharedServiceObj.updateColorThemeMethod(null);
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
     
       this.loadUpgradeList();
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
          //debugger;    
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
        //debugger;
        let savedAccessLevels:any[]=data;
    //debugger;
     
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
  loadUpgradeList()
  {
    if(this.userId!=""){
      let loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 700
      });
      loader.present();
  this.subscribtionObj.loadUpgradeList(this.userId.toString(),this.sharedServiceObj.service_id.toString(),
  this.interval.toString())
    .subscribe((result) => this.loadUpgradeListResp(result));
    }
  }
  loadUpgradeListResp(result:any)
  {
if(result.status==true)
{
  this.upgradePlans=result.plans;
  //this.current_upgrade=result.current_upgrade;
  //this.currentFilteredPlans=this.current_upgrade;
  this.upgradeFilteredPlans=this.upgradePlans;
  this.loadCurrentUpgrades(result.current_upgrade)
  //debugger;
  //debugger;
}
  }
  loadCurrentUpgrades(currentUpgradePlan:any)
  {
    let currentPlan=this.upgradePlans.filter((item) => {
    //  return (item.id).indexOf(currentUpgradePlan) > -1;
    if(item.id!=null)
    {
     
//        return this.upgradeFilteredPlans[0];
   //debugger;
     return (item.id).indexOf(currentUpgradePlan) > -1;
     //return this.upgradePlans[0];
    }
    else
    {
      if(currentUpgradePlan==null||currentUpgradePlan=="")
      {
      //  debugger;
        return this.upgradePlans[0];
      }
    }
  });
  //debugger;
  if(currentPlan.length>0)
  {
    this.current_upgrade=currentPlan[0];
    this.selectedCurrentPlans=currentPlan[0].id.toString();
  }
  //debugger;
  }
  filterPlansList()
  {
    //this.currentFilteredPlans=this.filterCurrentItems(this.interval);
    this.upgradeFilteredPlans=this.filterUpgradeItems(this.interval);
    //debugger;
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
onPlanSelection(plan:any)
{
  //debugger;
  let selectedPlan=this.upgradeFilteredPlans.filter((item) => {
    if(item.id!=null)
    {
     
//        return this.upgradeFilteredPlans[0];
     return (item.id).indexOf(plan) > -1;
    }
    else
    {
      if(plan==null||plan=="")
      {
      //  debugger;
        return this.upgradeFilteredPlans[0];
      }
    }
 //  debugger;
});
if(selectedPlan.length>0)
{
  //debugger;
  let confirm = this.alertCtrl.create({
    title: 'Upgrade Plan?',
    message: 'Would you like to change to '+selectedPlan[0].name+" ?",
    buttons: [
      {
        text: 'Cancel',
        handler: () => {
       
        }
      },
      {
        text: 'Ok',
        handler: () => {
        //  debugger;
         this.upgradeDowngradePlan(selectedPlan[0]);
       //  debugger;
        }
      }
    ]
  });
  confirm.present();
}
}
upgradeDowngradePlan(selectedPlan:any)
{
  if(selectedPlan.id!=null&&selectedPlan.id!="")
  {
    this.subscribtionObj.upgradeDowngradePlan(this.userId.toString(),selectedPlan.id)
    .subscribe((result) => this.upgradeDowngradePlanResp(result));
  }
  else
    {
this.notificationError="Plan does not exists.";
this.notificationMsg="";
let toast = this.toastCtrl.create({
  message: this.notificationError,
  duration: 3000,
  position: 'top',
  cssClass:'successToast'
});

toast.onDidDismiss(() => {
  //console.log('Dismissed toast');
});

toast.present();
/*let alert = this.alertCtrl.create({
  title: 'Notification',
  subTitle: this.notificationError,
  buttons: ['Ok']
});
alert.present();*/
    }
}

upgradeDowngradePlanResp(result:any)
{
  //debugger;
  if(result.status==true)
  {
    this.notificationError="";
this.notificationMsg=result.message;
/*let alert = this.alertCtrl.create({
  title: 'Notification',
  subTitle: this.notificationMsg,
  buttons: ['Ok']
});
alert.present();*/
let toast = this.toastCtrl.create({
  message: this.notificationError,
  duration: 3000,
  position: 'top',
  cssClass:'successToast'
});

toast.onDidDismiss(() => {
  //console.log('Dismissed toast');
});

toast.present();
  }
//debugger;
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
