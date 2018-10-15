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
  public isApp=false;
  public userId:string="";
  public parentId:string="";
  public isOwner:boolean=false;
  public isCreditCardList:boolean=false;
  public isBillingHistory:boolean=false;
  public isSetup:boolean=false;
  public isUpcomingSubscription:boolean=false;
  public isUpgradeCenter:boolean=false;
  public isGeneralInfo:boolean=false;
  
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform) {
  }

  ionViewDidLoad() {
    this.sharedServiceObj.updateColorThemeMethod(null);
    this.setAccessLevels();
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  setAccessLevels()
  {

    let parent_id = this.storage.get('parent_id');
      parent_id.then((data) => {
        if(data!=null)
        {
          //debugger;    
      this.parentId=data;
      this.isOwner=false;
        }
       else
       {
      this.isOwner=true;
       }
       this.allowMenuOptions();
      
      });
  }
  allowMenuOptions()
  {
    if(this.isOwner==false)
    {
      this.isBillingHistory=false;
      this.isCreditCardList=false;
      this.isUpcomingSubscription=false;
      this.isGeneralInfo=false;
      this.isSetup=false;
      this.isUpgradeCenter=false;
    let allowed_access_options = this.storage.get('allowed_access_options');
    allowed_access_options.then((data) => {
      if(data!=null)
      {
        //debugger;
        if(data!=false)
        {
        let savedAccessLevels:any[]=data;
      
    let creditCardAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="credit-card-list");
    });
    if(creditCardAccesLevels.length>0)
      {
        this.isCreditCardList=true;
      }
      else
      {
        this.isCreditCardList=false;
      }
      let billingHistoryAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="billing-history");
    });
    if(billingHistoryAccesLevels.length>0)
      {
        this.isBillingHistory=true;
      }
      else
      {
        this.isBillingHistory=false;
      }
      let setupAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="setup");
    });
    if(setupAccesLevels.length>0)
      {
        this.isSetup=true;
      }
      else
      {
        this.isSetup=false;
      }
      let upcomingSubscriptionAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="upcoming-subscription");
    });
    if(upcomingSubscriptionAccesLevels.length>0)
      {
        this.isUpcomingSubscription=true;
      }
      else
      {
        this.isUpcomingSubscription=false;
      }
      let upgradeAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="View Upgrade Plans");
    });
    if(upgradeAccesLevels.length>0)
      {
        this.isUpgradeCenter=true;
      }
      else
      {
        this.isUpgradeCenter=false;
      }
      let generalInfoAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="general-info");
    });
    if(generalInfoAccesLevels.length>0)
      {
        this.isGeneralInfo=true;
      }
      else
      {
        this.isGeneralInfo=false;
      }
    }
      }
    });
  }
  else
  {
    //debugger;
    this.isBillingHistory=true;
    this.isCreditCardList=true;
    this.isUpcomingSubscription=true;
    this.isGeneralInfo=true;
    this.isSetup=true;
    this.isUpgradeCenter=true;
  }
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
