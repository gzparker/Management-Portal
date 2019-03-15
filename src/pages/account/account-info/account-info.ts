import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { BrMaskerIonic3, BrMaskModel } from 'brmasker-ionic-3';
import { AlertController,ToastController } from 'ionic-angular';
import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { DashboardTabsPage } from '../../tabs/dashboard-tabs/dashboard-tabs';
/**
 * Generated class for the AccountInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-account-info',
  templateUrl: 'account-info.html',
  providers:[BrMaskerIonic3]
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
  public CkeditorConfig = {removeButtons:'Underline,Subscript,Superscript,SpecialChar'
  ,toolbar: [
    { name: 'document', groups: [], items: ['Source'] },
    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline'] },
    { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
    { name: 'links', items: [] },
    { name: 'styles', items: ['Format', 'FontSize' ] }
  ]};
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform,
    public loadingCtrl: LoadingController,private toastCtrl: ToastController,public brMaskerIonic3: BrMaskerIonic3) {
      
      if(this.navParams.get('notificationMsg')!=undefined)
      {
        /*let alert = this.alertCtrl.create({
          title: 'Notification',
          subTitle: this.navParams.get('notificationMsg'),
          buttons: ['Ok']
        });
        alert.present();*/
        let toast = this.toastCtrl.create({
          message: this.navParams.get('notificationMsg'),
          duration: 3000,
          position: 'top',
          cssClass:'successToast'
        });
      
        toast.onDidDismiss(() => {
          //console.log('Dismissed toast');
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
      this.viewAccount();
    });
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  editAccount()
  {
//this.navCtrl.push(EditAccountPage,{userId:this.userId});
this.navCtrl.setRoot(DashboardTabsPage,{selectedPage:26});
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
      let firebaseUserId = this.storage.get('firebaseUserId');
      firebaseUserId.then((data) => {
        this.userServiceObj.updateFirebaseUserInfo(result.result,data);
    });
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
  setPhoneMask(phoneNumber:string)
    {
      if(phoneNumber!=undefined)
      {
        const config: BrMaskModel = new BrMaskModel();
        config.mask = '(000) 000-0000';
        config.len = 14;
        config.type = 'num';
        return this.brMaskerIonic3.writeCreateValue(phoneNumber, config);
      }
      else{
        return "";
      }
    }
}
