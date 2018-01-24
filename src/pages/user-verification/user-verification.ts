import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SharedProvider } from '../../providers/shared/shared';
import { UserProvider } from '../../providers/user/user';
import { VerificationCodePage } from '../verification-code/verification-code';
/**
 * Generated class for the UserVerificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-verification',
  templateUrl: 'user-verification.html',
})
export class UserVerificationPage {
  public selectedCountryCode: string = "";
  public selectedCountryAbbv: string = "";
  public verificationMsg: string = "";
  public allCountryCodes: any[] = [];
  public verify_by: string = "phone";
  public master_id: string = "";
  public acctVerified: boolean = false;
  public verification_code: string = "";
  public phone_number_verify: number;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public userServiceObj: UserProvider, 
    public modalCtrl: ModalController, private storage: Storage,public ngZone: NgZone) {
  }

  ionViewDidLoad() {
    this.getAllCountryCodes();
    if(this.navParams.get('master_id')!=undefined)
   {
    this.master_id = this.navParams.get('master_id');
    }
   if(this.navParams.get('selected_country_abbv')!=undefined)
   {
    this.selectedCountryAbbv = this.navParams.get('selected_country_abbv');
   }
   if(this.navParams.get('selected_country_code')!=undefined)
   {
    this.selectedCountryCode = this.navParams.get('selected_country_code');
   }
   if(this.navParams.get('selected_phone_number')!=undefined)
   { 
    this.phone_number_verify = this.navParams.get('selected_phone_number');
   }
    //debugger;
    // console.log('ionViewDidLoad UserVerificationPage');
  }
  closeModal() {
    //debugger;
    this.viewCtrl.dismiss();
  }
  setVerifyByOption(value: string) {
    //debugger;
    this.verify_by = value;
  }
  verifyUser() {
    let dataObj = {
      phone_number_verify: this.phone_number_verify,
      master_id: this.master_id,
      country_code: this.selectedCountryCode,
      country_abbv: this.selectedCountryAbbv,
      verify_by: this.verify_by
    };

    //debugger;
    this.userServiceObj.sendVerificationInfo(dataObj)
      .subscribe((result) => this.verifyUserResp(result));
  }
  verifyUserResp(result: any): void {
    //debugger;
    if (result.status == true) {
      this.verificationMsg = result.message;
      // this.verificationModal.close();
      this.acctVerified = false;
      this.verification_code = "";
      //this.modalType=4;
      //this.openUserVerificationCodeModal();
      this.ngZone.run(() => {
      this.navCtrl.push(VerificationCodePage, { master_id: this.master_id });
      });
      //this.closeModal();
    }
    else {
      this.verificationMsg = result.message;
    }
    //debugger;
  }
  public openUserVerificationCodeModal() {
    var modalPage = this.modalCtrl.create(VerificationCodePage, { master_id: this.master_id });
    modalPage.present();
  }
  getAllCountryCodes(): void {

    let avilableCountryList = this.storage.get('availableCountryList');
    avilableCountryList.then((data) => {
      if (data == null) {
        //debugger;
        this.userServiceObj.loadCountryCodes()
          .subscribe((result) => this.getAllCountryCodesResp(result));
      }
      else {
        //debugger;
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
    //debugger;
    let countryGeoInfo = this.storage.get("userCountryInfo");
    if (this.selectedCountryAbbv == "") {
      countryGeoInfo.then((data) => {
        if (data == null) {
          //debugger;
          this.selectedCountryAbbv = "US";
        }
        else {
          this.selectedCountryAbbv = data.countryCode;

        }

      });
    }
   // debugger;
    let foundCountry = this.allCountryCodes.filter(
      country => country.country_abbv === this.selectedCountryAbbv);
    this.selectedCountryCode = foundCountry[0].country_code;
    //debugger;
  }
  onCountryCodeSelection($event: any): void {
    let selectedCountryCodeData: any;
    selectedCountryCodeData = this.allCountryCodes.filter(item => item.country_abbv == $event);
    //debugger;
    this.selectedCountryAbbv = selectedCountryCodeData[0].country_abbv;
    this.selectedCountryCode = selectedCountryCodeData[0].country_code;
    // debugger;
  }
}
