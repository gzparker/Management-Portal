import { Component, ViewChild, NgZone,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
  MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import { IMultiSelectOption,IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { BrMaskerIonic3, BrMaskModel } from 'brmasker-ionic-3';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";

import { PicturePopupPage } from '../../../pages/modal-popup/picture-popup/picture-popup';
import { AllLeadsPage } from '../../leads/all-leads/all-leads';
import { LeadDetailPage } from '../../leads/lead-detail/lead-detail';

import { ManageAgentsPage } from '../../setup/manage-agents/manage-agents';

import { AlertController,ToastController } from 'ionic-angular';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';

/**
 * Generated class for the EditLeadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google: any;
declare var firebase:any;
@Component({
  selector: 'page-edit-lead',
  templateUrl: 'edit-lead.html',
  providers:[BrMaskerIonic3]
})
export class EditLeadPage {
  @ViewChild('searchHomeBar', { read: ElementRef }) searchHomeBar: ElementRef;
  addressHomeElement: HTMLInputElement = null;
  @ViewChild('searchWorkBar', { read: ElementRef }) searchWorkBar: ElementRef;
  addressWorkElement: HTMLInputElement = null;
  /*@ViewChild('leadImageCropper', undefined)
  leadImageCropper:ImageCropperComponent;*/
  public isApp=false;
  public isWebBrowser=false;
  public isLeadImageExist=false;
  public leadId:string="";
  public userId:string="";
 
  public websiteId:string="";
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
public leadUpdateMsg:string="";
public allWebsiteList:any[]=[];
public allAgents:any[]=[];
public selectedWebsite:string="";
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
  public home_lat_lng:string="";
  public home_address:string="";
  public homeAddressDummy:string="";
  public home_google_place_id:string="";
  public work_lat_lng:string="";
  public work_address:string="";
  public workAddressDummy:string="";
  public work_google_place_id:string="";
  public groupRef:any;
  public groupMemberRef:any;
  public chatRef:any;
  public userRef:any;
  public notificationMsg:string="";
  public service_id:string="";
public loader:any;
public geoLocationOptions = {
  types: ['(cities)'],
  componentRestrictions: {country: "us"}
 };
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,public brMaskerIonic3: BrMaskerIonic3,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController,private crop: Crop,
    private camera: Camera,private imagePicker: ImagePicker,private toastCtrl: ToastController) {
      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 5000
      });
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
  }

  ionViewDidLoad() {
    this.sharedServiceObj.updateColorThemeMethod(null);
    let member_id = this.storage.get('userId');
    //debugger;
    member_id.then((data) => {
      this.userId=data;
      if(this.navParams.get('leadId')!=undefined)
      {
        //debugger;
       this.leadId = this.navParams.get('leadId');
       let generalWebsiteSettings = this.storage.get('generalWebsiteSettings');
       generalWebsiteSettings.then((data) => {
        this.service_id=data.service_id;
       this.getAllWebsite();
       this.loadAllAgents();
       this.initHomeAutocomplete();
      this.initWorkAutocomplete();
       this.editLead(this.leadId);
       
        });
       }
      
    });
  
          
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  ionViewDidLeave()
  {
    if(this.groupRef!=undefined)
    {
      this.groupRef.off("value");
    }
if(this.userRef!=undefined)
{
  this.userRef.off("value");
}
if(this.chatRef!=undefined)
{
this.chatRef.off("value");
}
  }
  setPhoneMask(phoneNumber:string)
    {
     // debugger;
     if(phoneNumber!="")
     {
      const config: BrMaskModel = new BrMaskModel();
      config.mask = '(000) 000-0000';
      config.len = 15;
      config.type = 'num';
      return this.brMaskerIonic3.writeCreateValue(phoneNumber, config);
     }
    else
    {
      return "";
    } 
    }
  editLead(leadId:string):void{
    if(this.userId!="")
    {
      this.loader.present();
  this.userServiceObj.leadDetail(leadId,this.userId.toString())
    .subscribe((result) => this.editLeadResp(result));
    }
  }
  onWebsiteSelection($event:any):void{
    this.selectedWebsite=$event;
    //debugger;
 }
 initHomeAutocomplete(): void {
   
  this.addressHomeElement = this.searchHomeBar.nativeElement.querySelector('.searchbar-input');
  this.createHomeAutocomplete(this.addressHomeElement).subscribe((location) => {
    
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
 loadAllAgents()
    {
      if(this.userId.toString())
      {
        
        this.userServiceObj.viewMemberAgents(this.userId.toString(),this.service_id)
      .subscribe((result) => this.loadAllAgentsResp(result));
       
      }
      
    }
    loadAllAgentsResp(result:any)
    {
     
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
     
 this.userServiceObj.allUserWebsites(this.userId.toString())
   .subscribe((result) => this.getAllWebsiteResp(result));
   }
   
 }
 getAllWebsiteResp(result:any):void{
   //debugger;
   if(result.status==true)
   {
    // debugger;
     this.allWebsiteList=result.result;
   }
   
 }
  editLeadResp(result:any):void{
    this.loader.dismiss();
    if(result.status==true)
    {
   if(result.result)
   {
  
     //this.clearLeadForm();
     this.firstName=result.result.first_name;
     this.lastName=result.result.last_name;
     this.email=result.result.email;
     this.mobileNumber=this.setPhoneMask(result.result.phone_mobile);
     this.officeNumber=this.setPhoneMask(result.result.phone_office);
     this.homeNumber=this.setPhoneMask(result.result.phone_home);
     this.leadId=result.result.lead_id;
     this.selectedWebsite=result.result.website_id;
     this.home_address_street=result.result.home_address_street;
     this.home_address_city=result.result.home_address_city;
     this.home_address_state_or_province=result.result.home_address_state_or_province;
     this.home_address_zipcode=result.result.home_address_zipcode;
     this.work_address_street=result.result.work_address_street;
     this.work_address_city=result.result.work_address_city;
     this.work_address_state_or_province=result.result.work_address_state_or_province;
     this.work_zipcode=result.result.work_zipcode;
     this.category=result.result.category;
     this.home_address=result.result.home_address;
     this.homeAddressDummy=result.result.home_address;
     this.home_lat_lng=result.result.home_lat_lng;
     this.home_google_place_id=result.result.home_google_place_id;
     this.work_address=result.result.work_address;
     this.workAddressDummy=result.result.work_address;
     this.work_google_place_id=result.result.work_google_place_id;
     this.work_lat_lng=result.result.work_lat_lng;
   // debugger;
     if(result.result.image_url!=undefined)
      {
        //debugger;
        this.loadLeadImage(this.sharedServiceObj.imgBucketUrl,result.result.image_url);
      }
     //debugger;
     if(result.result.assigned_agent_id!=undefined&&result.result.assigned_agent_id!='')
     {
       //debugger;
      this.assigned_agent_id=result.result.assigned_agent_id.split(',');
      //debugger;
     }
     
     this.internal_notes=result.result.internal_notes;
     //debugger;
  //this.editLeadModal.open();
   }
  
    }
   
  }
  updateLead():void{
  if(this.userId!="")
    {
     
      //this.loader.present();
      
  this.userServiceObj.updateLead(this.userId,this.selectedWebsite,this.leadId,this.email,this.password,
    this.firstName,this.lastName,this.officeNumber,this.mobileNumber,this.homeNumber,
    this.home_address_street,this.home_address_city,
    this.home_address_state_or_province,this.home_address_zipcode,
    this.work_address_street,this.work_address_city,this.work_address_state_or_province,this.work_zipcode,
  this.assigned_agent_id,this.category,this.internal_notes,this.home_address,
  this.home_lat_lng,this.home_google_place_id,this.work_address,this.work_lat_lng,
  this.work_google_place_id,this.leadImage)
    .subscribe((result) => this.updateLeadResp(result));
    }
  }
  updateLeadResp(result:any):void{
    var that=this;
    this.notificationMsg="Lead has been updated successfully.";
  
  let leadInfo=result.leadInfo;
 
  var i=0;
  this.userRef=firebase.database().ref('users');
  //debugger;
    this.userRef.orderByChild("webUserId").equalTo(leadInfo.lead_id).on("value", function(snapshot) {
      //debugger;
      if(snapshot.exists())
      {
        //debugger;
      snapshot.forEach(element => {
        
        if(element.val().is_lead=="1")
        {
      var fredRef=firebase.database().ref('users/'+element.key);
 
fredRef.update({email:leadInfo.email,first_name:leadInfo.first_name,image_url:leadInfo.image_url
  ,last_name:leadInfo.last_name,website_id:leadInfo.user_website_id});
}
      else
      {
      
        that.userServiceObj.setFireBaseInfo(leadInfo.email,leadInfo.password,leadInfo.lead_id,leadInfo.first_name,leadInfo.last_name,
          leadInfo.image_url,"0","0","1",leadInfo.user_website_id,this.service_id);
       
      }

      });
      that.ngZone.run(() => {
        
        //debugger;
        that.navCtrl.push(LeadDetailPage,{notificationMsg:that.notificationMsg.toUpperCase(),leadId:that.leadId});
         });
    }
    else
    {
    //debugger;
    
      that.userServiceObj.setFireBaseInfo(leadInfo.email,leadInfo.password,leadInfo.lead_id,leadInfo.first_name,leadInfo.last_name,
        leadInfo.image_url,"0","0","1",leadInfo.user_website_id,this.service_id);
        that.ngZone.run(() => {
         //debugger;
          that.navCtrl.push(LeadDetailPage,{notificationMsg:that.notificationMsg.toUpperCase(),leadId:that.leadId});
           });
    }
    });
   
  }
  editAgents()
  {
    this.ngZone.run(() => {
      this.navCtrl.push(ManageAgentsPage);
    });
  }
  loadLeadImage(baseUrl:string,imageUrl:string) {
   // debugger;
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
            self.leadCropperSettings.croppedWidth = this.width;
            self.leadCropperSettings.croppedHeight = this.height;
            self.leadImage=image.src;
            //debugger;
            //self.personalCropper.setImage(image);
            self.createLeadImageThumbnail(image.src);
        };
          // 
  
      };
    });
  }
  editImage(imageType:string){
    var that=this;
   
    //debugger;
    let selectedImageOption={
      mode:"edit",
      croppedWidth:this.leadCropperSettings.croppedWidth,
      croppedHeight:this.leadCropperSettings.croppedHeight,
      //websiteWidth:this.personalWidth,
      //websiteHeight:this.personalHeight,
      //datawebsiteImage:this.dataPersonalImage,
      websiteImage:this.leadImage,
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

          that.leadCropperSettings.croppedWidth = this.width;
          that.leadCropperSettings.croppedHeight = this.height;
          that.leadImage=this.src;
          that.createLeadImageThumbnail(that.leadImage);
          
          //that.leadImageCropper.setImage(image);  
      };
    };
    myReader.readAsDataURL(file);
}
leadImageCropped(image:any)
  {
    if(this.crop_lead_image)
    {
      this.leadCropperSettings.croppedWidth = image.width;
      this.leadCropperSettings.croppedHeight = image.height;
   
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
  takeHeaderPicture(){
      let options =
      {
        quality: 100,
        correctOrientation: true
      };
      this.camera.getPicture(options)
      .then((data) => {
        this.leadImage="data:image/jpeg;base64," +data;
        let image : any= new Image();
         image.src = this.leadImage;
        //this.personalImageCropper.setImage(image);
        if(this.isApp)
        {
       this.crop
       .crop(this.leadImage, {quality: 75,targetHeight:100,targetWidth:100})
      .then((newImage) => {
          this.leadImage=newImage;
        }, error => {
          alert(error)});
        }
      }, function(error) {
 
        console.log(error);
      });
    }
    /*showHideLeadCropper(){
    const self = this;
    this.crop_lead_image=false;
if(this.edit_lead_image)
{
  this.hideLeadCropper=true;
  if(this.leadImage!="")
  {
   // this.companyCropperLoaded=true;
    var image:any = new Image();
    image.src = this.leadImage;
            image.onload = function () {
              self.leadImageCropper.setImage(image); 
            }
 }
  //this.crop_personal_image=false;
}
else
{
  //this.crop_personal_image=false;
  this.hideLeadCropper=false;
}
    }*/
   /////////////////////Generate Thumbnail//////////////////////

   createLeadImageThumbnail(bigMatch:any) {
    let that=this;
    //debugger;
      this.generateLeadImageFromImage(bigMatch, 500, 500, 0.5, data => {
        
    that.dataLeadImage.image=data;
      });
    }
    generateLeadImageFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
      var canvas: any = document.createElement("canvas");
      var image:any = new Image();
      //image.width=this.companyCropperSettings.croppedWidth;
      //image.height=this.companyCropperSettings.croppedHeight;
      var that=this;
   //debugger;
      image.src = img;
      image.onload = function () {
       
        var width=that.leadCropperSettings.croppedWidth;
        var height=that.leadCropperSettings.croppedHeight;
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
    this.selectedWebsite="";
    this.mobileNumber=null;
    this.officeNumber=null;
    this.homeNumber=null;
    this.navCtrl.push(AllLeadsPage);
  }
}
