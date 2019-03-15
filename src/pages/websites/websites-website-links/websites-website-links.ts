import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
  MenuController,LoadingController,ToastController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Storage } from '@ionic/storage';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';

import { AlertController } from 'ionic-angular';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';

/**
 * Generated class for the WebsitesWebsiteLinksPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-websites-website-links',
  templateUrl: 'websites-website-links.html',
})
export class WebsitesWebsiteLinksPage {
  public userId:string="";
  public websiteId:string="";
  public hotsheet_links:any;
  public website_links:any;
  public selectedSegment:any="1";
  public websiteLinkSegment:string="1";
  public widgets:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController,
    private crop: Crop,private camera: Camera,private imagePicker: ImagePicker,private toastCtrl: ToastController) {
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  ionViewDidLoad() {
    this.sharedServiceObj.updateColorThemeMethod(null);
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
      if(this.navParams.get('websiteId')!=undefined)
      {  
       this.websiteId = this.navParams.get('websiteId');
       this.loadAllWebsiteLinks();
      } 
    });
  }
  openInAppBrowser(redirectUrl:string)
  {
    //debugger;
    window.open(redirectUrl, '_black');
    
  }
  copied($event:any)
  {
    //debugger;
    let toast = this.toastCtrl.create({
      message: "copied",
      duration: 3000,
      position: 'top',
      cssClass:'successToast'
    });
    
    toast.onDidDismiss(() => {
      
    });
    toast.present();
  }
  copyLink(redirectUrl:string)
  {
    //debugger;
  }
loadAllWebsiteLinks()
{
  if(this.userId!=""){
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 700
    });
    loader.present();
    //debugger;
this.userServiceObj.loadAllWebsiteLinks(this.userId.toString(),this.websiteId)
  .subscribe((result) => this.loadAllWebsiteLinksResp(result));
  }
}
loadAllWebsiteLinksResp(result:any):void{
 //debugger;
  if(result.status==true)
  {
  this.widgets=result.widgets;
  this.hotsheet_links=result.hotsheet_links;
  this.website_links=result.website_links;
  }
 // debugger;
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
    else if(event.value=="3")
    {
      this.selectedSegment="3";
    }
  }
}
