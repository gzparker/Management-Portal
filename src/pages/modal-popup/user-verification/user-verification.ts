import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,ModalController  } from 'ionic-angular';
import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import {VerificationCodePage}  from '../verification-code/verification-code';
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
  public selectedCountryCode:string="";
  public selectedCountryAbbv:string="";
  public verificationMsg:string="";
  public allCountryCodes:any[]=[];
  public verify_by:string="email";
  public master_id:string="";
  public acctVerified:boolean=false;
  public verification_code:string="";
  public phone_number_verify:number;
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public viewCtrl : ViewController,public userServiceObj:UserProvider,public modalCtrl : ModalController) {
  }

  ionViewDidLoad() {
    this.getAllCountryCodes();
    this.master_id=this.navParams.get('master_id');
    //debugger;
   // console.log('ionViewDidLoad UserVerificationPage');
  }
  closeModal(){
    //debugger;
    this.viewCtrl.dismiss();
  }
  setVerifyByOption(value:string){
    //debugger;
    this.verify_by=value;
  }
  verifyUser(){
    let dataObj={
      phone_number_verify:this.phone_number_verify,
      master_id:this.master_id,
      country_code:this.selectedCountryCode,
      country_abbv:this.selectedCountryAbbv,
      verify_by:this.verify_by
    };
   
    //debugger;
    this.userServiceObj.sendVerificationInfo(dataObj)
    .subscribe((result) => this.verifyUserResp(result));
  }
verifyUserResp(result:any):void
{
  //debugger;
  if(result.status==true)
  {
   this.verificationMsg=result.message;
  // this.verificationModal.close();
   this.acctVerified=false;
   this.verification_code="";
   //this.modalType=4;
this.openUserVerificationCodeModal();
this.closeModal();
  }
  else{
this.verificationMsg=result.message;
  }
  //debugger;
}
public openUserVerificationCodeModal()
    {
      var modalPage = this.modalCtrl.create(VerificationCodePage, { master_id: this.master_id });
      modalPage.present();
    }
  getAllCountryCodes():void{
    if(this.allCountryCodes==undefined)
    {
      //debugger;
      this.userServiceObj.loadCountryCodes()
      .subscribe((result) => this.getAllCountryCodesResp(result));
    }
    else if(this.allCountryCodes.length<=0)
    {
     //debugger;
      this.userServiceObj.loadCountryCodes()
      .subscribe((result) => this.getAllCountryCodesResp(result));
    }
  
  }
  getAllCountryCodesResp(result:any):void{
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
     debugger;
     this.selectedCountryAbbv=selectedCountryCodeData[0].country_abbv;
     this.selectedCountryCode=selectedCountryCodeData[0].country_code;
     // debugger;
    }
}
