import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, MenuController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { HomePage } from '../../../pages/home/home';

import { DashboardTabsPage } from '../../tabs/dashboard-tabs/dashboard-tabs';
import { ViewCreditCardsPage } from '../../billing/view-credit-cards/view-credit-cards';
import { UpgradeCenterPage } from '../../account/upgrade-center/upgrade-center';
import { ChangePasswordPage } from '../../account/change-password/change-password';
import { BillingHistoryPage } from '../../account/billing-history/billing-history';
import { UpcomingSubscriptionPage } from '../../account/upcoming-subscription/upcoming-subscription';
import { AccountInfoPage } from '../../account/account-info/account-info';
import { SetupOptionPage } from '../../setup/setup-option/setup-option';

import { AlertController } from 'ionic-angular';
import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';

/**
 * Generated class for the AccountOptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account-option',
  templateUrl: 'account-option.html',
})
export class AccountOptionPage {

  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountOptionPage');
  }
  openPage(pageNumber:string) {
    if (pageNumber == "15") {
      this.navCtrl.push(AccountInfoPage);
    }
    if (pageNumber == "16") {
      this.navCtrl.push(ViewCreditCardsPage);
    }
    if (pageNumber == "17") {
      this.navCtrl.push(ChangePasswordPage);
    }
    if (pageNumber == "19") {
      this.navCtrl.push(UpgradeCenterPage);
    }
    if (pageNumber == "21") {
      this.navCtrl.push(BillingHistoryPage);
    }
    if (pageNumber == "22") {
      this.navCtrl.push(UpcomingSubscriptionPage);
    }
    if (pageNumber == "8") {
      this.navCtrl.push(SetupOptionPage);
    }
    //this.navCtrl.setRoot(DashboardTabsPage,{selectedPage:pageNumber.toString()});
  }
  logOut() {
    this.sharedServiceObj.setLogOut();
   
  }
}
