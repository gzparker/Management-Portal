import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, 
  MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import jstz from 'jstz';
import { Storage } from '@ionic/storage';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";

import 'moment';
import * as moment from 'moment-timezone';
import { AlertController } from 'ionic-angular';
import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';
import { DashboardPage } from '../../dashboard/dashboard';
import { DashboardTabsPage } from '../../tabs/dashboard-tabs/dashboard-tabs';

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
  @ViewChild('companyCropper', undefined)
  companyCropper:ImageCropperComponent;
  @ViewChild('personalCropper', undefined)
  personalCropper:ImageCropperComponent;
  public ngxCropperConfig: object;
 
  // config 
  public hideCompanyCropper:boolean=true;
  public hidePersonalCropper:boolean=true;
  public edit_company_image:boolean=false;
  public companyCropperLoaded:boolean=false;
  public cropperJsConfig: object;
  public isApp=false;
  public userLoggedId:boolean=false;
  public colorBase:string="";
  public secondColor:string="";
  public thirdColor:string="";
  public timezone:string="";

  public settingsCreateMsg:string="";
  public description:string="";
  public companyCropperSettings;
  public personalCropperSettings;
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
  public personalWidth:string="";
  public personalHeight:string="";
  public companyWidth:string="";
  public companyHeight:string="";

  public user = {timezone:''};
  public placeholderString = 'Select timezone';
  

  public userId:string="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController,
    private crop: Crop,private camera: Camera,private imagePicker: ImagePicker) {
      let momentObj=moment();
      //debugger;
      let usertimezone = jstz.determine();
      //debugger;
      this.timezone=usertimezone.name();
      //debugger;
      if(this.navParams.get('route')!=undefined)
      {
        this.selectedRoute=this.navParams.get('route');
      }
     // debugger;
     if(this.platform.is('core') || this.platform.is('mobileweb') || this.platform.is('cordova') || this.platform.is('mobile')) {
      this.isApp=false;
    }
    else
    {
      this.isApp=true;
    }
    this.hideCompanyCropper=false;
    this.hidePersonalCropper=false;
    //////////////Company Cropper Settings//////////////////
      this.companyCropperSettings = new CropperSettings();
      this.companyCropperSettings.width = 100;
      this.companyCropperSettings.height = 100;
      this.companyCropperSettings.croppedWidth = 1280;
      this.companyCropperSettings.croppedHeight = 1000;
      this.companyCropperSettings.canvasWidth = 500;
      this.companyCropperSettings.canvasHeight = 300;
      this.companyCropperSettings.minWidth = 10;
        this.companyCropperSettings.minHeight = 10;
        //this.companyCropperSettings.dynamicSizing=true;
  
        this.companyCropperSettings.rounded = false;
        this.companyCropperSettings.keepAspect = false;
  
      this.companyCropperSettings.noFileInput = true;
    //////////////Personal Cropper Settings//////////////////
    this.personalCropperSettings = new CropperSettings();
      
    this.personalCropperSettings.width = 100;
    this.personalCropperSettings.height = 100;
    this.personalCropperSettings.croppedWidth = 1280;
    this.personalCropperSettings.croppedHeight = 1000;
      this.personalCropperSettings.canvasWidth = 500;
      this.personalCropperSettings.canvasHeight = 300;
      //this.companyCropperSettings.dynamicSizing=true;
      this.personalCropperSettings.minWidth = 10;
        this.personalCropperSettings.minHeight = 10;
  
        this.personalCropperSettings.rounded = false;
        this.personalCropperSettings.keepAspect = false;
  
      this.personalCropperSettings.noFileInput = true;
    ////////////////////////////////////////////////////////
        this.dataCompanyLogoImage= {};
        this.dataPersonalImage={};
        this.loader = this.loadingCtrl.create({
          content: "Please wait...",
          duration: 5000
        });

      
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
   // debugger;
    if(result.status==true)
    {
      this.globalSettings=result.globalSettings;
      if(this.globalSettings)
      {
        //debugger;
        this.user.timezone = this.globalSettings.timezone;
     
     this.colorBase=this.globalSettings.color_base;
    this.secondColor=this.globalSettings.color_second;
     this.thirdColor=this.globalSettings.color_third;
        if(this.globalSettings.photo_company!=undefined)
      {
        this.loadCompanyImage(this.sharedServiceObj.imgBucketUrl,this.globalSettings.photo_company);
      }
      if(this.globalSettings.photo_personal!=undefined)
      { 
        this.loadPersonalImage(this.sharedServiceObj.imgBucketUrl,this.globalSettings.photo_personal);
      }
        //debugger;
      }
      this.storage.set('globalSettings',this.globalSettings);
      //debugger;
    }
  }
  loadCompanyImage(baseUrl:string,imageUrl:string) {
   
    const self = this;
    //self.hideCompanyCropper=true;
    var image:any = new Image();
    const xhr = new XMLHttpRequest()
    xhr.open("GET", baseUrl+imageUrl);
    xhr.responseType = "blob";
    xhr.send();
    xhr.addEventListener("load", function() {
        var reader = new FileReader();
        reader.readAsDataURL(xhr.response); 
       
        reader.onloadend = function (loadEvent:any) {
          //debugger;
          image.src = loadEvent.target.result;
          image.onload = function () {
            self.companyCropperSettings.croppedWidth = this.width;
            self.companyCropperSettings.croppedHeight = this.height;
      
            //self.companyCropper.setImage(image); 
            self.createCompanyThumbnail(image.src);
        };
          
  
      };
    });
  }
  loadPersonalImage(baseUrl:string,imageUrl:string) {
   
    const self = this;
    //self.hidePersonalCropper=true;
    var image:any = new Image();
    const xhr = new XMLHttpRequest()
    xhr.open("GET", baseUrl+imageUrl);
    xhr.responseType = "blob";
    xhr.send();
    xhr.addEventListener("load", function() {
        var reader = new FileReader();
        reader.readAsDataURL(xhr.response); 
       
        reader.onloadend = function (loadEvent:any) {
          //debugger;
          image.src = loadEvent.target.result;
          image.onload = function () {
            //alert (this.width);
            //debugger;
            
            self.personalCropperSettings.croppedWidth = this.width;
            self.personalCropperSettings.croppedHeight = this.height;
            
           //self.personalCropper.setImage(image);
           self.createPersonalThumbnail(image.src);
        };
          
  
      };
    });
  }
  showHideCompanyCropper(){
    const self = this;
if(this.edit_company_image)
{
  this.hideCompanyCropper=true;
  //if(!this.companyCropperLoaded)
 // {
   // this.companyCropperLoaded=true;
    var image:any = new Image();
    image.src = this.dataCompanyLogoImage.image;
            image.onload = function () {
              self.companyCropper.setImage(image); 
            }
  //}
  
}
else
{
  this.hideCompanyCropper=false;
}
  }
   companyFileChangeListener($event) {
     this.hideCompanyCropper=true;
    var image:any = new Image();
    var file:File = $event.target.files[0];
    var myReader:FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent:any) {
      image.src = loadEvent.target.result;
      image.onload = function () {
      //  alert (this.width);
       // debugger;
        that.companyCropperSettings.croppedWidth = this.width;
        that.companyCropperSettings.croppedHeight = this.height;
        //that.createCompanyThumbnail(image.src);
        that.companyCropper.setImage(image);     
    };

        

    };

    myReader.readAsDataURL(file);
}
  companyImageCropped(image:any)
  {
    //debugger;
    this.companyCropperSettings.croppedWidth = image.width;
    this.companyCropperSettings.croppedHeight = image.height;
  let that=this;
    
    this.resizeCompanyImage(this.dataCompanyLogoImage.image, data => {
    
    that.companyLogoImage=data;
    this.createCompanyThumbnail(that.companyLogoImage);
      });
   
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
  
   personalFileChangeListener($event) {
     this.hidePersonalCropper=true;
    var image:any = new Image();
    var file:File = $event.target.files[0];
    //debugger;
    var myReader:FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent:any) {
        image.src = loadEvent.target.result;
        
        image.onload = function () {
         
         
          that.personalCropperSettings.croppedWidth = this.width;
          that.personalCropperSettings.croppedHeight = this.height;
       //  
          that.personalCropper.setImage(image);   
      };
    };

    myReader.readAsDataURL(file);
}
  personalImageCropped(image:any)
  {
   //debugger;
   let that=this;
   this.personalCropperSettings.croppedWidth = image.width;
  this.personalCropperSettings.croppedHeight = image.height;
  this.resizePersonalImage(this.dataPersonalImage.image, data => {
    
    that.personalImage=data;
    this.createPersonalThumbnail(that.personalImage);
      });
  
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
    /////////////////////Generate Thumbnail//////////////////////
    setPersonalImage(image:any)
    {

    }
    createPersonalThumbnail(bigMatch:any) {
      let that=this;
      this.generatePersonalFromImage(bigMatch, 500, 500, 0.5, data => {
        that.dataPersonalImage.image=data;
    
      });
    }
    generatePersonalFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
      var canvas: any = document.createElement("canvas");
      var image:any = new Image();
      var self=this;
   //debugger;
      image.src = img;
      image.onload = function () {
          
      //var width = image.width;
        
      // var height = image.height;
       //debugger;
       var width=self.personalCropperSettings.croppedWidth;
       var height=self.personalCropperSettings.croppedHeight;
     // debugger;
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        self.personalWidth = width;
        self.personalHeight = height;
      // debugger;
        var ctx = canvas.getContext("2d");
   
        ctx.drawImage(image, 0, 0, width, height);
   
        // IMPORTANT: 'jpeg' NOT 'jpg'
        var dataUrl = canvas.toDataURL('image/jpeg', quality);
   
        callback(dataUrl)
      }
      
    }
    setCompanyImage(image:any)
    {

    }
    createCompanyThumbnail(bigMatch:any) {
    let that=this;
    //debugger;
      this.generateCompanyFromImage(bigMatch, 500, 500, 0.5, data => {
     
    that.dataCompanyLogoImage.image=data;
      });
    }
    generateCompanyFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
      var canvas: any = document.createElement("canvas");
      var image:any = new Image();
      
      var that=this;
   //debugger;
      image.src = img;
      image.onload = function () {
       
        var width=that.companyCropperSettings.croppedWidth;
        var height=that.companyCropperSettings.croppedHeight;
       //debugger;
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        //debugger;
        canvas.width = width;
        canvas.height = height;
        that.companyWidth = width;
        that.companyHeight = height;
        //debugger;
        var ctx = canvas.getContext("2d");
   
        ctx.drawImage(image, 0, 0, width, height);
   
        // IMPORTANT: 'jpeg' NOT 'jpg'
        var dataUrl = canvas.toDataURL('image/jpeg', quality);
   
        callback(dataUrl)
      }
      
    }
    resizeCompanyImage(img:any,callback)
    {
      var canvas: any = document.createElement("canvas");
      var image:any = new Image();
     
      var that=this;
 
      image.src = img;
      image.onload = function () {
       
        var width=that.companyCropperSettings.croppedWidth;
        var height=that.companyCropperSettings.croppedHeight;
      
        canvas.width = width;
        canvas.height = height;

        var ctx = canvas.getContext("2d");
   
        ctx.drawImage(image, 0, 0, width, height);

        var dataUrl = canvas.toDataURL('image/jpeg', 1);

       callback(dataUrl)
      }
    }
    resizePersonalImage(img:any,callback)
    {
      var canvas: any = document.createElement("canvas");
      var image:any = new Image();
      //image.width=this.companyCropperSettings.croppedWidth;
      //image.height=this.companyCropperSettings.croppedHeight;
      var that=this;
   //debugger;
      image.src = img;
      image.onload = function () {
       
        var width=that.personalCropperSettings.croppedWidth;
        var height=that.personalCropperSettings.croppedHeight;
      
        canvas.width = width;
        canvas.height = height;
    
        //debugger;
        var ctx = canvas.getContext("2d");
   
        ctx.drawImage(image, 0, 0, width, height);
   
        // IMPORTANT: 'jpeg' NOT 'jpg'
        var dataUrl = canvas.toDataURL('image/jpeg', 1);
   //debugger;
       callback(dataUrl)
      }
    }
   ////////////////////////////////////////////////////////////////////////
    
    changeTimezone(timezone) {
     // debugger;
      this.user.timezone = timezone;
    }
    updateGlobalSettings(){
      if(this.userId!="")
    {
    //debugger;
     /*var image:any = new Image();
     image.src = this.companyLogoImage;
      image.onload = function () {
        debugger;
      }*/
    this.userServiceObj.updateGlobalSettings(this.userId,this.personalImage,this.companyLogoImage,this.user.timezone,
      this.colorBase,this.secondColor,this.thirdColor)
    .subscribe((result) => this.updateGlobalSettingsResp(result));
 
    }
    }
    updateGlobalSettingsResp(result:any)
  {
    //debugger;
    if(result.status==true)
    {
      this.ngZone.run(() => {
     this.storage.set('globalSettings',result.globalSettings);
     this.storage.set('showGlobalPopUp','no');
      this.settingsCreateMsg="Settings has been updated successfully.";
      this.navCtrl.setRoot(DashboardTabsPage,{notificationMsg:this.settingsCreateMsg.toUpperCase()});
    });
    }
 
  }
}
