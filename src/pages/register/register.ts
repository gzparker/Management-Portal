import { Component, ViewChild, NgZone,ElementRef  } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController,LoadingController,
  ActionSheetController,AlertController,ToastController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { DashboardTabsPage } from '../tabs/dashboard-tabs/dashboard-tabs';
import { LoginPage } from '../../pages/login/login';
import { FbConfirmPage } from '../fb-confirm/fb-confirm';
import { UserVerificationPage } from '../user-verification/user-verification';
import { SharedProvider } from '../../providers/shared/shared';
import { UserProvider } from '../../providers/user/user';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var firebase:any;
declare const gapi: any;
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  @ViewChild('btnGoogle', { read: ElementRef }) btnGoogle: ElementRef
  btnGoogleElement: HTMLInputElement = null;
  public isApp=false;public registeration_platform: string="";
  public email: string = ""; public emailFb: string = ""; public password: string = ""; public fbPassword: string = "";
  public first_name: string = ""; public first_name_fb: string = ""; public last_name: string = "";
  public last_name_fb: string = ""; public phone_number: number; public phone_number_verify: number;
  public userLogginMsg: string = ""; public verificationMsg: string = ""; public userSignUpMsg: string = "";
  public userFbSignUpMsg: string = ""; public userCreated: boolean = false; public userTypeSelected: boolean = true;
  public userType: string = "1"; public domainAccess: any; public userLoggedId: boolean = false; public fbAuthResp: any;
  public fbSignUp: boolean = false; public acctVerified: boolean = false; public fb_token_id: string = "";
  public selectedCountryCode: string = ""; public selectedCountryAbbv: string = ""; public allCountryCodes: any[] = [];
  public verify_by: string = "email"; public master_id: string = ""; public verification_code: string = "";
  public urlToUse = ""; public title: string; public message: string; public modalType: number;
  public fbLoginStatus: any; public appId: number = 701598080041539; public websiteBackgroundInfo:any;
  public headerColor:string=""; public sideBarMenuColor:string=""; public buttonColor:string="";
  public textColor:string=""; public loader:any; public loadedWebsite:string=""; public serviceType:string="";
  public google_token= ''; public google_id= ''; public google_name= ''; public google_image= ''; public google_email= '';
  private clientId = this.sharedServiceObj.google_client_id;
  private scope = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/admin.directory.user.readonly'
  ].join(' ');

  public auth2: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider,
    public modalCtrl: ModalController, private storage: Storage,
    public loadingCtrl: LoadingController,public actionSheetCtrl: ActionSheetController, 
    public alertCtrl: AlertController,private toastCtrl: ToastController) {
      this.isApp = (!document.URL.startsWith("http"));
      if(!this.isApp)
      {
        this.registeration_platform='browser';
      }
      else{
        this.registeration_platform='app';
      }
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
    else{
      this.serviceType="idx";
    }
      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 5000
      });
    userServiceObj.fbLoginDecision.subscribe(item => this.faceBookDecisionMethod(item));
  }
  faceBookDecisionMethod(opt: string) {
    if (opt == "0") {
      this.navCtrl.push(FbConfirmPage, { type: "0" });
    }
    else if (opt == "1") {
      this.navCtrl.push(DashboardTabsPage);
    }
    else if (opt == "2") {
      this.navCtrl.push(FbConfirmPage, { type: "2" });
    }
  }
  
  userSignUp(): void {
    let dataObj = {
      first_name: "",
      last_name: "",
      country_code: "",
      country_abbv: "",
      phone_number: 123,
      email: "",
      password: "",
      website_id: "",
      userType: "",
      fb_token: "",
      google_token: "",
      registeration_platform:"",
      verified: 0
    };
    if (this.fbSignUp) {
      dataObj.email = this.emailFb;
      dataObj.password = this.fbPassword;
      dataObj.fb_token = this.fb_token_id;
      dataObj.first_name = this.first_name_fb;
      dataObj.last_name = this.last_name_fb;
      dataObj.country_code = this.selectedCountryCode;
      dataObj.country_abbv = this.selectedCountryAbbv;
      dataObj.registeration_platform=this.registeration_platform;
      dataObj.phone_number = Math.floor(Math.random() * (90000000 - 1 + 1)) + 1;
      dataObj.verified = 0;
    }
    else {
      dataObj.email = this.email;
      dataObj.password = this.password;
      dataObj.fb_token = "";
      dataObj.first_name = this.first_name;
      dataObj.last_name = this.last_name;
      dataObj.country_code = this.selectedCountryCode;
      dataObj.country_abbv = this.selectedCountryAbbv;
      dataObj.phone_number = this.phone_number;
      dataObj.registeration_platform=this.registeration_platform;
      dataObj.verified = 0;
    }
    dataObj.userType = this.userType;
    let generalWebsiteSettings = this.storage.get('generalWebsiteSettings');
        generalWebsiteSettings.then((data) => {
    this.userServiceObj.userSignUp(dataObj,data.service_id)
      .subscribe((result) => this.userSignUpResponse(result));
        });
  }

  userSignUpResponse(result: any): void {
    if (result.status == true) {
      this.userCreated = true;
      this.userTypeSelected = true;
      this.userSignUpMsg = "User has been successfully registered.";
      if (!this.fbSignUp) {
        this.master_id = result.memberCredentials.master_id;
        this.selectedCountryCode = result.memberCredentials.country_code;
        this.selectedCountryAbbv = result.memberCredentials.country_abbv;
        this.phone_number_verify = result.memberCredentials.phone_mobile;
        this.navCtrl.push(UserVerificationPage, {
          master_id: this.master_id,
          selected_country_code: this.selectedCountryCode, selected_country_abbv: this.selectedCountryAbbv,
          selected_phone_number: this.phone_number_verify
        });
      }
    }
    else {
      this.userCreated = true;
      this.userSignUpMsg = result.message.toUpperCase();
      let toast = this.toastCtrl.create({
        message: this.userSignUpMsg,
        duration: 3000,
        position: 'top',
        cssClass:'errorToast'
      });
      
      toast.onDidDismiss(() => {
      });
      toast.present();
    }

  }
  userSignIn()
  {
this.navCtrl.setRoot(LoginPage);
  }
  public openUserVerificationModal(master_id: any) {
    var modalPage = this.modalCtrl.create(UserVerificationPage, { master_id: master_id });
    modalPage.present();
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
  }
  onFacebookLoginClick(): void {
    this.userServiceObj.onFacebookLoginClick();
  }
  public googleInit() {
    const that = this;
    gapi.load('auth2', function () {
      that.auth2 = gapi.auth2.init({
        client_id: that.clientId,
        cookiepolicy: 'single_host_origin',
        scope: that.scope
      });
      that.attachSignin(that.btnGoogleElement);
    });
  }
  public attachSignin(element) {
    const that = this;
    this.auth2.attachClickHandler(element, {},
      function (googleUser) {

        const profile = googleUser.getBasicProfile();
        that.google_token = googleUser.getAuthResponse().id_token;
        that.google_id = profile.getId();
        that.google_name = profile.getName();
        that.google_image = profile.getImageUrl();
        that.google_email = profile.getEmail();
        const dataObj = {
          google_token : that.google_token,
          google_id : that.google_id,
          google_name : that.google_name,
          google_image : that.google_image,
          google_email : that.google_email
        };
        that.storage.set('googleAuth', dataObj);
        that.userServiceObj.googleSignUp();
      }, function (error) {
        console.log(JSON.stringify(error, undefined, 2));
      });
  }
  ionViewDidLoad() {
    let that=this;
    this.btnGoogleElement = this.btnGoogle.nativeElement;
    this.googleInit();
    this.getAllCountryCodes();
    let generalWebsiteSettings = this.storage.get('generalWebsiteSettings');
    generalWebsiteSettings.then((data) => {
      that.websiteBackgroundInfo=data;
      if(that.websiteBackgroundInfo!=undefined)
  {
    that.applyColors();
  }
    });
  }

}
