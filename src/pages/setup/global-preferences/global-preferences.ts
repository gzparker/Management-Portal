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
import { PicturePopupPage } from '../../../pages/modal-popup/picture-popup/picture-popup';

import 'moment';
import * as moment from 'moment-timezone';
import { AlertController } from 'ionic-angular';
import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';
import { ColorSelectionPopupPage } from '../../modal-popup/color-selection-popup/color-selection-popup';
import { DashboardPage } from '../../dashboard/dashboard';
import { DashboardTabsPage } from '../../tabs/dashboard-tabs/dashboard-tabs';
import { trigger } from '@angular/core/src/animation/dsl';

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
  /*@ViewChild('companyCropper', undefined)
  companyCropper:ImageCropperComponent;
  @ViewChild('personalCropper', undefined)
  personalCropper:ImageCropperComponent;*/
  public ngxCropperConfig: object;
 
  // config 
  public hideCompanyCropper:boolean=true;
  public hidePersonalCropper:boolean=true;
  public edit_company_image:boolean=false;
  public edit_personal_image:boolean=false;
  public crop_company_image:boolean=false;
  public crop_personal_image:boolean=false;
  public companyCropperLoaded:boolean=false;
  public isCompanyImageExist:boolean=false;
  public cropperJsConfig: object;
  public isApp=false;
  public userLoggedId:boolean=false;
  public identity_name:string="";
  public colorBase:string="";
  public secondColor:string="";
  public thirdColor:string="";
  public headerColor:string="";
  public headerColorOption:string="";
  public textColor:string="";
  public textColorOption:string="";
  public buttonColor:string="";
  public buttonColorOption:string="";
  public backgroundColor:string="";
  public backgroundColorOption:string="";
  public sideBarMenuColor:string="";
  public sideBarMenuColorOption:string="";
  public contentTitleColor:string="";
  public contentTitleColorOption:string="";
  public paginationColor:string="";
  public paginationColorOption:string="";
  public modalBackgroundColor:string="";
  public modalBackgroundColorOption:string="";
  public isCustomColor:string="0";
  public customColorOption:boolean=false;
  public customColorOptionModal:boolean=false;

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

  public user = {timezone:'America/New_York'};
  public placeholderString = 'Select timezone';
  public colorOptions:any[]=[{id:"base_color",name:"1st Color"},
  {id:"secondary_color",name:"2nd Color"},{id:"tertiary_color",name:"3rd Color"},{id:"default",name:"Default Color"}];

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
     /*if(this.platform.is('core') || this.platform.is('mobileweb') || this.platform.is('cordova') || this.platform.is('mobile')) {
      this.isApp=false;
    }
    else
    {
      this.isApp=true;
    }*/
    this.isApp = (!document.URL.startsWith("http"));
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
        if(this.globalSettings.timezone==null||this.globalSettings.timezone==undefined)
        {
          this.user.timezone='America/New_York';
        }
        else
        {
          this.user.timezone = this.globalSettings.timezone;
        }
        if(this.globalSettings.isCustomColor=="false")
        {
          this.customColorOptionModal=false;
        }
        else
        {
          this.customColorOptionModal=true;
        }
       //this.customColorOptionModal=this.globalSettings.isCustomColor;
      //this.customColorOption=this.globalSettings.isCustomColor;
     this.colorBase=this.globalSettings.color_base;
    this.secondColor=this.globalSettings.color_second;
     this.thirdColor=this.globalSettings.color_third;
     this.identity_name=this.globalSettings.identity_name;
     this.headerColor=this.globalSettings.header_color;
     this.headerColorOption=this.globalSettings.header_color_option;
     this.sideBarMenuColor=this.globalSettings.sidebar_menu_color;
     this.sideBarMenuColorOption=this.globalSettings.sidebar_menu_color_option;
     this.textColor=this.globalSettings.text_color;
     this.textColor=this.globalSettings.text_color_option;
     this.buttonColor=this.globalSettings.button_color;
     this.buttonColorOption=this.globalSettings.button_color_option;
     this.contentTitleColor=this.globalSettings.content_title_color;
     this.contentTitleColorOption=this.globalSettings.content_title_color_option;
     this.paginationColor=this.globalSettings.pagination_color;
     this.paginationColorOption=this.globalSettings.pagination_color_option;
     this.modalBackgroundColor=this.globalSettings.modal_background_color;
     this.modalBackgroundColorOption=this.globalSettings.modal_background_color_option;
    // debugger;
     
        if(this.globalSettings.photo_company!=undefined)
      {
        this.loadCompanyImage(this.sharedServiceObj.imgBucketUrl,this.globalSettings.photo_company);
      }
      /*if(this.globalSettings.photo_personal!=undefined)
      { 
        this.loadPersonalImage(this.sharedServiceObj.imgBucketUrl,this.globalSettings.photo_personal);
      }*/
        //debugger;
      }
      this.storage.set('globalSettings',this.globalSettings);
      //debugger;
    }
  }
  showColorPopUp(option:string){
    var that=this;
    var selectedColor={
      option:"",
      selectedColorOption:"",
      selectedColor:""
    }
    if(option=='header_color')
    {
selectedColor.option=option;
selectedColor.selectedColorOption=this.headerColorOption;
selectedColor.selectedColor=this.headerColor;
    }
    if(option=='side_bar_menu_color')
    {
selectedColor.option=option;
selectedColor.selectedColorOption=this.sideBarMenuColorOption;
selectedColor.selectedColor=this.sideBarMenuColor;
    }
    if(option=='content_background_color')
    {
selectedColor.option=option;
selectedColor.selectedColorOption=this.backgroundColorOption;
selectedColor.selectedColor=this.backgroundColor;
    }
    if(option=='button_color')
    {
selectedColor.option=option;
selectedColor.selectedColorOption=this.buttonColorOption;
selectedColor.selectedColor=this.buttonColor;
    }
    if(option=='content_title_color')
    {
selectedColor.option=option;
selectedColor.selectedColorOption=this.contentTitleColorOption;
selectedColor.selectedColor=this.contentTitleColor;
    }
    if(option=='pagination_color')
    {
selectedColor.option=option;
selectedColor.selectedColorOption=this.paginationColorOption;
selectedColor.selectedColor=this.paginationColor;
    }
    if(option=='modal_background_color')
    {
selectedColor.option=option;
selectedColor.selectedColorOption=this.modalBackgroundColorOption;
selectedColor.selectedColor=this.modalBackgroundColor;
    }
    var modalColor = this.modalCtrl.create(ColorSelectionPopupPage,{selectedColor:selectedColor});
    modalColor.onDidDismiss(data => {
     // console.log(data);
      //debugger;
      that.setColorProperties(data);
 });
    modalColor.present();
  }
  setColorProperties(options:any)
  {
//debugger;
if(options.option=='header_color')
{
this.headerColorOption=options.selectedColorOption;
if(options.selectedColor!='')
{
  this.headerColor=options.selectedColor;
 // debugger;
}
else
{
if(this.headerColorOption=="base_color")
{
this.headerColor=this.colorBase;
}
else if(this.headerColorOption=="secondary_color")
{
this.headerColor=this.secondColor;
}
else if(this.headerColorOption=="tertiary_color")
{
this.headerColor=this.thirdColor;
//debugger;
}
else if(this.headerColorOption=="default")
{
this.headerColorOption="";
this.headerColor="";
}
}
//debugger;
}
else if(options.option=='side_bar_menu_color')
{
  this.sideBarMenuColorOption=options.selectedColorOption;
  if(options.selectedColor!='')
{
  this.sideBarMenuColor=options.selectedColor;
}
else
{
if(this.sideBarMenuColorOption=="base_color")
{
this.sideBarMenuColor=this.colorBase;
}
else if(this.sideBarMenuColorOption=="secondary_color")
{
this.sideBarMenuColor=this.secondColor;
}
else if(this.sideBarMenuColorOption=="tertiary_color")
{
this.sideBarMenuColor=this.thirdColor;
}
else if(this.sideBarMenuColorOption=="default")
{
this.sideBarMenuColorOption="";
this.sideBarMenuColor="";
}
}
}
else if(options.option=='content_background_color')
{
  this.backgroundColorOption=options.selectedColorOption;
  if(options.selectedColor!='')
{
  this.backgroundColor=options.selectedColor;
}
else
{
if(this.backgroundColorOption=="base_color")
{
this.backgroundColor=this.colorBase;
}
else if(this.backgroundColorOption=="secondary_color")
{
this.backgroundColor=this.secondColor;
}
else if(this.backgroundColorOption=="tertiary_color")
{
this.backgroundColor=this.thirdColor;
}
else if(this.backgroundColorOption=="default")
{
this.backgroundColorOption="";
this.backgroundColor="";
}
}
}
else if(options.option=='button_color')
{
  this.buttonColorOption=options.selectedColorOption;
  if(options.selectedColor!='')
{
  this.buttonColor=options.selectedColor;
}
else
{
if(this.buttonColorOption=="base_color")
{
this.buttonColor=this.colorBase;
}
else if(this.buttonColorOption=="secondary_color")
{
this.buttonColor=this.secondColor;
}
else if(this.buttonColorOption=="tertiary_color")
{
this.backgroundColor=this.thirdColor;
}
else if(this.buttonColorOption=="default")
{
this.buttonColorOption="";
this.buttonColor="";
}
}
}
else if(options.option=='content_title_color')
{
  this.contentTitleColorOption=options.selectedColorOption;
  if(options.selectedColor!='')
{
  this.contentTitleColor=options.selectedColor;
}
else
{
if(this.contentTitleColorOption=="base_color")
{
this.contentTitleColor=this.colorBase;
}
else if(this.contentTitleColorOption=="secondary_color")
{
this.contentTitleColor=this.secondColor;
}
else if(this.contentTitleColorOption=="tertiary_color")
{
this.contentTitleColor=this.thirdColor;
}
else if(this.contentTitleColorOption=="default")
{
this.contentTitleColorOption="";
this.contentTitleColor="";
}
}
}
else if(options.option=='pagination_color')
{
  this.paginationColorOption=options.selectedColorOption;
  if(options.selectedColor!='')
{
  this.paginationColor=options.selectedColor;
}
else
{
if(this.paginationColorOption=="base_color")
{
this.paginationColor=this.colorBase;
}
else if(this.paginationColorOption=="secondary_color")
{
this.paginationColor=this.secondColor;
}
else if(this.paginationColorOption=="tertiary_color")
{
this.paginationColor=this.thirdColor;
}
else if(this.paginationColorOption=="default")
{
this.paginationColorOption="";
this.paginationColor="";
}
}
}
else if(options.option=='modal_background_color')
{
  this.modalBackgroundColorOption=options.selectedColorOption;
  if(options.selectedColor!='')
{
  this.modalBackgroundColor=options.selectedColor;
}
else
{
if(this.modalBackgroundColorOption=="base_color")
{
this.modalBackgroundColor=this.colorBase;
}
else if(this.modalBackgroundColorOption=="secondary_color")
{
this.modalBackgroundColor=this.secondColor;
}
else if(this.modalBackgroundColorOption=="tertiary_color")
{
this.modalBackgroundColor=this.thirdColor;
}
else if(this.modalBackgroundColorOption=="default")
{
this.modalBackgroundColorOption="";
this.modalBackgroundColor="";
}
}
}
  }
  toggleCustomColor(){
    //this.customColorOption=!this.customColorOption;
   // debugger;
    if(this.customColorOption==true)
    {
      //this.customColorOption=false;
      //this.isCustomColor="0";
    }
    else
    {
      //this.customColorOption=true;
      //this.isCustomColor="1";
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
            self.companyLogoImage=image.src;
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
          image.src = loadEvent.target.result;
          image.onload = function () {
            self.personalCropperSettings.croppedWidth = this.width;
            self.personalCropperSettings.croppedHeight = this.height;
            self.personalImage=image.src;
           self.createPersonalThumbnail(image.src);
        };
      };
    });
  }
  /*showHideCompanyCropper(){
    this.crop_company_image=false;
    const self = this;
if(this.edit_company_image)
{
  this.hideCompanyCropper=true;
  if(this.companyLogoImage!="")
  {
   // this.companyCropperLoaded=true;
    var image:any = new Image();
    image.src = this.companyLogoImage;
            image.onload = function () {
              self.companyCropper.setImage(image); 
            }
 }
  
}
else
{
  this.hideCompanyCropper=false;
}
  }*/
  /*showHidePersonalCropper(){
    this.crop_personal_image=false;
    const self = this;
if(this.edit_personal_image)
{
  this.hidePersonalCropper=true;
  if(this.personalImage!="")
  {
   // this.companyCropperLoaded=true;
    var image:any = new Image();
    image.src = this.personalImage;
            image.onload = function () {
              self.personalCropper.setImage(image); 
            }
 }
  
}
else
{
  this.hidePersonalCropper=false;
}
  }*/
  editImage(imageType:string){
    var that=this;
   
    //debugger;
    let selectedImageOption={
      mode:"edit",
      croppedWidth:this.companyCropperSettings.croppedWidth,
      croppedHeight:this.companyCropperSettings.croppedHeight,
      //websiteWidth:this.personalWidth,
      //websiteHeight:this.personalHeight,
      //datawebsiteImage:this.dataPersonalImage,
      websiteImage:this.companyLogoImage,
      imageType:imageType
    };
    //debugger;
    //document.remo
    //document.getElementById("canvas").remove();
   var modalColor = this.modalCtrl.create(PicturePopupPage,{selectedImageOption:selectedImageOption});
    modalColor.onDidDismiss(data => {
      if(data)
      {
        that.setWebsiteImage(data);
      }
      
 });
   modalColor.present();
  }
  setWebsiteImage(imageObject:any)
  {
//debugger;
    this.loadEditedImage(imageObject,imageObject.imageType);
  }
  loadEditedImage(imageObject:any,imageType:any)
  {
    const self = this;
   
       if(imageType=="companyImage")
       {
        self.companyCropperSettings.croppedWidth = imageObject.croppedWidth;
        self.companyCropperSettings.croppedHeight = imageObject.croppedHeight;
        
       self.resizeCompanyImage(imageObject.websiteImage, data => {
        self.companyLogoImage=data;
          self.createCompanyThumbnail(self.companyLogoImage);
        });
       }

  }
   companyFileChangeListener($event) {
     this.crop_company_image=true;
     this.edit_company_image=true;
     this.hideCompanyCropper=true;
     this.isCompanyImageExist=true;
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
        that.companyLogoImage=this.src;
        that.createCompanyThumbnail(that.companyLogoImage);
        //that.createCompanyThumbnail(image.src);
        //that.companyCropper.setImage(image);     
    };

        

    };

    myReader.readAsDataURL(file);
}
  companyImageCropped(image:any)
  {
    if(this.crop_company_image)
    {
      this.companyCropperSettings.croppedWidth = image.width;
      this.companyCropperSettings.croppedHeight = image.height;
    let that=this;
      
      this.resizeCompanyImage(this.dataCompanyLogoImage.image, data => {
      
      that.companyLogoImage=data;
      this.createCompanyThumbnail(that.companyLogoImage);
        });
    }
   else
   {
     this.crop_company_image=true;
   } 
   
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
     this.crop_personal_image=true;
     this.edit_personal_image=true;
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
          //that.personalCropper.setImage(image);   
      };
    };

    myReader.readAsDataURL(file);
}
  personalImageCropped(image:any)
  {
   if(this.crop_personal_image)
   {
    let that=this;
    this.personalCropperSettings.croppedWidth = image.width;
   this.personalCropperSettings.croppedHeight = image.height;
   this.resizePersonalImage(this.dataPersonalImage.image, data => {
     
     that.personalImage=data;
     this.createPersonalThumbnail(that.personalImage);
       });
   }
   else
   {
     this.crop_personal_image=true;
   }
  
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
    this.userServiceObj.updateGlobalSettings(this.userId,this.personalImage,this.companyLogoImage,this.user.timezone,
      this.colorBase,this.secondColor,this.thirdColor,this.identity_name,this.headerColor,this.sideBarMenuColor,
      this.buttonColor,this.textColor,this.backgroundColor,this.headerColorOption,this.sideBarMenuColorOption,
      this.buttonColorOption,this.textColorOption,this.backgroundColorOption,this.customColorOptionModal,
      this.contentTitleColor,this.contentTitleColorOption,this.paginationColor,
      this.paginationColorOption,this.modalBackgroundColor,this.modalBackgroundColorOption)
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
      this.settingsCreateMsg="Settings have been updated successfully.";
      this.navCtrl.setRoot(DashboardTabsPage,{notificationMsg:this.settingsCreateMsg.toUpperCase()});
    });
    }
 
  }
}
