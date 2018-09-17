import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, MenuController,LoadingController, ViewController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";
import { GlobalPreferencesPage } from '../../setup/global-preferences/global-preferences';
import 'moment';
import * as moment from 'moment-timezone';
import { AlertController,ToastController } from 'ionic-angular';
import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';
/**
 * Generated class for the PicturePopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-picture-popup',
  templateUrl: 'picture-popup.html',
})
export class PicturePopupPage {
  @ViewChild('websiteCropper', undefined)
  websiteCropper:ImageCropperComponent;
  public edit_website_logo:boolean=false;
  public crop_website_image:boolean=false;
  public hideImageCropper:boolean=true;
  public cropperSettings;
  public croppedWidth:Number;
  public croppedHeight:Number;
  public websiteWidth:string="";
  public websiteHeight:string="";
  public datawebsiteImage:any;
  public websiteImage:string="";

  public croppedWidthOld:Number;
  public croppedHeightOld:Number;
  public websiteWidthOld:string="";
  public websiteHeightOld:string="";
  public datawebsiteImageOld:any;
  public websiteImageOld:string="";

  public selectedImageOption:any;
  public imgBaseUrl=this.sharedServiceObj.imgBucketUrl;
  public noImgUrl=this.sharedServiceObj.noImageUrl;
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform,
    public loadingCtrl: LoadingController,private crop: Crop,private camera: Camera,
    private imagePicker: ImagePicker,private toastCtrl: ToastController, 
    public subscriptionObj: SubscriptionProvider,public viewCtrl: ViewController) {
      this.hideImageCropper=false;
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
        this.datawebsiteImage={};
        if(this.navParams.get('selectedImageOption')!=undefined)
        {
          this.selectedImageOption=this.navParams.get('selectedImageOption');
          this.croppedWidth=this.selectedImageOption.croppedWidth;
          this.croppedHeight=this.selectedImageOption.croppedHeight;
          this.websiteWidth=this.selectedImageOption.websiteWidth;
          this.websiteHeight=this.selectedImageOption.websiteHeight;
          this.datawebsiteImage=this.selectedImageOption.datawebsiteImage;
          this.websiteImage=this.selectedImageOption.websiteImage;

          //this.croppedHeightOld=this.selectedImageOption.croppedHeight;
          //this.croppedWidthOld=this.selectedImageOption.croppedWidth;
          //this.websiteWidthOld=this.selectedImageOption.websiteWidth;
          //this.websiteHeightOld=this.selectedImageOption.websiteHeight;
          //this.datawebsiteImageOld=this.selectedImageOption.datawebsiteImage;
          //this.websiteImageOld=this.selectedImageOption.websiteImage;
          
//debugger;
          //this.websiteCropper.setImage(this.websiteImage);
          //this.imageType=this.selectedImageOption.imageType;
         /* if(this.selectedImageOption)
          {
            if(this.selectedImageOption.mode=="edit")
            {
              this.loadwebsiteImage(this.sharedServiceObj.imgBucketUrl,this.selectedImageOption.imageUrl);
            }
          }*/
          //this.loadwebsiteImage(this.sharedServiceObj.imgBucketUrl)
       // debugger;
        }
    }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad PicturePopupPage');
    var image:any = new Image();
          var that=this;
          image.src = this.websiteImage;
          image.onload = function () {
  
            that.cropperSettings.croppedWidth = this.width;
            that.cropperSettings.croppedHeight = this.height;
            //that.createPersonalImageThumbnail(image.src);
            that.websiteCropper.setImage(image);  
        };
  }
  ionViewDid() {
  }
  closePopUp()
  {
   // debugger;
    /*else
    {
      this.selectColor.
    }*/
   // debugger;
    /*selectedColor={
      option:this.option,
      selectedColorOption:this.selectedColorOption,
      selectedColor:this.customColor
    }*/
    //let selectedColor=this.selectedColorMethod();
    //let websiteImageObj=this.getFinalImage();
    
    let websiteOldImageObj={
      isCancel:'yes'
    };
    this.viewCtrl.dismiss();
  }
  getFinalImage(){
    //debugger;
    let websiteImageObj={
      croppedWidth:this.croppedWidth,
      croppedHeight:this.croppedHeight,
      websiteWidth:this.websiteWidth,
      websiteHeight:this.websiteHeight,
      datawebsiteImage:this.datawebsiteImage,
      websiteImage:this.websiteImage,
      imageType:this.selectedImageOption.imageType,
      isCancel:'no'
    };
    return websiteImageObj;
  }
  saveImage()
  {
    let websiteImageObj=this.getFinalImage();
    debugger;
    this.viewCtrl.dismiss(websiteImageObj);
  }
  loadwebsiteImage(baseUrl:string,imageUrl:string) {
   
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
            self.websiteImage=image.src;
            //debugger;
            //self.websiteCropper.setImage(image);
            self.createwebsiteImageThumbnail(image.src);
        };
          // 
  
      };
    });
  }
  websiteFileChangeListener($event) {
    this.crop_website_image=true;
    this.edit_website_logo=true;
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
          
          that.websiteCropper.setImage(image);  
      };
    };
    myReader.readAsDataURL(file);
}
  websiteImageCropped(image:any)
  {
    if(this.crop_website_image)
    {
      this.cropperSettings.croppedWidth = image.width;
      this.cropperSettings.croppedHeight = image.height;
   
    let that=this;
      this.resizewebsiteImage(this.datawebsiteImage.image, data => {
        that.websiteImage=data;
        this.createwebsiteImageThumbnail(that.websiteImage);
          });
    }
    else
    {
      this.crop_website_image=true;
    }
    
  }
  /////////////////////Generate Thumbnail//////////////////////

  createwebsiteImageThumbnail(bigMatch:any) {
    let that=this;
    //debugger;
      this.generatewebsiteImageFromImage(bigMatch, 500, 500, 0.5, data => {
        
    that.datawebsiteImage.image=data;
      });
    }
    generatewebsiteImageFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
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
        that.websiteWidth = width;
        that.websiteHeight = height;
        //debugger;
        var ctx = canvas.getContext("2d");
   
        ctx.drawImage(image, 0, 0, width, height);
   
        // IMPORTANT: 'jpeg' NOT 'jpg'
        var dataUrl = canvas.toDataURL('image/jpeg', quality);
   
        callback(dataUrl)
      }
      
    }
    resizewebsiteImage(img:any,callback)
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
}
