import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, 
  MenuController,LoadingController,ActionSheetController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";
import { PicturePopupPage } from '../../../pages/modal-popup/picture-popup/picture-popup';

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
declare var CKEDITOR: any;
@Component({
  selector: 'page-edit-agent',
  templateUrl: 'edit-agent.html',
})
export class EditAgentPage {
  public hideAgentCropper:boolean=true;
  public isApp=false;
  public edit_agent_image:boolean=false;
  public crop_agent_image:boolean=false;
  public userLoggedId:boolean=false;
  public isAgentImageExist:boolean=false;
  public mls_id:string="";
  public service_id:string="";
  public firstName:string="";
  public lastName:string="";
  public email:string="";
  public password:string="";
  public selectedCountryCode: string = "";
  public selectedCountryAbbv: string = "";
  public access_level:any[]=[];
  public allWebsiteList:any[]=[];
  public selectedWebsite:any[]=[];
  public allMls:any[]=[];
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
  public CkeditorConfig = {removeButtons:'Underline,Subscript,Superscript,SpecialChar'
  ,toolbar: [
    { name: 'document', groups: [], items: ['Source'] },
    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline'] },
    { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
    { name: 'links', items: [] },
    { name: 'styles', items: ['Format', 'FontSize' ] }
  ]};
  public userId:string="";
  public parentId:string="";
  public agent_id:string="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,public actionsheetCtrl: ActionSheetController,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController,
    private crop: Crop,private camera: Camera,private imagePicker: ImagePicker) {
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
    let generalWebsiteSettings = this.storage.get('generalWebsiteSettings');
    generalWebsiteSettings.then((data) => {
      this.service_id=data.service_id;
    });
    this.sharedServiceObj.updateColorThemeMethod(null);
    CKEDITOR.disableAutoInline = true;
    CKEDITOR.inline('description', {removeButtons:'Underline,Subscript,Superscript,SpecialChar'
    ,toolbar: [
      { name: 'document', groups: [], items: ['Source'] },
      { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline'] },
      { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
      { name: 'links', items: [] },
      { name: 'styles', items: ['Format', 'FontSize' ] }
    ]});
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
      let parent_id = this.storage.get('parent_id');
      parent_id.then((data) => {
        this.loadAllAvailableMLS();
        this.getAllWebsite();
        if(data!=null)
        {
      this.parentId=data;
      this.getAllRoles();
        }
        else
        {
          this.getAllRoles();
        }
      });
      if(this.navParams.get('agent_id')!=undefined)
      {
       this.agent_id = this.navParams.get('agent_id');
       this.loadAgentDetails();
       }
       let country_abbv = this.storage.get('country_abbv');
       country_abbv.then((data) => {
         this.selectedCountryAbbv=data;
       });
       let country_code = this.storage.get('country_code');
       country_code.then((data) => {
         this.selectedCountryCode=data;
       });
    });
   
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  loadAllAvailableMLS()
  {
    this.subscriptionObj.loadAllAvailableMLS()
    .subscribe((result) => this.allAvailableMLSResp(result)); 
  }
  allAvailableMLSResp(resp: any)
  {
if(resp.status==true)
{
  this.allMls=resp.available_mls;
}
else
{
  this.allMls=[];
}
  }
  onAgentBreifDescBlured(quill) {
  }
 
  onAgentBreifDescFocused(quill) {
  }
 
  onAgentBreifDescCreated(quill) {
  }
 
  onAgentBreifDescChanged(html) {
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
      if(this.agentDetail.mls_server_id!=null)
          {
            this.mls_id=this.agentDetail.mls_server_id.split(',');
          }
      this.phone_mobile=this.agentDetail.phone_mobile;
      if(this.agentDetail.access_level!=null)
      {
        this.access_level=this.agentDetail.access_level.split(",");
      }
      if(this.agentDetail.website_id!=null)
      {
        this.selectedWebsite=this.agentDetail.website_id.split(",");
      }
      this.password=this.agentDetail.password;
      document.getElementById("description").innerHTML=this.agentDetail.description;
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
getAllWebsite():void{
    
  if(this.userId!="")
  {
    this.loader.present();
this.userServiceObj.allUserWebsites(this.userId.toString())
  .subscribe((result) => this.getAllWebsiteResp(result));
  }
  
}
getAllWebsiteResp(result:any):void{
  this.loader.dismiss();
  if(result.status==true)
  {
    this.allWebsiteList=result.result;
  }
  
}
getAllRoles(){
  let member_id="";
  if(this.parentId!="")
  {
    member_id=this.parentId;
  }
  else
  {
    member_id=this.userId;
  }
  let generalWebsiteSettings = this.storage.get('generalWebsiteSettings');
    generalWebsiteSettings.then((data) => {
  this.userServiceObj.loadAllRoles(member_id,data.service_id)
  .subscribe((result) => this.getAllRolesResp(result));
    });
}
getAllRolesResp(result: any)
{
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
          this.agentImage=image.src;
          if(!self.isApp){
            self.cropperSettings.croppedWidth = this.width;
            self.cropperSettings.croppedHeight = this.height;
            self.createPersonalImageThumbnail(image.src);
          }
           
      };
    };
  });
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
        service_id:"",
        phone_mobile:"",
        access_level:[],
        website_id:[],
        password:"",
        description: "",
        country_abbv: "",
        country_code:"",
        email: ""
      };
  dataObj.service_id=this.service_id;
  dataObj.agent_image=this.agentImage;
  if(this.agentDetail.email!=this.email)
  {
    dataObj.email = this.email;
  }
  if(this.agentDetail.password!=this.password)
  {
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
        dataObj.phone_mobile = this.phone_mobile;
  }
  if(this.agentDetail.mls_id!=this.mls_id)
  {
        dataObj.mls_id = this.mls_id;
  }
  if(this.agentDetail.description!=document.getElementById("description").innerHTML)
  {
        dataObj.description = document.getElementById("description").innerHTML;
  }
  dataObj.access_level=this.access_level;
  dataObj.website_id=this.selectedWebsite;
  dataObj.country_abbv=this.selectedCountryAbbv;
  dataObj.country_code=this.selectedCountryCode;
    this.userServiceObj.updateAgent(this.agent_id,dataObj)
    .subscribe((result) => this.updateAgentResp(result));
    }
  }
  updateAgentResp(result:any)
  {
    this.agentUpdateMsg="Agent has been updated successfully.";
    CKEDITOR.instances['description'].destroy(true);
    this.ngZone.run(() => {
      this.navCtrl.setRoot(ManageAgentsPage,{notificationMsg:this.agentUpdateMsg.toUpperCase()});
    });
  }
  editImage(imageType:string){
    var that=this;
    let selectedImageOption={
      mode:"edit",
      croppedWidth:this.cropperSettings.croppedWidth,
      croppedHeight:this.cropperSettings.croppedHeight,
      websiteImage:this.agentImage,
      imageType:imageType
    };
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
    this.loadEditedImage(imageObject,imageObject.imageType);
  }
  loadEditedImage(imageObject:any,imageType:any)
  {
    const self = this;
   
       if(imageType=="agentImage")
       {
        self.cropperSettings.croppedWidth = imageObject.croppedWidth;
        self.cropperSettings.croppedHeight = imageObject.croppedHeight;
        
       self.resizePersonalImage(imageObject.websiteImage, data => {
        self.agentImage=data;
          self.createPersonalImageThumbnail(self.agentImage);
        });
       }

  }
  fileChangeListener($event) {
    this.crop_agent_image=true;
    this.hideAgentCropper=true;
    this.edit_agent_image=true;
    this.isAgentImageExist=true;
    var image:any = new Image();
    var file:File = $event.target.files[0];
    var myReader:FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent:any) {
        image.src = loadEvent.target.result;
        image.onload = function () {
          that.cropperSettings.croppedWidth = this.width;
          that.cropperSettings.croppedHeight = this.height;
          that.agentImage=this.src;
          that.createPersonalImageThumbnail(that.agentImage);
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
    this.generatePersonalImageFromImage(bigMatch, 500, 500, 0.5, data => {
      
  that.dataAgentImage.image=data;
    });
  }
  generatePersonalImageFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
    var canvas: any = document.createElement("canvas");
    var image:any = new Image();
    var that=this;
    image.src = img;
    image.onload = function () {
     
      var width=that.cropperSettings.croppedWidth;
      var height=that.cropperSettings.croppedHeight;
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
      that.cropperWidth = width.toString();
      that.cropperHeight = height.toString();
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
 openAgentPicture(){
  let actionSheet = this.actionsheetCtrl.create({
    title: 'Option',
    cssClass: 'action-sheets-basic-page',
    buttons: [
      {
        text: 'Take photo',
        icon: 'ios-camera-outline',
        handler: () => {
          this.takeAgentPicture();
        }
      },
      {
        text: 'Choose photo from Gallery',
        icon: 'ios-images-outline',
        handler: () => {
          this.selectAgentPicture();
        }
      }
]
});
actionSheet.present();
}
 takeAgentPicture(){
   let that=this;
    let options =
    {
      allowEdit: true,
    destinationType: that.camera.DestinationType.DATA_URL,
    encodingType: that.camera.EncodingType.JPEG,
    mediaType: that.camera.MediaType.PICTURE,
    sourceType: that.camera.PictureSourceType.CAMERA
    };
    this.camera.getPicture(options)
    .then((data) => {
      this.agentImage="data:image/jpeg;base64," +data;
      if(this.isApp)
      {
     this.crop
     .crop(this.agentImage, {quality: 75,targetHeight:100,targetWidth:100})
    .then((newImage) => {
        this.agentImage=newImage;
      }, error => {
        //alert(error)
      });
      }
    }, function(error) {

      console.log(error);
    });
  }
  selectAgentPicture(){
    let that=this;
     let options =
     {
       allowEdit: true,
     destinationType: that.camera.DestinationType.DATA_URL,
     encodingType: that.camera.EncodingType.JPEG,
     mediaType: that.camera.MediaType.PICTURE,
     sourceType: that.camera.PictureSourceType.SAVEDPHOTOALBUM
     };
     this.camera.getPicture(options)
     .then((data) => {
       this.agentImage="data:image/jpeg;base64," +data;
       if(this.isApp)
       {
      this.crop
      .crop(this.agentImage, {quality: 75,targetHeight:100,targetWidth:100})
     .then((newImage) => {
         this.agentImage=newImage;
       }, error => {
         //alert(error)
       });
       }
     }, function(error) {

       console.log(error);
     });
   }
}
