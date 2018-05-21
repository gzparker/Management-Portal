import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
  MenuController,LoadingController } from 'ionic-angular';
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
  public parentId:string="";
  public isOwner:boolean=false;
  public isUpgradeDowngradeAccess:boolean=false;
  public loader:any;
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController,public subscribtionObj:SubscriptionProvider, 
    public platform: Platform,public loadingCtrl: LoadingController) {
      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 5000
      });
      //debugger;
  }

  ionViewDidLoad() {
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
     
       this.loadUpgradeList();
       this.setAccessLevels();
    });
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
    let allowed_access_options = this.storage.get('allowed_access_options');
    allowed_access_options.then((data) => {
      if(data!=null)
      {
        //debugger;
        let savedAccessLevels:any[]=data;
    //debugger;
     
      let editAgentAccesLevels=savedAccessLevels.filter((element) => {
        return (element.name=="Upgrade/Downgrade");
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
  this.current_upgrade=result.current_upgrade;
  this.currentFilteredPlans=this.current_upgrade;
  this.upgradeFilteredPlans=this.upgradePlans;
  //debugger;
}

  }
  filterPlansList()
  {
    this.currentFilteredPlans=this.filterCurrentItems(this.interval);
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
upgradeDowngradePlan(plan_id:any)
{
 // debugger;
  this.subscribtionObj.upgradeDowngradePlan(this.userId.toString(),plan_id)
    .subscribe((result) => this.upgradeDowngradePlanResp(result));
}
upgradeDowngradePlanResp(result:any)
{
  if(result.status==true)
  {
this.notificationMsg=result.message;
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
