import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';

import { EditAccountPage } from '../edit-account/edit-account';
import { AlertController } from 'ionic-angular';
import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';

/**
 * Generated class for the AccountInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account-info',
  templateUrl: 'account-info.html',
})
export class AccountInfoPage {
  public notificationMsg:string="";
  public userLoggedId:boolean=false;
  public userType:string="1";
  public accountId:string="";
  public accountInfo:any=null;
  public globalSettings:any=null;
  public fb_pic_url:string="";
  public fbAuthResp:any;
  public userId:string="";
  public loader:any;

  public imgBaseUrl=this.sharedServiceObj.imgBucketUrl;
  public noImgUrl=this.sharedServiceObj.noImageUrl;

  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform,
    public loadingCtrl: LoadingController) {
      if(this.navParams.get('notificationMsg')!=undefined)
      {
        let alert = this.alertCtrl.create({
          title: 'Notification',
          subTitle: this.navParams.get('notificationMsg'),
          buttons: ['Ok']
        });
        alert.present();
       //debugger;
        //this.notificationMsg=this.navParams.get('notificationMsg');
      }
      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 5000
      });
  }

  ionViewDidLoad() {
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
      this.viewAccount();
    });
  }
  editAccount()
  {
this.navCtrl.push(EditAccountPage,{userId:this.userId});
  }
  viewAccount():void{
    if(this.userId!="")
    {
      this.loader.present();
  this.userServiceObj.userInfo(this.userId.toString())
    .subscribe((result) => this.accountInfoResp(result));
    }
    
  }
 
  accountInfoResp(result:any):void{
    this.loader.dismiss();
  
    if(result.status==true)
    {
//debugger;
      this.accountInfo=result.result;
      this.globalSettings=result.globalSettings;
      /*if(this.localStorageService.get('fbAuthResp'))
      {
  this.fbAuthResp=this.localStorageService.get('fbAuthResp');
  if(this.fbAuthResp!=undefined)
  {
    this.fb_pic_url=this.fbAuthResp.picture.data.url;
  }
  else
  {
    this.fb_pic_url=this.sharedServiceObj.defaultNoImage;
  }
      }
      else
      {
        this.fb_pic_url=this.sharedServiceObj.defaultNoImage;
      }*/
      
      // debugger;
    }
    
  }
}
