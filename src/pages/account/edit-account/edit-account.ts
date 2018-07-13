import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";
import { GlobalPreferencesPage } from '../../setup/global-preferences/global-preferences';
import 'moment';
import * as moment from 'moment-timezone';
import { AccountInfoPage } from '../account-info/account-info';
import { AlertController } from 'ionic-angular';
import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';

/**
 * Generated class for the EditAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-account',
  templateUrl: 'edit-account.html',
})
export class EditAccountPage {
  @ViewChild('personalCropper', undefined)
  personalCropper:ImageCropperComponent;
  public hideImageCropper:boolean=true;
  public edit_personal_logo:boolean=false;
  public crop_personal_image:boolean=false;
  public isApp=false;
  public cropperSettings;
  public croppedWidth:Number;
  public croppedHeight:Number;
  public userId:string="";
  public accountInfo:any=null;
  public globalSettings:any=null;
  public email: string = "";
 
  public passwordUpdated: string = "";
  
  public first_name: string = "";
  
  public last_name: string = "";
  public company:string="";
  
  public phone_number: number;
  public selectedCountryCode: string = "";
  public selectedCountryAbbv: string = "";
  public user_description:string="";
  public allCountryCodes: any[] = [];
  public accountInfoUpdateMsg: string = "";
  public updatedValue:boolean=false;
  public personalWidth:string="";
  public personalHeight:string="";
  public office_id:string="";
  public broker_id:string="";
  public agent_id:string="";
  public isGlobalPreference:boolean=false;
  public isOwner:boolean=false;
  public parentId:string="";
  public loader:any;

  public dataPersonalImage:any;
  public personalImage:string="";

  public imgBaseUrl=this.sharedServiceObj.imgBucketUrl;
  public noImgUrl=this.sharedServiceObj.noImageUrl;
  private CkeditorConfig = {uiColor: '#99000',removeButtons:'Underline,Subscript,Superscript,SpecialChar'
  ,toolbar: [
    { name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ 'Source'] },
    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', '-', 'RemoveFormat' ] },
    { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
    { name: 'links', items: [ 'Link', 'Unlink'] },
    { name: 'styles', items: ['Format', 'FontSize' ] }
  ]};
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform,
    public loadingCtrl: LoadingController,private crop: Crop,private camera: Camera,private imagePicker: ImagePicker) {
      //debugger;
      this.hideImageCropper=false;
      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 5000
      });
      /*if(this.platform.is('core') || this.platform.is('mobileweb') || this.platform.is('cordova') || this.platform.is('mobile')) {
        this.isApp=false;
      }
      else
      {
        this.isApp=true;
      }*/
      this.isApp = (!document.URL.startsWith("http"));
      this.cropperSettings = new CropperSettings();
      this.cropperSettings.width = 100;
      this.cropperSettings.height = 100;
      this.cropperSettings.croppedWidth = 1280;
      this.cropperSettings.croppedHeight = 1000;
      this.cropperSettings.canvasWidth = 500;
      this.cropperSettings.canvasHeight = 300;
      this.cropperSettings.minWidth = 10;
        this.cropperSettings.minHeight = 10;
  
        this.cropperSettings.rounded = false;
        this.cropperSettings.keepAspect = false;
  
      this.cropperSettings.noFileInput = true;
        this.dataPersonalImage={};
  }

  ionViewDidLoad() {
    let member_id = this.storage.get('userId');
   // debugger;
    member_id.then((data) => {
      this.userId=data;
      this.viewAccount();
      this.getAllCountryCodes();
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
      this.isGlobalPreference=false;
     
    let allowed_access_options = this.storage.get('allowed_access_options');
    allowed_access_options.then((data) => {
      if(data!=null)
      {
        if(data!=false)
        {
        let savedAccessLevels:any[]=data;
      
    let globalPreferenceAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="global-preference");
    });
    if(globalPreferenceAccesLevels.length>0)
      {
        this.isGlobalPreference=true;
      }
      else
      {
        this.isGlobalPreference=false;
      }
     
    
    }
      }
    });
  }
  else
  {
    //debugger;
    this.isGlobalPreference=true;
  
  }
  }
  viewAccount():void{
    if(this.userId!="")
    {
     this.loader.present();
  this.userServiceObj.userInfo(this.userId.toString())
    .subscribe((result) => this.accountInfoResp(result));
    }
    
  }
 
  accountInfoResp(result:any):void{
    if(result.status==true)
    {
    // debugger;
     this.accountInfo=result.result;
     this.globalSettings=result.globalSettings;
     //debugger;
     if(this.globalSettings!=null)
     {
       //debugger;
      if(this.globalSettings.photo_personal!=undefined)
      { 
        this.loadPersonalImage(this.sharedServiceObj.imgBucketUrl,this.globalSettings.photo_personal);
      }
     }
    // debugger;
     this.first_name=this.accountInfo.first_name;
     this.last_name=this.accountInfo.last_name;
     this.company=this.accountInfo.company;
     //debugger;
     this.user_description=this.accountInfo.description;
     this.email=this.accountInfo.email;
     this.broker_id=this.accountInfo.broker_id;
     this.agent_id=this.accountInfo.agent_id;
     this.office_id=this.accountInfo.office_id;
   // debugger;
     this.passwordUpdated=this.accountInfo.password;
     this.phone_number=this.accountInfo.phone_mobile;
     this.selectedCountryAbbv=this.accountInfo.country_abbv;
    }
    
  }
  userDescBlured(quill) {
    //console.log('editor blur!', quill);
  }
 
  userDescFocused(quill) {
    //console.log('editor focus!', quill);
  }
 
  userDescCreated(quill) {
   // this.editor = quill;
    //console.log('quill is ready! this is current quill instance object', quill);
  }
 
  userDescChanged(html) {
//debugger;
this.user_description=html;
 
  }
  loadPersonalImage(baseUrl:string,imageUrl:string) {
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
         // self.hideImageCropper=true;
          image.src = loadEvent.target.result;
          image.onload = function () {
            //alert (this.width);
            //debugger;
            self.cropperSettings.croppedWidth = this.width;
            self.cropperSettings.croppedHeight = this.height;
            self.personalImage=image.src;
            //debugger;
            //self.personalCropper.setImage(image);
            self.createPersonalImageThumbnail(image.src);
        };
          // 
  
      };
    });
  }
  personalFileChangeListener($event) {
    this.crop_personal_image=true;
    this.edit_personal_logo=true;
    this.hideImageCropper=true;
    var image:any = new Image();
    var file:File = $event.target.files[0];
    var myReader:FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent:any) {
        image.src = loadEvent.target.result;
        image.onload = function () {

          that.cropperSettings.croppedWidth = this.width;
          that.cropperSettings.croppedHeight = this.height;
          
          that.personalCropper.setImage(image);  
      };
    };
    myReader.readAsDataURL(file);
}
  personalImageCropped(image:any)
  {
    if(this.crop_personal_image)
    {
      this.cropperSettings.croppedWidth = image.width;
      this.cropperSettings.croppedHeight = image.height;
   
    let that=this;
      this.resizePersonalImage(this.dataPersonalImage.image, data => {
        that.personalImage=data;
        this.createPersonalImageThumbnail(that.personalImage);
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
  getAllCountryCodes(): void {


    let avilableCountryList = this.storage.get('availableCountryList');
    avilableCountryList.then((data) => {
      if (data == null) {

        this.userServiceObj.loadCountryCodes()
          .subscribe((result) => this.getAllCountryCodesResp(result));
      }
      else {
        this.loader.dismiss();
        this.allCountryCodes = data;
        this.setCountryInfo();

      }

    })

  }
  getAllCountryCodesResp(result: any): void {
    this.loader.dismiss();
      //debugger;
    let countryCodesDummy = [];
    if (result.status == true) {

      this.allCountryCodes = result.countryArray;
      this.setCountryInfo();
    }

  }
  setCountryInfo() {

    this.selectedCountryAbbv = "US";
    let countryGeoInfo = this.storage.get("userCountryInfo");
    countryGeoInfo.then((data) => {
     // debugger;
      if (data == null) {

        this.selectedCountryAbbv = "US";
        this.setCountryCode();
      }
      else {

        this.selectedCountryAbbv = data.countryCode;
        this.setCountryCode();
      }

    });

    
  }
 setCountryCode()
  {
    let foundCountry = this.allCountryCodes.filter(
      country => country.country_abbv === this.selectedCountryAbbv);
    this.selectedCountryCode = foundCountry[0].country_code;
  }
  onCountryCodeSelection($event: any): void {
    let selectedCountryCodeData: any;
   
    selectedCountryCodeData = this.allCountryCodes.filter(item => item.country_abbv == $event);
    this.selectedCountryAbbv = selectedCountryCodeData[0].country_abbv;
    this.selectedCountryCode = selectedCountryCodeData[0].country_code;

  }
  checkFormStatus()
  {
    this.updatedValue=false;
   if(this.accountInfo!=null)
   {
     //debugger;
    if(this.accountInfo.email!=this.email)
{
 this.updatedValue=true;
  
}
if(this.accountInfo.password!=this.passwordUpdated)
{
  this.updatedValue=true;
   
} 
if(this.accountInfo.first_name!=this.first_name)
{
 this.updatedValue=true;
}  
if(this.accountInfo.last_name!=this.last_name)
{
  this.updatedValue=true;
   
} 
if(this.accountInfo.company!=this.company)
{
  this.updatedValue=true;
   
} 
if(this.accountInfo.country_code!=this.selectedCountryCode)
{
  this.updatedValue=true;
     
}
if(this.accountInfo.country_abbv!=this.selectedCountryAbbv)
{
  this.updatedValue=true;
    
}
if(this.accountInfo.country_abbv!=this.selectedCountryAbbv)
{
 this.updatedValue=true;
  
}
if(this.accountInfo.phone_mobile!=this.phone_number)
{
  this.updatedValue=true;
   
}
if(this.accountInfo.agent_id!=this.agent_id)
{
this.updatedValue=true;
}
if(this.accountInfo.office_id!=this.office_id)
{
this.updatedValue=true;
}
if(this.accountInfo.broker_id!=this.broker_id)
{
this.updatedValue=true;
}
   }
  }
  showHidePersonLogoCropper(){
    const self = this;
    this.crop_personal_image=false;
if(this.edit_personal_logo)
{
  this.hideImageCropper=true;
  if(this.personalImage!="")
  {
   // this.companyCropperLoaded=true;
    var image:any = new Image();
    image.src = this.personalImage;
            image.onload = function () {
              self.personalCropper.setImage(image); 
            }
 }
  //this.crop_personal_image=false;
}
else
{
  //this.crop_personal_image=false;
  this.hideImageCropper=false;
}
  }
  moveGlobalSettings()
  {
    this.navCtrl.push(GlobalPreferencesPage);
  }
  /////////////////////Generate Thumbnail//////////////////////

  createPersonalImageThumbnail(bigMatch:any) {
  let that=this;
  //debugger;
    this.generatePersonalImageFromImage(bigMatch, 500, 500, 0.5, data => {
      
  that.dataPersonalImage.image=data;
    });
  }
  generatePersonalImageFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
    var canvas: any = document.createElement("canvas");
    var image:any = new Image();
    //image.width=this.companyCropperSettings.croppedWidth;
    //image.height=this.companyCropperSettings.croppedHeight;
    var that=this;
 //debugger;
    image.src = img;
    image.onload = function () {
     
      var width=that.cropperSettings.croppedWidth;
      var height=that.cropperSettings.croppedHeight;
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
      that.personalWidth = width;
      that.personalHeight = height;
      //debugger;
      var ctx = canvas.getContext("2d");
 
      ctx.drawImage(image, 0, 0, width, height);
 
      // IMPORTANT: 'jpeg' NOT 'jpg'
      var dataUrl = canvas.toDataURL('image/jpeg', quality);
 
      callback(dataUrl)
    }
    
  }
  resizePersonalImage(img:any,callback)
  {
    var canvas: any = document.createElement("canvas");
    var image:any = new Image();
   
    var that=this;

    image.src = img;
    image.onload = function () {
     
      var width=that.cropperSettings.croppedWidth;
      var height=that.cropperSettings.croppedHeight;
    
      canvas.width = width;
      canvas.height = height;

      var ctx = canvas.getContext("2d");
 
      ctx.drawImage(image, 0, 0, width, height);

      var dataUrl = canvas.toDataURL('image/jpeg', 1);

     callback(dataUrl)
    }
  }
  
 ////////////////////////////////////////////////////////////////////////
  updateAccount():void{
    let dataObj = {
      first_name: "",
      photo_personal:"",
      last_name: "",
      description:"",
      company:"",
      office_id:"",
      agent_id:"",
      broker_id:"",
      country_code: "",
      country_abbv: "",
      phone_number: "",
      email: "",
      password: "",
      timezone:""
    
    };
dataObj.photo_personal=this.personalImage;
//debugger;
if(this.accountInfo.email!=this.email)
{
  dataObj.email = this.email;
}
if(this.accountInfo.password!=this.passwordUpdated)
{
 // debugger;
      dataObj.password = this.passwordUpdated;
} 
if(this.accountInfo.first_name!=this.first_name)
{
      dataObj.first_name = this.first_name;
} 
if(this.accountInfo.last_name!=this.last_name)
{
      dataObj.last_name = this.last_name;
}
if(this.accountInfo.description!=this.user_description)
{
      dataObj.description = this.user_description;
}
if(this.accountInfo.company!=this.company)
{
      dataObj.company = this.company;
}
if(this.accountInfo.country_code!=this.selectedCountryCode)
{
      dataObj.country_code = this.selectedCountryCode;
}
if(this.accountInfo.country_abbv!=this.selectedCountryAbbv)
{
      dataObj.country_abbv = this.selectedCountryAbbv;
}
if(this.accountInfo.agent_id!=this.agent_id)
{
  dataObj.agent_id = this.agent_id;
}
if(this.accountInfo.office_id!=this.office_id)
{
  dataObj.office_id = this.office_id;
}
if(this.accountInfo.broker_id!=this.broker_id)
{
  dataObj.broker_id = this.broker_id;
}
if(this.accountInfo.phone_mobile!=this.phone_number)
{
      dataObj.phone_number = this.phone_number.toString();
}
//debugger;
//this.loader.present();
    this.userServiceObj.updateAccount(this.userId,dataObj)
    .subscribe((result) => this.updatAccountResp(result));
  }
  updatAccountResp(result:any):void{
   //this.loader.dismiss();
    if(result.status==true)
    {
//debugger;
     this.ngZone.run(() => {
  this.navCtrl.push(AccountInfoPage,{notificationMsg:"Account has been updated successfully."})
    });
    }
  else
  {
   // debugger;
    //this.accountInfoUpdateMsg=result.message;
    let alert = this.alertCtrl.create({
      title: 'Notification',
      subTitle: result.message,
      buttons: ['Ok']
    });
    alert.present();
  }
  }

}
