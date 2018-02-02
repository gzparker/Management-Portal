import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, MenuController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { FbConfirmPage } from '../fb-confirm/fb-confirm';
import { SubscriptionPage } from '../subscription/subscription';
import { AlertController } from 'ionic-angular';
import { DashboardTabsPage } from '../tabs/dashboard-tabs/dashboard-tabs';
import { AllWebsitesPage } from '../websites/all-websites/all-websites';
import { AllLeadsPage } from '../leads/all-leads/all-leads';
import { AllHotSheetsPage } from '../hotsheets/all-hot-sheets/all-hot-sheets';
import { UserVerificationPage } from '../user-verification/user-verification';

import { CreateAgentPage } from '../setup/create-agent/create-agent';
import { GlobalPreferencesPage } from '../setup/global-preferences/global-preferences';
import { ManageAgentsPage } from '../setup/manage-agents/manage-agents';
import { MlsSettingsPage } from '../setup/mls-settings/mls-settings';
import { SetupOptionPage } from '../setup/setup-option/setup-option';
import { UserOptionPage } from '../setup/user-option/user-option';

import { AccountInfoPage } from '../account/account-info/account-info';
import { AccountOptionPage } from '../account/account-option/account-option';
import { BillingInfoPage } from '../account/billing-info/billing-info';
import { ChangePasswordPage } from '../account/change-password/change-password';
import { EditBillingPage } from '../account/edit-billing/edit-billing';
import { UpgradeCenterPage } from '../account/upgrade-center/upgrade-center';

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
public userId:string="";
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform) {
      if(this.navParams.get('notificationMsg')!=undefined)
      {
       // debugger;
        this.notificationMsg=this.navParams.get('notificationMsg');
      }
      sharedServiceObj.navigationalPage.subscribe(item => this.openPage(item));
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
      //debugger;
    this.userId=data;
      this.userServiceObj.getMemberInfo(data)
        .subscribe((result) => this.userDetailedInfoResp(result));
    });

  }
  userDetailedInfoResp(status: any) {
   // debugger;
    if (status.status == true) {
      if (status.result != undefined) {
        if (status.result.subscribed_services.length > 0) {
          if (status.result.subscribed_services[0].service_status == null) {
          debugger;
            this.ngZone.run(() => {
              this.navCtrl.push(SubscriptionPage, { full_name: status.result.first_name + " " + status.result.last_name });
            });
          }
        }
      }
    }
  }
  openPage(pageNumber) {
//debugger;
    if (pageNumber == "4") {
      this.navCtrl.setRoot(DashboardPage);
    }
    if (pageNumber == "5") {
      this.navCtrl.setRoot(AllWebsitesPage);
    }
    if (pageNumber == "6") {
      this.navCtrl.setRoot(AllLeadsPage);
    }
    if (pageNumber == "7") {
      this.navCtrl.setRoot(AllHotSheetsPage);
    }
    if (pageNumber == "8") {
      this.navCtrl.setRoot(SetupOptionPage);
    }
    if (pageNumber == "9") {
      this.navCtrl.setRoot(AccountOptionPage);
    }
    if (pageNumber == "10") {
      this.navCtrl.push(GlobalPreferencesPage);
    }
    if (pageNumber == "11") {
      this.navCtrl.push(MlsSettingsPage);
    }
    if (pageNumber == "12") {
      this.navCtrl.push(UserOptionPage);
    }
    if (pageNumber == "13") {
      this.navCtrl.push(ManageAgentsPage);
    }
    if (pageNumber == "14") {
      this.navCtrl.push(CreateAgentPage);
    }
    if (pageNumber == "15") {
      this.navCtrl.push(AccountInfoPage);
    }
    if (pageNumber == "16") {
      this.navCtrl.push(BillingInfoPage);
    }
    if (pageNumber == "17") {
      this.navCtrl.push(ChangePasswordPage);
    }
    if (pageNumber == "18") {
      this.navCtrl.push(EditBillingPage);
    }
    if (pageNumber == "19") {
      this.navCtrl.push(UpgradeCenterPage);
    }
  }
}
