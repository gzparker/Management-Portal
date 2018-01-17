import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
/**
 * Generated class for the VerificationCodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-verification-code',
  templateUrl: 'verification-code.html',
})
export class VerificationCodePage {
  public master_id:string="";
  public verification_code:string="";
  public verificationMsg:string="";
  public acctVerified:boolean=false;
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public viewCtrl : ViewController,public userServiceObj:UserProvider) {
  }
  confirmVerification(){
    this.userServiceObj.confirmVerificationCode(this.master_id,this.verification_code)
    .subscribe((result) => this.confirmVerificationResp(result));
  }
  confirmVerificationResp(result:any){
    //debugger;
    if(result.status==true)
    {
      this.verificationMsg=result.message;
      this.acctVerified=true;
    }
  }
  ionViewDidLoad() {
    this.master_id=this.navParams.get('master_id');
   // console.log('ionViewDidLoad VerificationCodePage');
  }
  closeModal(){
   // debugger;
    this.viewCtrl.dismiss();
  }
}
