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
import { WebsitesWebsiteLinksPage } from '../../websites/websites-website-links/websites-website-links';
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
  public hideLogoCropper:boolean=true;
  public hideFavIconCropper:boolean=true;
  public edit_identity_logo:boolean=false;
  public edit_favivon_image:boolean=false;
  public crop_identity_logo:boolean=false;
  public crop_favivon_image:boolean=false;
  public logoCropperSettings;
  public favIconCropperSettings;
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
  public intagent_website:boolean=false;
  public custom_css:string="";
  public show_open_houses:boolean=false;
  public show_new_listings:boolean=false;
  public feature_agent_listings:boolean=false;
  public feature_broker_listings:boolean=false;
  public feature_office_listings:boolean=false;
  public imageChangedEvent: any = '';
  public loader:any;
  public favIconWidth:string="";
  public favIconHeight:string="";
  public logoWidth:string="";
  public logoHeight:string="";
  public website_a_record_location:string="";
  public identity_phone_number:string="";
  public homepage_description:string="";
  public homepageMeta_description:string="";
  public homepage_search_text:string="";
  public homepage_meta_title:string="";
  private CkeditorConfig = {removeButtons:'Underline,Subscript,Superscript,SpecialChar'
  ,toolbar: [
    { name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ 'Source'] },
    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', '-', 'RemoveFormat' ] },
    { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
    { name: 'links', items: [ 'Link', 'Unlink'] },
    { name: 'styles', items: ['Format', 'FontSize' ] }
  ]};

  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController,
    private crop: Crop,private camera: Camera,private imagePicker: ImagePicker) {
      /*if(this.platform.is('core') || this.platform.is('mobileweb') || this.platform.is('cordova') || this.platform.is('mobile')) {
        this.isApp=false;
      }
      else
      {
        this.isApp=true;
      }*/
      this.isApp = (!document.URL.startsWith("http"));
      this.hideFavIconCropper=false;
      this.hideLogoCropper=false;
      this.logoCropperSettings = new CropperSettings();
      this.logoCropperSettings.width = 100;
      this.logoCropperSettings.height = 100;
      this.logoCropperSettings.croppedWidth = 1280;
      this.logoCropperSettings.croppedHeight = 1000;
      this.logoCropperSettings.canvasWidth = 500;
      this.logoCropperSettings.canvasHeight = 300;
      this.logoCropperSettings.minWidth = 10;
      this.logoCropperSettings.minHeight = 10;
  
      this.logoCropperSettings.rounded = false;
      this.logoCropperSettings.keepAspect = false;
  
      this.logoCropperSettings.noFileInput = true;

      this.favIconCropperSettings = new CropperSettings();
      this.favIconCropperSettings.width = 100;
      this.favIconCropperSettings.height = 100;
      this.favIconCropperSettings.croppedWidth = 1280;
      this.favIconCropperSettings.croppedHeight = 1000;
      this.favIconCropperSettings.canvasWidth = 500;
      this.favIconCropperSettings.canvasHeight = 300;
      this.favIconCropperSettings.minWidth = 10;
      this.favIconCropperSettings.minHeight = 10;
  
      this.favIconCropperSettings.rounded = false;
      this.favIconCropperSettings.keepAspect = false;
  
      this.favIconCropperSettings.noFileInput = true;
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
       //debugger;
       this.editWebsite();
       } 
    });
  }
  websiteLogoFileChangeListener($event) {
    this.crop_identity_logo=true;
    this.hideLogoCropper=true;
    this.edit_identity_logo=true;
    var image:any = new Image();
    var file:File = $event.target.files[0];
    var myReader:FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent:any) {
        image.src = loadEvent.target.result;
        image.onload = function () {
          
          that.logoCropperSettings.croppedWidth = this.width;
          that.logoCropperSettings.croppedHeight = this.height;
          
          that.companyLogoCropper.setImage(image);
      };
        //that.companyLogoCropper.setImage(image);
    };
    myReader.readAsDataURL(file);
}
  websiteIdentityImageCropped(image:any)
   {
    if(this.crop_identity_logo)
    {
      this.logoCropperSettings.croppedWidth = image.width;
      this.logoCropperSettings.croppedHeight = image.height;
      let that=this;
      this.resizeLogoImage(this.dataWebsiteLogo.image, data => {
      
        that.identity_logo=data;
        this.createLogoThumbnail(that.identity_logo);
          });
    }
    else
    {
      this.crop_identity_logo=true;
    }
 
   }
   takePicture(){
      let options =
      {
        quality: 100,
        correctOrientation: true,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        targetHeight:100,targetWidth:100,allowEdit:true
      };
      this.camera.getPicture(options)
      .then((data) => {
        var image:any = new Image();
        this.identity_logo="data:image/jpeg;base64," +data;
        var that = this;
        alert(this.identity_logo);
        image.src = this.identity_logo;
          image.onload = function () {
           alert(this.width);
            that.logoCropperSettings.croppedWidth = this.width;
            that.logoCropperSettings.croppedHeight = this.height;
            
            that.createLogoThumbnail(this.identity_logo);
        };
        //this.logoCropperSettings.croppedWidth = this.identity_logo.width;
          //this.logoCropperSettings.croppedHeight = this.identity_logo.height;
      
        /*if(this.isApp)
        {
       this.crop
       .crop(this.identity_logo, {quality: 75,targetHeight:100,targetWidth:100})
      .then((newImage) => {
          this.identity_logo=newImage;
        }, error => {
          alert(error)});
        }*/
      }, function(error) {
        console.log(error);
      });
    }
    websiteFavIconFileChangeListener($event) {
      this.crop_favivon_image=true;
      this.hideFavIconCropper=true;
      this.edit_favivon_image=true;
      var image:any = new Image();
      var file:File = $event.target.files[0];
      var myReader:FileReader = new FileReader();
      var that = this;
      myReader.onloadend = function (loadEvent:any) {
          image.src = loadEvent.target.result;
          image.onload = function () {
           
            that.favIconCropperSettings.croppedWidth = this.width;
            that.favIconCropperSettings.croppedHeight = this.height;
            
            that.favIconLogoCropper.setImage(image);
        };
        
  
      };
  
      myReader.readAsDataURL(file);
  }
    websiteFavIconImageCropped(image:any)
     {
       if(this.crop_favivon_image)
       {
        this.favIconCropperSettings.croppedWidth = image.width;
        this.favIconCropperSettings.croppedHeight = image.height;
        
        let that=this;
        this.resizeFavIconImage(this.dataWebsiteIcon.image, data => {
        
          that.identity_icon=data;
          this.createFavIconThumbnail(that.identity_icon);
            });
       }
      else
      {
        this.crop_favivon_image=true;
      }
     }
    takeFavIconPicture(){
      let options =
      {
        quality: 100,
        correctOrientation: true,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        targetHeight:100,targetWidth:100,allowEdit:true
      };
      this.camera.getPicture(options)
      .then((data) => {
        this.identity_icon="data:image/jpeg;base64," +data;
        this.createFavIconThumbnail(this.identity_icon);
        /*if(this.isApp)
        {
       this.crop
       .crop(this.identity_icon, {quality: 75,targetHeight:100,targetWidth:100})
      .then((newImage) => {
          this.identity_icon=newImage;
        }, error => {
         
          alert(error)});
        }*/
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
      //debugger;
  this.userServiceObj.editWebsite(this.userId.toString(),this.websiteId)
    .subscribe((result) => this.editWebsiteResp(result));
    }
  }
  editWebsiteResp(result:any):void{
 //debugger;
    if(result.status==true)
    {
     // debugger;
this.identity_name=result.result.identity_name;
this.website_a_record_location=result.result.website_a_record_location;
this.identity_phone_number=result.result.identity_phone_number;
this.homepage_description=result.result.homepage_description;
this.homepageMeta_description=result.result.homepage_meta_description;
this.homepage_search_text=result.result.homepage_search_text;
this.homepage_meta_title=result.result.homepage_meta_title;
if(result.result.identity_logo!=undefined)
      {
      
        this.loadLogo(this.sharedServiceObj.imgBucketUrl,result.result.identity_logo);
      }
      if(result.result.identity_icon!=undefined)
      {
      
      // debugger;
      this.loadIcon(this.sharedServiceObj.imgBucketUrl,result.result.identity_icon);
      }
   if(result.result.website.indexOf("http://www")<0 && result.result.website.indexOf("https://www")<0)
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
if(result.result.intagent_website==null||result.result.intagent_website=="0")
{
 this.intagent_website=false;
}
else
{
  this.intagent_website=true;
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
  //alert('here');
   //alert(imageUrl);
    //this.hideLogoCropper=true;
    const self = this;
    var image:any = new Image();
    const xhr = new XMLHttpRequest()
    xhr.open("GET", baseUrl+imageUrl);
    xhr.responseType = "blob";
    xhr.send();
    xhr.addEventListener("load", function() {
        var reader = new FileReader();
        reader.readAsDataURL(xhr.response); 
      // alert('1');
        reader.onloadend = function (loadEvent:any) {
          image.src = loadEvent.target.result;
//alert('2');
//alert(loadEvent.target.result);
          image.onload = function () {
         //alert('yes');
            self.logoCropperSettings.croppedWidth = this.width;
            self.logoCropperSettings.croppedHeight = this.height;
            self.identity_logo=image.src;
            //self.companyLogoCropper.setImage(image);
            self.createLogoThumbnail(image.src);
        };
      };
    });
  }
  loadIcon(baseUrl:string,imageUrl:string) {
    //this.hideFavIconCropper=true;
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
         
          image.onload = function () {
          // debugger;
            self.favIconCropperSettings.croppedWidth = this.width;
            self.favIconCropperSettings.croppedHeight = this.height;
            self.identity_icon=image.src;
            //self.favIconLogoCropper.setImage(image);
            self.createFavIconThumbnail(image.src);
        };
      };
    });
  }
  showHideLogoCropper(){
    const self = this;
    this.crop_identity_logo=false;
if(this.edit_identity_logo)
{
  this.hideLogoCropper=true;
  if(this.identity_logo!="")
  {
   // this.companyCropperLoaded=true;
    var image:any = new Image();
    image.src = this.identity_logo;
            image.onload = function () {
              self.companyLogoCropper.setImage(image); 
            }
 }
  
}
else
{
  this.hideLogoCropper=false;
}
  }
  showHideFavIconCropper(){
    this.crop_favivon_image=false;
    const self = this;
if(this.edit_favivon_image)
{
  this.hideFavIconCropper=true;
  if(this.identity_icon!="")
  {
   // this.companyCropperLoaded=true;
    var image:any = new Image();
    image.src = this.identity_icon;
            image.onload = function () {
              self.favIconLogoCropper.setImage(image); 
            }
 }
  
}
else
{
  this.hideFavIconCropper=false;
}
  }
  /////////////////////Generate Thumbnail//////////////////////
  createLogoThumbnail(bigMatch:any) {
    //alert('in create thumbnail');
    let that=this;
    this.generateLogoFromImage(bigMatch, 500, 500, 0.5, data => {
      this.ngZone.run(() => {
      that.dataWebsiteLogo.image=data;
//alert(that.dataWebsiteLogo.image);
      });
    });
  }
  generateLogoFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
    var canvas: any = document.createElement("canvas");
    var image:any = new Image();
    var self=this;
 //debugger;
    image.src = img;
    image.onload = function () {
        
    //var width = image.width;
      
    // var height = image.height;
     //debugger;
     var width=self.logoCropperSettings.croppedWidth;
     var height=self.logoCropperSettings.croppedHeight;
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
      self.logoWidth = width;
      self.logoHeight = height;
    // debugger;
      var ctx = canvas.getContext("2d");
 
      ctx.drawImage(image, 0, 0, width, height);
 
      // IMPORTANT: 'jpeg' NOT 'jpg'
      var dataUrl = canvas.toDataURL('image/jpeg', quality);
 
      callback(dataUrl)
    }
    
  }
  createFavIconThumbnail(bigMatch:any) {
  let that=this;
  //debugger;
    this.generateFavIconFromImage(bigMatch, 500, 500, 0.5, data => {
      
    //image.onload = function () {
      //var abc="334";
      //debugger;
    //}
   // debugger;
  //this.companyLogoImage=data;
  this.ngZone.run(() => {
  that.dataWebsiteIcon.image=data;
  }
);
  });
}
  generateFavIconFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
    var canvas: any = document.createElement("canvas");
    var image:any = new Image();
    //image.width=this.companyCropperSettings.croppedWidth;
    //image.height=this.companyCropperSettings.croppedHeight;
    var that=this;
 //debugger;
    image.src = img;
    image.onload = function () {
     
      var width=that.favIconCropperSettings.croppedWidth;
      var height=that.favIconCropperSettings.croppedHeight;
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
      that.favIconWidth = width;
      that.favIconHeight = height;
      //debugger;
      var ctx = canvas.getContext("2d");
 
      ctx.drawImage(image, 0, 0, width, height);
 
      // IMPORTANT: 'jpeg' NOT 'jpg'
      var dataUrl = canvas.toDataURL('image/jpeg', quality);
 
      callback(dataUrl)
    }
    
  }
  resizeLogoImage(img:any,callback)
  {
    var canvas: any = document.createElement("canvas");
    var image:any = new Image();
   
    var that=this;

    image.src = img;
    image.onload = function () {
     
      var width=that.logoCropperSettings.croppedWidth;
      var height=that.logoCropperSettings.croppedHeight;
    
      canvas.width = width;
      canvas.height = height;

      var ctx = canvas.getContext("2d");
 
      ctx.drawImage(image, 0, 0, width, height);

      var dataUrl = canvas.toDataURL('image/jpeg', 1);

     callback(dataUrl)
    }
  }
  resizeFavIconImage(img:any,callback)
  {
    var canvas: any = document.createElement("canvas");
    var image:any = new Image();
    //image.width=this.companyCropperSettings.croppedWidth;
    //image.height=this.companyCropperSettings.croppedHeight;
    var that=this;
 //debugger;
    image.src = img;
    image.onload = function () {
     
      var width=that.favIconCropperSettings.croppedWidth;
      var height=that.favIconCropperSettings.croppedHeight;
    
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
  updateWebsite():void{
    let isActiveFinal="1";
    let show_new_listing_dummy="0";
    let show_open_houses_dummy="0";
    let feature_agent_listings_dummy="0";
    let feature_broker_listings_dummy="0";
    let feature_office_listings_dummy="0";
    let intagent_website_dummy="0";
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
       if(this.intagent_website)
       {
        intagent_website_dummy="1";
       }
       if(this.website_domain.indexOf("http://www")<0 && this.website_domain.indexOf("https://www")<0)
{
 // debugger;
  this.website_domain="http://www."+this.website_domain;
}
else
{
 // debugger;
  this.website_domain=this.website_domain;
}
     //  debugger;
  this.userServiceObj.updateWebsite(this.userId,isActiveFinal,this.website_domain,this.websiteId,
    this.contact_email,this.header_wrapper,this.footer_wrapper,intagent_website_dummy,this.custom_css,
    show_new_listing_dummy,show_open_houses_dummy,feature_agent_listings_dummy,
    feature_broker_listings_dummy,feature_office_listings_dummy,this.identity_name,this.identity_logo,
    this.identity_icon,this.website_a_record_location,this.identity_phone_number,this.homepage_description,
    this.homepageMeta_description,this.homepage_search_text,this.homepage_meta_title)
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
  
  homepageDescBlured(quill) {
    //console.log('editor blur!', quill);
  }
 
  homepageDescFocused(quill) {
    //console.log('editor focus!', quill);
  }
 
  homepageDescCreated(quill) {
   // this.editor = quill;
    //console.log('quill is ready! this is current quill instance object', quill);
  }
 
  homepageDescChanged(html) {
//debugger;
this.homepage_description=html;
 
  }
  homepageMetaDescBlured(quill) {
    //console.log('editor blur!', quill);
  }
 
  homepageMetaDescFocused(quill) {
    //console.log('editor focus!', quill);
  }
 
  homepageMetaDescCreated(quill) {
   // this.editor = quill;
    //console.log('quill is ready! this is current quill instance object', quill);
  }
 
  homepageMetaDescChanged(html) {
//debugger;
this.homepageMeta_description=html;
 
  }
}
