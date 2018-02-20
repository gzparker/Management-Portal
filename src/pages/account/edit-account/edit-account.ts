import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';

import { AccountInfoPage } from '../account-info/account-info';
import { AlertController } from 'ionic-angular';
import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';

/**
 * Generated class for the EditAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-account',
  templateUrl: 'edit-account.html',
})
export class EditAccountPage {
  public userId:string="";
  public accountInfo:any=null;
  public email: string = "";
 
  public password: string = "";
  
  public first_name: string = "";
  
  public last_name: string = "";
  
  public phone_number: number;
  public selectedCountryCode: string = "";
  public selectedCountryAbbv: string = "";
  public allCountryCodes: any[] = [];
  public accountInfoUpdateMsg: string = "";
  public updatedValue:boolean=false;
  public loader:any;
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform,public loadingCtrl: LoadingController) {
      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 5000
      });
  }

  ionViewDidLoad() {
    let member_id = this.storage.get('userId');
   // debugger;
    member_id.then((data) => {
      this.userId=data;
      this.viewAccount();
      this.getAllCountryCodes();
    });
  }
  viewAccount():void{
    if(this.userId!="")
    {
     this.loader.present();
  this.userServiceObj.userInfo(this.userId.toString())
    .subscribe((result) => this.accountInfoResp(result));
    }
    
  }
 
  accountInfoResp(result:any):void{
    if(result.status==true)
    {
    // debugger;
     this.accountInfo=result.result;
     this.first_name=this.accountInfo.first_name;
     this.last_name=this.accountInfo.last_name;
     this.email=this.accountInfo.email;
     this.password=this.accountInfo.password;
     this.phone_number=this.accountInfo.phone_mobile;
     this.selectedCountryAbbv=this.accountInfo.country_abbv;
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
        this.loader.dismiss();
        this.allCountryCodes = data;
        this.setCountryInfo();

      }

    })

  }
  getAllCountryCodesResp(result: any): void {
    this.loader.dismiss();
      //debugger;
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
   // var offset = new Date().getTimezoneOffset();
   // debugger;
    selectedCountryCodeData = this.allCountryCodes.filter(item => item.country_abbv == $event);
    this.selectedCountryAbbv = selectedCountryCodeData[0].country_abbv;
    this.selectedCountryCode = selectedCountryCodeData[0].country_code;
    // debugger;
  }
  checkFormStatus()
  {
    this.updatedValue=false;
   if(this.accountInfo!=null)
   {
     //debugger;
    if(this.accountInfo.email!=this.email)
{
 this.updatedValue=true;
  
}
if(this.accountInfo.password!=this.password)
{
  this.updatedValue=true;
   
} 
if(this.accountInfo.first_name!=this.first_name)
{
 this.updatedValue=true;
}  
if(this.accountInfo.last_name!=this.last_name)
{
  this.updatedValue=true;
   
} 
if(this.accountInfo.country_code!=this.selectedCountryCode)
{
  this.updatedValue=true;
     
}
if(this.accountInfo.country_abbv!=this.selectedCountryAbbv)
{
  this.updatedValue=true;
    
}
if(this.accountInfo.country_abbv!=this.selectedCountryAbbv)
{
 this.updatedValue=true;
  
}
if(this.accountInfo.phone_mobile!=this.phone_number)
{
  this.updatedValue=true;
   
}
   }
  }
  updateAccount():void{
    let dataObj = {
      first_name: "",
      last_name: "",
      country_code: "",
      country_abbv: "",
      phone_number: "",
      email: "",
      password: "",
      timezone:""
    
    };
if(this.accountInfo.email!=this.email)
{
  dataObj.email = this.email;
}
if(this.accountInfo.password!=this.password)
{
      dataObj.password = this.password;
} 
if(this.accountInfo.first_name!=this.first_name)
{
      dataObj.first_name = this.first_name;
} 
if(this.accountInfo.last_name!=this.last_name)
{
      dataObj.last_name = this.last_name;
} 
if(this.accountInfo.country_code!=this.selectedCountryCode)
{
      dataObj.country_code = this.selectedCountryCode;
}
if(this.accountInfo.country_abbv!=this.selectedCountryAbbv)
{
      dataObj.country_abbv = this.selectedCountryAbbv;
}
if(this.accountInfo.country_abbv!=this.selectedCountryAbbv)
{
      dataObj.country_abbv = this.selectedCountryAbbv;
}
if(this.accountInfo.phone_mobile!=this.phone_number)
{
      dataObj.phone_number = this.phone_number.toString();
}
//this.loader.present();
    this.userServiceObj.updateAccount(this.userId,dataObj)
    .subscribe((result) => this.updatAccountResp(result));
  }
  updatAccountResp(result:any):void{
   //this.loader.dismiss();
    if(result.status==true)
    {
     // debugger;
      this.ngZone.run(() => {
  this.navCtrl.push(AccountInfoPage,{notificationMsg:"Account has been updated successfully."})
      });
    }
  else
  {
    this.accountInfoUpdateMsg=result.message;
  }
  }

}
