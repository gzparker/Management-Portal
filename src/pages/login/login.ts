import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,LoadingController,ToastController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../dashboard/dashboard';
import { DashboardTabsPage } from '../tabs/dashboard-tabs/dashboard-tabs';
import { FbConfirmPage } from '../fb-confirm/fb-confirm';
import { AlertController } from 'ionic-angular';
import { RegisterPage } from '../../pages/register/register';

import { UserVerificationPage } from '../user-verification/user-verification';

import { SharedProvider } from '../../providers/shared/shared';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
//declare const FB:any;
declare var firebase:any;
@IonicPage()

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public email: string = "";
  public emailFb: string = "";
  public password: string = "";
  public fbPassword: string = "";
  public first_name: string = "";
  public first_name_fb: string = "";
  public last_name: string = "";
  public last_name_fb: string = "";
  public phone_number: number;
  public phone_number_verify: number;
  public userLogginMsg: string = "";
  public verificationMsg: string = "";

  public userLoggedId: boolean = false;
  public fbAuthResp: any;

  public acctVerified: boolean = false;
  public fb_token_id: string = "";
  public selectedCountryCode: string = "";
  public selectedCountryAbbv: string = "";
  public allCountryCodes: any[] = [];
  public verify_by: string = "email";
  public master_id: string = "";
  public service_id:string="";
  public verification_code: string = "";
  public loader:any;

  public fbLoginStatus: any;
  public appId: number = 701598080041539;
  public websiteBackgroundInfo:any;
  public headerColor:string="";
  public sideBarMenuColor:string="";
  public buttonColor:string="";
  public textColor:string="";
  public loadedWebsite:string="";
  public serviceType:string="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform
    ,public loadingCtrl: LoadingController,public ngZone: NgZone,private toastCtrl: ToastController) {
    userServiceObj.fbLoginDecision.subscribe(item => this.faceBookDecisionMethod(item));
    this.loadedWebsite=document.URL.toString();
    if(this.loadedWebsite.indexOf("localhost")>0)
    {
      this.serviceType="intagent";
    }
    else if(this.loadedWebsite.indexOf("intagent")>0)
    {
      this.serviceType="intagent";
    }
    else if(this.loadedWebsite.indexOf("idx")>0)
    {
      this.serviceType="idx";
    }
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 5000
    });
  }
  ionViewDidEnter()
  {
    //this.sharedServiceObj.updateColorThemeMethod(null);
  }
  ionViewDidLoad() {
    let that=this;
    //this.sharedServiceObj.updateColorThemeMethod(null);
    let generalWebsiteSettings = this.storage.get('generalWebsiteSettings');
    generalWebsiteSettings.then((data) => {
      //debugger;
      that.service_id=data.service_id;
      that.websiteBackgroundInfo=data;
      if(that.websiteBackgroundInfo!=undefined)
  {
    //debugger;
    that.applyColors();
  }
    });
  }
  applyColors()
{
  
  let contentBackgroundElement=document.getElementsByClassName("background_color");
    
  for (let i = 0; i < contentBackgroundElement.length; i++) {
    contentBackgroundElement[i].setAttribute("style", "background:"+this.websiteBackgroundInfo.content_background+" !important;");
  }
  let sidebarElements=document.getElementsByClassName("sidebar_color");
    for (let i = 0; i < sidebarElements.length; i++) {
      sidebarElements[i].setAttribute("style", "background:"+this.websiteBackgroundInfo.sidebar_menu_color+" !important;");
    }
    let textBarElements=document.getElementsByClassName("text_color");
    for (let i = 0; i < textBarElements.length; i++) {
    
     textBarElements[i].setAttribute("style", "color:"+this.websiteBackgroundInfo.text_color+" !important;");
     //debugger;
    }
    //////////////////////////////Button Color////////////////////////////////    
    let buttonColorElement=document.getElementsByClassName("button_color");
    
    for (let i = 0; i < buttonColorElement.length; i++) {
    
      buttonColorElement[i].setAttribute("style", "background:"+this.websiteBackgroundInfo.button_color+" !important;");
    }
    let buttonToggleElement=document.getElementsByClassName("btnToggle");
    
    for (let i = 0; i < buttonToggleElement.length; i++) {
    
      buttonToggleElement[i].setAttribute("style", "background:"+this.websiteBackgroundInfo.button_color+" !important;");
    }
    let buttonBadgeElement=document.getElementsByClassName("msgcounter");
    
    for (let i = 0; i < buttonBadgeElement.length; i++) {
    
      buttonBadgeElement[i].setAttribute("style", "background:"+this.websiteBackgroundInfo.button_color+" !important;");
    }
    let buttonBadgeInviteElement=document.getElementsByClassName("badgeInvite");
    
    for (let i = 0; i < buttonBadgeInviteElement.length; i++) {
    
      buttonBadgeInviteElement[i].setAttribute("style", "background:"+this.websiteBackgroundInfo.button_color+" !important;");
    }
    let buttonviewProfileElement=document.getElementsByClassName("viewProfile");
    
    for (let i = 0; i < buttonviewProfileElement.length; i++) {
    
      buttonviewProfileElement[i].setAttribute("style", "background:"+this.websiteBackgroundInfo.button_color+" !important;");
    }
    let buttonContactElement=document.getElementsByClassName("contactPhone");
    
    for (let i = 0; i < buttonContactElement.length; i++) {
    
      buttonContactElement[i].setAttribute("style", "background:"+this.websiteBackgroundInfo.button_color+" !important;");
    }
    let buttonContactChatElement=document.getElementsByClassName("contactChat");
    
    for (let i = 0; i < buttonContactChatElement.length; i++) {
    
      buttonContactChatElement[i].setAttribute("style", "background:"+this.websiteBackgroundInfo.button_color+" !important;");
    }
    let buttonContactEmailElement=document.getElementsByClassName("contactEmail");
    
    for (let i = 0; i < buttonContactEmailElement.length; i++) {
    
      buttonContactEmailElement[i].setAttribute("style", "background:"+this.websiteBackgroundInfo.button_color+" !important;");
    }
    let buttonContactInviteElement=document.getElementsByClassName("contactInvite");
    
    for (let i = 0; i < buttonContactInviteElement.length; i++) {
    
      buttonContactInviteElement[i].setAttribute("style", "background:"+this.websiteBackgroundInfo.button_color+" !important;");
    }
}  
  back() {
    //public back = (url) => this.navCtrl.pop();
  }
  userLogin(): void {
    this.userServiceObj.userLogin(this.email, this.password)
      .subscribe((result) => this.userLoginResponse(result));
  }
  userLoginResponse(result: any): void {
    //this.loader.dismiss();
let is_submember:string="0";
let is_lead:string="0";
    if (result.status == true) {
      if (result.memberCredentials) {

        if (result.memberCredentials.verified == "1") {
          this.storage.ready().then(() => {
          this.storage.set('loggedId', '1');
          this.storage.set('selectedService','2');
          this.storage.set('email', result.memberCredentials.email);
          this.storage.set('first_name', result.memberCredentials.first_name);
          this.storage.set('last_name', result.memberCredentials.last_name);
          this.storage.set('userType', "1");
        
          this.storage.set('country_abbv', result.memberCredentials.country_abbv);
          this.storage.set('country_code', result.memberCredentials.country_code);
          if(result.memberCredentials.parent_id!=null)
          {
            this.storage.set('userId', result.memberCredentials.parent_id);
            this.storage.set('subMemberId', result.memberCredentials.id);
          }
          else
          {
            this.storage.set('userId', result.memberCredentials.id);
          }
          this.storage.set('parent_id', result.memberCredentials.parent_id);
          this.storage.set('image_url',result.memberCredentials.image_url);
          this.storage.set('loggedInUserInfo', result);
          this.storage.set('globalSettings',result.globalSettings);
          this.userLoggedId = true;
        if(result.memberCredentials.parent_id!=undefined)
        {
          this.storage.set('is_submember', "1");
          is_submember="1";
          this.setAllAccessOptions(result.userAssignedRoles);
          this.userServiceObj.setFireBaseInfo(result.memberCredentials.email,result.memberCredentials.password,
            result.memberCredentials.id,result.memberCredentials.first_name,result.memberCredentials.last_name,
            result.memberCredentials.image_url,result.memberCredentials.parent_id,is_submember,is_lead,"",this.service_id);
            this.navCtrl.setRoot(DashboardTabsPage);
        }
        else
        {
          this.storage.set('is_submember', "0");
          is_submember="0";
          //this.userServiceObj.setFireBaseInfo(result.memberCredentials);
         //debugger;
          this.userServiceObj.setFireBaseInfo(result.memberCredentials.email,result.memberCredentials.password,
          result.memberCredentials.id,result.memberCredentials.first_name,result.memberCredentials.last_name,
          result.memberCredentials.image_url,result.memberCredentials.parent_id,is_submember,is_lead,"",this.service_id);
          this.navCtrl.setRoot(DashboardTabsPage);
   
        }
        //  debugger;
         //debugger;
        //debugger;
        //this.sharedServiceObj.setLoginStatus(true);
         
          
      });
        }
        else if (result.memberCredentials.verified == "0") {
          this.selectedCountryCode = result.memberCredentials.country_code;
          this.selectedCountryAbbv = result.memberCredentials.country_abbv;
          this.phone_number_verify = result.memberCredentials.phone_mobile;
          this.master_id = result.memberCredentials.master_id;
          this.verify_by = "phone";
          this.navCtrl.push(UserVerificationPage, {
            master_id: this.master_id,
            selected_country_code: this.selectedCountryCode, selected_country_abbv: this.selectedCountryAbbv,
            selected_phone_number: this.phone_number_verify
          });
        }
      }


    }
    else {
      //debugger;
      this.email = "";
      this.password = "";
      this.userLogginMsg = result.message;

      this.storage.remove('userType');
      this.storage.remove('loggedInUserInfo');
      this.userLoggedId = false;
      /*let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: this.userLogginMsg,
        buttons: ['Ok']
      });
      alert.present();*/
      let toast = this.toastCtrl.create({
        message: this.userLogginMsg,
        duration: 3000,
        position: 'top',
        cssClass:'errorToast'
      });
      
      toast.onDidDismiss(() => {
        //console.log('Dismissed toast');
      });
      toast.present();
      // this.loginModal.close();

    }
 
  }
