import { HttpClient } from '@angular/common/http';
//import { HTTP } from '@ionic-native/http';

import { Http, Response,URLSearchParams,Headers,RequestOptions } from '@angular/http';
import { EventEmitter,Injectable } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController,Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import {Subject} from "rxjs/Subject";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {DashboardPage}  from '../../pages/dashboard/dashboard';
import {FbConfirmPage}  from '../../pages/modal-popup/fb-confirm/fb-confirm';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { SharedProvider } from '../../providers/shared/shared';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
declare const FB:any;
@Injectable()
export class UserProvider {
  public fbLoginDecision: EventEmitter<String>;
  private headers:Headers=new Headers();
  private headerOptions:RequestOptions=new RequestOptions();
  public fbLoginStatus:any;
  public facebookObject:any;
  public fbAuthResp:any;
  constructor(private http: Http,public sharedServiceObj:SharedProvider,
    private storage: Storage,public modalCtrl : ModalController) {
      this.fbLoginDecision=new EventEmitter();
    FB.init({
      appId      : '701598080041539',
      cookie     : false,  
                         
      xfbml      : true,  
      version    : 'v2.9', 
      status     : true
  });
  this.facebookObject=FB;
  this.facebookObject.getLoginStatus(response => {
    
    //alert('yes');
           // this.statusChangeCallback(response);
           this.fbLoginStatus=response;
          
        },true);
  }
  onFacebookLoginClick():void{
 
    if(this.fbLoginStatus!=undefined)
    {
     
      this.statusChangeCallback(this.fbLoginStatus);
    }
    
      }
  statusChangeCallback(resp) {

    if(resp!=undefined)
    {
      if (resp.status === 'connected') {
          
        this.facebookObject.api('/me', { locale: 'en_US', fields: 'name, email,picture' }, this.setFacebookAuthentication.bind(this));
     
        }else if (resp.status === 'not_authorized') {
          
        }else {
      
          this.facebookObject.login(this.checkFacebookResp.bind(this));
     
        }
    }
    else
    {
      this.facebookObject.login(this.checkFacebookResp.bind(this));
    }    
     };
  checkFacebookResp(resp:any)
    {     
  
    if (resp.authResponse) {
      this.facebookObject.api('/me', { locale: 'en_US', fields: 'name, email,picture' }, this.setFacebookAuthentication.bind(this));
      }

    }
     setFacebookAuthentication(response:any):void{
     
      if (response.email) {
        
           this.storage.set('fbAuthResp',response);
        
         this.fbEmailCheck(response.email).subscribe(result => this.checkFbEmail(result));
         } else {
     
         }
 
     }
     checkFbEmail(resp:any):void{
      
       this.storage.get('fbAuthResp').then((data) => {
         if(data != null)
         {
          this.fbAuthResp=data;
          if(resp.status==true)
          {
       
            this.fbSetAuthenticationValues(resp);
            this.fbUpdateToken(this.fbAuthResp.email,this.fbAuthResp.id)
            .subscribe(result => this.fbUpdateTokenResp(result));
          }
          else
          {
         
            this.storage.set("fbMembershipResp",this.fbAuthResp);
            this.openFBConfirmModal();
           
        
          }
         }
       });
    
      
     }
     fbUpdateTokenResp(result:any):void{
      
     }
     fbSetAuthenticationValues(result:any):void{
       if(result.status==true)
       {
         if(result.memberCredentials.verified=="1")
         {
          this.storage.set('loggedId','1');
          this.storage.set('userId',result.memberCredentials.id);
          this.storage.set('email',result.memberCredentials.email);
          this.storage.set('first_name',result.memberCredentials.first_name);
          this.storage.set('last_name',result.memberCredentials.last_name);
         
          this.storage.set('loggedInUserInfo',result);
        
          this.sharedServiceObj.setLoginStatus(true);
          this.fbLoginDecision.emit('1');
          //this.navCtrl.push(DashboardPage);
     }
       }
     }
    
