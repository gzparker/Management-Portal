import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, 
  MenuController,LoadingController,ActionSheetController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import jstz from 'jstz';
import { Storage } from '@ionic/storage';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";
import { PicturePopupPage } from '../../../pages/modal-popup/picture-popup/picture-popup';

import 'moment';
import * as moment from 'moment-timezone';
import { AlertController } from 'ionic-angular';
import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';
import { ColorSelectionPopupPage } from '../../modal-popup/color-selection-popup/color-selection-popup';
import { DashboardTabsPage } from '../../tabs/dashboard-tabs/dashboard-tabs';
import { trigger } from '@angular/core/src/animation/dsl';

/**
 * Generated class for the GlobalPreferencesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-global-preferences',
  templateUrl: 'global-preferences.html',
})
export class GlobalPreferencesPage {
  public ngxCropperConfig: object;
 
  // config 
  public hideCompanyCropper:boolean=true;
  public hidePersonalCropper:boolean=true;
  public hideDwellerCropper:boolean=true;
  public edit_company_image:boolean=false;
  public edit_personal_image:boolean=false;
  public edit_dweller_image:boolean=false;
  public crop_company_image:boolean=false;
  public crop_personal_image:boolean=false;
  public crop_dweller_image:boolean=false;
  public companyCropperLoaded:boolean=false;
  public isCompanyImageExist:boolean=false;
  public isDwellerImageExist:boolean=false;
  public cropperJsConfig: object;
  public isApp=false;
  public userLoggedId:boolean=false;
  public identity_name:string="";
  public colorBase:string="#00d2ff";
  public secondColor:string="#00d2ff";
  public thirdColor:string="#00d2ff";
  public headerColor:string="";
  public headerColorOption:string="";
  public textColor:string="";
  public textColorOption:string="";
  public buttonColor:string="";
  public buttonColorOption:string="";
  public backgroundColor:string="";
  public backgroundColorOption:string="";
  public sideBarMenuColor:string="";
  public sideBarMenuColorOption:string="";
  public contentTitleColor:string="";
  public contentTitleColorOption:string="";
  public paginationColor:string="";
  public paginationColorOption:string="";
  public modalBackgroundColor:string="";
  public modalBackgroundColorOption:string="";
  public mapSidebarColor:string="";
  public mapSidebarColorOption:string="";

  public buttonDwellerColor:string="";
  public buttonDwellerColorOption:string="";
  public sideBarDwellerColor:string="";
  public sideBarDwellerColorOption:string="";
  public backgroundDwellerColor:string="";
  public backgroundDwellerOption:string="";

  public isCustomColor:string="0";
  
  public customColorOption:boolean=false;
  public customColorOptionModal:boolean=false;

  public timezone:string="";

  public settingsCreateMsg:string="";
  public description:string="";
  public companyCropperSettings;
  public personalCropperSettings;
  public dwellerCropperSettings;
  public croppedWidth:Number;
  public croppedHeight:Number;
  public companyImageChangedEvent: any = '';
  public personalImageChangedEvent: any = '';
  public dwellerImageChangedEvent: any = '';
  public dataCompanyLogoImage:any;
  public companyLogoImage:string="";
  public dataPersonalImage:any;
  public personalImage:string="";
  public dataDwellerImage:any;
  public dwellerImage:string="";
  public loader:any;
  public selectedRoute:string="";
  public globalSettings:any;
  public personalWidth:string="";
  public personalHeight:string="";
  public companyWidth:string="";
  public companyHeight:string="";
  public dwellerWidth:string="";
  public dwellerHeight:string="";
  public selectedSegment:any="1";
  public colorSegment:string="1";
  public display_name_dweller:string="";
 
  public user = {timezone:'America/New_York'};
  public placeholderString = 'Select timezone';
  public colorOptions:any[]=[{id:"base_color",name:"1st Color"},
  {id:"secondary_color",name:"2nd Color"},{id:"tertiary_color",name:"3rd Color"},{id:"default",name:"Default Color"}];

  public userId:string="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,public actionsheetCtrl: ActionSheetController,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController,
    private crop: Crop,private camera: Camera,private imagePicker: ImagePicker) {
      let momentObj=moment();
      //debugger;
      let usertimezone = jstz.determine();
      //debugger;
      this.timezone=usertimezone.name();
      //debugger;
      if(this.navParams.get('route')!=undefined)
      {
        this.selectedRoute=this.navParams.get('route');
      }
     // debugger;
     /*if(this.platform.is('core') || this.platform.is('mobileweb') || this.platform.is('cordova') || this.platform.is('mobile')) {
      this.isApp=false;
    }
    else
    {
      this.isApp=true;
    }*/
    this.isApp = (!document.URL.startsWith("http"));
    this.hideCompanyCropper=false;
    this.hidePersonalCropper=false;
    //////////////Company Cropper Settings//////////////////
      this.companyCropperSettings = new CropperSettings();
      this.companyCropperSettings.width = 100;
      this.companyCropperSettings.height = 100;
      this.companyCropperSettings.croppedWidth = 1280;
      this.companyCropperSettings.croppedHeight = 1000;
      this.companyCropperSettings.canvasWidth = 500;
      this.companyCropperSettings.canvasHeight = 300;
      this.companyCropperSettings.minWidth = 10;
        this.companyCropperSettings.minHeight = 10;
        //this.companyCropperSettings.dynamicSizing=true;
  
        this.companyCropperSettings.rounded = false;
        this.companyCropperSettings.keepAspect = false;
  
      this.companyCropperSettings.noFileInput = true;
       //////////////Dweller Cropper Settings//////////////////
       this.dwellerCropperSettings = new CropperSettings();
       this.dwellerCropperSettings.width = 100;
       this.dwellerCropperSettings.height = 100;
       this.dwellerCropperSettings.croppedWidth = 1280;
       this.dwellerCropperSettings.croppedHeight = 1000;
       this.dwellerCropperSettings.canvasWidth = 500;
       this.dwellerCropperSettings.canvasHeight = 300;
       this.dwellerCropperSettings.minWidth = 10;
         this.dwellerCropperSettings.minHeight = 10;
         //this.companyCropperSettings.dynamicSizing=true;
   
         this.dwellerCropperSettings.rounded = false;
         this.dwellerCropperSettings.keepAspect = false;
   
       this.dwellerCropperSettings.noFileInput = true;
    //////////////Personal Cropper Settings//////////////////
    this.personalCropperSettings = new CropperSettings();
      
    this.personalCropperSettings.width = 100;
    this.personalCropperSettings.height = 100;
    this.personalCropperSettings.croppedWidth = 1280;
    this.personalCropperSettings.croppedHeight = 1000;
      this.personalCropperSettings.canvasWidth = 500;
      this.personalCropperSettings.canvasHeight = 300;
      //this.companyCropperSettings.dynamicSizing=true;
      this.personalCropperSettings.minWidth = 10;
        this.personalCropperSettings.minHeight = 10;
  
        this.personalCropperSettings.rounded = false;
        this.personalCropperSettings.keepAspect = false;
  
      this.personalCropperSettings.noFileInput = true;
    ////////////////////////////////////////////////////////
        this.dataCompanyLogoImage= {};
        this.dataPersonalImage={};
        this.dataDwellerImage={}
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
      this.loadGlobalSettings();
     // this.sharedServiceObj.updateColorThemeMethod(null);
    });
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  segmentChanged(event:any)
  {
    this.customColorOptionModal=true;
    if(event.value=="1")
    {
this.selectedSegment="1";
    }
    else if(event.value=="2")
    {
      this.selectedSegment="2";
    }
  this.sharedServiceObj.updateColorThemeMethod(null); 
  }
  loadGlobalSettings()
  {
    //debugger;
    this.userServiceObj.viewGlobalSettings(this.userId)
    .subscribe((result) => this.loadGlobalSettingsResp(result));
  }
  loadGlobalSettingsResp(result:any)
  {
   // debugger;
    if(result.status==true)
    {
      this.globalSettings=result.globalSettings;
      if(this.globalSettings)
      {
        //debugger;
        if(this.globalSettings.timezone==null||this.globalSettings.timezone==undefined)
        {
          this.user.timezone='America/New_York';
        }
        else
        {
          this.user.timezone = this.globalSettings.timezone;
        }
        if(this.globalSettings.isCustomColor=="false")
        {
          this.customColorOptionModal=false;
        }
        else
        {
          this.customColorOptionModal=true;
        }
       //this.customColorOptionModal=this.globalSettings.isCustomColor;
      //this.customColorOption=this.globalSettings.isCustomColor;
      //debugger;
      if(this.globalSettings.color_base!=null&&this.globalSettings.color_base!=undefined&&this.globalSettings.color_base!=""){
        this.colorBase=this.globalSettings.color_base;
      }
      if(this.globalSettings.color_second!=null&&this.globalSettings.color_second!=undefined&&this.globalSettings.color_second!=""){
        this.secondColor=this.globalSettings.color_second;
      } 
      if(this.globalSettings.color_third!=null&&this.globalSettings.color_third!=undefined&&this.globalSettings.color_third!=""){
        this.thirdColor=this.globalSettings.color_third;
      }
     
     this.identity_name=this.globalSettings.identity_name;
     if(this.globalSettings.display_name_dweller!=undefined&&this.globalSettings.display_name_dweller!="")
     {
      this.display_name_dweller=this.globalSettings.display_name_dweller;
     }
     else
     {
      this.display_name_dweller=this.globalSettings.identity_name;
     }
     this.headerColor=this.globalSettings.header_color;
     this.headerColorOption=this.globalSettings.header_color_option;
     this.sideBarMenuColor=this.globalSettings.sidebar_menu_color;
     this.sideBarMenuColorOption=this.globalSettings.sidebar_menu_color_option;
     this.textColor=this.globalSettings.text_color;
     this.textColor=this.globalSettings.text_color_option;
     this.buttonColor=this.globalSettings.button_color;
     this.buttonColorOption=this.globalSettings.button_color_option;
     this.backgroundColor=this.globalSettings.content_background;
     this.backgroundColorOption=this.globalSettings.content_background_option;
     this.contentTitleColor=this.globalSettings.content_title_color;
     this.contentTitleColorOption=this.globalSettings.content_title_color_option;
     this.paginationColor=this.globalSettings.pagination_color;
     this.paginationColorOption=this.globalSettings.pagination_color_option;
     this.modalBackgroundColor=this.globalSettings.modal_background_color;
     this.modalBackgroundColorOption=this.globalSettings.modal_background_color_option;
     this.mapSidebarColor=this.globalSettings.map_sidebar_color;
     this.mapSidebarColorOption=this.globalSettings.map_sidebar_color_option;
     this.buttonDwellerColor=this.globalSettings.button_color_dweller;
     this.buttonDwellerColorOption=this.globalSettings.button_color_dweller_option;
     this.sideBarDwellerColor=this.globalSettings.side_bar_color_dweller;
     this.sideBarDwellerColorOption=this.globalSettings.side_bar_color_dweller_option;
     this.backgroundDwellerColor=this.globalSettings.background_color_dweller;
     this.backgroundDwellerOption=this.globalSettings.background_color_dweller_option;
     //debugger;
     
        if(this.globalSettings.photo_company!=undefined)
      {
        this.loadCompanyImage(this.sharedServiceObj.imgBucketUrl,this.globalSettings.photo_company);
      }
      if(this.globalSettings.image_dweller!=undefined)
      {
       
        this.loadDwellerImage(this.sharedServiceObj.imgBucketUrl,this.globalSettings.image_dweller);
      }
      else
      {

      }
      /*if(this.globalSettings.photo_personal!=undefined)
      { 
        this.loadPersonalImage(this.sharedServiceObj.imgBucketUrl,this.globalSettings.photo_personal);
      }*/
        //debugger;
      }
      this.storage.set('globalSettings',this.globalSettings);
      //debugger;
    }
  }
  changeBaseColorEvent($event:any){
this.colorBase=$event;
//debugger;
  }
  showColorPopUp(option:string){
    var that=this;
    var selectedColor={
      option:"",
      selectedColorOption:"",
      selectedColor:"",
      colorBase:"",
      secondColor:"",
      thirdColor:""
    }
    if(option=='header_color')
    {
selectedColor.option=option;
selectedColor.selectedColorOption=this.headerColorOption;
selectedColor.selectedColor=this.headerColor;
    }
    if(option=='side_bar_menu_color')
    {
selectedColor.option=option;
selectedColor.selectedColorOption=this.sideBarMenuColorOption;
selectedColor.selectedColor=this.sideBarMenuColor;
    }
    if(option=='content_background_color')
    {
selectedColor.option=option;
//debugger;
selectedColor.selectedColorOption=this.backgroundColorOption;
selectedColor.selectedColor=this.backgroundColor;
    }
    if(option=='button_color')
    {
selectedColor.option=option;
selectedColor.selectedColorOption=this.buttonColorOption;
selectedColor.selectedColor=this.buttonColor;
    }
    if(option=='content_title_color')
    {
selectedColor.option=option;
selectedColor.selectedColorOption=this.contentTitleColorOption;
selectedColor.selectedColor=this.contentTitleColor;
    }
    if(option=='pagination_color')
    {
selectedColor.option=option;
selectedColor.selectedColorOption=this.paginationColorOption;
selectedColor.selectedColor=this.paginationColor;
    }
    if(option=='modal_background_color')
    {
selectedColor.option=option;
selectedColor.selectedColorOption=this.modalBackgroundColorOption;
selectedColor.selectedColor=this.modalBackgroundColor;
    }
    if(option=='map_sidebar_color')
    {
selectedColor.option=option;
selectedColor.selectedColorOption=this.mapSidebarColorOption;
selectedColor.selectedColor=this.mapSidebarColor;
    }
    if(option=='button_color_dweller')
    {
      //debugger;
selectedColor.option=option;
selectedColor.selectedColorOption=this.buttonDwellerColorOption;
selectedColor.selectedColor=this.buttonDwellerColor;
    }
    if(option=='side_bar_color_dweller')
    {
selectedColor.option=option;
selectedColor.selectedColorOption=this.sideBarDwellerColorOption;
selectedColor.selectedColor=this.sideBarDwellerColor;
    }
    if(option=='background_color_dweller')
    {
selectedColor.option=option;
selectedColor.selectedColorOption=this.backgroundDwellerOption;
selectedColor.selectedColor=this.backgroundDwellerColor;
    }
    selectedColor.colorBase=this.colorBase;
    selectedColor.secondColor=this.secondColor;
    selectedColor.thirdColor=this.thirdColor;
    //debugger;   
    var modalColor = this.modalCtrl.create(ColorSelectionPopupPage,{selectedColor:selectedColor});
    modalColor.onDidDismiss(data => {
     // console.log(data);
      //debugger;
      that.setColorProperties(data);
 });
    modalColor.present();
  }
  setColorProperties(options:any)
  {
//debugger;
if(options.option=='header_color')
{
this.headerColorOption=options.selectedColorOption;
if(options.selectedColor!=''&&options.isCustomColor==true)
{
  this.headerColor=options.selectedColor;
 // debugger;
}
else
{
if(this.headerColorOption=="base_color")
{
this.headerColor=this.colorBase;
options.selectedColor=this.headerColor;
}
else if(this.headerColorOption=="secondary_color")
{
this.headerColor=this.secondColor;
options.selectedColor=this.headerColor;
}
else if(this.headerColorOption=="tertiary_color")
{
this.headerColor=this.thirdColor;
options.selectedColor=this.headerColor;
//debugger;
}
else if(this.headerColorOption=="default")
{
this.headerColorOption="";
this.headerColor="";
options.selectedColor=this.headerColor;
}
}
//debugger;
}
else if(options.option=='side_bar_menu_color')
{
  this.sideBarMenuColorOption=options.selectedColorOption;
  if(options.selectedColor!=''&&options.isCustomColor==true)
{
  this.sideBarMenuColor=options.selectedColor;
}
else
{
if(this.sideBarMenuColorOption=="base_color")
{
this.sideBarMenuColor=this.colorBase;
options.selectedColor=this.sideBarMenuColor;
}
else if(this.sideBarMenuColorOption=="secondary_color")
{
this.sideBarMenuColor=this.secondColor;
options.selectedColor=this.sideBarMenuColor;
}
else if(this.sideBarMenuColorOption=="tertiary_color")
{
this.sideBarMenuColor=this.thirdColor;
options.selectedColor=this.sideBarMenuColor;
}
else if(this.sideBarMenuColorOption=="default")
{
this.sideBarMenuColorOption="";
this.sideBarMenuColor="";
options.selectedColor=this.sideBarMenuColor;
}
}
}
else if(options.option=='content_background_color')
{
  this.backgroundColorOption=options.selectedColorOption;
  if(options.selectedColor!=''&&options.isCustomColor==true)
{
  this.backgroundColor=options.selectedColor;
}
else
{
if(this.backgroundColorOption=="base_color")
{
this.backgroundColor=this.colorBase;
options.selectedColor=this.backgroundColor;
}
else if(this.backgroundColorOption=="secondary_color")
{
this.backgroundColor=this.secondColor;
options.selectedColor=this.backgroundColor;
}
else if(this.backgroundColorOption=="tertiary_color")
{
this.backgroundColor=this.thirdColor;
options.selectedColor=this.backgroundColor;
}
else if(this.backgroundColorOption=="default")
{
this.backgroundColorOption="";
this.backgroundColor="";
options.selectedColor=this.backgroundColor;
}
}
}
else if(options.option=='button_color')
{
  this.buttonColorOption=options.selectedColorOption;
  if(options.selectedColor!=''&&options.isCustomColor==true)
{
  this.buttonColor=options.selectedColor;
}
else
{
if(this.buttonColorOption=="base_color")
{
this.buttonColor=this.colorBase;
options.selectedColor=this.buttonColor;
}
else if(this.buttonColorOption=="secondary_color")
{
this.buttonColor=this.secondColor;
options.selectedColor=this.buttonColor;
}
else if(this.buttonColorOption=="tertiary_color")
{
this.buttonColor=this.thirdColor;
options.selectedColor=this.buttonColor;
}
else if(this.buttonColorOption=="default")
{
this.buttonColorOption="";
this.buttonColor="";
options.selectedColor=this.buttonColor;
}
}
}
else if(options.option=='content_title_color')
{
  this.contentTitleColorOption=options.selectedColorOption;
  if(options.selectedColor!=''&&options.isCustomColor==true)
{
  this.contentTitleColor=options.selectedColor;
}
else
{
if(this.contentTitleColorOption=="base_color")
{
this.contentTitleColor=this.colorBase;
options.selectedColor=this.contentTitleColor;
}
else if(this.contentTitleColorOption=="secondary_color")
{
this.contentTitleColor=this.secondColor;
options.selectedColor=this.contentTitleColor;
}
else if(this.contentTitleColorOption=="tertiary_color")
{
this.contentTitleColor=this.thirdColor;
options.selectedColor=this.contentTitleColor;
}
else if(this.contentTitleColorOption=="default")
{
this.contentTitleColorOption="";
this.contentTitleColor="";
options.selectedColor=this.contentTitleColor;
}
}
}
else if(options.option=='pagination_color')
{
  this.paginationColorOption=options.selectedColorOption;
  if(options.selectedColor!=''&&options.isCustomColor==true)
{
  this.paginationColor=options.selectedColor;
}
else
{
if(this.paginationColorOption=="base_color")
{
this.paginationColor=this.colorBase;
options.selectedColor=this.paginationColor;
}
else if(this.paginationColorOption=="secondary_color")
{
this.paginationColor=this.secondColor;
options.selectedColor=this.paginationColor;
}
else if(this.paginationColorOption=="tertiary_color")
{
this.paginationColor=this.thirdColor;
options.selectedColor=this.paginationColor;
}
else if(this.paginationColorOption=="default")
{
this.paginationColorOption="";
this.paginationColor="";
options.selectedColor=this.paginationColor;
}
}
}
else if(options.option=='modal_background_color')
{
  this.modalBackgroundColorOption=options.selectedColorOption;
  if(options.selectedColor!=''&&options.isCustomColor==true)
{
  this.modalBackgroundColor=options.selectedColor;
}
else
{
if(this.modalBackgroundColorOption=="base_color")
{
this.modalBackgroundColor=this.colorBase;
options.selectedColor=this.modalBackgroundColor;
}
else if(this.modalBackgroundColorOption=="secondary_color")
{
this.modalBackgroundColor=this.secondColor;
options.selectedColor=this.modalBackgroundColor;
}
else if(this.modalBackgroundColorOption=="tertiary_color")
{
this.modalBackgroundColor=this.thirdColor;
options.selectedColor=this.modalBackgroundColor;
}
else if(this.modalBackgroundColorOption=="default")
{
this.modalBackgroundColorOption="";
this.modalBackgroundColor="";
options.selectedColor=this.modalBackgroundColor;
}
}
}
else if(options.option=='map_sidebar_color')
{
  this.mapSidebarColorOption=options.selectedColorOption;
  if(options.selectedColor!=''&&options.isCustomColor==true)
{
  this.mapSidebarColor=options.selectedColor;
}
else
{
if(this.mapSidebarColorOption=="base_color")
{
  this.mapSidebarColor=this.colorBase;
  options.selectedColor=this.mapSidebarColor;
}
else if(this.mapSidebarColorOption=="secondary_color")
{
  this.mapSidebarColor=this.secondColor;
  options.selectedColor=this.mapSidebarColor;
}
else if(this.mapSidebarColorOption=="tertiary_color")
{
  this.mapSidebarColor=this.thirdColor;
  options.selectedColor=this.mapSidebarColor;
}
else if(this.mapSidebarColorOption=="default")
{
  this.mapSidebarColorOption="";
  this.mapSidebarColor="";
  options.selectedColor=this.mapSidebarColor;
}
}
}
else if(options.option=='button_color_dweller')
{
  this.buttonDwellerColorOption=options.selectedColorOption;
  if(options.selectedColor!=''&&options.isCustomColor==true)
{
  this.buttonDwellerColor=options.selectedColor;
}
else
{
if(this.buttonDwellerColorOption=="base_color")
{
  this.buttonDwellerColor=this.colorBase;
  options.selectedColor=this.buttonDwellerColor;
}
else if(this.buttonDwellerColorOption=="secondary_color")
{
  this.buttonDwellerColor=this.secondColor;
  options.selectedColor=this.buttonDwellerColor;
}
else if(this.buttonDwellerColorOption=="tertiary_color")
{
  this.buttonDwellerColor=this.thirdColor;
  options.selectedColor=this.buttonDwellerColor;
}
else if(this.buttonDwellerColorOption=="default")
{
  this.buttonDwellerColorOption="";
  this.buttonDwellerColor="";
  options.selectedColor=this.buttonDwellerColor;
}
}
}
else if(options.option=='side_bar_color_dweller')
{
  this.sideBarDwellerColorOption=options.selectedColorOption;
  if(options.selectedColor!=''&&options.isCustomColor==true)
{
  this.sideBarDwellerColor=options.selectedColor;
}
else
{
if(this.sideBarDwellerColorOption=="base_color")
{
  this.sideBarDwellerColor=this.colorBase;
  options.selectedColor=this.sideBarDwellerColor;
}
else if(this.sideBarDwellerColorOption=="secondary_color")
{
  this.sideBarDwellerColor=this.secondColor;
  options.selectedColor=this.sideBarDwellerColor;
}
else if(this.sideBarDwellerColorOption=="tertiary_color")
{
  this.sideBarDwellerColor=this.thirdColor;
  options.selectedColor=this.sideBarDwellerColor;
}
else if(this.sideBarDwellerColorOption=="default")
{
  this.sideBarDwellerColorOption="";
  this.sideBarDwellerColor="";
  options.selectedColor=this.sideBarDwellerColor;
}
}
}
else if(options.option=='background_color_dweller')
{
  this.backgroundDwellerOption=options.selectedColorOption;
  if(options.selectedColor!=''&&options.isCustomColor==true)
{
  this.backgroundDwellerColor=options.selectedColor;
}
else
{
if(this.backgroundDwellerOption=="base_color")
{
  this.backgroundDwellerColor=this.colorBase;
  options.selectedColor=this.backgroundDwellerColor;
}
else if(this.backgroundDwellerOption=="secondary_color")
{
  this.backgroundDwellerColor=this.secondColor;
  options.selectedColor=this.backgroundDwellerColor;
}
else if(this.backgroundDwellerOption=="tertiary_color")
{
  this.backgroundDwellerColor=this.thirdColor;
  options.selectedColor=this.backgroundDwellerColor;
}
else if(this.backgroundDwellerOption=="default")
{
  this.backgroundDwellerOption="";
  this.backgroundDwellerColor="";
  options.selectedColor=this.backgroundDwellerColor;
}
}
}
//debugger;
this.sharedServiceObj.updateColorThemeMethod(options);
//debugger;
  }
  toggleCustomColor(){
    //this.customColorOption=!this.customColorOption;
   // debugger;
    if(this.customColorOption==true)
    {
      //this.customColorOption=false;
      //this.isCustomColor="0";
    }
    else
    {
      //this.customColorOption=true;
      //this.isCustomColor="1";
    }
      }
      loadDwellerImage(baseUrl:string,imageUrl:string) {
   
        const self = this;
        //debugger;
        //self.hideCompanyCropper=true;
        var image:any = new Image();
        const xhr = new XMLHttpRequest()
        xhr.open("GET", baseUrl+imageUrl);
        xhr.responseType = "blob";
        xhr.send();
        xhr.addEventListener("load", function() {
            var reader = new FileReader();
            reader.readAsDataURL(xhr.response); 
           
            reader.onloadend = function (loadEvent:any) {
              //debugger;
              image.src = loadEvent.target.result;
              image.onload = function () {
                self.dwellerImage=image.src;
                if(!self.isApp){
                  self.dwellerCropperSettings.croppedWidth = this.width;
                  self.dwellerCropperSettings.croppedHeight = this.height;
                  self.createDwellerThumbnail(image.src);
                }
            };
              
      
          };
        });
      }
  loadCompanyImage(baseUrl:string,imageUrl:string) {
   
    const self = this;
    
    //self.hideCompanyCropper=true;
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
            self.companyLogoImage=image.src;
            if(!self.isApp){
              self.companyCropperSettings.croppedWidth = this.width;
              self.companyCropperSettings.croppedHeight = this.height;
              self.createCompanyThumbnail(image.src);
            }
        };
          
  
      };
    });
  }
  loadPersonalImage(baseUrl:string,imageUrl:string) {
    const self = this;
    //self.hidePersonalCropper=true;
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
            self.personalImage=image.src;
            if(!self.isApp){
              self.personalCropperSettings.croppedWidth = this.width;
              self.personalCropperSettings.croppedHeight = this.height;
             self.createPersonalThumbnail(image.src);
            }
        };
      };
    });
  }
  editImage(imageType:string){
    var that=this;
    let selectedImageOption={
      mode:'',
      croppedWidth:'',
      croppedHeight:'',
      websiteImage:'',
      imageType:''
    };
    //debugger;
    if(imageType=="companyImage")
    {
      selectedImageOption={
        mode:"edit",
        croppedWidth:this.companyCropperSettings.croppedWidth,
        croppedHeight:this.companyCropperSettings.croppedHeight,
       
        websiteImage:this.companyLogoImage,
        imageType:imageType
      };
    }
    if(imageType=="dwellerImage")
    {
      selectedImageOption={
        mode:"edit",
        croppedWidth:this.dwellerCropperSettings.croppedWidth,
        croppedHeight:this.dwellerCropperSettings.croppedHeight,
       
        websiteImage:this.dwellerImage,
        imageType:imageType
      };
    } 
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
   
       if(imageType=="companyImage")
       {
        self.companyCropperSettings.croppedWidth = imageObject.croppedWidth;
        self.companyCropperSettings.croppedHeight = imageObject.croppedHeight;
        
       self.resizeCompanyImage(imageObject.websiteImage, data => {
        self.companyLogoImage=data;
          self.createCompanyThumbnail(self.companyLogoImage);
        });
       }
       else if(imageType=="dwellerImage")
       {
        self.dwellerCropperSettings.croppedWidth = imageObject.croppedWidth;
        self.dwellerCropperSettings.croppedHeight = imageObject.croppedHeight;
        
       self.resizeDwellerImage(imageObject.websiteImage, data => {
        self.dwellerImage=data;
          self.createDwellerThumbnail(self.dwellerImage);
        });
       }
  }
  dwellerFileChangeListener($event) {
    this.crop_dweller_image=true;
    this.edit_dweller_image=true;
    this.hideDwellerCropper=true;
    this.isDwellerImageExist=true;
   var image:any = new Image();
   var file:File = $event.target.files[0];
   var myReader:FileReader = new FileReader();
   var that = this;
   myReader.onloadend = function (loadEvent:any) {
     image.src = loadEvent.target.result;
     image.onload = function () {
     //  alert (this.width);
      // debugger;
       that.dwellerCropperSettings.croppedWidth = this.width;
       that.dwellerCropperSettings.croppedHeight = this.height;
       that.dwellerImage=this.src;
       that.createDwellerThumbnail(that.dwellerImage);
       //that.createCompanyThumbnail(image.src);
       //that.companyCropper.setImage(image);     
   };

       

   };

   myReader.readAsDataURL(file);
}
 dwellerImageCropped(image:any)
 {
   if(this.crop_dweller_image)
   {
     this.dwellerCropperSettings.croppedWidth = image.width;
     this.dwellerCropperSettings.croppedHeight = image.height;
   let that=this;
     
     this.resizeDwellerImage(this.dataDwellerImage.image, data => {
     
     that.dwellerImage=data;
     this.createDwellerThumbnail(that.dwellerImage);
       });
   }
  else
  {
    this.crop_dweller_image=true;
  } 
  
 }
