import { HttpClient } from '@angular/common/http';
//import { HTTP } from '@ionic-native/http';

import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { EventEmitter, Injectable } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { DashboardPage } from '../../pages/dashboard/dashboard';
import { FbConfirmPage } from '../../pages/fb-confirm/fb-confirm';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { SharedProvider } from '../../providers/shared/shared';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
declare const FB: any;
@Injectable()
export class UserProvider {
  public fbLoginDecision: EventEmitter<String>;
  private headers: Headers = new Headers();
  private headerOptions: RequestOptions = new RequestOptions();
  public fbLoginStatus: any;
  public facebookObject: any;
  public fbAuthResp: any;
  public isApp=false;
  constructor(public platform: Platform,private http: Http, public sharedServiceObj: SharedProvider,
    private storage: Storage, public modalCtrl: ModalController,private fb: Facebook) {
    this.fbLoginDecision = new EventEmitter();
    if(this.platform.is('core') || this.platform.is('mobileweb')) {
      this.isApp=false;
    }
    else
    {
      this.isApp=true;
    }
    if(!this.isApp)
    {
    FB.init({
      appId: '701598080041539',
      cookie: false,

      xfbml: true,
      version: 'v2.9',
      status: true
    });
    this.facebookObject = FB;
    this.facebookObject.getLoginStatus(response => {

      this.fbLoginStatus = response;

    }, true);
  }
  else
  {
    this.fb.browserInit(701598080041539,'v2.9');
    this.facebookObject = this.fb;
    let status=this.facebookObject.getLoginStatus();
    
    status.then((resp)=>{
     // alert('yes');
      //alert(JSON.stringify(resp));
      //alert(resp.status);
      this.fbLoginStatus = resp;
    }).catch((error) => {
     
      console.log('Error getting location', error);
    });
  }
    //this.fb.browserInit(701598080041539,'v2.9');
    
  
  }
  onFacebookLoginClick(): void {
//alert('inside');
    if (this.fbLoginStatus != undefined) {
//alert('here');
      this.statusChangeCallback(this.fbLoginStatus);
    }

  }
  statusChangeCallback(resp) {

    if (resp != undefined) {
      if (resp.status === 'connected') {
//alert('1');
    if(!this.isApp)
        {
        this.facebookObject.api('/me', { locale: 'en_US', fields: 'name, email,picture' }, this.setFacebookAuthentication.bind(this));
        }
        else
        {
          this.fb.api('/me?fields=id,name,email,picture',['public_profile', 'user_friends', 'email'])
          .then((res: any) =>{this.setFacebookAuthentication(res)})
          .catch(e => {console.log('Error getting location', e);});
        }
      } else if (resp.status === 'not_authorized') {
        //alert('2');
      } else {
        //alert('3');
        if(!this.isApp)
        {
          this.facebookObject.login(this.checkFacebookResp.bind(this));
        }
       else
       {
        
        this.fb.login(['public_profile', 'user_friends', 'email'])
        .then((res: FacebookLoginResponse) =>{this.checkFacebookResp(res)})
        .catch(e => {console.log('Error getting location', e);});
       } 

      }
    }
    else {
     // alert('4');
     if(!this.isApp)
     {
       this.facebookObject.login(this.checkFacebookResp.bind(this));
     }
    else
    {
    
    this.fb.login(['public_profile', 'user_friends', 'email'])
    .then((res: FacebookLoginResponse) =>{this.checkFacebookResp(res)})
    .catch(e => {console.log('Error getting location', e);});
    } 
    }
  };
  checkFacebookResp(resp: any) {
//alert('new');
//alert(JSON.stringify(resp));
    if (resp.authResponse) {
      if(!this.isApp)
      {
      this.facebookObject.api('/me', { locale: 'en_US', fields: 'name, email,picture' }, this.setFacebookAuthentication.bind(this));
      }
      else
      {
        this.fb.api('/me?fields=id,name,email,picture',['public_profile', 'user_friends', 'email'])
      .then((res: any) =>{this.setFacebookAuthentication(res)})
      .catch(e => {console.log('Error getting location', e);});
      }
    }

  }
  setFacebookAuthentication(response: any): void {
    //alert('here');
    //alert(JSON.stringify(response));
    if (response.email) {

      this.storage.set('fbAuthResp', response);
      //alert('5');
      //alert(JSON.stringify(response));
     this.fbEmailCheck(response.email).subscribe(result => this.checkFbEmail(result));
    } else {

    }

  }
  checkFbEmail(resp: any): void {

    this.storage.get('fbAuthResp').then((data) => {
      if (data != null) {
        this.fbAuthResp = data;
        if (resp.status == true) {

          this.fbSetAuthenticationValues(resp);
          this.fbUpdateToken(this.fbAuthResp.email, this.fbAuthResp.id)
            .subscribe(result => this.fbUpdateTokenResp(result));
        }
        else {

          this.storage.set("fbMembershipResp", this.fbAuthResp);
          this.openFBConfirmModal();


        }
      }
    });


  }
  fbUpdateTokenResp(result: any): void {

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
        this.fbLoginDecision.emit('1');
        //this.navCtrl.push(DashboardPage);
      }
    }
  }

  openFBConfirmModal() {
    this.fbLoginDecision.emit('0');
  }
  userLogin(email: string, password: string) {
    let url = "";
    url = this.sharedServiceObj.registerationApiBaseUrl + 'members/memberLogin';


    let data = new URLSearchParams();

    data.append('email', email);
    data.append('password', password);

    let loggedInStatus = this.http
      .post(url, data, this.headerOptions)
      .map(this.extractData)
    return loggedInStatus;
  }
  userSignUp(dataObj: any) {

    let url = "";
    let data = new URLSearchParams();
    url = this.sharedServiceObj.registerationApiBaseUrl + 'members/memberSignup';

    data.append('email', dataObj.email);
    data.append('password', dataObj.password);

    data.append('first_name', dataObj.first_name);
    data.append('last_name', dataObj.last_name);
    data.append('phone_mobile', dataObj.phone_number.toString());
    data.append('fb_token', dataObj.fb_token);
    data.append('country_code', dataObj.country_code);
    data.append('country_abbv', dataObj.country_abbv);
    data.append('verified', dataObj.verified);
    data.append('service_id', this.sharedServiceObj.service_id);
    let signUpStatus = this.http
      .post(url, data, this.headerOptions)
      .map(this.extractData)
    return signUpStatus;

  }
  getMemberInfo(member_id: string) {
    let url = "";
    let data = new URLSearchParams();
    url = this.sharedServiceObj.registerationApiBaseUrl + 'members/generalinfo';
    //debugger;
    data.append('member_id', member_id);
    //debugger;
    let memberInfo = this.http
      .post(url, data, this.headerOptions)
      .map(this.extractData)
    return memberInfo;
  }
  getUserAdditionalInfo(master_id: string) {

    let url = "";
    let data = new URLSearchParams();
    url = this.sharedServiceObj.registerationApiBaseUrl + 'members/getAdditionalInfo';
    //debugger;
    data.append('master_id', master_id);
    //debugger;
    let signUpAdditionalInfo = this.http
      .post(url, data, this.headerOptions)
      .map(this.extractData)
    return signUpAdditionalInfo;
  }
  sendVerificationInfo(json_data: any) {
    let data = new URLSearchParams();
    data.append('master_id', json_data.master_id);
    data.append('verify_by', json_data.verify_by);
    data.append('service_id', this.sharedServiceObj.service_id);
    if (json_data.verify_by == "phone") {
      data.append('phone_mobile', json_data.phone_number_verify);
      data.append('country_code', json_data.country_code);
      data.append('country_abbv', json_data.country_abbv);
    }
    let verificationInfogResp = this.http
      .post(this.sharedServiceObj.registerationApiBaseUrl + 'members/verifyInfo', data,
      this.headerOptions)
      .map(this.extractData)
    return verificationInfogResp;
  }
  confirmVerificationCode(master_id: string, verification_code: string) {
    let data = new URLSearchParams();
    data.append('master_id', master_id);
    data.append('verification_code', verification_code);
    let verificationInfogResp = this.http
      .post(this.sharedServiceObj.registerationApiBaseUrl + 'members/confirmVerification', data,
      this.headerOptions)
      .map(this.extractData)
    return verificationInfogResp;
  }
  fbEmailCheck(email: string) {

    let data = new URLSearchParams();
    data.append('email', email);
    let searchedListing = this.http
      .post(this.sharedServiceObj.registerationApiBaseUrl + 'members/fbEmailCheck', data,
      this.headerOptions)
      .map(this.extractData)
    return searchedListing;

  }
  fbUpdateToken(email: string, fb_token: string) {
    let data = new URLSearchParams();
    data.append('email', email);
    data.append('fb_token', fb_token);
    //debugger;
    let searchedListing = this.http
      .post(this.sharedServiceObj.registerationApiBaseUrl + 'members/fbTokenUpdate', data,
      this.headerOptions)
      .map(this.extractData)
    return searchedListing;
  }
  userInfo(user_id: string) {
   // debugger;
    let data = new URLSearchParams();
    data.append('member_id', user_id);


    let acountInfoResp = this.http
      .post(this.sharedServiceObj.registerationApiBaseUrl + 'members/generalinfo', data,
      this.headerOptions)
      .map(this.extractData)
    return acountInfoResp;
  }
  updateAccount(user_id: string, dataObj:any) {
    // debugger;
    let data = new URLSearchParams();
    if(dataObj.email!="")
    {
      data.append('email', dataObj.email);
    }
    if(dataObj.password!="")
    {
      data.append('password', dataObj.password);
    }
    if(dataObj.first_name!="")
    {
      data.append('first_name', dataObj.first_name);
    }
    if(dataObj.last_name!="")
    {
      data.append('last_name', dataObj.last_name);
    }
    if(dataObj.phone_number!="")
    {
      data.append('phone_mobile', dataObj.phone_number);
    }
    if(dataObj.timezone!="")
    {
      data.append('timezone', dataObj.timezone);
    }
    data.append('member_id', user_id);
//debugger;
    let accountUpdatingResp = this.http
      .post(this.sharedServiceObj.registerationApiBaseUrl + 'members/updateAccountInfo', data,
      this.headerOptions)
      .map(this.extractData)
    return accountUpdatingResp;
  }
  loadCountryCodes() {
    let data = new URLSearchParams();
    let countryCodesResp = this.http
      .post(this.sharedServiceObj.registerationApiBaseUrl + 'members/countryphonecodes', data,
      this.headerOptions)
      .map(this.extractData)
    return countryCodesResp;
  }
  sendContactUsEmail(reason: string, firstName: string, lastName: string, phoneNumber: number, emailAddress: string,
    message: string, service_id: string, captchaResp: string) {
    //debugger;
    let data = new URLSearchParams();
    data.append('firstName', firstName);
    data.append('lastName', lastName);
    data.append('emailAddress', emailAddress);
    data.append('phoneNumber', phoneNumber.toString());
    data.append('message', message);
    data.append('reason', reason);
    data.append('service_id', service_id);
    //data.append('ip_address',ip_address)
    data.append('g-recaptcha-response', captchaResp)
    let contactUsResp = this.http
      .post(this.sharedServiceObj.registerationApiBaseUrl + 'General/contactForm', data,
      this.headerOptions)
      .map(this.extractData)
    return contactUsResp;
  }
  deleteLead(lead_id:string){

    let data = new URLSearchParams();
 data.append('lead_id',lead_id);
  let deleteLeadResp=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/deleteLead', data, this.headerOptions)
    .map(this.extractData)
    return deleteLeadResp;
}
leadDetail(lead_id:string,member_id:string){

    let data = new URLSearchParams();
 data.append('lead_id',lead_id);
data.append('member_id',member_id);
  let searchedListing=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/viewLeadDetails', data, this.headerOptions)
    .map(this.extractData)
    return searchedListing;
}
createLead(member_id:string,website_id:string,email:string,password:string,first_name:string,last_name:string,phone_office:number,phone_mobile:number,phone_home:number){
let phone_office_num="";
let phone_mobile_num="";
let phone_home_num="";

if(phone_office!=null)
{
  phone_office_num=phone_office.toString();
}
if(phone_mobile!=null)
{
  phone_mobile_num=phone_mobile.toString();
}
if(phone_home!=null)
{
  phone_home_num=phone_home.toString();
}

    let data = new URLSearchParams();
data.append('email',email);
data.append('password',password);
data.append('first_name',first_name);
data.append('last_name',last_name);
data.append('phone_office',phone_office_num);
data.append('phone_mobile',phone_mobile_num);
data.append('phone_home',phone_home_num);
data.append('website_id',website_id);

  let searchedListing=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/createLead', data, this.headerOptions)
    .map(this.extractData)
    return searchedListing;
}
updateLead(website_id:string,lead_id:string,email:string,password:string,first_name:string,last_name:string,phone_office:number,phone_mobile:number,phone_home:number){
let phone_office_num="";
let phone_mobile_num="";
let phone_home_num="";

if(phone_office!=null)
{
  phone_office_num=phone_office.toString();
}
if(phone_mobile!=null)
{
  phone_mobile_num=phone_mobile.toString();
}
if(phone_home!=null)
{
  phone_home_num=phone_home.toString();
}

    let data = new URLSearchParams();
 data.append('lead_id',lead_id);
data.append('email',email);
data.append('password',password);
data.append('first_name',first_name);
data.append('last_name',last_name);
data.append('phone_office',phone_office_num);
data.append('phone_mobile',phone_mobile_num);
data.append('phone_home',phone_home_num);
data.append('website_id',website_id);

  let searchedListing=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/updateLead', data, this.headerOptions)
    .map(this.extractData)
    return searchedListing;
}

