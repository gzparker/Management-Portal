import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
  MenuController,LoadingController,ToastController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../../dashboard/dashboard';
import { AlertController } from 'ionic-angular';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';

/**
 * Generated class for the MlsSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-mls-settings',
  templateUrl: 'mls-settings.html',
})
export class MlsSettingsPage {
  public notificationMsg:string="";
  public paperWorkFoundMsg:string="";
  public userId:string="";
  public website_Id:string="";
  public paperWorkDetails:any;
  public loader:any;
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform,
    public loadingCtrl: LoadingController,private toastCtrl: ToastController) {
      if(this.navParams.get('notificationMsg')!=undefined)
      {
        this.notificationMsg=this.navParams.get('notificationMsg');
      }
      if(this.navParams.get('website_Id')!=undefined)
      {
        //debugger;
        this.website_Id=this.navParams.get('website_Id');
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
      this.loadMlsSetup();
    });
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
loadMlsSetup()
{
  //debugger;
  if(this.userId!="")
    {
      
      this.loader.present();
     this.userServiceObj.loadPaperWorkStatus(this.website_Id)
    .subscribe((result) => this.loadPaperWorkStatusResp(result));
    }
    
}
loadPaperWorkStatusResp(result:any):void{
  this.loader.dismiss();
  if(result.status==true)
  {
    //debugger;
    this.paperWorkDetails=result.result;   
  }
  else
  {
    //this.paperWorkFoundMsg=result.message;
//debugger;
/*let alert = this.alertCtrl.create({
  title: 'Error',
  subTitle: this.paperWorkFoundMsg,
  buttons: ['Ok']
});
alert.present();*/
let toast = this.toastCtrl.create({
  message: this.paperWorkFoundMsg,
  duration: 3000,
  position: 'top',
  cssClass:'errorToast'
});

toast.onDidDismiss(() => {
  //console.log('Dismissed toast');
});
toast.present();
  }
}
}