    openFBConfirmModal(){
      this.fbLoginDecision.emit('0');
     }
userLogin(email:string,password:string){
  let url="";
  url=this.sharedServiceObj.registerationApiBaseUrl+'members/memberLogin';
 
 
     let data = new URLSearchParams();
   
  data.append('email',email);
 data.append('password',password);
 
   let loggedInStatus=this.http
     .post(url, data, this.headerOptions)
    .map(this.extractData)
     return loggedInStatus;
 }
 userSignUp(dataObj:any){
   
  let url="";
  let data = new URLSearchParams();
  url=this.sharedServiceObj.registerationApiBaseUrl+'members/memberSignup';
  
  data.append('email',dataObj.email);
 data.append('password',dataObj.password);
 
 data.append('first_name',dataObj.first_name);
 data.append('last_name',dataObj.last_name);
 data.append('phone_mobile',dataObj.phone_number.toString());
 data.append('fb_token',dataObj.fb_token);
 data.append('country_code',dataObj.country_code);
 data.append('country_abbv',dataObj.country_abbv);
 data.append('verified',dataObj.verified);
 data.append('service_id',this.sharedServiceObj.service_id);
   let signUpStatus=this.http
     .post(url, data, this.headerOptions)
    .map(this.extractData)
     return signUpStatus;
 
 }
 getMemberInfo(member_id:string){
  let url="";
  let data = new URLSearchParams();
  url=this.sharedServiceObj.registerationApiBaseUrl+'members/generalinfo';
  //debugger;
  data.append('member_id',member_id);
  //debugger;
  let memberInfo=this.http
  .post(url, data, this.headerOptions)
  .map(this.extractData)
  return memberInfo; 
 }
 getUserAdditionalInfo(master_id:string){
 
   let url="";
   let data = new URLSearchParams();
   url=this.sharedServiceObj.registerationApiBaseUrl+'members/getAdditionalInfo';
   //debugger;
   data.append('master_id',master_id);
   //debugger;
   let signUpAdditionalInfo=this.http
   .post(url, data, this.headerOptions)
   .map(this.extractData)
   return signUpAdditionalInfo;
 }
 sendVerificationInfo(json_data:any){
   let data = new URLSearchParams();
   data.append('master_id',json_data.master_id);
   data.append('verify_by',json_data.verify_by);
   data.append('service_id',this.sharedServiceObj.service_id);
   if(json_data.verify_by=="phone")
   {
     data.append('phone_mobile',json_data.phone_number_verify);
     data.append('country_code',json_data.country_code);
     data.append('country_abbv',json_data.country_abbv);
   }
    let verificationInfogResp=this.http
      .post(this.sharedServiceObj.registerationApiBaseUrl+'members/verifyInfo', data, 
      this.headerOptions)
      .map(this.extractData)
      return verificationInfogResp;
 }
 confirmVerificationCode(master_id:string,verification_code:string){
   let data = new URLSearchParams();
   data.append('master_id',master_id);
   data.append('verification_code',verification_code);
    let verificationInfogResp=this.http
      .post(this.sharedServiceObj.registerationApiBaseUrl+'members/confirmVerification', data, 
      this.headerOptions)
     .map(this.extractData)
      return verificationInfogResp;
 }
 fbEmailCheck(email:string){
 
     let data = new URLSearchParams();
  data.append('email',email);
   let searchedListing=this.http
     .post(this.sharedServiceObj.registerationApiBaseUrl+'members/fbEmailCheck', data, 
     this.headerOptions)
     .map(this.extractData)
     return searchedListing;
 
 }
 fbUpdateToken(email:string,fb_token:string){
   let data = new URLSearchParams();
  data.append('email',email);
  data.append('fb_token',fb_token);
  //debugger;
   let searchedListing=this.http
     .post(this.sharedServiceObj.registerationApiBaseUrl+'members/fbTokenUpdate', data, 
     this.headerOptions)
     .map(this.extractData)
     return searchedListing;
 }
 userInfo(user_id:string){
  //debugger;
 let data = new URLSearchParams();
  data.append('member_id',user_id);
 
 
   let hotSheetUpdatingResp=this.http
     .post(this.sharedServiceObj.registerationApiBaseUrl+'members/viewAccountInfo', data, 
     this.headerOptions)
     .map(this.extractData)
     return hotSheetUpdatingResp;
 }
 updateAccount(email:string,user_id:string,password:string,first_name:string,last_name:string,
   phone_number:string){
  // debugger;
 let data = new URLSearchParams();
  data.append('email',email);
  data.append('member_id',user_id);
  data.append('password',password);
  data.append('first_name',first_name);
  data.append('last_name',last_name);
  data.append('phone_number',phone_number);
 
   let accountUpdatingResp=this.http
     .post(this.sharedServiceObj.registerationApiBaseUrl+'members/updateAccountInfo', data, 
     this.headerOptions)
     .map(this.extractData)
     return accountUpdatingResp;
 }
 loadCountryCodes()
 {
   let data = new URLSearchParams();
   let countryCodesResp=this.http
   .post(this.sharedServiceObj.registerationApiBaseUrl+'members/countryphonecodes', data, 
   this.headerOptions)
   .map(this.extractData)
   return countryCodesResp;
 }
 sendContactUsEmail(reason:string,firstName:string,lastName:string,phoneNumber:number,emailAddress:string,
   message:string,service_id:string,captchaResp:string)
 {
   //debugger;
   let data = new URLSearchParams();
   data.append('firstName',firstName);
   data.append('lastName',lastName);
   data.append('emailAddress',emailAddress);
   data.append('phoneNumber',phoneNumber.toString());
   data.append('message',message);
   data.append('reason',reason);
   data.append('service_id',service_id);
   //data.append('ip_address',ip_address)
   data.append('g-recaptcha-response',captchaResp)
   let contactUsResp=this.http
     .post(this.sharedServiceObj.registerationApiBaseUrl+'General/contactForm', data, 
     this.headerOptions)
     .map(this.extractData)
     return contactUsResp;
 }
 private extractData(res: Response) {
  //debugger;
    return res.json();
      }
  private handleErrorObservable (error: Response | any) {
   /// debugger;
    console.error(error.message || error);
    return Observable.throw(error.message || error);
      }
      private handleErrorPromise (error: Response | any) {
       
    console.error(error.message || error);
    return Promise.reject(error.message || error);
      }	
}
