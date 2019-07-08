import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../../pages/dashboard/dashboard';
import { ContactusPage } from '../../pages/contactus/contactus';

import { AlertController } from 'ionic-angular';
import { SharedProvider } from '../../providers/shared/shared';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the DashboardTabsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'dashboard-tabs',
  templateUrl: 'dashboard-tabs.html'
})
export class DashboardTabsComponent {
  tab1Root: any = DashboardPage;
  tab2Root: any = ContactusPage;
  public notificationMsg:string="";
  public dashBoardParams: Object;
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform) {
      if(this.navParams.get('notificationMsg')!=undefined)
      {
        this.notificationMsg=this.navParams.get('notificationMsg');
        this.dashBoardParams = { notificationMsg: this.notificationMsg };
      }
    
  }

  ionViewDidLoad() {
  }
setRootPages(option:any)
{
 if(option=='1')
 {
  this.navCtrl.setRoot(DashboardPage,{ notificationMsg: this.notificationMsg});
 } 
 if(option=='2')
 {
  this.navCtrl.setRoot(ContactusPage);
 }
}
}
