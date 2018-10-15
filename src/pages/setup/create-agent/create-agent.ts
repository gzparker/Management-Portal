import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, 
  MenuController,LoadingController,ToastController } from 'ionic-angular';
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
 * Generated class for the CreateAgentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var CKEDITOR: any;
@IonicPage()
@Component({
  selector: 'page-create-agent',
  templateUrl: 'create-agent.html'
})
export class CreateAgentPage {
  /*@ViewChild('agentCropper', undefined)
  agentCropper:ImageCropperComponent;*/
  public hideAgentCropper:boolean=true;
  cropperSettings: CropperSettings;
  public isApp=false;
  public userLoggedId:boolean=false;
  public edit_agent_image:boolean=false;
  public crop_agent_image:boolean=false;
  public isAgentImageExist:boolean=false;
  public userType:string="1";
  public firstName:string="";
  public lastName:string="";
  public email:string="";
  public password:string="";
  public mls_id:string="";
  public access_level:any[]=[];
  public phone_mobile:string='';
  public selectedCountryCode: string = "";
  public selectedCountryAbbv: string = "";
  public allCountryCodes: any[] = [];
  public allRoles:any[]=[];
  public agentCreateMsg:string="";
  public description:string="";
  public cropperWidth:string="";
  public cropperHeight:string="";

  public dataAgentImage:any;
  public agentImage:string="";
  public loader:any;
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
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController,
    private crop: Crop,private camera: Camera,private imagePicker: ImagePicker,private toastCtrl: ToastController) {
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
  createAgent()
  {
    if(this.userId!="")
    {
    //debugger;  
  this.userServiceObj.createAgent(this.userId,this.firstName,this.lastName,this.email,this.selectedCountryCode,this.phone_mobile.toString(),this.access_level,
    this.password,this.agentImage,document.getElementById("description").innerHTML,this.mls_id,this.selectedCountryAbbv)
    .subscribe((result) => this.createAgentResp(result));
 
    }
  }
  createAgentResp(result:any)
  {
    //debugger;
    if(result.status==true)
    {
      this.agentCreateMsg="Agent has been created successfully.";
      CKEDITOR.instances['description'].destroy(true);
      this.ngZone.run(() => {
        this.navCtrl.push(ManageAgentsPage,{notificationMsg:this.agentCreateMsg.toUpperCase()});
      });
    }
    else if(result.status==false)
    {
      this.ngZone.run(() => {
      this.agentCreateMsg=result.message;
      /*let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: this.agentCreateMsg,
        buttons: ['Ok']
      });
      alert.present();*/
      let toast = this.toastCtrl.create({
        message: this.agentCreateMsg,
        duration: 3000,
        position: 'top',
        cssClass:'successToast'
      });
      
      toast.onDidDismiss(() => {
        //console.log('Dismissed toast');
      });
      toast.present();
    });
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
    this.userServiceObj.loadAllRoles(member_id)
    .subscribe((result) => this.getAllRolesResp(result));
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
  getAllCountryCodes(): void {
    let avilableCountryList = this.storage.get('availableCountryList');
    avilableCountryList.then((data) => {
      if (data == null) {

        this.userServiceObj.loadCountryCodes()
          .subscribe((result) => this.getAllCountryCodesResp(result));
      }
      else {

        this.allCountryCodes = data;
        this.setCountryInfo();

      }

    })

  }
  getAllCountryCodesResp(result: any): void {

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
    // debugger;
  }
  editImage(imageType:string){
    var that=this;
   
    //debugger;
    let selectedImageOption={
      mode:"edit",
      croppedWidth:this.cropperSettings.croppedWidth,
      croppedHeight:this.cropperSettings.croppedHeight,
      //websiteWidth:this.personalWidth,
      //websiteHeight:this.personalHeight,
      //datawebsiteImage:this.dataPersonalImage,
      websiteImage:this.agentImage,
      imageType:imageType
    };
    //debugger;
    //document.remo
    //document.getElementById("canvas").remove();
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
//debugger;
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
    this.edit_agent_image=true;
    this.hideAgentCropper=true;
    this.isAgentImageExist=true;
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
          that.agentImage=this.src;
          that.createPersonalImageThumbnail(that.agentImage);
          //that.agentCropper.setImage(image);  
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
   /*showHideAgentCropper(){
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
    }*/
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
