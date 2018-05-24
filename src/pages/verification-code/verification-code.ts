import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SharedProvider } from '../../providers/shared/shared';
import { UserProvider } from '../../providers/user/user';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../dashboard/dashboard';
import { DashboardTabsPage } from '../tabs/dashboard-tabs/dashboard-tabs';
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
  //public verificationMsg:string="";
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public userServiceObj: UserProvider, private storage: Storage, 
    public sharedServiceObj: SharedProvider, public ngZone: NgZone) {
  }
  confirmVerification() {
   
 this.userServiceObj.confirmVerificationCode(this.master_id, this.verification_code)
    .subscribe((result) => this.confirmVerificationResp(result));
  }
  confirmVerificationResp(result: any) {
  
    if (result.status == true) {
  
          /*this.storage.set('loggedId', '1');
          this.storage.set('selectedService','2');
          this.storage.set('userId', result.memberCredentials.id);
          this.storage.set('email', result.memberCredentials.email);
          this.storage.set('first_name', result.memberCredentials.first_name);
          this.storage.set('last_name', result.memberCredentials.last_name);
          this.storage.set('country_abbv', result.memberCredentials.country_abbv);
          this.storage.set('country_code', result.memberCredentials.country_code);
          this.storage.set('userType', "1");
          this.storage.set('loggedInUserInfo', result);
          this.sharedServiceObj.setLoginStatus(true);
          this.ngZone.run(() => {
          
         this.navCtrl.setRoot(DashboardTabsPage,{notificationMsg:result.message.toUpperCase()});
          });*/
          this.verificationMsg=result.message.toUpperCase();
          this.userLogin(result.memberCredentials.email,result.memberCredentials.password)
    }
    else {
      this.verificationMsg = result.message;
    }
  }
  userLogin(email:string,password:string): void {
    this.userServiceObj.userLogin(email, password)
      .subscribe((result) => this.userLoginResponse(result));
  }
  userLoginResponse(result: any): void {
    //this.loader.dismiss();

    if (result.status == true) {
      if (result.memberCredentials) {

        //if (result.memberCredentials.verified == "1") {
          this.storage.ready().then(() => {
          this.storage.set('loggedId', '1');
          this.storage.set('selectedService','2');
          this.storage.set('email', result.memberCredentials.email);
          this.storage.set('first_name', result.memberCredentials.first_name);
          this.storage.set('last_name', result.memberCredentials.last_name);
          this.storage.set('userType', "1");
          this.storage.set('last_name', result.memberCredentials.last_name);
        
          this.storage.set('country_abbv', result.memberCredentials.country_abbv);
          this.storage.set('country_code', result.memberCredentials.country_code);
          if(result.memberCredentials.parent_id!=null)
          {
            this.storage.set('userId', result.memberCredentials.parent_id);
            this.storage.set('subMemberId', result.memberCredentials.id);
            //debugger;
          }
          else
          {
            //;
            this.storage.set('userId', result.memberCredentials.id);
          }
          this.storage.set('parent_id', result.memberCredentials.parent_id);
          this.storage.set('image_url',result.memberCredentials.image_url);
          this.storage.set('loggedInUserInfo', result);
          //debugger;
          this.storage.set('globalSettings',result.globalSettings);
        
        if(result.memberCredentials.parent_id!=undefined)
        {
          this.storage.set('is_submember', "1");
          this.setAllAccessOptions(result.userAssignedRoles);
          //this.storage.set('allowed_access_options', result.memberAllowedOptions);
        }
        else
        {
          this.storage.set('is_submember', "0");
          this.navCtrl.setRoot(DashboardTabsPage);
        }
        //  debugger;
         
        //debugger;
        //this.sharedServiceObj.setLoginStatus(true);
          
          
      });
       // }
       
      }


    }
    else {
      this.verificationMsg = result.message;
    }
 
  }
setAllAccessOptions(userAllowedRoles:any)
{
let finalAllowedRolesOptions:number[]=[];
userAllowedRoles.forEach(element => {
  //finalAllowedRolesOptions.concat(element.allowed_options.split(','));
  //debugger;
  let dummyAllOptions=element.allowed_options.split(',');
  for(let i=0;i<dummyAllOptions.length;i++)
  {
    finalAllowedRolesOptions.push(dummyAllOptions[i].toString());
  }
});
//debugger;
this.userServiceObj.getAllMemberAllowedOptions(finalAllowedRolesOptions)
      .subscribe((result) => this.setAllAccessOptionsResp(result));
}
setAllAccessOptionsResp(result:any)
{
  if (result.status == true) {
    //debugger;
    this.storage.set('allowed_access_options', result.memberAllowedOptions);
    this.ngZone.run(() => {
    this.navCtrl.setRoot(DashboardTabsPage,{notificationMsg:this.verificationMsg.toUpperCase()});
    });
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
