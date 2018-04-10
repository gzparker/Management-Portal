import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, 
  MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";

import { ManageAgentsPage } from '../manage-agents/manage-agents';

import { AlertController } from 'ionic-angular';
import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';
/**
 * Generated class for the CreateAgentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-agent',
  templateUrl: 'create-agent.html'
})
export class CreateAgentPage {
  @ViewChild('agentCropper', undefined)
  agentCropper:ImageCropperComponent;
  public hideAgentCropper:boolean=true;
  cropperSettings: CropperSettings;
  public isApp=false;
  public userLoggedId:boolean=false;
  public edit_agent_image:boolean=false;
  public crop_agent_image:boolean=false;
  public userType:string="1";
  public firstName:string="";
  public lastName:string="";
  public email:string="";
  public password:string="";
  public mls_id:string="";
  public access_level:string="";
  public phone_mobile:string='';
  public agentCreateMsg:string="";
  public description:string="";
  public cropperWidth:string="";
  public cropperHeight:string="";

  public dataAgentImage:any;
  public agentImage:string="";
  public loader:any;

  public userId:string="";
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
      this.hideAgentCropper=false;
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
    this.dataAgentImage= {};
    this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 5000
      });
  }
  
  ionViewDidLoad() {
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
      
    });
  }
  createAgent()
  {
    if(this.userId!="")
    {
      
  this.userServiceObj.createAgent(this.userId,this.firstName,this.lastName,this.email,this.phone_mobile.toString(),this.access_level,
    this.password,this.agentImage,this.description,this.mls_id)
    .subscribe((result) => this.createAgentResp(result));
 
    }
  }
  createAgentResp(result:any)
  {
    this.agentCreateMsg="Agent has been created successfully.";

    this.ngZone.run(() => {
      this.navCtrl.push(ManageAgentsPage,{notificationMsg:this.agentCreateMsg.toUpperCase()});
    });
  }
  fileChangeListener($event) {
    this.crop_agent_image=true;
    this.edit_agent_image=true;
    this.hideAgentCropper=true;
    var image:any = new Image();
    var file:File = $event.target.files[0];
    var myReader:FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent:any) {
        image.src = loadEvent.target.result;
        image.onload = function () {
          //alert (this.width);
          //debugger;
          that.cropperSettings.croppedWidth = this.width;
          that.cropperSettings.croppedHeight = this.height;
          
          that.agentCropper.setImage(image);  
      };

    };

    myReader.readAsDataURL(file);
}
  agentImageCropped(image:any)
   {
     if(this.crop_agent_image)
     {
      this.cropperSettings.croppedWidth = image.width;
      this.cropperSettings.croppedHeight = image.height;
      let that=this;
        this.resizePersonalImage(this.dataAgentImage.image, data => {
        
          that.agentImage=data;
          this.createPersonalImageThumbnail(that.agentImage);
            });
     }
    else
    {
      this.crop_agent_image=true;
    }
   }
   
   takePicture(){
      let options =
      {
        quality: 100,
        correctOrientation: true
      };
      this.camera.getPicture(options)
      .then((data) => {
        this.agentImage="data:image/jpeg;base64," +data;
        let image : any= new Image();
         image.src = this.agentImage;
       // this.agentImageCropper.setImage(image);
        if(this.isApp)
        {
       this.crop
       .crop(this.agentImage, {quality: 75,targetHeight:100,targetWidth:100})
      .then((newImage) => {
          this.agentImage=newImage;
        }, error => {
         
          alert(error)});
        }
      }, function(error) {

        console.log(error);
      });
    }
    showHideAgentCropper(){
      this.crop_agent_image=false;
      const self = this;
  if(this.edit_agent_image)
  {
    this.hideAgentCropper=true;
    if(this.agentImage!="")
    {
     // this.companyCropperLoaded=true;
      var image:any = new Image();
      image.src = this.agentImage;
              image.onload = function () {
                self.agentCropper.setImage(image); 
              }
   }
    
  }
  else
  {
    this.hideAgentCropper=false;
  }
    }
/////////////////////Generate Thumbnail//////////////////////

createPersonalImageThumbnail(bigMatch:any) {
  let that=this;
  //debugger;
    this.generatePersonalImageFromImage(bigMatch, 500, 500, 0.5, data => {
      
  that.dataAgentImage.image=data;
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
      that.cropperWidth = width.toString();
      that.cropperHeight = height.toString();
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
}
