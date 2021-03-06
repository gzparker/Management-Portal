import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SharedProvider } from '../../providers/shared/shared';
import { UserProvider } from '../../providers/user/user';
import { Storage } from '@ionic/storage';
import { DashboardTabsPage } from '../tabs/dashboard-tabs/dashboard-tabs';
import { SubscriptionPage } from '../subscription/subscription';
/**
 * Generated class for the VerificationCodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var firebase:any;
@Component({
  selector: 'page-verification-code',
  templateUrl: 'verification-code.html',
})
export class VerificationCodePage {
  public master_id: string = "";
  public verification_code: string = "";
  public verificationMsg: string = "";
  public acctVerified: boolean = false;
  public service_id:string="";
  public websiteBackgroundInfo:any;
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
  
          this.verificationMsg=result.message.toUpperCase();
          //this.leadCreateMsg="Lead has been created successfully.";
      //debugger;
      this.sharedServiceObj.sendNotification(this.master_id.toString(),"Registeration Complete",this.verificationMsg,this.service_id,
      this.websiteBackgroundInfo.brand_image_url,"member",'',"email,sms","successful_registration_email").
      subscribe((result) => this.sendNotificationResp(result));
          this.userLogin(result.memberCredentials.email,result.memberCredentials.password);
    }
    else {
      this.verificationMsg = result.message;
    }
  }
  sendNotificationResp(result:any)
  {
   //debugger;
    if(result.status)
{
  //debugger;
}
  }
  userLogin(email:string,password:string): void {
    this.userServiceObj.userLogin(email, password,this.service_id)
      .subscribe((result) => this.userLoginResponse(result));
  }
  userLoginResponse(result: any): void {
    let is_submember:string="0";
    let is_lead:string="0";
    if (result.status == true) {
      if (result.memberCredentials) {
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
          }
          else
          {
            this.storage.set('userId', result.memberCredentials.id);
          }
          this.storage.set('parent_id', result.memberCredentials.parent_id);
          this.storage.set('image_url',result.memberCredentials.image_url);
          this.storage.set('loggedInUserInfo', result);
          this.storage.set('globalSettings',result.globalSettings);
          this.storage.set('subscribed_services',result.subscribed_services);
        if(result.memberCredentials.parent_id!=undefined)
        {
          this.storage.set('is_submember', "1");
          is_submember="1";
          this.setAllAccessOptions(result.userAssignedRoles);
          this.userServiceObj.setFireBaseInfo(result.memberCredentials.email,result.memberCredentials.password,
            result.memberCredentials.id,result.memberCredentials.first_name,result.memberCredentials.last_name,
            result.memberCredentials.image_url,result.memberCredentials.parent_id,is_submember,is_lead,"",this.service_id);
        }
        else
        {
          is_submember="0";
          this.storage.set('is_submember', "0");
          this.userServiceObj.setFireBaseInfo(result.memberCredentials.email,result.memberCredentials.password,
          result.memberCredentials.id,result.memberCredentials.first_name,result.memberCredentials.last_name,
          result.memberCredentials.image_url,result.memberCredentials.parent_id,is_submember,is_lead,"",this.service_id);
        }
        this.navCtrl.setRoot(DashboardTabsPage);
        
      });
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
  let dummyAllOptions=element.allowed_options.split(',');
  for(let i=0;i<dummyAllOptions.length;i++)
  {
    finalAllowedRolesOptions.push(dummyAllOptions[i].toString());
  }
});
this.userServiceObj.getAllMemberAllowedOptions(finalAllowedRolesOptions)
      .subscribe((result) => this.setAllAccessOptionsResp(result));
}
setAllAccessOptionsResp(result:any)
{
  if (result.status == true) {
    this.storage.set('allowed_access_options', result.memberAllowedOptions);
    this.ngZone.run(() => {
    this.navCtrl.setRoot(DashboardTabsPage,{notificationMsg:this.verificationMsg.toUpperCase()});
    });
  }
}
  ionViewDidLoad() {
    let that=this;
    this.master_id = this.navParams.get('master_id');
    let generalWebsiteSettings = this.storage.get('generalWebsiteSettings');
    generalWebsiteSettings.then((data) => {
      that.websiteBackgroundInfo=data;
      this.service_id=data.service_id;
    });
  }
  closeModal() {
    this.viewCtrl.dismiss();
  }
}
