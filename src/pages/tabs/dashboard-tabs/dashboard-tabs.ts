import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,Tabs } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../../dashboard/dashboard';
import { ContactusPage } from '../../contactus/contactus';
import { SetupOptionPage } from '../../setup/setup-option/setup-option';

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
  public notificationMsg:string="";
  public dashBoardParams: any;
  public setUpPage: any;
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform) {
    //  debugger;
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
  }

  ionViewDidLoad() {
  
  }
setRootPages(option:any)
{
  //debugger;
  //this.idxpaymentTabs.select(1);
  //this.sharedServiceObj.setNavigationalPage('8');
 /*if(option=='1')
 {
  this.sharedServiceObj.setNavigationalPage('4');
 
 } 
 if(option=='2')
 {
 
   this.sharedServiceObj.setNavigationalPage('8');
  
 }*/
}


}
