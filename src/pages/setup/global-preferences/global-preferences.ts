import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, 
  MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import jstz from 'jstz';
import { Storage } from '@ionic/storage';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import {ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';

import { AlertController } from 'ionic-angular';
import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';
import { DashboardPage } from '../../dashboard/dashboard';

/**
 * Generated class for the GlobalPreferencesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-global-preferences',
  templateUrl: 'global-preferences.html',
})
export class GlobalPreferencesPage {
  @ViewChild('companyLogoCropper') companyLogoCropper : ImageCropperComponent;
  @ViewChild('personalImageCropper') personalImageCropper : ImageCropperComponent;
  
  public isApp=false;
  public userLoggedId:boolean=false;
  public colorBase:string="";
  public secondColor:string="";
  public thirdColor:string="";
  public timezone:string="";

  public settingsCreateMsg:string="";
  public description:string="";
  public cropperSettings;
  public croppedWidth:Number;
  public croppedHeight:Number;
  public companyImageChangedEvent: any = '';
  public personalImageChangedEvent: any = '';
  public dataCompanyLogoImage:any;
  public companyLogoImage:string="";
  public dataPersonalImage:any;
  public personalImage:string="";
  public loader:any;
  public selectedRoute:string="";
  public globalSettings:any;
  

  public userId:string="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController,
    private crop: Crop,private camera: Camera,private imagePicker: ImagePicker) {
      let usertimezone = jstz.determine();
      this.timezone=usertimezone.name();
      if(this.navParams.get('route')!=undefined)
      {
        this.selectedRoute=this.navParams.get('route');
      }
     // debugger;
      if(this.platform.is('core') || this.platform.is('mobileweb')) {
        this.isApp=false;
      }
      else
      {
        this.isApp=true;
      }
      
      this.cropperSettings= new CropperSettings();

      this.cropperSettings.noFileInput=false;

      this.cropperSettings.cropOnResize=true;

      this.cropperSettings.fileType= 'image/jpeg';

      this.cropperSettings.keepAspect= false;

      this.dataCompanyLogoImage= {};
      this.dataPersonalImage={};
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
      this.loadGlobalSettings();
    });
  }
  loadGlobalSettings()
  {
    //debugger;
    this.userServiceObj.viewGlobalSettings(this.userId)
    .subscribe((result) => this.loadGlobalSettingsResp(result));
  }
  loadGlobalSettingsResp(result:any)
  {
    //debugger;
    if(result.status==true)
    {
      this.globalSettings=result.globalSettings;
      if(this.globalSettings)
      {
        this.colorBase=this.globalSettings.color_base;
        this.secondColor=this.globalSettings.color_second;
        this.thirdColor=this.globalSettings.color_third;
      }
      this.storage.set('globalSettings',this.globalSettings);
      //debugger;
    }
  }
  
  fileCompanyChangeEvent(event: any): void {
    this.companyImageChangedEvent = event;
}
companyImageLoaded()
   {

   }
   companyLoadImageFailed()
   {

   }
  companyImageCropped(image:string)
  {
    this.companyLogoImage=image;
   
  }
  takeCompanyLogoPicture(){
   //debugger;
     let options =
     {
       quality: 100,
       correctOrientation: true
     };
     this.camera.getPicture(options)
     .then((data) => {
       this.companyLogoImage="data:image/jpeg;base64," +data;
       let image : any= new Image();
        image.src = this.companyLogoImage;
        //this.companyLogoImage=image;
       //this.companyLogoCropper.setImage(image);
       if(this.isApp)
       {
      this.crop
      .crop(this.companyLogoImage, {quality: 75,targetHeight:100,targetWidth:100})
     .then((newImage) => {
    
         //alert(newImage);
         this.companyLogoImage=newImage;
       }, error => {
        
         alert(error)});
       }
     }, function(error) {

       console.log(error);
     });
   }
   filePersonalChangeEvent(event: any): void {
    this.personalImageChangedEvent = event;
}
personalImageLoaded()
   {

   }
   personalLoadImageFailed()
   {

   }
  personalImageCropped(image:string)
  {
    this.personalImage=image;
   
  }
   takePersonalPicture(){
      let options =
      {
        quality: 100,
        correctOrientation: true
      };
      this.camera.getPicture(options)
      .then((data) => {
        this.personalImage="data:image/jpeg;base64," +data;
        let image : any= new Image();
         image.src = this.personalImage;
        //this.personalImageCropper.setImage(image);
        if(this.isApp)
        {
       this.crop
       .crop(this.personalImage, {quality: 75,targetHeight:100,targetWidth:100})
      .then((newImage) => {
          this.personalImage=newImage;
        }, error => {
          alert(error)});
        }
      }, function(error) {
 
        console.log(error);
      });
    }
    updateGlobalSettings(){
      if(this.userId!="")
    {
    this.userServiceObj.updateGlobalSettings(this.userId,this.personalImage,this.companyLogoImage,this.timezone,
      this.colorBase,this.secondColor,this.thirdColor)
    .subscribe((result) => this.updateGlobalSettingsResp(result));
 
    }
    }
    updateGlobalSettingsResp(result:any)
  {
    
    if(result.status==true)
    {
      this.ngZone.run(() => {
      this.storage.set('globalSettings',result.globalSettings);
      this.storage.set('showGlobalPopUp','no');
      this.settingsCreateMsg="Settings has been updated successfully.";
      this.navCtrl.push(DashboardPage,{notificationMsg:this.settingsCreateMsg.toUpperCase()});
    });
    }
 
  }
}
