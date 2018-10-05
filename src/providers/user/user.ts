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
import { AllLeadsPage } from '../../pages/leads/all-leads/all-leads';
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
declare var firebase:any;
@Injectable()
export class UserProvider {
  public fbLoginDecision: EventEmitter<String>;
  private headers: Headers = new Headers();
  private headerOptions: RequestOptions = new RequestOptions();
  private headersIDX: Headers = new Headers();
  private headerOptionsIDX: RequestOptions = new RequestOptions();
  public fbLoginStatus: any;
  public facebookObject: any;
  public fbAuthResp: any;
  public isApp=false;
  private firbase_token_data="";
  private device_name="Browser";
  constructor(public sharedServiceObj: SharedProvider,public platform: Platform,private http: Http,
    private storage: Storage, public modalCtrl: ModalController,private fb: Facebook) {

    this.fbLoginDecision = new EventEmitter();
    this.headersIDX.append("IDXKEY",this.sharedServiceObj.idxapiKey);
this.headerOptionsIDX= new RequestOptions({ headers: this.headersIDX });
this.headers.append("REGISTRATIONKEY",this.sharedServiceObj.registerationApiKey);
this.headerOptions= new RequestOptions({ headers: this.headers });
   // this.headers.append("IDX-API-KEY",this.sharedServiceObj.idxapiKey);
//this.headerOptionsIDX= new RequestOptions({ headers: this.headers });
    /*if(this.platform.is('core') || this.platform.is('mobileweb') || this.platform.is('cordova') || this.platform.is('mobile')) {
      this.isApp=false;
    }
    else
    {
      this.isApp=true;
    }*/
    if(this.platform.is('ios')) {
      this.device_name="IOS";
    }
    else if(this.platform.is('ipad')) {
      this.device_name="iPad";
    }
    else if(this.platform.is('iphone')) {
      this.device_name="iPhone";
    }
    else if(this.platform.is('android')) {
      this.device_name="Android";
    }
    else if(this.platform.is('phablet')) {
      this.device_name="Phable";
    }
    else if(this.platform.is('tablet')) {
      this.device_name="Tablet";
    }
    else if(this.platform.is('windows')) {
      this.device_name="Windows";
    }
    this.isApp = (!document.URL.startsWith("http"));
    if(!this.isApp)
    {
    //alert('1');
    FB.init({
      appId: '701598080041539',
      cookie: false,
      xfbml: true,
      version: 'v2.9',
      status: true
    });
    this.facebookObject = FB;
    this.facebookObject.getLoginStatus(response => {
//alert('1..');
      this.fbLoginStatus = response;

    }, true);
  }
  else
  {
    
    //this.fb.browserInit(701598080041539,'v2.9');
    this.facebookObject = this.fb;
    let status=this.facebookObject.getLoginStatus();  
    status.then((resp)=>{
   
      this.fbLoginStatus = resp;
    }).catch((error) => {
     
      console.log('Error getting location', error);
    });
  }
    //this.fb.browserInit(701598080041539,'v2.9');
    let firbase_token = this.storage.get('firebase_token');
    firbase_token.then((data) => {
    //debugger;
      //this.firebase_token_data=data;
      this.firbase_token_data=data;
    });

  
  }
  onFacebookLoginClick(): void {
   //alert('3');
    if (this.fbLoginStatus != undefined) {
     //alert('4');
      this.statusChangeCallback(this.fbLoginStatus);
    }

  }
  setFireBaseInfo(email:string,password:string,webUserId:string,first_name:string,last_name:string,
    image_url:string,parent_id:string,is_submember:string,is_lead:string,website_id:string)
  {
  
   let that=this;
 //debugger;
 let is_online="0";
 if(is_lead=="0")
 {
is_online="1";
 }
 else
 {
   is_online="0";
 }
var i=0;
var userExists="0";
//debugger;
    firebase.database().ref('users').orderByChild("email").equalTo(email).once("value", function(snapshot) {
     
      i=0;

      if(snapshot.exists())
      {
        snapshot.forEach(element => {
i=i+1;
if(element.val().is_lead=="0"&&element.val().website_id==website_id)
{
  
  userExists="1";
}
if(i==snapshot.numChildren())
{
  if(userExists=="1")
  {
    that.storage.set('firebaseUserId',element.key);
    //window.localStorage.setItem("firebaseKey", element.key);
    //debugger;
    var fredRef=firebase.database().ref('users/'+element.key);
    fredRef.update({isOnline:is_online,webUserId:webUserId,first_name: first_name,
    last_name:last_name,
    user_type:"1",
    is_lead:is_lead,
    is_submember:is_submember,
    website_id:website_id,
    image_url: image_url,
    parent_id: parent_id,
    fbId:element.key,
    verified: "1",
    email:email}).then(function(ref) {
      //location.reload();
      }, function(error) {
    
     //location.reload();
      });
  }
  else
  {
    
    var fredRefUser=firebase.database().ref('users');
    fredRefUser.push({isOnline:is_online,webUserId:webUserId,first_name: first_name,
    last_name:last_name,
    user_type:"1",
    is_lead:is_lead,
    is_submember:is_submember,
    website_id:website_id,
    image_url: image_url,
    parent_id: parent_id,
    verified: "1",
    email:email}).then(function(ref) {
      //debugger;
      that.storage.set('firebaseUserId',ref.getKey());
      //debugger;
      //window.localStorage.setItem("firebaseKey", ref.getkey());
      var fredRefUpdate=firebase.database().ref('users/'+ref.getKey());
      fredRefUpdate.update({fbId:ref.getKey()});
    //location.reload();
      
      }, function(error) {
    
     //location.reload();
      });
  }
}
        });
      }
      else
      {
      
    var fredRefUser1=firebase.database().ref('users');
    fredRefUser1.push({isOnline:is_online,webUserId:webUserId,first_name: first_name,
    last_name:last_name,
    user_type:"1",
    is_lead:is_lead,
    is_submember:is_submember,
    website_id:website_id,
    image_url: image_url,
    parent_id: parent_id,
    verified: "1",
    email:email}).then(function(ref) {
      //debugger;
      that.storage.set('firebaseUserId',ref.getKey());
     
      var fredRefUser1Update=firebase.database().ref('users/'+ref.getKey());
      fredRefUser1Update.update({fbId:ref.getKey()});
    
      
      }, function(error) {
     //debugger;
   
      });
      }
    });
   /*firebase.auth().createUserWithEmailAndPassword(email,password)
                 .then(function (currentUser) {
                  // debugger;
                  firebase.auth().signInWithEmailAndPassword(email, password)
                  .then(function(currentUser) {

               that.storage.set('firebaseUserId',currentUser.uid);
               that.saveFireBaseUserInfo(email,password,webUserId,first_name,last_name,
                image_url,parent_id,is_submember,is_lead,website_id,currentUser);
                  }).catch(function(error) {
                    
                    console.log("Authentication failed:", error);
                   
                  });
                 }).catch(function(error) {

                  firebase.auth().signInWithEmailAndPassword(email, password)
                  .then(function(currentUser) {

               that.storage.set('firebaseUserId',currentUser.uid);
               that.saveFireBaseUserInfo(email,password,webUserId,first_name,last_name,
                image_url,parent_id,is_submember,is_lead,website_id,currentUser);
                  }).catch(function(error) {
                    
                    console.log("Authentication failed:", error);
                   
                  });
     
     });*/
      

  }
  /*saveFireBaseUserInfo(email:string,password:string,webUserId:string,first_name:string,last_name:string,
    image_url:string,parent_id:string,is_submember:string,is_lead:string,website_id:string,currentUser:any)
  {
  let is_online="0";
    if(is_lead=="0")
    {
is_online="1";
    }
    else
    {
      is_online="0";
    }
   //debugger;
    var fredRef=firebase.database().ref('users/'+currentUser.uid);
    
    fredRef.update({isOnline:is_online,webUserId:webUserId,first_name: first_name,
    last_name:last_name,
    user_type:"1",
    is_lead:is_lead,
    is_submember:is_submember,
    website_id:website_id,
    image_url: image_url,
    parent_id: parent_id,
    verified: "1",
    email:email,fbId:currentUser.uid}).then(function() {
    // debugger;
      currentUser.updateProfile({
        displayName: first_name+" "+last_name
   
   }).then(function() {
   //debugger;
   // Update successful.
   }, function(error) {
   //debugger;
   // An error happened.
   });
      // Update successful.
      }, function(error) {
     // debugger;
      // An error happened.
      });
       
  }*/
  
