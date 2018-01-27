import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SharedProvider } from '../../providers/shared/shared';
import { UserProvider } from '../../providers/user/user';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../dashboard/dashboard';
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
  public master_id: string = "";
  public verification_code: string = "";
  public verificationMsg: string = "";
  public acctVerified: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public userServiceObj: UserProvider, private storage: Storage, 
    public sharedServiceObj: SharedProvider, public ngZone: NgZone) {
  }
  confirmVerification() {
    this.userServiceObj.confirmVerificationCode(this.master_id, this.verification_code)
      .subscribe((result) => this.confirmVerificationResp(result));
  }
  confirmVerificationResp(result: any) {
    //debugger;
    if (result.status == true) {
  // debugger;
         this.storage.set('loggedId', '1');
          this.storage.set('userId', result.memberCredentials.id);
          this.storage.set('email', result.memberCredentials.email);
          this.storage.set('first_name', result.memberCredentials.first_name);
          this.storage.set('last_name', result.memberCredentials.last_name);
          this.storage.set('userType', "1");
          this.storage.set('loggedInUserInfo', result);
        
          this.sharedServiceObj.setLoginStatus(true);
          this.ngZone.run(() => {
          this.navCtrl.push(DashboardPage,{notificationMsg:result.message.toUpperCase()});
          });
    }
    else {
      this.verificationMsg = result.message;
    }
  }
  ionViewDidLoad() {
    this.master_id = this.navParams.get('master_id');
    // console.log('ionViewDidLoad VerificationCodePage');
  }
  closeModal() {
    // debugger;
    this.viewCtrl.dismiss();
  }
}
