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
        
          this.websiteImage=this.selectedImageOption.websiteImage;

        this.cropperSettings.croppedHeight=this.selectedImageOption.croppedHeight;
         this.cropperSettings.croppedWidth=this.selectedImageOption.croppedWidth;
         this.cropperSettings.width=this.selectedImageOption.croppedWidth;
         this.cropperSettings.height=this.selectedImageOption.croppedHeight;
         //debugger;
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
    ionViewDidEnter()
    {
      this.sharedServiceObj.updateColorThemeMethod(null);
    }
  ionViewDidLoad() {
    //console.log('ionViewDidLoad PicturePopupPage');
    var image:any = new Image();
          var that=this;
          image.src = this.websiteImage;
          image.onload = function () {
  
            //that.cropperSettings.croppedWidth = this.width;
            //that.cropperSettings.croppedHeight = this.height;
            //debugger;
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
     croppedWidth:this.cropperSettings.croppedWidth,
     croppedHeight:this.cropperSettings.croppedHeight,
      websiteImage:this.websiteImage,
      imageType:this.selectedImageOption.imageType,
      isCancel:'no'
    };
   // debugger;
    return websiteImageObj;
  }
  saveImage()
  {
    let websiteImageObj=this.getFinalImage();
  //  debugger;
    this.viewCtrl.dismiss(websiteImageObj);
  }

  websiteImageCropped(image:any)
  {
    //debugger;
    //if(this.crop_website_image)
    //{
      this.cropperSettings.croppedWidth = image.width;
      this.cropperSettings.croppedHeight = image.height;
   //debugger;
    let that=this;
    that.websiteImage=this.datawebsiteImage.image;
      
    //}
    //else
    //{
     // this.crop_website_image=true;
    //}
    
  }
  
}