  updateFirebaseUserInfo(result:any,userId:string)
  {
    var fredRef=firebase.database().ref('users/'+userId);
    //debugger;
    fredRef.update({isOnline:'1',first_name: result.first_name,
    last_name:result.last_name,
    image_url: result.image_url,
    email:result.email});
       
  }
  statusChangeCallback(resp) {

    if (resp != 0) {
      if (resp.status === 'connected') {
        //alert('5');
    if(!this.isApp)
        {
        //alert('6');
        this.facebookObject.api('/me', { locale: 'en_US', fields: 'name, email,picture' }, this.setFacebookAuthentication.bind(this));
        }
        else
        {
         //alert('7');
          this.fb.api('/me?fields=id,name,email,picture',['public_profile', 'user_friends', 'email'])
          .then((res: any) =>{this.setFacebookAuthentication(res)})
          .catch(e => {console.log('Error getting location', e);});
        }
      } else if (resp.status === 'not_authorized') {
        //alert('8');
        
      } else {
       
        if(!this.isApp)
        {
        // alert('9');
         // alert('yes');
          this.facebookObject.login(this.checkFacebookResp.bind(this));
        }
       else
       {
      //alert('10');
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
     //alert('11');
       this.facebookObject.login(this.checkFacebookResp.bind(this));
     }
    else
    {
     // alert('12');
    this.fb.login(['public_profile', 'user_friends', 'email'])
    .then((res: FacebookLoginResponse) =>{this.checkFacebookResp(res)})
    .catch(e => {console.log('Error getting location', e);});
    } 
    }
  };
  checkFacebookResp(resp: any) {
//alert('first');
    if (resp.authResponse) {
      if(!this.isApp)
      {
     //alert('14');
      this.facebookObject.api('/me', { locale: 'en_US', fields: 'name, email,picture' }, this.setFacebookAuthentication.bind(this));
      }
      else
      {
     //alert('15');
        this.fb.api('/me?fields=id,name,email,picture',['public_profile', 'user_friends', 'email'])
      .then((res: any) =>{this.setFacebookAuthentication(res)})
      .catch(e => {console.log('Error getting location', e);});
      }
    }

  }
  setFacebookAuthentication(response: any): void {
   // alert('here');
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
//alert('now');
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
        this.storage.set('globalSettings',result.globalSettings);
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
    //debugger;
    data.append('email', email);
    data.append('password', password);
    data.append('firebase_token', this.firbase_token_data);
    data.append('device_name', this.device_name);
    let loggedInStatus = this.http
      .post(url, data, this.headerOptions)
      .map(this.extractData)
    return loggedInStatus;
  }
  userSignUp(dataObj: any) {
    let firbase_token = this.storage.get('firebase_token');
    firbase_token.then((data) => {
 
      this.firbase_token_data=data;
    });
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
    data.append('firebase_token', this.firbase_token_data);
    data.append('device_name', this.device_name);
    data.append('location', dataObj.location);
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
    if(dataObj.agent_title!="")
    {
      data.append('agent_title', dataObj.agent_title);
    }
    if(dataObj.description!="")
    {
      data.append('description', dataObj.description);
    }
    if(dataObj.company!="")
    {
      data.append('company', dataObj.company);
    }
    if(dataObj.phone_number!="")
    {
      data.append('phone_mobile', dataObj.phone_number);
    }
    if(dataObj.agent_id!="")
    {
      data.append('agent_id', dataObj.agent_id);
    }
    if(dataObj.office_id!="")
    {
      data.append('office_id', dataObj.office_id);
    }
    if(dataObj.broker_id!="")
    {
      data.append('broker_id', dataObj.broker_id);
    }
    if(dataObj.country_code!="")
    {
      data.append('country_code', dataObj.country_code);
    }
    if(dataObj.country_abbv!="")
    {
      data.append('country_abbv', dataObj.country_abbv);
    }
    if(dataObj.mls_server_id!="")
    {
      data.append('mls_server_id', dataObj.mls_server_id);
    }
    //debugger;
    //if(dataObj.timezone!="")
   // {
   //   data.append('timezone', dataObj.timezone);
    //}
  if(dataObj.photo_personal!="")
   {
    data.append('photo_personal', dataObj.photo_personal);
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
  deleteLead(lead_id:string,user_id:string){

    let data = new URLSearchParams();
 data.append('lead_id',lead_id);
 data.append('member_id',user_id);
  let deleteLeadResp=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/deleteLead', data, this.headerOptionsIDX)
    .map(this.extractData)
    return deleteLeadResp;
}
leadDetail(lead_id:string,member_id:string){

    let data = new URLSearchParams();
 data.append('lead_id',lead_id);
data.append('member_id',member_id);
  let searchedListing=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/viewLeadDetails', data, this.headerOptionsIDX)
    .map(this.extractData)
    return searchedListing;
}
createLead(member_id:string,website_id:string,email:string,password:string,first_name:string,
  last_name:string,phone_office:number,phone_mobile:number,phone_home:number,home_address_street:string,
  home_address_city:string,home_address_state_or_province:string,home_address_zipcode:string,work_address_street:string,
  work_address_city:string,work_address_state_or_province:string,work_zipcode:string,assigned_agent_id:string,
  category:string,internal_notes:string,home_address:string,home_lat_lng:string,home_google_place_id:string,
  work_address:string,work_lat_lng:string,work_google_place_id:string,leadImage:string){
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
data.append('member_id',member_id);

data.append('home_address_street',home_address_street);
data.append('home_address_city',home_address_city);
data.append('home_address_state_or_province',home_address_state_or_province);
data.append('home_address_zipcode',home_address_zipcode);
data.append('work_address_street',work_address_street);
data.append('work_address_city',work_address_city);
data.append('work_address_state_or_province',work_address_state_or_province);

data.append('work_zipcode',work_zipcode);
data.append('assigned_agent_id',assigned_agent_id);
data.append('category',category);
data.append('internal_notes',internal_notes);

data.append('home_address',home_address);
data.append('home_lat_lng',home_lat_lng);
data.append('home_google_place_id',home_google_place_id);
data.append('work_address',work_address);
data.append('work_lat_lng',work_lat_lng);
data.append('work_google_place_id',work_google_place_id);
data.append('image_url',leadImage);
//data.append('image_url',leadImage);
//debugger;
  let searchedListing=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/createLead', data, this.headerOptionsIDX)
    .map(this.extractData)
    return searchedListing;
}
updateLead(member_id:string,website_id:string,lead_id:string,email:string,password:string,
  first_name:string,last_name:string,phone_office:number,phone_mobile:number,phone_home:number,home_address_street:string,
  home_address_city:string,home_address_state_or_province:string,home_address_zipcode:string,work_address_street:string,
  work_address_city:string,work_address_state_or_province:string,work_zipcode:string,assigned_agent_id:string,
  category:string,internal_notes:string,home_address:string,home_lat_lng:string,home_google_place_id:string,
  work_address:string,work_lat_lng:string,work_google_place_id:string,leadImage:string){
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
data.append('member_id',member_id);   
 data.append('lead_id',lead_id);
data.append('email',email);
data.append('password',password);
data.append('first_name',first_name);
data.append('last_name',last_name);
data.append('phone_office',phone_office_num);
data.append('phone_mobile',phone_mobile_num);
data.append('phone_home',phone_home_num);
data.append('website_id',website_id);

data.append('home_address_street',home_address_street);
data.append('home_address_city',home_address_city);
data.append('home_address_state_or_province',home_address_state_or_province);
data.append('home_address_zipcode',home_address_zipcode);
data.append('work_address_street',work_address_street);
data.append('work_address_city',work_address_city);
data.append('work_address_state_or_province',work_address_state_or_province);

data.append('work_zipcode',work_zipcode);
data.append('assigned_agent_id',assigned_agent_id);
data.append('category',category);
data.append('internal_notes',internal_notes);

data.append('home_address',home_address);
data.append('home_lat_lng',home_lat_lng);
data.append('home_google_place_id',home_google_place_id);
data.append('work_address',work_address);
data.append('work_lat_lng',work_lat_lng);
data.append('work_google_place_id',work_google_place_id);
data.append('image_url',leadImage);
//debugger;
  let searchedListing=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/updateLead', data, this.headerOptionsIDX)
    .map(this.extractData)
    return searchedListing;
}
updateLeadNotes(lead_id:string,internal_notes:string){
    let data = new URLSearchParams();
//debugger;
 data.append('lead_id',lead_id);
data.append('internal_notes',internal_notes);
//debugger;
  let updateNotes=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/updateLeadNotes', data, this.headerOptionsIDX)
    .map(this.extractData)
    return updateNotes;
}
allLeads(user_id:string,category:string){
//debugger;
    let data = new URLSearchParams();
 data.append('member_id',user_id);
data.append('category',category);
  let savedListing=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/viewAllLeads', data, this.headerOptionsIDX)
    .map(this.extractData)
    return savedListing;
}

viewLeadRouting(website_id:string){

  let data = new URLSearchParams();
data.append('website_id',website_id);
//debugger;
let leadRouting=this.http
  .post(this.sharedServiceObj.registerationApiBaseUrl+'members/viewWebsiteLeadRouting', data, this.headerOptions)
  .map(this.extractData)
  return leadRouting;
}
updateLeadRouting(website_id:string,send_to_email_addresses:string,
  send_to_zillow_crm:string,send_to_intagent_crm:string,send_to_zapier:string,
  agent_microsites:string,send_to_roundrobin:string){
//debugger;
  let data = new URLSearchParams();
  data.append('website_id',website_id);
  data.append('send_to_email_addresses',send_to_email_addresses);
  data.append('send_to_zillow_crm',send_to_zillow_crm);
  data.append('send_to_intagent_crm',send_to_intagent_crm);
  data.append('send_to_zapier',send_to_zapier);
  data.append('send_to_roundrobin',send_to_roundrobin);
  data.append('agent_microsites',agent_microsites);

  let leadRouting=this.http
  .post(this.sharedServiceObj.registerationApiBaseUrl+'members/updateWebsiteLeadRouting', data, this.headerOptions)
  .map(this.extractData)
  return leadRouting;
}
sendAppInvitation(phone_number:string,message:string){
  //debugger;
      let data = new URLSearchParams();
   data.append('phone_number',phone_number);
  data.append('message',message);
    let leadInvitation=this.http
      .post(this.sharedServiceObj.registerationApiBaseUrl+'members/sendAppInvitation', data, this.headerOptions)
      .map(this.extractData)
      return leadInvitation;
  }
  sendEmailToContact(toUserId:string,subject:string,message:string,service_id:string){
    //debugger;
        let data = new URLSearchParams();
     data.append('to','user_'+toUserId);
     data.append('from','noreply@idxcompany.com');
    data.append('json_message',message);
    data.append('notification_type','message');
    data.append('title',subject);
    data.append('service_id',service_id);
    debugger;
      let contactEmail=this.http
        .post(this.sharedServiceObj.registerationApiBaseUrl+'messaging/sendEmailMessage', data, this.headerOptions)
        .map(this.extractData)
        return contactEmail;
    }
allUserWebsites(user_id:string){
    let data = new URLSearchParams();
 data.append('member_id',user_id);
//debugger;
  let websiteListing=this.http
    .post(this.sharedServiceObj.registerationApiBaseUrl+'members/viewAllWebsites', data, this.headerOptions)
    .map(this.extractData)
    return websiteListing;
}
createWebsite(user_id:string,isActive:string,website_domain:string,identity_name:string,
  intagent_website:number,website_a_record_location:string,identity_phone_number:string,homepage_description:string,
  homepageMeta_description:string,homepage_search_text:string,homepage_meta_title:string,
  mls_server_id:any,agent_id:string,office_id:string,broker_id:string,
  colorBase:string,secondColor:string,thirdColor:string,headerColor:string,
  sideBarMenuColor:string,buttonColor:string,textColor:string,backgroundColor:string,
  headerColorOption:string,sideBarMenuColorOption:string,
  buttonColorOption:string,textColorOption:string,backgroundColorOption:string,customColorOption:boolean,
  contentTitleColor:string,contentTitleColorOption:string,paginationColor:string,paginationColorOption:string,
  modalBackgroundColor:string,modalBackgroundColorOption:string,mapSidebarColor:string,mapSidebarColorOption:string,
  show_new_listings:string,show_open_houses:string,feature_agent_listings:string,
  feature_broker_listings:string,
  feature_office_listings:string,isSsl:string){
//debugger;
    let data = new URLSearchParams();
    data.append('website_domain',website_domain);
    data.append('identity_name',identity_name);
 data.append('member_id',user_id);
 data.append('active',isActive);
 data.append('mls_server_id',mls_server_id);

 data.append('intagent_website',intagent_website.toString());
 data.append('website_a_record_location',website_a_record_location);
data.append('identity_phone_number',identity_phone_number);
data.append('homepage_description',homepage_description);
data.append('homepageMeta_description',homepageMeta_description);
data.append('homepage_search_text',homepage_search_text);
data.append('homepage_meta_title',homepage_meta_title);
data.append('agent_id',agent_id);
data.append('office_id',office_id);
data.append('broker_id',broker_id);

data.append('color_base',colorBase);
data.append('color_second',secondColor);
data.append('color_third',thirdColor);
data.append('header_color',headerColor);
data.append('side_bar_menu_color',sideBarMenuColor);
data.append('button_color',buttonColor);
data.append('text_color',textColor);
data.append('content_background',backgroundColor);
data.append('header_color_option',headerColorOption);
data.append('side_bar_menu_color_option',sideBarMenuColorOption);
data.append('button_color_option',buttonColorOption);
data.append('text_color_option',textColorOption);
data.append('content_background_option',backgroundColorOption);
data.append('isCustomColor',customColorOption.toString());
data.append('content_title_color',contentTitleColor);
    data.append('content_title_color_option',contentTitleColorOption);
    data.append('pagination_color',paginationColor);
    data.append('pagination_color_option',paginationColorOption);
    data.append('modal_background_color',modalBackgroundColor);
    data.append('modal_background_color_option',modalBackgroundColorOption);
    data.append('map_sidebar_color',mapSidebarColor);
    data.append('map_sidebar_color_option',mapSidebarColorOption);

    data.append('show_new_listings',show_new_listings);
 data.append('show_open_houses',show_open_houses);
 data.append('feature_agent_listings',feature_agent_listings);
 data.append('feature_broker_listings',feature_broker_listings);
 data.append('feature_office_listings',feature_office_listings);
 data.append('isSsl',isSsl);
//debugger;
  let websiteListing=this.http
    .post(this.sharedServiceObj.registerationApiBaseUrl+'members/createWebsite', data, this.headerOptions)
    .map(this.extractData)
    return websiteListing;
}
editWebsite(user_id:string,website_id:string){

    let data = new URLSearchParams();
 data.append('member_id',user_id);
 data.append('id',website_id);

  let websiteListing=this.http
    .post(this.sharedServiceObj.registerationApiBaseUrl+'members/editWebsite', data, this.headerOptions)
    .map(this.extractData)
    return websiteListing;
}
updateWebsite(user_id:string,isActive:string,website_domain:string,website_id:string,contact_email:string,
  header_wrapper:string,footer_wrapper:string,intagent_website:string,custom_css:string,
  show_new_listings:string,show_open_houses:string,feature_agent_listings:string,
  feature_broker_listings:string,
  feature_office_listings:string,identity_name:string,identity_logo:string,
  identity_icon:string,website_a_record_location:string,identity_phone_number:string,homepage_description:string,
  homepageMeta_description:string,homepage_search_text:string,homepage_meta_title:string,
  agent_id:string,office_id:string,broker_id:string,mls_server_id:any,
  colorBase:string,secondColor:string,thirdColor:string,headerColor:string,
  sideBarMenuColor:string,buttonColor:string,textColor:string,backgroundColor:string,
  headerColorOption:string,sideBarMenuColorOption:string,
  buttonColorOption:string,textColorOption:string,backgroundColorOption:string,customColorOption:boolean,
  contentTitleColor:string,contentTitleColorOption:string,paginationColor:string,paginationColorOption:string,
  modalBackgroundColor:string,modalBackgroundColorOption:string,
  mapSidebarColor:string,mapSidebarColorOption:string,navigationColor:string,navigationColorOption:string){

let data = new URLSearchParams();
 data.append('website_domain',website_domain);
 data.append('member_id',user_id);
 data.append('active',isActive);
 data.append('id',website_id);
 data.append('mls_server_id',mls_server_id);
 data.append('contact_email',contact_email);
 data.append('identity_name',identity_name);
 data.append('identity_logo',identity_logo);
 data.append('identity_icon',identity_icon);
 data.append('header_wrapper',header_wrapper);
 data.append('footer_wrapper',footer_wrapper);
 data.append('intagent_website',intagent_website);
 data.append('custom_css',custom_css);
 data.append('show_new_listings',show_new_listings);
 data.append('show_open_houses',show_open_houses);
 data.append('feature_agent_listings',feature_agent_listings);
 data.append('feature_broker_listings',feature_broker_listings);
 data.append('feature_office_listings',feature_office_listings);

 data.append('website_a_record_location',website_a_record_location);
data.append('identity_phone_number',identity_phone_number);
data.append('homepage_description',homepage_description);
data.append('homepageMeta_description',homepageMeta_description);
data.append('homepage_search_text',homepage_search_text);
data.append('homepage_meta_title',homepage_meta_title);
data.append('agent_id',agent_id);
data.append('office_id',office_id);
data.append('broker_id',broker_id);

data.append('color_base',colorBase);
data.append('color_second',secondColor);
data.append('color_third',thirdColor);
data.append('header_color',headerColor);
data.append('side_bar_menu_color',sideBarMenuColor);
data.append('button_color',buttonColor);
data.append('text_color',textColor);
data.append('content_background',backgroundColor);
data.append('header_color_option',headerColorOption);
data.append('side_bar_menu_color_option',sideBarMenuColorOption);
data.append('button_color_option',buttonColorOption);
data.append('text_color_option',textColorOption);
data.append('content_background_option',backgroundColorOption);
data.append('isCustomColor',customColorOption.toString());
data.append('content_title_color',contentTitleColor);
    data.append('content_title_color_option',contentTitleColorOption);
    data.append('pagination_color',paginationColor);
    data.append('pagination_color_option',paginationColorOption);
    data.append('modal_background_color',modalBackgroundColor);
    data.append('modal_background_color_option',modalBackgroundColorOption);
    data.append('map_sidebar_color',mapSidebarColor);
    data.append('map_sidebar_color_option',mapSidebarColorOption);
    data.append('navigation_color',navigationColor);
    data.append('navigation_color_option',navigationColorOption);
//debugger;
  let websiteListing=this.http
    .post(this.sharedServiceObj.registerationApiBaseUrl+'members/updateWebsite', data, this.headerOptions)
    .map(this.extractData)
    return websiteListing;
}
deleteWebsite(user_id:string,website_id:string){

    let data = new URLSearchParams();
 data.append('member_id',user_id);
 data.append('id',website_id);

  let websiteListing=this.http
    .post(this.sharedServiceObj.registerationApiBaseUrl+'members/deleteWebsite', data, this.headerOptions)
    .map(this.extractData)
    return websiteListing;
}
loadAllWebsiteLinks(user_id:string,website_id:string){

  let data = new URLSearchParams();
data.append('member_id',user_id);
data.append('website_id',website_id);

let websiteLinks=this.http
  .post(this.sharedServiceObj.registerationApiBaseUrl+'members/viewWebsiteLinks', data, this.headerOptions)
  .map(this.extractData)
  return websiteLinks;
}
loadAllWebsiteInfoByDomain(domain:string){

  let data = new URLSearchParams();
data.append('domain_name',domain);
//debugger;
let websiteDomainInfo=this.http
  .post(this.sharedServiceObj.registerationApiBaseUrl+'members/viewWebsiteInfoByDomain', data, this.headerOptions)
  .map(this.extractData)
  return websiteDomainInfo;
}
allListCreditCards(user_id:string,service_id:string){
  //debugger;
  let data = new URLSearchParams();
data.append('member_id',user_id);
data.append('service_id',service_id);
let creditCardListing=this.http
  .post(this.sharedServiceObj.registerationApiBaseUrl+'PaymentMethods/getMyCardsOnFile', data, this.headerOptions)
  .map(this.extractData)
  return creditCardListing;
}
loadCreditCardDetail(user_id:string,service_id:string,unique_id:string){
  let data = new URLSearchParams();
  data.append('member_id',user_id);
  data.append('service_id',service_id);
  data.append('unique_id',unique_id);
let creditCardDetail=this.http
  .post(this.sharedServiceObj.registerationApiBaseUrl+'PaymentMethods/viewPaymentMethod', data, this.headerOptions)
  .map(this.extractData)
  return creditCardDetail;
}

addCreditCardDetail(creditCardData: any) {
  //debugger;
  let url = "";
  let data = new URLSearchParams();
  url = this.sharedServiceObj.registerationApiBaseUrl + 'PaymentMethods/savePaymentMethod';
  
  data.append('member_id', creditCardData.member_id);
  data.append('service_id',this.sharedServiceObj.service_id);
  data.append('full_name', creditCardData.full_name);
  data.append('cc', creditCardData.cc_number);
  data.append('exp_month', creditCardData.exp_month);
  data.append('exp_year', creditCardData.exp_year);
  data.append('cvc', creditCardData.cvc);
  //data.append('primary_source',creditCardData.primary_source);
 //debugger;
  let addCreditCardResp = this.http
    .post(url, data, this.headerOptions)
    .map(this.extractData)
  return addCreditCardResp;
}
updateCreditCardDetail(user_id:string,service_id:string,unique_id:string,name:string,exp_year:string,
  exp_month:string,zipcode:string,primary_source:string,cvc:string)
{
  let data = new URLSearchParams();
  data.append('member_id',user_id);
  data.append('service_id',service_id);
  data.append('unique_id',unique_id);
  data.append('name',name);
  data.append('exp_year',exp_year);
  data.append('exp_month',exp_month);
  data.append('zipcode',zipcode);
  data.append('cvc',cvc);
  data.append('primary_source',primary_source);
  //debugger;
let creditCardDetail=this.http
  .post(this.sharedServiceObj.registerationApiBaseUrl+'PaymentMethods/updatePaymentMethod', data, this.headerOptions)
  .map(this.extractData)
  return creditCardDetail;
}
deleteCreditCard(user_id:string,service_id:string,unique_id:string){
  let data = new URLSearchParams();
 data.append('member_id',user_id);
 data.append('service_id',service_id);
 data.append('unique_id',unique_id);
//debugger;
//return 0;
let creditCardDeletingResp=this.http
    .post(this.sharedServiceObj.registerationApiBaseUrl+'PaymentMethods/deletePaymentMethod', data, this.headerOptions)
    .map(this.extractData)
    return creditCardDeletingResp;
}

allUserHotSheets(user_id:string){
    let data = new URLSearchParams();
 data.append('member_id',user_id);
  let websiteListing=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/viewAllSavedHotsheets', data, this.headerOptionsIDX)
    .map(this.extractData)
    return websiteListing;
}
createHotSheet(user_id:string,website_id:string,mlsServerId:string,name:string,hotsheet_Title:string,slug:string,
  json_search:any,brief_description:any,main_description:any,virtual_tour_url:any,video_url:any,
  sub_city:any,communityImage:any,headerImage:any,local:any,
  administrative_area_level_1:any,community:any,agent_ids:any,polygon_search:any,
  meta_description:any,meta_title:any,parent_id:any){
    //debugger;
 let data = new URLSearchParams();
 data.append('name',name);
 data.append('title',hotsheet_Title);
 data.append('member_id',user_id);
 data.append('slug',slug);
 //data.append('mls_server_id',mlsServerId);
 data.append('website_id',website_id);
 data.append('search_results_json',json_search);
 data.append('polygon_search',polygon_search);
 data.append('local',local);
 data.append('administrative_area_level_1',administrative_area_level_1);
 data.append('community',community);
 data.append('main_description',main_description);
 data.append('brief_description',brief_description);
 data.append('meta_title',meta_title);
 data.append('meta_description',meta_description);
 data.append('parent_id',parent_id);
 data.append('sub_city',sub_city);
 data.append('video_url',video_url);
 data.append('virtual_tour_url',virtual_tour_url);
 data.append('header_image',headerImage);
 data.append('community_image',JSON.stringify(communityImage));
 data.append('assigned_agent_ids',agent_ids);
//debugger;
  let hotSheetCreatingResp=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/createHotsheet', data, this.headerOptionsIDX)
    .map(this.extractData)
    return hotSheetCreatingResp;
}
checkHotSheetSlug(slug:string,user_id:string){
  let data = new URLSearchParams();
 data.append('slug',slug);
 data.append('member_id',user_id);
  let hotSheetCheckResp=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/checkHotsheetSlug', data, this.headerOptionsIDX)
    .map(this.extractData)
    return hotSheetCheckResp;
}
editHotSheet(user_id:string,id:string){
//  debugger;
  let data = new URLSearchParams();
 data.append('id',id);
 data.append('member_id',user_id);
  let hotSheetCheckResp=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/editSavedHotsheet', data, this.headerOptionsIDX)
    .map(this.extractData)
    return hotSheetCheckResp;
}
updateHotSheet(id:string,user_id:string,website_id:string,mlsServerId:string,name:string,hotsheet_Title:string,slug:string,
  json_search:any,brief_description:any,main_description:any,virtual_tour_url:any,video_url:any,
  sub_city:any,communityImage:any,headerImage:any,local:any,
  administrative_area_level_1:any,community:any,agent_ids:any,polygon_search:any,
  meta_description:any,meta_title:any,parent_id:any){
 let data = new URLSearchParams();
 data.append('id',id);
 data.append('name',name);
 data.append('title',hotsheet_Title);
 data.append('member_id',user_id);
 data.append('slug',slug);
 //data.append('mls_server_id',mlsServerId);
 data.append('website_id',website_id);
 data.append('search_results_json',json_search);
 data.append('polygon_search',polygon_search);
 data.append('local',local);
 data.append('administrative_area_level_1',administrative_area_level_1);
 data.append('community',community);
 data.append('main_description',main_description);
 data.append('brief_description',brief_description);
 data.append('meta_title',meta_title);
 data.append('meta_description',meta_description);
 data.append('parent_id',parent_id);
 data.append('sub_city',sub_city);
 data.append('video_url',video_url);
 data.append('virtual_tour_url',virtual_tour_url);
 data.append('header_image',headerImage);
 data.append('community_image',JSON.stringify(communityImage));
 data.append('assigned_agent_ids',agent_ids);
//debugger;
  let hotSheetUpdatingResp=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/updateSavedHotsheet', data, this.headerOptionsIDX)
    .map(this.extractData)
    return hotSheetUpdatingResp;
}
deleteHotsheet(user_id:string,id:string){
  let data = new URLSearchParams();
 data.append('member_id',user_id);
 data.append('id',id);

let hotSheetDeletingResp=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'members/deleteSavedHotsheet', data, this.headerOptionsIDX)
    .map(this.extractData)
    return hotSheetDeletingResp;
}
viewMemberAgents(user_id:string)
{
  let data = new URLSearchParams();
  data.append('member_id',user_id);
  data.append('service_id',this.sharedServiceObj.service_id.toString());
  let agentListResp=this.http
     .post(this.sharedServiceObj.registerationApiBaseUrl+'members/viewSubMembers', data, this.headerOptions)
     .map(this.extractData)
     return agentListResp;
}
createAgent(user_id:string,first_name:string,last_name:string,email:string,countryCode:string,phone_mobile:string,access_level:any,
password:string,image:string,description:string,mls_id:string,countryCodeAbbv:string)
{
  let data = new URLSearchParams();
  data.append('member_id',user_id);
  data.append('first_name',first_name);
  data.append('last_name',last_name);
  data.append('email',email);
  data.append('country_code',countryCode);
  data.append('country_abbv',countryCodeAbbv);
  data.append('phone_mobile',phone_mobile);
  data.append('access_level',access_level);
  data.append('password',password);
  data.append('mls_id',mls_id);
  data.append('image',image);
  data.append('description',description);
 // debugger;
 let createAgentResp=this.http
     .post(this.sharedServiceObj.registerationApiBaseUrl+'members/createSubMember', data, this.headerOptions)
     .map(this.extractData)
    return createAgentResp;
}
updateAgent(agent_id:string,dataObj:any)
  {
    let data = new URLSearchParams();
    data.append('member_id',agent_id);
    data.append('first_name',dataObj.first_name);
    data.append('last_name',dataObj.last_name);
    data.append('email',dataObj.email);
    data.append('country_code',dataObj.country_code);
    data.append('country_abbv',dataObj.country_abbv);
    data.append('phone_mobile',dataObj.phone_mobile);
    data.append('access_level',dataObj.access_level);
    data.append('password',dataObj.password);
    data.append('mls_id',dataObj.mls_id);
    data.append('image',dataObj.agent_image);
    data.append('description',dataObj.description);
 // debugger;
  let updateAgentResp=this.http
   .post(this.sharedServiceObj.registerationApiBaseUrl+'members/updateSubMember', data, this.headerOptions)
     .map(this.extractData)
       return updateAgentResp;
  }
agentDetail(agent_id:string)
{
  let data = new URLSearchParams();
  data.append('agent_id',agent_id);
  let agentDetailResp=this.http
     .post(this.sharedServiceObj.registerationApiBaseUrl+'members/viewSubMemberDetails', data, this.headerOptions)
     .map(this.extractData)
     return agentDetailResp;
}
deleteAgent(agent_id:string)
{
  let data = new URLSearchParams();
  data.append('member_id',agent_id);
 let agentResp=this.http
     .post(this.sharedServiceObj.registerationApiBaseUrl+'members/deleteSubMember', data, this.headerOptions)
     .map(this.extractData)
     return agentResp;
}
loadAllRoles(member_id:string)
{
  let data = new URLSearchParams();
  //debugger;
  data.append('service_id',this.sharedServiceObj.service_id);
  data.append('member_id',member_id);
 let roleResp=this.http
     .post(this.sharedServiceObj.registerationApiBaseUrl+'members/allRoles', data, this.headerOptions)
     .map(this.extractData)
     return roleResp;
}
deleteRole(role_id:string)
{
  let data = new URLSearchParams();
  //debugger;
  data.append('role_id',role_id);
 let roleResp=this.http
     .post(this.sharedServiceObj.registerationApiBaseUrl+'members/deleteRole', data, this.headerOptions)
     .map(this.extractData)
     return roleResp;
}
loadAllAccessLevels()
{
  let data = new URLSearchParams();
  //debugger;
  data.append('service_id',this.sharedServiceObj.service_id);
 let roleResp=this.http
     .post(this.sharedServiceObj.registerationApiBaseUrl+'members/allAccessLevels', data, this.headerOptions)
     .map(this.extractData)
     return roleResp;
}
createRole(access_level:any,user_id:string,name:string)
{
  let data = new URLSearchParams();
  //debugger;
  data.append('access_level',access_level);
  data.append('member_id',user_id);
  data.append('service_id',this.sharedServiceObj.service_id);
  data.append('name',name);
 // debugger;
 let roleResp=this.http
     .post(this.sharedServiceObj.registerationApiBaseUrl+'members/createRole', data, this.headerOptions)
     .map(this.extractData)
     return roleResp;
}
updateRole(access_level:any,role_id:string,name:string)
{
  let data = new URLSearchParams();
  //debugger;
  data.append('access_level',access_level);

  data.append('role_id',role_id);
  data.append('name',name);
 // debugger;
 let roleResp=this.http
     .post(this.sharedServiceObj.registerationApiBaseUrl+'members/updateRole', data, this.headerOptions)
     .map(this.extractData)
     return roleResp;
}
roleDetail(role_id:string)
{
  let data = new URLSearchParams();
  data.append('role_id',role_id);
 let roleResp=this.http
     .post(this.sharedServiceObj.registerationApiBaseUrl+'members/roleDetail', data, this.headerOptions)
     .map(this.extractData)
     return roleResp;
}

getAllMemberAllowedOptions(allowedOptions)
{
  
  let data = new URLSearchParams();
  //debugger;
    data.append('allowedOptions',allowedOptions);
   let allowedOptionsResp=this.http
       .post(this.sharedServiceObj.registerationApiBaseUrl+'members/memberAllowedOptions', data, this.headerOptions)
       .map(this.extractData)
       return allowedOptionsResp;
}
loadNotificationSettings(member_id:string){
  let data = new URLSearchParams();
    data.append('member_id',member_id);
    data.append('member_id',member_id);
   let notificationSettingsResp=this.http
       .post(this.sharedServiceObj.registerationApiBaseUrl+'members/loadNotificationSettings', data, this.headerOptions)
       .map(this.extractData)
       return notificationSettingsResp;
}
updateNotificationSettings(member_id:string,receive_account_support:any,
  receive_messages:any,receive_policy_and_community:any,receive_promotions_and_tips:any,
  receive_reminders:any){
  let data = new URLSearchParams();
    data.append('member_id',member_id);
    data.append('receive_account_support',receive_account_support);
    data.append('receive_messages',receive_messages);
    data.append('receive_policy_and_community',receive_policy_and_community);
    data.append('receive_promotions_and_tips',receive_promotions_and_tips);
    data.append('receive_reminders',receive_reminders);
    //debugger;
   let notificationSettingsResp=this.http
       .post(this.sharedServiceObj.registerationApiBaseUrl+'members/updateNotificationSettings', data, this.headerOptions)
       .map(this.extractData)
       return notificationSettingsResp;
}
viewGlobalSettings(member_id:string){
  let data = new URLSearchParams();
    data.append('master_id',member_id);
   let viewSettingsResp=this.http
       .post(this.sharedServiceObj.registerationApiBaseUrl+'members/viewGlobalSettings', data, this.headerOptions)
       .map(this.extractData)
       return viewSettingsResp;
}
updateGlobalSettings(member_id:string,personalImage:string,companyImage:string,
  timezone:string,colorBase:string,secondColor:string,thirdColor:string,identity_name:string,display_name_dweller:string,image_dweller:string,headerColor:string,
  sideBarMenuColor:string,buttonColor:string,textColor:string,backgroundColor:string,headerColorOption:string,sideBarMenuColorOption:string,
  buttonColorOption:string,textColorOption:string,backgroundColorOption:string,customColorOption:boolean,
  contentTitleColor:string,contentTitleColorOption:string,paginationColor:string,paginationColorOption:string,
  modalBackgroundColor:string,modalBackgroundColorOption:string,buttonDwellerColor:string,
  buttonDwellerColorOption:string,sideBarDwellerColor:string,sideBarDwellerColorOption:string,
  backgroundDwellerColor:string,backgroundDwellerOption:string,mapSidebarColor:string,mapSidebarColorOption:string){
  //  debugger;
    let data = new URLSearchParams();
    data.append('master_id',member_id);
    data.append('photo_company',companyImage);
    data.append('photo_personal',personalImage);
    data.append('image_dweller',image_dweller);
    data.append('timezone',timezone);
    data.append('color_base',colorBase);
    data.append('color_second',secondColor);
    data.append('color_third',thirdColor);
    data.append('identity_name',identity_name);
    data.append('display_name_dweller',display_name_dweller);
    data.append('header_color',headerColor);
    data.append('side_bar_menu_color',sideBarMenuColor);
    data.append('button_color',buttonColor);
    data.append('text_color',textColor);
    data.append('content_background',backgroundColor);
    data.append('header_color_option',headerColorOption);
    data.append('side_bar_menu_color_option',sideBarMenuColorOption);
    data.append('button_color_option',buttonColorOption);
    data.append('text_color_option',textColorOption);
    data.append('content_background_option',backgroundColorOption);
    data.append('isCustomColor',customColorOption.toString());

    data.append('content_title_color',contentTitleColor);
    data.append('content_title_color_option',contentTitleColorOption);
    data.append('pagination_color',paginationColor);
    data.append('pagination_color_option',paginationColorOption);
    data.append('modal_background_color',modalBackgroundColor);
    data.append('modal_background_color_option',modalBackgroundColorOption);

    data.append('button_color_dweller',buttonDwellerColor);
    data.append('button_color_dweller_option',buttonDwellerColorOption);
    data.append('side_bar_color_dweller',sideBarDwellerColor);
    data.append('side_bar_color_dweller_option',sideBarDwellerColorOption);
    data.append('background_color_dweller',backgroundDwellerColor);
    data.append('background_color_dweller_option',backgroundDwellerOption);
    data.append('map_sidebar_color',mapSidebarColor);
    data.append('map_sidebar_color_option',mapSidebarColorOption);
 //debugger;
   let updateSettingsResp=this.http
       .post(this.sharedServiceObj.registerationApiBaseUrl+'members/updateGlobalSettings', data, this.headerOptions)
       .map(this.extractData)
       return updateSettingsResp;
}
loadPaperWorkStatus(website_id:string)
{
  let data = new URLSearchParams();
  data.append('website_id',website_id);
 
 let paperWorkResp=this.http
     .post(this.sharedServiceObj.registerationApiBaseUrl+'members/viewPaperworkStatus', data, this.headerOptions)
     .map(this.extractData)
     return paperWorkResp;
}
getUsersChartsData(member_id:string)
{
  let data = new URLSearchParams();
    data.append('member_id',member_id);
   let userChartsResp=this.http
       .post(this.sharedServiceObj.apiBaseUrl+'members/getDashboardCharts', data, this.headerOptionsIDX)
       .map(this.extractData)
       return userChartsResp;
}
private extractData(res: Response) {
  //debugger;
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
