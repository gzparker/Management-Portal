import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
  MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Storage } from '@ionic/storage';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { AllWebsitesPage } from '../../websites/all-websites/all-websites';
import { FbConfirmPage } from '../../fb-confirm/fb-confirm';
import { AlertController } from 'ionic-angular';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";

import { UserVerificationPage } from '../../user-verification/user-verification';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';

/**
 * Generated class for the EditWebsitePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-website',
  templateUrl: 'edit-website.html',
})
export class EditWebsitePage {
  @ViewChild('companyLogoCropper', undefined)
  companyLogoCropper:ImageCropperComponent;
  @ViewChild('favIconLogoCropper', undefined)
  favIconLogoCropper:ImageCropperComponent;
  public cropperSettings;
  public domainAccess:any;
  public website_domain:string="";
  public isApp=false;
  public websiteUpdateMsg:string="";
  public dataWebsiteLogo:any;
  public dataWebsiteIcon:any;
  public identity_name:string="";
  public identity_logo:string="";
  public identity_icon:string="";
  public isActive:boolean=true;
  public websiteId:string="";
  public userId:string="";
  public contact_email:string="";
  public header_wrapper:string="";
  public footer_wrapper:string="";
  public intagent_website:number;
  public custom_css:string="";
  public show_open_houses:boolean=false;
  public show_new_listings:boolean=false;
  public feature_agent_listings:boolean=false;
  public feature_broker_listings:boolean=false;
  public feature_office_listings:boolean=false;
  public imageChangedEvent: any = '';
  public loader:any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController,
    private crop: Crop,private camera: Camera,private imagePicker: ImagePicker) {
      if(this.platform.is('core') || this.platform.is('mobileweb') || this.platform.is('cordova') || this.platform.is('mobile')) {
        this.isApp=false;
      }
      else
      {
        this.isApp=true;
      }
      this.cropperSettings = new CropperSettings();
      this.cropperSettings.width = 100;
      this.cropperSettings.height = 100;
      this.cropperSettings.croppedWidth = 200;
      this.cropperSettings.croppedHeight = 200;
      this.cropperSettings.canvasWidth = 500;
      this.cropperSettings.canvasHeight = 300;
      this.cropperSettings.minWidth = 10;
        this.cropperSettings.minHeight = 10;
  
        this.cropperSettings.rounded = false;
        this.cropperSettings.keepAspect = false;
  
      this.cropperSettings.noFileInput = true;
        this.dataWebsiteLogo={};
        this.dataWebsiteIcon={};
        this.loader = this.loadingCtrl.create({
          content: "Please wait...",
          duration: 5000
        });
  }

  ionViewDidLoad() {
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
      if(this.navParams.get('websiteId')!=undefined)
      {
       this.websiteId = this.navParams.get('websiteId');
       this.editWebsite();
       } 
    });
  }
  websiteLogoFileChangeListener($event) {
    var image:any = new Image();
    var file:File = $event.target.files[0];
    var myReader:FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent:any) {
        image.src = loadEvent.target.result;
        that.companyLogoCropper.setImage(image);
    };
    myReader.readAsDataURL(file);
}
  websiteIdentityImageCropped(image:string)
   {
    this.identity_logo = this.dataWebsiteLogo.image;
   }
   takePicture(){
      let options =
      {
        quality: 100,
        correctOrientation: true
      };
      this.camera.getPicture(options)
      .then((data) => {
        this.identity_logo="data:image/jpeg;base64," +data;
        if(this.isApp)
        {
       this.crop
       .crop(this.identity_logo, {quality: 75,targetHeight:100,targetWidth:100})
      .then((newImage) => {
          this.identity_logo=newImage;
        }, error => {
          alert(error)});
        }
      }, function(error) {
        console.log(error);
      });
    }
    websiteFavIconFileChangeListener($event) {
      var image:any = new Image();
      var file:File = $event.target.files[0];
      var myReader:FileReader = new FileReader();
      var that = this;
      myReader.onloadend = function (loadEvent:any) {
          image.src = loadEvent.target.result;
          that.favIconLogoCropper.setImage(image);
  
      };
  
      myReader.readAsDataURL(file);
  }
    websiteFavIconImageCropped(image:string)
     {
      this.identity_icon = this.dataWebsiteIcon.image;
     
     }
    takeFavIconPicture(){
      let options =
      {
        quality: 100,
        correctOrientation: true
      };
      this.camera.getPicture(options)
      .then((data) => {
        this.identity_icon="data:image/jpeg;base64," +data;
        
        if(this.isApp)
        {
       this.crop
       .crop(this.identity_icon, {quality: 75,targetHeight:100,targetWidth:100})
      .then((newImage) => {
          this.identity_icon=newImage;
        }, error => {
         
          alert(error)});
        }
      }, function(error) {

        console.log(error);
      });
    }
  editWebsite():void{
    if(this.userId!=""){
      let loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 700
      });
      loader.present();
  this.userServiceObj.editWebsite(this.userId.toString(),this.websiteId)
    .subscribe((result) => this.editWebsiteResp(result));
    }
  }
  editWebsiteResp(result:any):void{
 
    if(result.result.status==true)
    {
this.identity_name=result.result.identity_name;
if(result.result.identity_logo!=undefined)
      {
      
        this.loadLogo(this.sharedServiceObj.imgBucketUrl,result.result.identity_logo);
      }
      if(result.result.identity_icon!=undefined)
      {
      
      // debugger;
      this.loadIcon(this.sharedServiceObj.imgBucketUrl,result.result.identity_icon);
      }
   if(result.result.website.indexOf("http://www")<0)
{
  //debugger;
  this.website_domain="http://www."+result.result.website;
}
else
{
  this.website_domain=result.result.website;
}
if(result.result.show_open_houses==null||result.result.show_open_houses=="0")
{
  this.show_open_houses=false;
}
else
{
  this.show_open_houses=true;
}
if(result.result.show_new_listings==null||result.result.show_new_listings=="0")
{
 this.show_new_listings=false;
}
else
{
  this.show_new_listings=true;
}
if(result.result.feature_agent_listings==null||result.result.feature_agent_listings=="0")
{
 this.feature_agent_listings=false;
}
else
{
  this.feature_agent_listings=true;
}
if(result.result.feature_broker_listings==null||result.result.feature_broker_listings=="0")
{
 this.feature_broker_listings=false;
}
else
{
  this.feature_broker_listings=true;
}
if(result.result.feature_office_listings==null||result.result.feature_office_listings=="0")
{
 this.feature_office_listings=false;
}
else
{
  this.feature_office_listings=true;
}
this.header_wrapper=result.result.header_wrapper;
this.footer_wrapper=result.result.footer_wrapper;
      if(result.result.status=="1")
      {
        this.isActive=true;
      }
      else
      {
        this.isActive=false;
      }
    }
  }
  loadLogo(baseUrl:string,imageUrl:string) {
    //debugger;
    const self = this;
    var image:any = new Image();
    const xhr = new XMLHttpRequest()
    xhr.open("GET", baseUrl+imageUrl);
    xhr.responseType = "blob";
    xhr.send();
    xhr.addEventListener("load", function() {
        var reader = new FileReader();
        reader.readAsDataURL(xhr.response); 
       
        reader.onloadend = function (loadEvent:any) {
          image.src = loadEvent.target.result;
          self.companyLogoCropper.setImage(image);
  
      };
    });
  }
  loadIcon(baseUrl:string,imageUrl:string) {
    const self = this;
    var image:any = new Image();
    //debugger;
    const xhr = new XMLHttpRequest()
    xhr.open("GET", baseUrl+imageUrl);
    xhr.responseType = "blob";
    xhr.send();
    xhr.addEventListener("load", function() {
        var reader = new FileReader();
        reader.readAsDataURL(xhr.response); 
       
        reader.onloadend = function (loadEvent:any) {
          image.src = loadEvent.target.result;
          self.favIconLogoCropper.setImage(image);
  
      };
    });
  } 
  updateWebsite():void{
    let isActiveFinal="1";
    let show_new_listing_dummy="0";
    let show_open_houses_dummy="0";
    let feature_agent_listings_dummy="0";
    let feature_broker_listings_dummy="0";
    let feature_office_listings_dummy="0";
    let intagent_website_dummy="";
  if(this.userId!="")
    {
     //if(this.domainAccess)
     //{
       if(this.isActive==true)
       {
         isActiveFinal="1";
       }
       else
       {
         isActiveFinal="0";
       }
       if(this.show_open_houses)
       {
         show_open_houses_dummy="1";
       }
       if(this.show_new_listings)
       {
        show_new_listing_dummy="1";
       }
       if(this.feature_agent_listings)
       {
        feature_agent_listings_dummy="1";
       }
       if(this.feature_broker_listings)
       {
        feature_broker_listings_dummy="1";
       }
       if(this.feature_office_listings)
       {
        feature_office_listings_dummy="1";
       }
       if(this.intagent_website!=null)
       {
        intagent_website_dummy="1";
       }
     //  debugger;
  this.userServiceObj.updateWebsite(this.userId,isActiveFinal,this.website_domain,this.websiteId,
    this.contact_email,this.header_wrapper,this.footer_wrapper,intagent_website_dummy,this.custom_css,
    show_new_listing_dummy,show_open_houses_dummy,feature_agent_listings_dummy,
    feature_broker_listings_dummy,feature_office_listings_dummy,this.identity_name,this.identity_logo,this.identity_icon)
    .subscribe((result) => this.updateWebsiteResp(result));
     //}
      
    }
  }
  updateWebsiteResp(result:any):void{
  this.websiteUpdateMsg="Website has been updated successfully.";
  //debugger;
  this.ngZone.run(() => {
    this.navCtrl.push(AllWebsitesPage,{notificationMsg:this.websiteUpdateMsg.toUpperCase()});
    });
  }
}
