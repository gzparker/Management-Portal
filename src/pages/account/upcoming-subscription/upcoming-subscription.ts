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
 * Generated class for the UpcomingSubscriptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-upcoming-subscription',
  templateUrl: 'upcoming-subscription.html',
})
export class UpcomingSubscriptionPage {
  public notificationMsg:string="";
  public allUpcomingSubscription:any[]=[];
  
  public upcomingFoundMessage="";
  public userId:string="";
  
  public title: string = 'Cancel Subscription';
  public message: string = 'Are you sure to delete this subscription!';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;
  public isOpen: boolean = false;
  public loader:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {
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
      this.viewAllUpcomingSubscription(null);
    });
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  viewAllUpcomingSubscription(refresher:any):void{
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
  this.subscriptionObj.upcomingSubscriptionList(this.userId.toString(),data.service_id)
    .subscribe((result) => this.viewAllUpcomingSubscriptionResp(result));
    });
    }
  }
  viewAllUpcomingSubscriptionResp(result:any):void{
    this.loader.dismiss();
    if(result.status==true)
    {
      this.allUpcomingSubscription=result.upcoming_subscription_preview;
    }
    else
    {
      this.allUpcomingSubscription=[];
      this.upcomingFoundMessage="No upcoming subscription.";
      let alert = this.alertCtrl.create({
        title: 'Notification',
        subTitle: this.upcomingFoundMessage,
        buttons: ['Ok']
      });
      alert.present();
    }
    
  }
}