allLeads(user_id:string){

    let data = new URLSearchParams();
 data.append('member_id',user_id);

  let savedListing=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/viewAllLeads', data, this.headerOptions)
    .map(this.extractData)
    return savedListing;
}
allUserWebsites(user_id:string){

    let data = new URLSearchParams();
 data.append('member_id',user_id);

  let websiteListing=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/viewAllWebsites', data, this.headerOptions)
    .map(this.extractData)
    return websiteListing;
}
createWebsite(user_id:string,isActive:string,website_domain:string){
//debugger;
    let data = new URLSearchParams();
    data.append('website_domain',website_domain);
 data.append('member_id',user_id);
 data.append('active',isActive);
 data.append('mls_server_id',this.sharedServiceObj.mlsServerId);
//debugger;
  let websiteListing=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/createWebsite', data, this.headerOptions)
    .map(this.extractData)
    return websiteListing;
}
editWebsite(user_id:string,website_id:string){

    let data = new URLSearchParams();
 data.append('member_id',user_id);
 data.append('id',website_id);

  let websiteListing=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/editWebsite', data, this.headerOptions)
    .map(this.extractData)
    return websiteListing;
}
updateWebsite(user_id:string,isActive:string,website_domain:string,website_id:string){

    let data = new URLSearchParams();
    data.append('website_domain',website_domain);
 data.append('member_id',user_id);
 data.append('active',isActive);
 data.append('id',website_id);
 data.append('mls_server_id',this.sharedServiceObj.mlsServerId);

  let websiteListing=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/updateWebsite', data, this.headerOptions)
    .map(this.extractData)
    return websiteListing;
}
deleteWebsite(user_id:string,website_id:string){

    let data = new URLSearchParams();
 data.append('member_id',user_id);
 data.append('id',website_id);

  let websiteListing=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/deleteWebsite', data, this.headerOptions)
    .map(this.extractData)
    return websiteListing;
}
allUserHotSheets(user_id:string){
    let data = new URLSearchParams();
 data.append('member_id',user_id);
//debugger;
  let websiteListing=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/viewAllSavedHotsheets', data, this.headerOptions)
    .map(this.extractData)
    return websiteListing;
}
createHotSheet(user_id:string,website_id:string,mlsServerId:string,name:string,slug:string,
  json_search:any,brief_description:any,main_description:any,virtual_tour_url:any,video_url:any,sub_city:any){

let data = new URLSearchParams();
 data.append('name',name);
 data.append('member_id',user_id);
 data.append('slug',slug);
 data.append('mls_server_id',mlsServerId);
 data.append('website_id',website_id);
 data.append('search_results_json',json_search);
 data.append('polygon_search',"");
 data.append('local',"");
 data.append('administrative_area_level_1',"");
 data.append('community',"");
 data.append('main_description',main_description);
 data.append('brief_description',brief_description);
 data.append('sub_city',sub_city);
 data.append('video_url',video_url);
 data.append('virtual_tour_url',virtual_tour_url);
//debugger;
  let hotSheetCreatingResp=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/createHotsheet', data, this.headerOptions)
    .map(this.extractData)
    return hotSheetCreatingResp;
}
checkHotSheetSlug(slug:string,user_id:string){
  let data = new URLSearchParams();
 data.append('slug',slug);
 data.append('member_id',user_id);
  let hotSheetCheckResp=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/checkHotsheetSlug', data, this.headerOptions)
    .map(this.extractData)
    return hotSheetCheckResp;
}
editHotSheet(user_id:string,id:string){
//  debugger;
  let data = new URLSearchParams();
 data.append('id',id);
 data.append('member_id',user_id);
  let hotSheetCheckResp=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/editSavedHotsheet', data, this.headerOptions)
    .map(this.extractData)
    return hotSheetCheckResp;
}
updateHotSheet(id:string,user_id:string,website_id:string,mlsServerId:string,name:string,slug:string,json_search:any){
 // debugger;
let data = new URLSearchParams();
 data.append('name',name);
 data.append('member_id',user_id);
 data.append('slug',slug);
 data.append('mls_server_id',mlsServerId);
 data.append('website_id',website_id);
 data.append('json_search',json_search);
 data.append('id',id);

  let hotSheetUpdatingResp=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/updateSavedHotsheet', data, this.headerOptions)
    .map(this.extractData)
    return hotSheetUpdatingResp;
}
deleteHotsheet(user_id:string,id:string){
  let data = new URLSearchParams();
 data.append('member_id',user_id);
 data.append('id',id);

let hotSheetDeletingResp=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/deleteSavedHotsheet', data, this.headerOptions)
    .map(this.extractData)
    return hotSheetDeletingResp;
}
  private extractData(res: Response) {
//  debugger;
    return res.json();
  }
  private handleErrorObservable(error: Response | any) {
    /// debugger;
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }
  private handleErrorPromise(error: Response | any) {

    console.error(error.message || error);
    return Promise.reject(error.message || error);
  }
}
