import { Component, ViewChild, NgZone,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
  MenuController,LoadingController,ActionSheetController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../../dashboard/dashboard';
import { FbConfirmPage } from '../../fb-confirm/fb-confirm';
import { IMultiSelectOption,IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { BrMaskerIonic3, BrMaskModel } from 'brmasker-ionic-3';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";

import { Observable } from 'rxjs/Observable';
import { PicturePopupPage } from '../../../pages/modal-popup/picture-popup/picture-popup';
import { AllLeadsPage } from '../../leads/all-leads/all-leads';

import { AlertController } from 'ionic-angular';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';

/**
 * Generated class for the CreateLeadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google: any;
declare var firebase:any;
@Component({
  selector: 'page-create-lead',
  templateUrl: 'create-lead.html',
  providers:[BrMaskerIonic3]
})
export class CreateLeadPage {
  @ViewChild('searchHomeBar', { read: ElementRef }) searchHomeBar: ElementRef;
  addressHomeElement: HTMLInputElement = null;
  @ViewChild('searchWorkBar', { read: ElementRef }) searchWorkBar: ElementRef;
  addressWorkElement: HTMLInputElement = null;
  public isApp=false;
  public isWebBrowser=false;
  public userLoggedId:boolean=false;
  public isLeadImageExist=false;
  public userType:string="1";
  public firstName:string="";
  public lastName:string="";
  public email:string="";
  public website:string="";
  public password:string="";
  public mobileNumber:number;
  public officeNumber:number;
  public homeNumber:number;
  public home_address_street:string='';
  public home_address_city:string="";
  public home_address_state_or_province:string="";
  public home_address_zipcode:string="";
  public work_address_street:string="";
  public work_address_city:string="";
  public work_address_state_or_province:string="";
  public work_zipcode:string="";
  public assigned_agent_id:string="";
  public category:string="";
  public internal_notes:string="";
  public leadCreateMsg:string="";
  public domainAccess:any;
  public allWebsiteList:any[]=[];
  public allAgents:any[]=[];
  public selectedWebsite:string="";
  public userId:string="";
  public loader:any;
  public home_lat_lng:string="";
  public home_address:string="";
  public home_google_place_id:string="";
  public work_lat_lng:string="";
  public work_address:string="";
  public work_google_place_id:string="";
  public hideLeadCropper:boolean=true;
  public edit_lead_image:boolean=false;
  public crop_lead_image:boolean=false;
  public leadCropperSettings;
  public croppedWidth:Number;
  public croppedHeight:Number;
  public dataLeadImage:any;
  public leadWidth:string="";
  public leadHeight:string="";
  public leadImage:string="";
  public service_id:string="";
  public websiteBackgroundInfo:any;
  public geoLocationOptions = {
    types: ['(cities)'],
    componentRestrictions: {country: "us"}
   };
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,public actionsheetCtrl: ActionSheetController,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,private crop: Crop,public brMaskerIonic3: BrMaskerIonic3,
    private camera: Camera,private imagePicker: ImagePicker,public loadingCtrl: LoadingController) {
      this.isApp = (!document.URL.startsWith("http"));
      
      this.hideLeadCropper=false;
      if(this.platform.is('core')) {
        this.isWebBrowser=true;
      }
      this.leadCropperSettings = new CropperSettings();
      this.leadCropperSettings.width = 100;
      this.leadCropperSettings.height = 100;
      this.leadCropperSettings.croppedWidth = 1280;
      this.leadCropperSettings.croppedHeight = 1000;
      this.leadCropperSettings.canvasWidth = 500;
      this.leadCropperSettings.canvasHeight = 300;
      this.leadCropperSettings.minWidth = 10;
      this.leadCropperSettings.minHeight = 10;
  
      this.leadCropperSettings.rounded = false;
      this.leadCropperSettings.keepAspect = false;
  
      this.leadCropperSettings.noFileInput = true;

      this.dataLeadImage= {};
      
      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 5000
      });
  }

  ionViewDidLoad() {
    this.sharedServiceObj.updateColorThemeMethod(null);
  let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
      this.getAllWebsite();
      this.loadAllAgents();
      this.initHomeAutocomplete();
      this.initWorkAutocomplete();
    });
    let generalWebsiteSettings = this.storage.get('generalWebsiteSettings');
        generalWebsiteSettings.then((data) => {
          this.service_id=data.service_id;
        });
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
    this.loadGeneralWebsiteSettings();
  }
  loadGeneralWebsiteSettings()
  {
    //debugger;
    var that=this;
    let serviceInfo=this.storage.get("generalWebsiteSettings");
    serviceInfo.then((result)=>
{
  //debugger;
  that.websiteBackgroundInfo=result;

});
//debugger;
  }
  loadAllAgents()
    {
      if(this.userId.toString())
      {
       // debugger;
    
        this.userServiceObj.viewMemberAgents(this.userId.toString(),this.service_id)
      .subscribe((result) => this.loadAllAgentsResp(result));
        
      }
      
    }
    loadAllAgentsResp(result:any)
    {
    // debugger;
      if(result.status==true)
      {
        this.allAgents=result.results; 
      }
      else
      {
        this.allAgents=[];
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
     // debugger;
      this.allWebsiteList=result.result;
      
    }
    
  }
  onWebsiteSelection($event:any):void{
     this.selectedWebsite=$event;
  }
  initHomeAutocomplete(): void {
   
    this.addressHomeElement = this.searchHomeBar.nativeElement.querySelector('.searchbar-input');
    this.createHomeAutocomplete(this.addressHomeElement).subscribe((location) => {
    //debugger;  
    });
  }

  createHomeAutocomplete(addressEl: HTMLInputElement): Observable<any> {
    
    const autocomplete = new google.maps.places.Autocomplete(addressEl,this.geoLocationOptions);
    
    return new Observable((sub: any) => {
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          sub.error({
            message: 'Autocomplete returned place with no geometry'
          });
        } else {
          //debugger;
          sub.next(place.geometry.location);
          this.getHomeAddress(place);
          
        }
      });
    });
  }
  getHomeAddress(data) {
    this.home_address=data.formatted_address;
    this.home_lat_lng=data.geometry.location.lat().toString()+","+data.geometry.location.lng().toString();
    this.home_google_place_id=data.place_id;
     }
     initWorkAutocomplete(): void {
   
      this.addressWorkElement = this.searchWorkBar.nativeElement.querySelector('.searchbar-input');
      this.createWorkAutocomplete(this.addressWorkElement).subscribe((location) => {
        
      });
    }
    createWorkAutocomplete(addressEl: HTMLInputElement): Observable<any> {
      const autocomplete = new google.maps.places.Autocomplete(addressEl,this.geoLocationOptions);
      
      return new Observable((sub: any) => {
        google.maps.event.addListener(autocomplete, 'place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place.geometry) {
            sub.error({
              message: 'Autocomplete returned place with no geometry'
            });
          } else {
            
            sub.next(place.geometry.location);
            this.getWorkAddress(place);
            
          }
        });
      });
    }
    getWorkAddress(data) {
     // debugger;
      this.work_address=data.formatted_address;
      this.work_lat_lng=data.geometry.location.lat().toString()+","+data.geometry.location.lng().toString();
      this.work_google_place_id=data.place_id;
      //this.selectedLong=data.geometry.location.lng();
      
       }
  createLead():void{
    //this.domainAccess=this.localStorageService.get('domainAccess');
    if(this.userId!="")
    {
    //  this.loader.present();
    //debugger;
  this.userServiceObj.createLead(this.userId.toString(),this.selectedWebsite,this.email,
  this.password,this.firstName,this.lastName,
  this.officeNumber,this.mobileNumber,this.homeNumber,this.home_address_street,this.home_address_city,
  this.home_address_state_or_province,this.home_address_zipcode,
  this.work_address_street,this.work_address_city,this.work_address_state_or_province,this.work_zipcode,
this.assigned_agent_id,this.category,this.internal_notes,this.home_address,
this.home_lat_lng,this.home_google_place_id,this.work_address,this.work_lat_lng,this.work_google_place_id,
this.leadImage,this.service_id)
    .subscribe((result) => this.createLeadResp(result));
 
    }
  }
  createLeadResp(result:any):void{
    //this.loader.dismiss();
    if(result.status)
    {
      this.leadCreateMsg="Lead has been created successfully.";
      //debugger;
      this.sharedServiceObj.sendNotification(this.userId.toString(),"New Lead",this.leadCreateMsg,this.service_id,
      this.websiteBackgroundInfo.brand_image_url,"member",'lead',"email,push","new_lead").
      subscribe((result) => this.sendNotificationResp(result));
      //debugger;
      let leadInfo=result.leadInfo;
      this.createFirebaseLead(leadInfo.email,leadInfo.password,
        leadInfo.lead_id,leadInfo.first_name,leadInfo.last_name,
        leadInfo.image_url,"0","0","1",leadInfo.user_website_id,this.leadCreateMsg.toUpperCase(),leadInfo);
    }
  }
  sendNotificationResp(result:any)
  {
   //debugger;
    if(result.status)
{
  //debugger;
}
  }
  createFirebaseLead(email:string,password:string,webUserId:string,first_name:string,last_name:string,
    image_url:string,parent_id:string,is_submember:string,is_lead:string,website_id:string,leadCreationResp:string,leadInfo:any)
  {

let that=this;

that.userServiceObj.setFireBaseInfo(email,password,webUserId,first_name,last_name,
  image_url,parent_id,is_submember,is_lead,website_id,this.service_id);
     this.ngZone.run(() => {
       this.navCtrl.push(AllLeadsPage,{notificationMsg:this.leadCreateMsg.toUpperCase()});
       });
  }
  editImage(imageType:string){
    var that=this;
    let selectedImageOption={
      mode:"edit",
      croppedWidth:this.leadCropperSettings.croppedWidth,
      croppedHeight:this.leadCropperSettings.croppedHeight,
      websiteImage:this.leadImage,
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
   
       if(imageType=="leadImage")
       {
        self.leadCropperSettings.croppedWidth = imageObject.croppedWidth;
        self.leadCropperSettings.croppedHeight = imageObject.croppedHeight;
        
       self.resizeLeadImage(imageObject.websiteImage, data => {
        self.leadImage=data;
          self.createLeadImageThumbnail(self.leadImage);
        });
       }

  }
  leadFileChangeListener($event) {
    this.hideLeadCropper=true;
    this.edit_lead_image=true;
    this.crop_lead_image=true;
    this.isLeadImageExist=true;
    var image:any = new Image();
    
    var file:File = $event.target.files[0];
    var myReader:FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent:any) {
        image.src = loadEvent.target.result;
        image.onload = function () {
          that.leadCropperSettings.croppedWidth=this.width;
          that.leadCropperSettings.croppedHeight=this.height;
          that.leadImage=this.src;
          that.createLeadImageThumbnail(that.leadImage);
        }
    };

    myReader.readAsDataURL(file);
}
leadImageCropped(image:any)
  {
    if(this.crop_lead_image)
    {
      this.leadCropperSettings.croppedWidth=image.width;
      this.leadCropperSettings.croppedHeight=image.height;
      
      let that=this;
      this.resizeLeadImage(this.dataLeadImage.image, data => {
      
        that.leadImage=data;
        this.createLeadImageThumbnail(that.leadImage);
          });
    }
   else
   {
     this.crop_lead_image=true;
   } 
   
  }
  openLeadPicture(){
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Option',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Take photo',
          icon: 'ios-camera-outline',
          handler: () => {
            this.takeLeadPicture();
          }
        },
        {
          text: 'Choose photo from Gallery',
          icon: 'ios-images-outline',
          handler: () => {
            this.selectLeadPicture();
          }
        }
  ]
  });
  actionSheet.present();
  }
  takeLeadPicture(){
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
      this.leadImage="data:image/jpeg;base64," +data;
      if(this.isApp)
      {
     this.crop
     .crop(this.leadImage, {quality: 75,targetHeight:100,targetWidth:100})
    .then((newImage) => {
        this.leadImage=newImage;
      }, error => {
      });
      }
    }, function(error) {

      console.log(error);
    });
  }
  selectLeadPicture()
  {
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
      this.leadImage="data:image/jpeg;base64," +data;

      if(this.isApp)
      {
     this.crop
     .crop(this.leadImage, {quality: 75,targetHeight:100,targetWidth:100})
    .then((newImage) => {
        this.leadImage=newImage;
      }, error => {
      });
      }
    }, function(error) {

      console.log(error);
    });
  }
  
 /////////////////////Generate Thumbnail//////////////////////

  createLeadImageThumbnail(bigMatch:any) {
    let that=this;
      this.generateLeadImageFromImage(bigMatch, 500, 500, 0.5, data => {
        
    that.dataLeadImage.image=data;
      });
    }
    generateLeadImageFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
      var canvas: any = document.createElement("canvas");
      var image:any = new Image();
      var that=this;
      image.src = img;
      image.onload = function () {
       
        var width=that.leadCropperSettings.croppedWidth;
        var height=that.leadCropperSettings.croppedHeight;
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
        that.leadWidth = width;
        that.leadHeight = height;
        //debugger;
        var ctx = canvas.getContext("2d");
   
        ctx.drawImage(image, 0, 0, width, height);
   
        // IMPORTANT: 'jpeg' NOT 'jpg'
        var dataUrl = canvas.toDataURL('image/jpeg', quality);
   
        callback(dataUrl)
      }
      
    }
    resizeLeadImage(img:any,callback)
    {
      var canvas: any = document.createElement("canvas");
      var image:any = new Image();
     
      var that=this;
  
      image.src = img;
      image.onload = function () {
       
        var width=that.leadCropperSettings.croppedWidth;
        var height=that.leadCropperSettings.croppedHeight;
      
        canvas.width = width;
        canvas.height = height;
  
        var ctx = canvas.getContext("2d");
   
        ctx.drawImage(image, 0, 0, width, height);
  
        var dataUrl = canvas.toDataURL('image/jpeg', 1);
  
       callback(dataUrl)
      }
    }
 ////////////////////////////////////////////////////////////////////////
  clearLeadForm():void{
    this.firstName="";
    this.lastName="";
    this.email="";
    this.website="";
    this.mobileNumber=null;
    this.officeNumber=null;
    this.homeNumber=null;
    this.navCtrl.push(AllLeadsPage);
  }
}
