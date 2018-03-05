import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';
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
  tab1Root: any=DashboardPage;
  tab2Root: any=SetupOptionPage;
  public notificationMsg:string="";
  public dashBoardParams: Object;
  public setUpPage: Object;
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform) {
      if(this.navParams.get('notificationMsg')!=undefined)
      {
        this.notificationMsg=this.navParams.get('notificationMsg');
        this.dashBoardParams = { notificationMsg: this.notificationMsg };
      }
     // if(this.navParams.get('selectedTab')!=undefined)
     // {
      //  debugger;
      this.setUpPage = { selectedPage: '8' };
      //}
  }

  ionViewDidLoad() {
  
  }
setRootPages(option:any)
{
  //debugger;
  //this.tab1Root= { title: 'Dashboard', component: DashboardPage,params: { notificationMsg: this.notificationMsg}}
 if(option=='1')
 {
  this.sharedServiceObj.setNavigationalPage('4');
   //debugger;
  //this.navCtrl.setRoot(DashboardPage,{ notificationMsg: this.notificationMsg});
 } 
 if(option=='2')
 {
 // this.navCtrl.setRoot(DashboardTabsPage,{selectedTab:'2'});
   //debugger;
   //this.sharedServiceObj.setNavigationalPage('8');
  //this.navCtrl.setRoot(ContactusPage);
 }
}


}
