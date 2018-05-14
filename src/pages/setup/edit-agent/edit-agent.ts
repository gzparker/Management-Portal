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
  public hideAgentCropper:boolean=true;
  public isApp=false;
  public edit_agent_image:boolean=false;
  public crop_agent_image:boolean=false;
  public userLoggedId:boolean=false;
  public mls_id:string="";
  public firstName:string="";
  public lastName:string="";
  public email:string="";
  public password:string="";
  public selectedCountryCode: string = "";
  public selectedCountryAbbv: string = "";
  public access_level:any[]=[];
  public phone_mobile:string="";
  public agentUpdateMsg:string="";
  public description:string="";
  public allRoles:any[]=[];
  public cropperSettings: CropperSettings;

  public dataAgentImage:any;
  public agentImage:string="";
  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  public agentDetail:any;
  public loader:any;
  public cropperWidth:string="";
  public cropperHeight:string="";
  private CkeditorConfig = {uiColor: '#99000',removeButtons:'Underline,Subscript,Superscript,SpecialChar'
  ,toolbar: [
    { name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ 'Source'] },
    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', '-', 'RemoveFormat' ] },
    { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
    { name: 'links', items: [ 'Link', 'Unlink'] },
    { name: 'styles', items: ['Format', 'FontSize' ] }
  ]};
  public userId:string="";
  public agent_id:string="";
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
      if(this.navParams.get('agent_id')!=undefined)
      {
       this.agent_id = this.navParams.get('agent_id');
       this.loadAgentDetails();
       }
       let country_abbv = this.storage.get('country_abbv');
       country_abbv.then((data) => {
         this.selectedCountryAbbv=data;
        // debugger;
       });
       let country_code = this.storage.get('country_code');
       country_code.then((data) => {
         this.selectedCountryCode=data;
        // debugger;
       });
    });
    this.getAllRoles();
  }
  onAgentBreifDescBlured(quill) {
    //console.log('editor blur!', quill);
  }
 
  onAgentBreifDescFocused(quill) {
    //console.log('editor focus!', quill);
  }
 
  onAgentBreifDescCreated(quill) {
   // this.editor = quill;
    //console.log('quill is ready! this is current quill instance object', quill);
  }
 
  onAgentBreifDescChanged(html) {
//debugger;
this.description=html;
 
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
      if(this.agentDetail.access_level!=null)
      {
        this.access_level=this.agentDetail.access_level.split(",");
        //debugger;
      }
      
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
getAllRoles(){
  this.userServiceObj.loadAllRoles()
  .subscribe((result) => this.getAllRolesResp(result));
}
getAllRolesResp(result: any)
{
//  debugger;
  if(result.status==true)
  {
this.allRoles=result.results;
  }
  else
  {
this.allRoles=[];
  }

}
loadImage(baseUrl:string,imageUrl:string) {
  //debugger;
  //this.hideAgentCropper=true;
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
          //alert (this.width);
          //debugger;
          self.cropperSettings.croppedWidth = this.width;
          self.cropperSettings.croppedHeight = this.height;
          this.agentImage=image.src;
          self.createPersonalImageThumbnail(image.src);
          //self.agentCropper.setImage(image);  
      };
        //self.agentCropper.setImage(image);

    };
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
updateAgent()
  {
    if(this.agent_id!="")
    {
      let dataObj = {
        first_name: "",
        agent_image:"",
        last_name: "",
        mls_id:"",
        phone_mobile:"",
        access_level:[],
        password:"",
        description: "",
        country_abbv: "",
        country_code:"",
        email: ""
      };
  dataObj.agent_image=this.agentImage;
  //debugger;
  
  if(this.agentDetail.email!=this.email)
  {
    dataObj.email = this.email;
  }
  if(this.agentDetail.password!=this.password)
  {
   // debugger;
        dataObj.password = this.password;
  } 
  if(this.agentDetail.first_name!=this.firstName)
  {
        dataObj.first_name = this.firstName;
  } 
  if(this.agentDetail.last_name!=this.lastName)
  {
        dataObj.last_name = this.lastName;
  }
  if(this.agentDetail.phone_mobile!=this.phone_mobile.toString().replace(/\D/g, ''))
  {
    //debugger;
        dataObj.phone_mobile = this.phone_mobile;
  }
  if(this.agentDetail.mls_id!=this.mls_id)
  {
        dataObj.mls_id = this.mls_id;
  }
  if(this.agentDetail.description!=this.description)
  {
        dataObj.description = this.description;
  }
  dataObj.access_level=this.access_level;
  dataObj.country_abbv=this.selectedCountryAbbv;
  dataObj.country_code=this.selectedCountryCode;
  //debugger;
    this.userServiceObj.updateAgent(this.agent_id,dataObj)
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
    this.crop_agent_image=true;
    this.hideAgentCropper=true;
    this.edit_agent_image=true;
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
