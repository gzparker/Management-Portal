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
 * Generated class for the EditAgentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-agent',
  templateUrl: 'edit-agent.html',
})
export class EditAgentPage {
  @ViewChild('agentImageCropper') agentImageCropper : ImageCropperComponent;
  public isApp=false;
  public userLoggedId:boolean=false;
  public mls_id:string="";
  public firstName:string="";
  public lastName:string="";
  public email:string="";
  public password:string="";
  public access_level:string="";
  public phone_mobile:number;
  public agentUpdateMsg:string="";
  public description:string="";
  public cropperSettings;
  public croppedWidth:Number;
  public croppedHeight:Number;
  public dataAgentImage:any;
  public agentImage:string="";
  public agentDetail:any;

  public userId:string="";
  public agent_id:string="";
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
      if(this.navParams.get('agent_id')!=undefined)
      {
       this.agent_id = this.navParams.get('agent_id');
       this.loadAgentDetails();
       }
    });
  }
  loadAgentDetails()
{
  if(this.userId.toString())
  {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 700
    });
    loader.present();
  
    this.userServiceObj.agentDetail(this.agent_id.toString())
  .subscribe((result) => this.loadAgentDetailsResp(result));
  }
  
}
loadAgentDetailsResp(result:any)
{
  //debugger;
  if(result.status==true)
  {
    if(result.result)
    {
      this.agentDetail=result.result;
      this.firstName=this.agentDetail.first_name;
      this.lastName=this.agentDetail.last_name;
      this.email=this.agentDetail.email;
      this.mls_id=this.agentDetail.mls_id;
      this.phone_mobile=this.agentDetail.phone_mobile;
      this.access_level=this.agentDetail.access_level;
      this.password=this.agentDetail.password;
      this.description=this.agentDetail.description;
    }
  }
  else
  {

  }
}
  updateAgent()
  {
    if(this.agent_id!="")
    {
   //debugger;
  this.userServiceObj.updateAgent(this.agent_id,this.firstName,this.lastName,this.email,this.phone_mobile.toString(),this.access_level,
    this.password,this.agentImage,this.description)
    .subscribe((result) => this.updateAgentResp(result));
 
    }
  }
  updateAgentResp(result:any)
  {
    this.agentUpdateMsg="Agent has been updated successfully.";

    this.ngZone.run(() => {
      this.navCtrl.push(ManageAgentsPage,{notificationMsg:this.agentUpdateMsg.toUpperCase()});
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
