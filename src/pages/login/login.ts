import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../dashboard/dashboard';
import { DashboardTabsPage } from '../tabs/dashboard-tabs/dashboard-tabs';
import { FbConfirmPage } from '../fb-confirm/fb-confirm';
import { AlertController } from 'ionic-angular';

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
  public verification_code: string = "";
  public loader:any;

  public fbLoginStatus: any;
  public appId: number = 701598080041539;
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform
    ,public loadingCtrl: LoadingController,public ngZone: NgZone) {
    userServiceObj.fbLoginDecision.subscribe(item => this.faceBookDecisionMethod(item));
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 5000
    });
  }

  ionViewDidLoad() {

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
          this.storage.set('last_name', result.memberCredentials.last_name);
        
          this.storage.set('country_abbv', result.memberCredentials.country_abbv);
          this.storage.set('country_code', result.memberCredentials.country_code);
          if(result.memberCredentials.parent_id!=null)
          {
            this.storage.set('userId', result.memberCredentials.parent_id);
            this.storage.set('subMemberId', result.memberCredentials.id);
            //debugger;
          }
          else
          {
            //;
            this.storage.set('userId', result.memberCredentials.id);
          }
          this.storage.set('parent_id', result.memberCredentials.parent_id);
          this.storage.set('image_url',result.memberCredentials.image_url);
          this.storage.set('loggedInUserInfo', result);
          //debugger;
          this.storage.set('globalSettings',result.globalSettings);
          this.userLoggedId = true;
        if(result.memberCredentials.parent_id!=undefined)
        {
          this.storage.set('is_submember', "1");
          this.setAllAccessOptions(result.userAssignedRoles);
          //this.storage.set('allowed_access_options', result.memberAllowedOptions);
        }
        else
        {
          this.storage.set('is_submember', "0");
          this.navCtrl.setRoot(DashboardTabsPage);
        }
        //  debugger;
         
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
      // this.loginModal.close();

    }
 
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
    //debugger;
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
