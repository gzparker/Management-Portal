import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import {DashboardPage}  from '../dashboard/dashboard';
import {FbConfirmPage}  from '../../pages/modal-popup/fb-confirm/fb-confirm';
import {UserVerificationPage}  from '../../pages/modal-popup/user-verification/user-verification';
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
  public email:string="";
  public emailFb:string="";
  public password:string="";
  public fbPassword:string="";
  public first_name:string="";
  public first_name_fb:string="";
  public last_name:string="";
  public last_name_fb:string="";
  public phone_number:number;
  public phone_number_verify:number;
  public userLogginMsg:string="";
  public verificationMsg:string="";
  public userSignUpMsg:string="";
  public userFbSignUpMsg:string="";
  public userCreated:boolean=false;
  public userTypeSelected:boolean=true;
  public userType:string="1";
  public domainAccess:any;
  public userLoggedId:boolean=false;
  public fbAuthResp:any;
  public fbSignUp:boolean=false;
  public acctVerified:boolean=false;
  public fb_token_id:string="";
  public selectedCountryCode:string="";
  public selectedCountryAbbv:string="";
  public allCountryCodes:any[]=[];
  public verify_by:string="email";
  public master_id:string="";
  public verification_code:string="";
  public urlToUse = "";
  public title: string;
  public message: string;
  public modalType:number;
  public fbLoginStatus:any;
  public appId:number=701598080041539;
  constructor(public navCtrl: NavController, public navParams: NavParams,public fb: Facebook,
    public userServiceObj:UserProvider,public sharedServiceObj:SharedProvider,
    public modalCtrl : ModalController) {
      userServiceObj.fbLoginDecision.subscribe(item => this.faceBookDecisionMethod(item));
  }
  faceBookDecisionMethod(opt:string){
    if(opt=="0")
    {
      let modalPage = this.modalCtrl.create(FbConfirmPage);
      modalPage.present();
    } 
    else if(opt=="1")
    {
      this.navCtrl.push(DashboardPage);
    }     
        }
  userSignUp():void{
    //debugger;
    
     let dataObj={
       first_name:"",
       last_name:"",
       country_code:"",
       country_abbv:"",
       phone_number:123,
       email:"",
       password:"",
       website_id:"",
       userType:"",
       fb_token:"",
       verified:0
     };
     //if(this.domainAccess)
     //{
      if(this.fbSignUp)
       {
       //debugger;
       dataObj.email=this.emailFb;
       dataObj.password=this.fbPassword;
       dataObj.fb_token=this.fb_token_id;
       dataObj.first_name=this.first_name_fb;
       dataObj.last_name=this.last_name_fb;
       dataObj.country_code=this.selectedCountryCode;
       dataObj.country_abbv=this.selectedCountryAbbv;
       dataObj.phone_number=Math.floor(Math.random() * (90000000 - 1 + 1)) + 1;
       dataObj.verified=1;
       //debugger;
       }
       else
       {
        // debugger;
       dataObj.email=this.email;
       dataObj.password=this.password;
       dataObj.fb_token="";
       dataObj.first_name=this.first_name;
       dataObj.last_name=this.last_name; 
       dataObj.country_code=this.selectedCountryCode;
       dataObj.country_abbv=this.selectedCountryAbbv;
       dataObj.phone_number=this.phone_number;
       dataObj.verified=0;
       }
     //  debugger;
       //dataObj.website_id=this.domainAccess.userCredentials.website_id;
       dataObj.userType=this.userType;
       //debugger;
     this.userServiceObj.userSignUp(dataObj)
     .subscribe((result) => this.userSignUpResponse(result));
     }
     
   userSignUpResponse(result:any):void{
    //debugger;
     if(result.status==true)
     {
      //debugger;
     this.userCreated=true;
     this.userTypeSelected=true;
     this.userSignUpMsg="User has been successfully registered.";
     //this.userType="1";
     if(!this.fbSignUp)
     {
   
   this.master_id=result.memberCredentials.master_id;
   this.selectedCountryCode=result.memberCredentials.country_code;
   this.selectedCountryAbbv=result.memberCredentials.country_abbv;
   this.phone_number_verify=result.memberCredentials.phone_mobile;
   this.openUserVerificationModal(this.master_id);
   
     }
    
     
   }
   else
   {
  //  debugger;
     //this.modalType=3;
     this.userCreated=true;
     this.userSignUpMsg=result.message;
   }
 
   }
   public openUserVerificationModal(master_id:any)
    {
      var modalPage = this.modalCtrl.create(UserVerificationPage, { master_id: master_id });
      modalPage.present(); 
    }
   getAllCountryCodes():void{
     //debugger;
    if(this.allCountryCodes==undefined)
    {
      this.userServiceObj.loadCountryCodes()
      .subscribe((result) => this.getAllCountryCodesResp(result));
    }
    else if(this.allCountryCodes.length<=0)
    {
      this.userServiceObj.loadCountryCodes()
      .subscribe((result) => this.getAllCountryCodesResp(result));
    }
  
  }
  getAllCountryCodesResp(result:any):void{
    //debugger;
    let countryCodesDummy=[];
    if(result.status==true)
    {
      
      this.allCountryCodes=result.countryArray;
      this.selectedCountryAbbv="US";
      this.selectedCountryCode="1";
   // debugger;
    }
    
  }
  onCountryCodeSelection($event:any):void{
  let selectedCountryCodeData:any;
   selectedCountryCodeData=this.allCountryCodes.filter(item => item.country_abbv == $event);
   this.selectedCountryAbbv=selectedCountryCodeData[0].country_abbv;
   this.selectedCountryCode=selectedCountryCodeData[0].country_code;
   // debugger;
  }
  onFacebookLoginClick():void{
    this.userServiceObj.onFacebookLoginClick();
  }
  ionViewDidLoad() {
    //debugger;
    this.getAllCountryCodes();
    console.log('ionViewDidLoad RegisterPage');
  }

}
