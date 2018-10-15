import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';

import { AccountOptionPage } from '../../account/account-option/account-option';

import { ChangePasswordPage } from '../../account/change-password/change-password';
import { UpgradeCenterPage } from '../../account/upgrade-center/upgrade-center';

import { EditCreditCardPage } from '../../billing/edit-credit-card/edit-credit-card';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';

/**
 * Generated class for the CreditCardDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-credit-card-detail',
  templateUrl: 'credit-card-detail.html',
})
export class CreditCardDetailPage {
  public cardDetail:any;
  public userId:string="";
  public uniquer_id:string="";
  public isOwner:boolean=false;
  public parentId:string="";
  public isEditCreditCardAccess:boolean=false;
  public loader:any;
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController,
     public platform: Platform,public loadingCtrl: LoadingController) {
      if(this.navParams.get('unique_id')!=undefined)
      {
        this.uniquer_id=this.navParams.get('unique_id');
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
    this.loadCreditCardDetail();
    this.setAccessLevels();
    });
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
      this.isEditCreditCardAccess=false;
    let allowed_access_options = this.storage.get('allowed_access_options');
    allowed_access_options.then((data) => {
      if(data!=null)
      {
        if(data!=false)
        {
        let savedAccessLevels:any[]=data;
        let editCreditCardAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="edit-credit-card");
    });
    if(editCreditCardAccesLevels.length>0)
      {
        this.isEditCreditCardAccess=true;
      }
      else
      {
        this.isEditCreditCardAccess=false;
      } 
    }
      }
    });
    
  }
  else
  {
    
    this.isEditCreditCardAccess=true;
    
  }
  }
  loadCreditCardDetail()
  {
    this.loader.present();  
    this.userServiceObj.loadCreditCardDetail(this.userId.toString(),this.sharedServiceObj.service_id,
    this.uniquer_id)
    .subscribe((result) => this.loadCreditCardDetailResp(result));
  }
  loadCreditCardDetailResp(result:any)
  {
    this.loader.dismiss();
    if(result.status==true)
      {
      this.cardDetail=result.card;
      //debugger;
      }
  }
  editCreditCardDetail()
  {
      this.navCtrl.push(EditCreditCardPage,{unique_id:this.uniquer_id});
  }
}
