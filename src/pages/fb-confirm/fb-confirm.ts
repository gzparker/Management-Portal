import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, Platform } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { DashboardTabsPage } from '../tabs/dashboard-tabs/dashboard-tabs';
import { SharedProvider } from '../../providers/shared/shared';
import { UserProvider } from '../../providers/user/user';
import { UserVerificationPage } from '../user-verification/user-verification';
/**
 * Generated class for the FbConfirmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fb-confirm',
  templateUrl: 'fb-confirm.html',
})
export class FbConfirmPage {
  public emailFb: string = "";
  public fbPassword: string = "";
  public first_name_fb: string = "";
  public last_name_fb: string = "";
  public fb_token_id: string = "";
  public master_id: string = "";
  public phone_number_verify: number;
  public selectedCountryCode: string = "1";
  public selectedCountryAbbv: string = "US";
  public userCreated: boolean = false;
  public userFbSignUpMsg: string = "";
  public allCountryCodes: any[] = [];
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, public viewCtrl: ViewController) {
  }
  closeModal() {
    //debugger;
    this.viewCtrl.dismiss();
  }
  ionViewDidLoad() {
    this.sharedServiceObj.updateColorThemeMethod(null);
    this.setFacebookValues();
    this.getAllCountryCodes();
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  setFacebookValues() {
    this.storage.get('fbMembershipResp').then((data) => {
      if (data == null) {
        // debugger;
      }
      else {
        //  debugger;
        this.emailFb = data.email;
        let fullname = data.name.split(' ');
        this.fb_token_id = data.id;

        if (fullname[0] != undefined) {
          this.first_name_fb = fullname[0];
        }
        if (fullname[1] != undefined) {
          this.last_name_fb = fullname[1];
        }
      }
    });
  }
  fbSignUpMethod(): void {

    this.userSignUp();
    // if(this.emailFb!="")
    //  {

    //  this.userServiceObj.fbEmailCheck(this.emailFb).subscribe(result => this.fbSetAuthenticationValues(result));

    // }
  }
  userSignUp(): void {
    //debugger;

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

    //debugger;
    let generalWebsiteSettings = this.storage.get('generalWebsiteSettings');
        generalWebsiteSettings.then((data) => {
    this.userServiceObj.userSignUp(dataObj,data.service_id)
      .subscribe((result) => this.userSignUpResponse(result));
        });
  }
  userSignUpResponse(result: any): void {
    //debugger;
    if (result.status == true) {
      this.ngZone.run(() => {
       // debugger;
       // this.userCreated = true;
       // this.userFbSignUpMsg = "User has been successfully registered.";
       this.master_id = result.memberCredentials.master_id;
       this.selectedCountryCode = result.memberCredentials.country_code;
       this.selectedCountryAbbv = result.memberCredentials.country_abbv;
       this.phone_number_verify = result.memberCredentials.phone_mobile;
    //this.navCtrl.push(DashboardPage);
       this.navCtrl.push(UserVerificationPage, {
         master_id: this.master_id,
         selected_country_code: this.selectedCountryCode, selected_country_abbv: this.selectedCountryAbbv,
         selected_phone_number: this.phone_number_verify
       });
      });
    }
  }
  fbSetAuthenticationValues(result: any): void {
    if (result.status == true) {

      if (result.memberCredentials.verified == "1") {
        this.storage.set('loggedId', '1');
        this.storage.set('userId', result.memberCredentials.id);
        this.storage.set('email', result.memberCredentials.email);
        this.storage.set('first_name', result.memberCredentials.first_name);
        this.storage.set('last_name', result.memberCredentials.last_name);

        this.storage.set('loggedInUserInfo', result);

        this.sharedServiceObj.setLoginStatus(true);
        this.ngZone.run(() => {
       // this.navCtrl.push(DashboardPage);
      this.navCtrl.push(DashboardTabsPage);
        });
      }

      // debugger;
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
   // debugger;
    let countryGeoInfo = this.storage.get("userCountryInfo");
    if (this.selectedCountryAbbv == "") {
      countryGeoInfo.then((data) => {
        if (data == null) {
          //debugger;
          this.selectedCountryAbbv = "US";
        }
        else {
     //     debugger;
          this.selectedCountryAbbv = data.countryCode;

        }

      });
    }
  //debugger;
    let foundCountry = this.allCountryCodes.filter(
      country => country.country_abbv === this.selectedCountryAbbv);
    //  debugger;
    this.selectedCountryCode = foundCountry[0].country_code;
    //debugger;
  }
}
