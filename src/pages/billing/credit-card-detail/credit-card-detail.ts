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

  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController,
     public platform: Platform,public loadingCtrl: LoadingController) {
      if(this.navParams.get('unique_id')!=undefined)
      {
        this.uniquer_id=this.navParams.get('unique_id');
      }
  }

  ionViewDidLoad() {
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
    this.userId=data;
    this.loadCreditCardDetail();
    });
  }
  loadCreditCardDetail()
  {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 700
    });
    loader.present();
   
    this.userServiceObj.loadCreditCardDetail(this.userId.toString(),this.sharedServiceObj.service_id,
    this.uniquer_id)
    .subscribe((result) => this.loadCreditCardDetailResp(result));
  }
  loadCreditCardDetailResp(result:any)
  {

if(result.status==true)
{
this.cardDetail=result.card;
}
//debugger;
  }
  editCreditCardDetail()
  {
      this.navCtrl.push(EditCreditCardPage,{unique_id:this.uniquer_id});
  }
}