openDwellerPicture(){
  let actionSheet = this.actionsheetCtrl.create({
    title: 'Option',
    cssClass: 'action-sheets-basic-page',
    buttons: [
      {
        text: 'Take photo',
        icon: 'ios-camera-outline',
        handler: () => {
          this.takeDwellerPicture();
        }
      },
      {
        text: 'Choose photo from Gallery',
        icon: 'ios-images-outline',
        handler: () => {
          this.selectDwellerPicture();
        }
      }
]
});
actionSheet.present();
}
 takeDwellerPicture(){
   //debugger;
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
      this.dwellerImage="data:image/jpeg;base64," +data;
      if(this.isApp)
      {
     this.crop
     .crop(this.dwellerImage, {quality: 75,targetHeight:100,targetWidth:100})
    .then((newImage) => {
        this.dwellerImage=newImage;
      }, error => {
      });
      }
    }, function(error) {

      console.log(error);
    });
  }
  selectDwellerPicture(){
    //debugger;
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
        this.dwellerImage="data:image/jpeg;base64," +data;
        if(this.isApp)
        {
       this.crop
       .crop(this.dwellerImage, {quality: 75,targetHeight:100,targetWidth:100})
      .then((newImage) => {
          this.dwellerImage=newImage;
        }, error => {
        });
        }
      }, function(error) {
        console.log(error);
      });
    }
  createDwellerThumbnail(bigMatch:any) {
    let that=this;
    //debugger;
      this.generateDwellerFromImage(bigMatch, 500, 500, 0.5, data => {
     //debugger;
    that.dataDwellerImage.image=data;
      });
    }
    generateDwellerFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
      var canvas: any = document.createElement("canvas");
      var image:any = new Image();
      
      var that=this;
   //debugger;
      image.src = img;
      image.onload = function () {
       
        var width=that.dwellerCropperSettings.croppedWidth;
        var height=that.dwellerCropperSettings.croppedHeight;
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
        that.dwellerWidth = width;
        that.dwellerHeight = height;
        //debugger;
        var ctx = canvas.getContext("2d");
   
        ctx.drawImage(image, 0, 0, width, height);
   
        // IMPORTANT: 'jpeg' NOT 'jpg'
        var dataUrl = canvas.toDataURL('image/jpeg', quality);
   
        callback(dataUrl)
      }
      
    }
    resizeDwellerImage(img:any,callback)
    {
      var canvas: any = document.createElement("canvas");
      var image:any = new Image();
     
      var that=this;
 
      image.src = img;
      image.onload = function () {
       
        var width=that.dwellerCropperSettings.croppedWidth;
        var height=that.dwellerCropperSettings.croppedHeight;
      
        canvas.width = width;
        canvas.height = height;

        var ctx = canvas.getContext("2d");
   
        ctx.drawImage(image, 0, 0, width, height);

        var dataUrl = canvas.toDataURL('image/jpeg', 1);

       callback(dataUrl)
      }
    }
   companyFileChangeListener($event) {
     this.crop_company_image=true;
     this.edit_company_image=true;
     this.hideCompanyCropper=true;
     this.isCompanyImageExist=true;
    var image:any = new Image();
    var file:File = $event.target.files[0];
    var myReader:FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent:any) {
      image.src = loadEvent.target.result;
      image.onload = function () {
      //  alert (this.width);
       // debugger;
        that.companyCropperSettings.croppedWidth = this.width;
        that.companyCropperSettings.croppedHeight = this.height;
        that.companyLogoImage=this.src;
        that.createCompanyThumbnail(that.companyLogoImage);
        //that.createCompanyThumbnail(image.src);
        //that.companyCropper.setImage(image);     
    };

        

    };

    myReader.readAsDataURL(file);
}
  companyImageCropped(image:any)
  {
    if(this.crop_company_image)
    {
      this.companyCropperSettings.croppedWidth = image.width;
      this.companyCropperSettings.croppedHeight = image.height;
    let that=this;
      
      this.resizeCompanyImage(this.dataCompanyLogoImage.image, data => {
      
      that.companyLogoImage=data;
      this.createCompanyThumbnail(that.companyLogoImage);
        });
    }
   else
   {
     this.crop_company_image=true;
   } 
   
  }
