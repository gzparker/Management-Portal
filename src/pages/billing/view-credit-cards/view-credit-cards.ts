import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';

import { AccountOptionPage } from '../../account/account-option/account-option';

import { ChangePasswordPage } from '../../account/change-password/change-password';
import { UpgradeCenterPage } from '../../account/upgrade-center/upgrade-center';

import { EditCreditCardPage } from '../edit-credit-card/edit-credit-card';
import { CreditCardDetailPage } from '../credit-card-detail/credit-card-detail';
import { AddCreditCardPage } from '../add-credit-card/add-credit-card';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';


/**
 * Generated class for the ViewCreditCardsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-credit-cards',
  templateUrl: 'view-credit-cards.html',
})
export class ViewCreditCardsPage {
  public allCreditCards:any[]=[];
  public defaultCreditCard:any;
  public notificationMsg:string="";
  public userId:string="";
  public creditCardsFoundMessage="";
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, 
    public platform: Platform,public loadingCtrl: LoadingController) {
      if(this.navParams.get('notificationMsg')!=undefined)
      {
        this.notificationMsg=this.navParams.get('notificationMsg');
      }
  }

  ionViewDidLoad() {
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
      this.loadAllCreditCards(null);
    });
  }
  loadAllCreditCards(refresher:any)
  {
    if(this.userId.toString())
    {
      let loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 700
      });
      loader.present();
      if(refresher!=null)
    {
      refresher.complete();
    }
      this.userServiceObj.allListCreditCards(this.userId.toString(),this.sharedServiceObj.service_id)
    .subscribe((result) => this.loadAllCreditCardsResp(result));
    }
    
  }
  loadAllCreditCardsResp(result:any)
  {
    if(result.status==true)
    {
      //debugger;
      this.defaultCreditCard=result.default_card;
      this.allCreditCards=result.all_cards;
      //debugger;
    }
    else
    {
     // debugger;
      this.allCreditCards=[];
      this.creditCardsFoundMessage="No billing info found.";
    }
  }
  deleteCreditCard(creditCard:any)
  {

    let confirm = this.alertCtrl.create({
      title: 'Delete Credit Card?',
      message: 'Are you sure to delete this credit card?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
           // console.log('Disagree clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            let selectedIndex = this.allCreditCards.indexOf(creditCard);
            if (selectedIndex >= 0) {
            this.allCreditCards.splice(selectedIndex, 1);
            }
            if(this.allCreditCards.length<=0)
            {
              this.creditCardsFoundMessage="All credit cards have been deleted.Please add new credit card.";
              this.notificationMsg="";
            }
            this.userServiceObj.deleteCreditCard(this.userId.toString(),this.sharedServiceObj.service_id,creditCard.unique_id)
            .subscribe((result) => this.deleteCreditCardResp(result));
          }
        }
      ]
    });
    confirm.present();
  }
  deleteCreditCardResp(result:any):void{
    //debugger;
    if(result.status==true)
    {
     // debugger;
   // this.viewAllHotSheets();
    }
    
    }
  cardDetail(unique_id:string)
  {
     if(unique_id!="")
     {
       //debugger;
       this.navCtrl.push(CreditCardDetailPage,{unique_id:unique_id});
     }
  }
  editCreditCardDetail(unique_id:string)
  {
      this.navCtrl.push(EditCreditCardPage,{unique_id:unique_id});
  }
  addCreditCard()
  {
      this.navCtrl.push(AddCreditCardPage);
  }
}
