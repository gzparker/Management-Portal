import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, 
  MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import {ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';
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
  templateUrl: 'create-agent.html',
})
export class CreateAgentPage {
  @ViewChild('agentImageCropper') agentImageCropper : ImageCropperComponent;
  public isApp=false;
  public userLoggedId:boolean=false;
  public userType:string="1";
  public firstName:string="";
  public lastName:string="";
  public email:string="";
  public password:string="";
  public access_level:string="";
  public phone_mobile:number;
  public agentCreateMsg:string="";
  public description:string="";
  public cropperSettings;
  public croppedWidth:Number;
  public croppedHeight:Number;
  public dataAgentImage:any;
  public agentImage:string="";

  public userId:string="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController,
    private crop: Crop,private camera: Camera,private imagePicker: ImagePicker) {
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

      this.dataAgentImage= {};
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
  // debugger;
  this.userServiceObj.createAgent(this.userId,this.firstName,this.lastName,this.email,this.phone_mobile.toString(),this.access_level,
    this.password,this.agentImage,this.description)
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
  agentImageCropped(bounds : Bounds)
   {
     this.agentImage=this.dataAgentImage.image;
     // this.croppedHeight=bounds.bottom-bounds.top;
    //  this.croppedWidth=bounds.right-bounds.left;
//debugger;
   }
   takePicture(){
    //debugger;
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
        this.agentImageCropper.setImage(image);
        if(this.isApp)
        {
       this.crop
       .crop(this.agentImage, {quality: 75,targetHeight:100,targetWidth:100})
      .then((newImage) => {
     
          //alert(newImage);
          this.agentImage=newImage;
        }, error => {
         
          alert(error)});
        }
      }, function(error) {

        console.log(error);
      });
    }
}