userSignup()
{
this.navCtrl.setRoot(RegisterPage);
}  
setAllAccessOptions(userAllowedRoles:any)
{
let finalAllowedRolesOptions:number[]=[];
userAllowedRoles.forEach(element => {
  //finalAllowedRolesOptions.concat(element.allowed_options.split(','));
  //debugger;
  let dummyAllOptions=element.allowed_options.split(',');
  for(let i=0;i<dummyAllOptions.length;i++)
  {
    finalAllowedRolesOptions.push(dummyAllOptions[i].toString());
  }
});
//debugger;
this.userServiceObj.getAllMemberAllowedOptions(finalAllowedRolesOptions)
      .subscribe((result) => this.setAllAccessOptionsResp(result));
}
setAllAccessOptionsResp(result:any)
{
  if (result.status == true) {
    debugger;
    this.storage.set('allowed_access_options', result.memberAllowedOptions);
    this.navCtrl.setRoot(DashboardTabsPage);
  }
}
  public openUserVerificationModal(master_id: any) {
    var modalPage = this.modalCtrl.create(UserVerificationPage, { master_id: master_id });
    modalPage.present();
  }

  onFacebookLoginClick(): void {
    //
    this.userServiceObj.onFacebookLoginClick();
  }
  faceBookDecisionMethod(opt: string) {
    if (opt == "0") {
      this.navCtrl.push(UserVerificationPage);
    }
    else if (opt == "1") {
      this.navCtrl.push(DashboardTabsPage);
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
        this.selectedCountryAbbv = "US";
        this.allCountryCodes.filter
      
        let foundCountry = this.allCountryCodes.filter(
          country => country.country_abbv === this.selectedCountryAbbv);
        this.selectedCountryCode = foundCountry[0].country_code;
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
  setBackgroundInfo()
  {
    var that=this;
    let generalWebsiteSettings = this.storage.get('generalWebsiteSettings');
    generalWebsiteSettings.then((data) => {
        if(data!=null)
        {
          that.websiteBackgroundInfo=data;
          if(data.header_color)
          {
            if(data.header_color=="base_color")
            {
              that.headerColor=data.color_base;
          }
          if(data.header_color=="secondary_color")
          {
            that.headerColor=data.color_secondary;
        }
          if(data.header_color=="tertiary_color")
            {
              that.headerColor=data.color_tertiary;
          }
         
         // debugger;
        }
        if(data.sidebar_menu_color)
        {
          if(data.sidebar_menu_color=="base_color")
          {
            that.sideBarMenuColor=data.color_base;
        }
        if(data.sidebar_menu_color=="secondary_color")
          {
            that.sideBarMenuColor=data.color_secondary;
        }
        if(data.sidebar_menu_color=="tertiary_color")
          {
            that.sideBarMenuColor=data.color_tertiary;
        }
        
       // debugger;
      }
      if(data.button_color)
      {
        if(data.button_color=="base_color")
        {
          that.buttonColor=data.color_base;
      }
      if(data.button_color=="secondary_color")
        {
          that.buttonColor=data.color_secondary;
      }
      if(data.button_color=="tertiary_color")
        {
          that.buttonColor=data.color_tertiary;
      }
      
     // debugger;
    }
    if(data.text_color)
    {
      if(data.text_color=="base_color")
      {
        that.textColor=data.color_base;
    }
    if(data.text_color=="secondary_color")
      {
        that.textColor=data.color_secondary;
    }
    if(data.text_color=="tertiary_color")
      {
        that.textColor=data.color_tertiary;
    }
    
  
  }
  //debugger;
      }
      });
  }
  setCountryInfo() {
    this.selectedCountryAbbv = "US";
    let countryGeoInfo = this.storage.get("userCountryInfo");
    countryGeoInfo.then((data) => {
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

}