openCompanyImageBox(){
  let actionSheet = this.actionsheetCtrl.create({
    title: 'Option',
    cssClass: 'action-sheets-basic-page',
    buttons: [
      {
        text: 'Take photo',
        icon: 'ios-camera-outline',
        handler: () => {
          this.takeCompanyLogoPicture();
        }
      },
      {
        text: 'Choose photo from Gallery',
        icon: 'ios-images-outline',
        handler: () => {
          this.selectCompanyLogoPicture();
        }
      }
]
});
actionSheet.present();
}
  takeCompanyLogoPicture(){
    //debugger;
   let that=this;
     let options =
     {
      allowEdit: true,
      destinationType: that.camera.DestinationType.DATA_URL,
      encodingType: that.camera.EncodingType.JPEG,
      mediaType: that.camera.MediaType.PICTURE,
      sourceType: that.camera.PictureSourceType.CAMERA
     };
     that.camera.getPicture(options)
     .then((data) => {
       that.companyLogoImage="data:image/jpeg;base64," +data;
      
       if(that.isApp)
       {
        that.crop
      .crop(that.companyLogoImage, {quality: 75,targetHeight:100,targetWidth:100})
     .then((newImage) => {
         that.companyLogoImage=newImage;
       }, error => {
        });
       }
     }, function(error) {
       console.log(error);
     });
   }
   selectCompanyLogoPicture(){
     //debugger;
    let that=this;
      let options =
      {
       allowEdit: true,
       destinationType: that.camera.DestinationType.DATA_URL,
       encodingType: that.camera.EncodingType.JPEG,
       mediaType: that.camera.MediaType.PICTURE,
       sourceType: that.camera.PictureSourceType.SAVEDPHOTOALBUM
      };
      that.camera.getPicture(options)
      .then((data) => {
        that.companyLogoImage="data:image/jpeg;base64," +data;
       
        if(that.isApp)
        {
         that.crop
       .crop(that.companyLogoImage, {quality: 75,targetHeight:100,targetWidth:100})
      .then((newImage) => {
          that.companyLogoImage=newImage;
        }, error => {
         });
        }
      }, function(error) {
        console.log(error);
      });
    }
  
   personalFileChangeListener($event) {
     this.crop_personal_image=true;
     this.edit_personal_image=true;
     this.hidePersonalCropper=true;
    var image:any = new Image();
    var file:File = $event.target.files[0];
    //debugger;
    var myReader:FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent:any) {
        image.src = loadEvent.target.result;
        
        image.onload = function () {
         
         
          that.personalCropperSettings.croppedWidth = this.width;
          that.personalCropperSettings.croppedHeight = this.height;
       //  
          //that.personalCropper.setImage(image);   
      };
    };

    myReader.readAsDataURL(file);
}
  personalImageCropped(image:any)
  {
   if(this.crop_personal_image)
   {
    let that=this;
    this.personalCropperSettings.croppedWidth = image.width;
   this.personalCropperSettings.croppedHeight = image.height;
   this.resizePersonalImage(this.dataPersonalImage.image, data => {
     
     that.personalImage=data;
     this.createPersonalThumbnail(that.personalImage);
       });
   }
   else
   {
     this.crop_personal_image=true;
   }
  
  }
    takePersonalPicture(){
      let that=this;
      let options =
      {
       allowEdit: true,
       destinationType: that.camera.DestinationType.DATA_URL,
       encodingType: that.camera.EncodingType.JPEG,
       mediaType: that.camera.MediaType.PICTURE,
       sourceType: that.camera.PictureSourceType.CAMERA
      };
      that.camera.getPicture(options)
      .then((data) => {
        that.personalImage="data:image/jpeg;base64," +data;
       
        if(that.isApp)
        {
         that.crop
       .crop(that.personalImage, {quality: 75,targetHeight:100,targetWidth:100})
      .then((newImage) => {
        that.personalImage=newImage;
        }, error => {
         });
        }
      }, function(error) {
        console.log(error);
      });
      }
      selectPersonalPicture(){
        let that=this;
        let options =
        {
         allowEdit: true,
         destinationType: that.camera.DestinationType.DATA_URL,
         encodingType: that.camera.EncodingType.JPEG,
         mediaType: that.camera.MediaType.PICTURE,
         sourceType: that.camera.PictureSourceType.SAVEDPHOTOALBUM
        };
        that.camera.getPicture(options)
        .then((data) => {
          that.personalImage="data:image/jpeg;base64," +data;
         
          if(that.isApp)
          {
           that.crop
         .crop(that.personalImage, {quality: 75,targetHeight:100,targetWidth:100})
        .then((newImage) => {
          that.personalImage=newImage;
          }, error => {
           });
          }
        }, function(error) {
          console.log(error);
        });
        }
    /////////////////////Generate Thumbnail//////////////////////
    setPersonalImage(image:any)
    {

    }
    createPersonalThumbnail(bigMatch:any) {
      let that=this;
      this.generatePersonalFromImage(bigMatch, 500, 500, 0.5, data => {
        that.dataPersonalImage.image=data;
    
      });
    }
    generatePersonalFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
      var canvas: any = document.createElement("canvas");
      var image:any = new Image();
      var self=this;
   //debugger;
      image.src = img;
      image.onload = function () {
          
      //var width = image.width;
        
      // var height = image.height;
       //debugger;
       var width=self.personalCropperSettings.croppedWidth;
       var height=self.personalCropperSettings.croppedHeight;
     // debugger;
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
        self.personalWidth = width;
        self.personalHeight = height;
      // debugger;
        var ctx = canvas.getContext("2d");
   
        ctx.drawImage(image, 0, 0, width, height);
   
        // IMPORTANT: 'jpeg' NOT 'jpg'
        var dataUrl = canvas.toDataURL('image/jpeg', quality);
   
        callback(dataUrl)
      }
      
    }
    setCompanyImage(image:any)
    {

    }
    createCompanyThumbnail(bigMatch:any) {
    let that=this;
    //debugger;
      this.generateCompanyFromImage(bigMatch, 500, 500, 0.5, data => {
     
    that.dataCompanyLogoImage.image=data;
      });
    }
    generateCompanyFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
      var canvas: any = document.createElement("canvas");
      var image:any = new Image();
      
      var that=this;
   //debugger;
      image.src = img;
      image.onload = function () {
       
        var width=that.companyCropperSettings.croppedWidth;
        var height=that.companyCropperSettings.croppedHeight;
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
        that.companyWidth = width;
        that.companyHeight = height;
        //debugger;
        var ctx = canvas.getContext("2d");
   
        ctx.drawImage(image, 0, 0, width, height);
   
        // IMPORTANT: 'jpeg' NOT 'jpg'
        var dataUrl = canvas.toDataURL('image/jpeg', quality);
   
        callback(dataUrl)
      }
      
    }
    resizeCompanyImage(img:any,callback)
    {
      var canvas: any = document.createElement("canvas");
      var image:any = new Image();
     
      var that=this;
 
      image.src = img;
      image.onload = function () {
       
        var width=that.companyCropperSettings.croppedWidth;
        var height=that.companyCropperSettings.croppedHeight;
      
        canvas.width = width;
        canvas.height = height;

        var ctx = canvas.getContext("2d");
   
        ctx.drawImage(image, 0, 0, width, height);

        var dataUrl = canvas.toDataURL('image/jpeg', 1);

       callback(dataUrl)
      }
    }
    resizePersonalImage(img:any,callback)
    {
      var canvas: any = document.createElement("canvas");
      var image:any = new Image();
      //image.width=this.companyCropperSettings.croppedWidth;
      //image.height=this.companyCropperSettings.croppedHeight;
      var that=this;
   //debugger;
      image.src = img;
      image.onload = function () {
       
        var width=that.personalCropperSettings.croppedWidth;
        var height=that.personalCropperSettings.croppedHeight;
      
        canvas.width = width;
        canvas.height = height;
    
        //debugger;
        var ctx = canvas.getContext("2d");
   
        ctx.drawImage(image, 0, 0, width, height);
   
        // IMPORTANT: 'jpeg' NOT 'jpg'
        var dataUrl = canvas.toDataURL('image/jpeg', 1);
   //debugger;
       callback(dataUrl)
      }
    }
   ////////////////////////////////////////////////////////////////////////
    
    changeTimezone(timezone) {
     // debugger;
      this.user.timezone = timezone;
    }
    updateGlobalSettings(){
      if(this.userId!="")
    {
    //debugger;
    this.userServiceObj.updateGlobalSettings(this.userId,this.personalImage,this.companyLogoImage,this.user.timezone,
      this.colorBase,this.secondColor,this.thirdColor,this.identity_name,this.display_name_dweller,this.dwellerImage,this.headerColor,this.sideBarMenuColor,
      this.buttonColor,this.textColor,this.backgroundColor,this.headerColorOption,this.sideBarMenuColorOption,
      this.buttonColorOption,this.textColorOption,this.backgroundColorOption,this.customColorOptionModal,
      this.contentTitleColor,this.contentTitleColorOption,this.paginationColor,
      this.paginationColorOption,this.modalBackgroundColor,this.modalBackgroundColorOption,
      this.buttonDwellerColor,
      this.buttonDwellerColorOption,this.sideBarDwellerColor,this.sideBarDwellerColorOption,
      this.backgroundDwellerColor,this.backgroundDwellerOption,this.mapSidebarColor,this.mapSidebarColorOption)
    .subscribe((result) => this.updateGlobalSettingsResp(result));
 
    }
    }
    updateGlobalSettingsResp(result:any)
  {
    //debugger;
    if(result.status==true)
    {
      this.ngZone.run(() => {
     this.storage.set('globalSettings',result.globalSettings);
     this.storage.set('showGlobalPopUp','no');
      this.settingsCreateMsg="Settings have been updated successfully.";
      this.navCtrl.setRoot(DashboardTabsPage,{notificationMsg:this.settingsCreateMsg.toUpperCase()});
    });
    }
 
  }
}
