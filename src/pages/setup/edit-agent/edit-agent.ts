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
  @ViewChild('agentCropper', undefined)
  agentCropper:ImageCropperComponent;

  public isApp=false;
  public userLoggedId:boolean=false;
  public mls_id:string="";
  public firstName:string="";
  public lastName:string="";
  public email:string="";
  public password:string="";
  public access_level:string="";
  public phone_mobile:string="";
  public agentUpdateMsg:string="";
  public description:string="";
  public cropperSettings: CropperSettings;

  public dataAgentImage:any;
  public agentImage:string="";
  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  public agentDetail:any;
  public loader:any;

  public userId:string="";
  public agent_id:string="";
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
    
    this.loader.present();
  
    this.userServiceObj.agentDetail(this.agent_id.toString())
  .subscribe((result) => this.loadAgentDetailsResp(result));
  }
  
}
loadAgentDetailsResp(result:any)
{
  this.loader.dismiss();
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
      if(this.agentDetail.image_url!=undefined)
      {
       
      this.loadImage(this.sharedServiceObj.imgBucketUrl,this.agentDetail.image_url);
      }
      
    }
  }
  else
  {

  }
}
loadImage(baseUrl:string,imageUrl:string) {
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
        self.agentCropper.setImage(image);

    };
  });
}
updateAgent()
  {
    if(this.agent_id!="")
    {
    this.userServiceObj.updateAgent(this.agent_id,this.firstName,this.lastName,this.email,this.phone_mobile.toString(),this.access_level,
    this.password,this.agentImage,this.description,this.mls_id)
    .subscribe((result) => this.updateAgentResp(result));
    }
  }
  updateAgentResp(result:any)
  {
    this.agentUpdateMsg="Agent has been updated successfully.";
//debugger;
    this.ngZone.run(() => {
      this.navCtrl.push(ManageAgentsPage,{notificationMsg:this.agentUpdateMsg.toUpperCase()});
    });
  }
  fileChangeListener($event) {
    var image:any = new Image();
    var file:File = $event.target.files[0];
    var myReader:FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent:any) {
        image.src = loadEvent.target.result;
        that.agentCropper.setImage(image);

    };

    myReader.readAsDataURL(file);
}
  agentImageCropped(image:string)
   {
    this.agentImage = this.dataAgentImage.image;
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
}
