import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,Tabs } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../../dashboard/dashboard';
import { ContactusPage } from '../../contactus/contactus';
import { SetupOptionPage } from '../../setup/setup-option/setup-option';
import { ChatPage } from '../../chatmodule/chat/chat';

import { AlertController } from 'ionic-angular';
import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';

/**
 * Generated class for the DashboardTabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
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
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform) {
    //debugger;
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
    
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
      //debugger;
      this.loadGlobalSettings();
    });
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
   // debugger;
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
    //debugger;
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
