import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,Tabs,ActionSheetController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../../dashboard/dashboard';
import { SetupOptionPage } from '../../setup/setup-option/setup-option';
import { ChatPage } from '../../chatmodule/chat/chat';
import { SubscriptionPage } from '../../subscription/subscription';
import { GlobalPreferencesPage } from '../../setup/global-preferences/global-preferences';

import { AlertController } from 'ionic-angular';
import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';

/**
 * Generated class for the DashboardTabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-dashboard-tabs',
  templateUrl: 'dashboard-tabs.html',
})
export class DashboardTabsPage {

  @ViewChild("idxpaymentTabs") idxpaymentTabs: Tabs;
  public dashboardRoot: any=DashboardPage;
  public setupRoot: any=SetupOptionPage;
  public chatRoot:any=ChatPage;
  public notificationMsg:string="";
  public dashBoardParams: any;
  public setUpPage: any;
  public userId:string="";
  public allUnreadMsg:string="";
  public globalSettings:any;
  public showSetupTab:boolean;
  public enableSetup:boolean=true;
  public paid_status:string="0";
  public memberCredentials:any;
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform,public actionSheetCtrl: ActionSheetController) {
    this.sharedServiceObj.setLoginStatus(true);
    this.dashBoardParams={ notificationMsg: "",selectedPage:"" };
      if(this.navParams.get('notificationMsg')!=undefined&&this.navParams.get('notificationMsg')!='')
      {
      this.dashBoardParams.notificationMsg=this.navParams.get('notificationMsg');
      }
      if(this.navParams.get('selectedPage')!=undefined&&this.navParams.get('selectedPage')!='')
      {
      this.dashBoardParams.selectedPage=this.navParams.get('selectedPage');
      }
     this.setUpPage = { selectedPage: "8" };
     sharedServiceObj.unreadMsgCounterEmitter.subscribe(item => this.setUnreadMsgs(item));
  }

  ionViewDidLoad() {
    let paid_status_dummy = this.storage.get('paid_status');
    paid_status_dummy.then((data) => {
      this.paid_status=data;
    });
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
      let loggedInUserInfo = this.storage.get('loggedInUserInfo');
      loggedInUserInfo.then((userInfoData) => {
 this.memberCredentials=userInfoData.memberCredentials;
 if(userInfoData!=null)
       {
         this.getUserDetailedInfo();
       }
      });
      this.loadGlobalSettings();
    });
  }
  getUserDetailedInfo(): void {
if(this.paid_status!="1"){
    let subscribed_services = this.storage.get('subscribed_services');
    subscribed_services.then((subscribed_services_data) => {
      if (subscribed_services_data != undefined) {
        if (subscribed_services_data.subscribed_services!=undefined){
        if (subscribed_services_data.subscribed_services.length > 0) {
          if (subscribed_services_data.subscribed_services[0].service_status == null) {
            this.ngZone.run(() => {
              this.sharedServiceObj.setPaidStatus(false);
              if(this.paid_status!="1")
              {
                this.navCtrl.setRoot(SubscriptionPage, { full_name: this.memberCredentials.first_name + " " + this.memberCredentials.last_name });
              }
            });
          }
          else
          {
            this.setGlobalPreferences();
          }
        }
      }
      else
      {
        this.ngZone.run(() => {
          this.sharedServiceObj.setPaidStatus(false);
          if(this.paid_status!="1")
              {
          this.navCtrl.setRoot(SubscriptionPage, { full_name: this.memberCredentials.first_name + " " + this.memberCredentials.last_name });
              }
        });
      }
    }
    });
  }else{
    this.setGlobalPreferences();
  }
  }
  setGlobalPreferences(){
    this.sharedServiceObj.setPaidStatus(true);
    let userGlobalSettingsResp = this.storage.get('globalSettings');
    userGlobalSettingsResp.then((data) => {
if(data!=null)
{
 // debugger;
if(data.photo_company==null&&data.photo_personal==null&&
data.timezone==null)
{
 // debugger;
this.redirectToGlobalPreferences(true);
}
else
{
//  debugger;
this.redirectToGlobalPreferences(false);
}
}
});
  }
  redirectToGlobalPreferences(status:boolean)
{
 // debugger;
if(status==true)
{
 // debugger;
  let showGlobalPopUp = this.storage.get('showGlobalPopUp');
  showGlobalPopUp.then((data) => {
  //  debugger;
  if(data==null)
    {
    //  debugger;
  let actionSheet = this.actionSheetCtrl.create({
    title: 'Select any option',
    buttons: [
      {
        text: 'Upload Company Picture',
        handler: () => {
          this.ngZone.run(() => {
          this.navCtrl.setRoot(GlobalPreferencesPage, { route: "subscribe" });
          });
        }
      },
      {
        text: "No Thanks",
        handler: () => {
          this.storage.set('showGlobalPopUp','no');
        }
      },
      {
        text: 'Cancel',
        handler: () => {
        }
      }
    ]
  });
  actionSheet.present();
}

});
}

}
  enableDisableSetup(option:string)
  {
    if(option=='1')
    {
      this.enableSetup=true;
    }
   else if(option=='2')
   {
    this.enableSetup=false;
   } 
  }
  loadGlobalSettings()
  {
    this.userServiceObj.viewGlobalSettings(this.userId)
    .subscribe((result) => this.loadGlobalSettingsResp(result));
  }
  loadGlobalSettingsResp(result:any)
  {
    if(result.status==true)
    {
      this.globalSettings=result.globalSettings;
      if(this.globalSettings)
      {
       if(this.globalSettings.color_base!=undefined&&this.globalSettings.color_base!=null&&this.globalSettings.color_base!="")
       {
        this.ngZone.run(() => {
this.showSetupTab=false;
        });
       }
       if(this.globalSettings.color_second!=undefined&&this.globalSettings.color_second!=null&&this.globalSettings.color_second!="")
       {
        this.ngZone.run(() => {
this.showSetupTab=false;
        });
       }
       if(this.globalSettings.color_third!=undefined&&this.globalSettings.color_third!=null&&this.globalSettings.color_third!="")
       {
        this.ngZone.run(() => {
this.showSetupTab=false;
        });
       }
       if(this.showSetupTab==undefined||this.showSetupTab==null)
       {
         this.showSetupTab=true;
       }
      
      }
    else
    {
      this.showSetupTab=true;
    }
    }
  }
  selectChat()
  {
    this.navCtrl.setRoot(ChatPage);
  }
setRootPages(option:any)
{
 if(option=='1')
 {
  this.sharedServiceObj.setNavigationalPage('4');
 
 } 
 if(option=='2')
 {
 
   this.sharedServiceObj.setNavigationalPage('8');
  
 }
}
setUnreadMsgs(msgCounter:string)
  {
this.allUnreadMsg=msgCounter;
  }

}
