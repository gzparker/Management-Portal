import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController,LoadingController,
  ActionSheetController,AlertController,ToastController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../dashboard/dashboard';
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

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
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
  public userSignUpMsg: string = "";
  public userFbSignUpMsg: string = "";
  public userCreated: boolean = false;
  public userTypeSelected: boolean = true;
  public userType: string = "1";
  public domainAccess: any;
  public userLoggedId: boolean = false;
  public fbAuthResp: any;
  public fbSignUp: boolean = false;
  public acctVerified: boolean = false;
  public fb_token_id: string = "";
  public selectedCountryCode: string = "";
  public selectedCountryAbbv: string = "";
  public allCountryCodes: any[] = [];
  public verify_by: string = "email";
  public master_id: string = "";
  public verification_code: string = "";
  public urlToUse = "";
  public title: string;
  public message: string;
  public modalType: number;
  public fbLoginStatus: any;
  public appId: number = 701598080041539;
  public websiteBackgroundInfo:any;
  public headerColor:string="";
  public sideBarMenuColor:string="";
  public buttonColor:string="";
  public textColor:string="";
  public loader:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider,
    public modalCtrl: ModalController, private storage: Storage,
    public loadingCtrl: LoadingController,public actionSheetCtrl: ActionSheetController, 
    public alertCtrl: AlertController,private toastCtrl: ToastController) {
      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 5000
      });
    userServiceObj.fbLoginDecision.subscribe(item => this.faceBookDecisionMethod(item));
  }
  faceBookDecisionMethod(opt: string) {
    if (opt == "0") {
    
      this.navCtrl.push(FbConfirmPage);
    }
    else if (opt == "1") {
      
    this.navCtrl.setRoot(DashboardTabsPage);
    }
  }
  
  userSignUp(): void {
    //debugger;
//this.loader.present();
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
      verified: 0
    };
    //if(this.domainAccess)
    //{
    if (this.fbSignUp) {
      //debugger;
      dataObj.email = this.emailFb;
      dataObj.password = this.fbPassword;
      dataObj.fb_token = this.fb_token_id;
      dataObj.first_name = this.first_name_fb;
      dataObj.last_name = this.last_name_fb;
      dataObj.country_code = this.selectedCountryCode;
      dataObj.country_abbv = this.selectedCountryAbbv;
      dataObj.phone_number = Math.floor(Math.random() * (90000000 - 1 + 1)) + 1;
      dataObj.verified = 0;
      //debugger;
    }
    else {
      // debugger;
      dataObj.email = this.email;
      dataObj.password = this.password;
      dataObj.fb_token = "";
      dataObj.first_name = this.first_name;
      dataObj.last_name = this.last_name;
      dataObj.country_code = this.selectedCountryCode;
      dataObj.country_abbv = this.selectedCountryAbbv;
      dataObj.phone_number = this.phone_number;
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
    //this.loader.dismiss();
    if (result.status == true) {
      //debugger;
      this.userCreated = true;
      this.userTypeSelected = true;
      this.userSignUpMsg = "User has been successfully registered.";

      //this.userType="1";
      if (!this.fbSignUp) {

        this.master_id = result.memberCredentials.master_id;
        this.selectedCountryCode = result.memberCredentials.country_code;
        this.selectedCountryAbbv = result.memberCredentials.country_abbv;
        this.phone_number_verify = result.memberCredentials.phone_mobile;
        //this.openUserVerificationModal(this.master_id);
        this.navCtrl.push(UserVerificationPage, {
          master_id: this.master_id,
          selected_country_code: this.selectedCountryCode, selected_country_abbv: this.selectedCountryAbbv,
          selected_phone_number: this.phone_number_verify
        });
      }


    }
    else {
      //  debugger;
      //this.modalType=3;
      this.userCreated = true;
      this.userSignUpMsg = result.message.toUpperCase();
      /*let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: this.userSignUpMsg,
        buttons: ['Ok']
      });
      alert.present();*/
      let toast = this.toastCtrl.create({
        message: this.userSignUpMsg,
        duration: 3000,
        position: 'top',
        cssClass:'errorToast'
      });
      
      toast.onDidDismiss(() => {
        //console.log('Dismissed toast');
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
  onFacebookLoginClick(): void {
    this.userServiceObj.onFacebookLoginClick();
  }
  ionViewDidLoad() {
    //debugger;
    this.getAllCountryCodes();
    console.log('ionViewDidLoad RegisterPage');
  }

}
