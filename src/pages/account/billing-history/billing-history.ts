import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
  MenuController,LoadingController,ToastController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';


import { AlertController } from 'ionic-angular';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';
/**
 * Generated class for the BillingHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-billing-history',
  templateUrl: 'billing-history.html',
})
export class BillingHistoryPage {
  public notificationMsg:string="";
  public allSubscriptionHistory:any[]=[];
  
  public historyFoundMessage="";
  public userId:string="";
  
  public title: string = 'Delete Subscription';
  public message: string = 'Are you sure to delete this subscription!';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;
  public isOpen: boolean = false;
  public loader:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController,private toastCtrl: ToastController) {
      if(this.navParams.get('notificationMsg')!=undefined)
      {
        let toast = this.toastCtrl.create({
          message: this.navParams.get('notificationMsg'),
          duration: 3000,
          position: 'top',
          cssClass:'successToast'
        });
      
        toast.onDidDismiss(() => {
        });
      
        toast.present();
      }
      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 5000
      });
  }

  ionViewDidLoad() {
    this.sharedServiceObj.updateColorThemeMethod(null);
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
      this.viewAllBillingHistory(null);
    });
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  viewAllBillingHistory(refresher:any):void{
    if(this.userId!="")
    {
      
      
      if(refresher!=null)
    {
      refresher.complete();
    }
    else
    {
      this.loader.present();
    }
    let generalWebsiteSettings = this.storage.get('generalWebsiteSettings');
    generalWebsiteSettings.then((data) => {
      this.subscriptionObj.subscriptionBillingHistory(this.userId.toString(),data.service_id)
      .subscribe((result) => this.viewAllBillingHistoryResp(result));
    });
  
    }
    
  }
  viewAllBillingHistoryResp(result:any):void{
    this.loader.dismiss();
    if(result.status==true)
    {
      this.allSubscriptionHistory=result.billing_history;
    }
    else
    {
      this.allSubscriptionHistory=[];
      this.historyFoundMessage="No billing history found.";
    }
    
  }
  deleteSubscription(subscription:any)
  {
    let confirm = this.alertCtrl.create({
      title: this.title,
      message: this.message,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Ok',
          handler: () => {
            let selectedIndex = this.allSubscriptionHistory.indexOf(subscription);
            if (selectedIndex >= 0) {
            this.allSubscriptionHistory.splice(selectedIndex, 1);
            }
            if(this.allSubscriptionHistory.length<=0)
            {
              this.historyFoundMessage="All subscriptions have been deleted.Please subscribe again.";
              this.notificationMsg="";
            }
            let generalWebsiteSettings = this.storage.get('generalWebsiteSettings');
    generalWebsiteSettings.then((data) => {
            this.subscriptionObj.cancelSubscription(this.userId.toString(),subscription.subscription_id,data.service_id)
            .subscribe((result) => this.deleteSubscriptionResp(result));
    });
          }
        }
      ]
    });
    confirm.present();
  }
  deleteSubscriptionResp(result:any)
  {

  }
}
