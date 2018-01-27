import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, MenuController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { FbConfirmPage } from '../fb-confirm/fb-confirm';
import { SubscriptionPage } from '../subscription/subscription';
import { AlertController } from 'ionic-angular';

import { UserVerificationPage } from '../user-verification/user-verification';

import { SharedProvider } from '../../providers/shared/shared';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
public notificationMsg:string="";
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform) {
      if(this.navParams.get('notificationMsg')!=undefined)
      {
        this.notificationMsg=this.navParams.get('notificationMsg');
      }
  }

  ionViewDidLoad() {
    //debugger;
    //sharedServiceObj.isLoggedInEmitter.subscribe(item => this.setLoginStatus(item));
    this.getUserDetailedInfo();
  }
  getUserDetailedInfo(): void {
    //debugger;
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
    // debugger;
      this.userServiceObj.getMemberInfo(data)
        .subscribe((result) => this.userDetailedInfoResp(result));
    });

  }
  userDetailedInfoResp(status: any) {
    //debugger;
    if (status.status == true) {
      if (status.result != undefined) {
        if (status.result.subscribed_services.length > 0) {
          if (status.result.subscribed_services[0].service_status == null) {
          //  debugger;
            this.ngZone.run(() => {
              this.navCtrl.push(SubscriptionPage, { full_name: status.result.first_name + " " + status.result.last_name });
            });
          }
        }
      }
    }
  }
}
