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
  public parentId:string="";

  public isAddCreditCardAccess:boolean=false;
  public isEditCreditCardAccess:boolean=false;
  public isCreditCardDetailAccess:boolean=false;
  public isDeleteCreditCardAccess:boolean=false;

  public isOwner:boolean=false;
  public creditCardsFoundMessage="";
  public totalCreditCards:number=0;
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
      this.setAccessLevels();
    });
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
    let allowed_access_options = this.storage.get('allowed_access_options');
    allowed_access_options.then((data) => {
      if(data!=null)
      {
        //debugger;
        let savedAccessLevels:any[]=data;
    //debugger;
     
      let addCreditCardAccesLevels=savedAccessLevels.filter((element) => {
        return (element.name=="Add Credit Card");
    });
    if(addCreditCardAccesLevels.length>0)
      {
        this.isAddCreditCardAccess=true;
      }
      else
      {
        this.isAddCreditCardAccess=false;
      }
    let editCreditCardAccesLevels=savedAccessLevels.filter((element) => {
        return (element.name=="Edit Credit Card");
    });
    if(editCreditCardAccesLevels.length>0)
      {
        this.isEditCreditCardAccess=true;
      }
      else
      {
        this.isEditCreditCardAccess=false;
      } 
      let creditCardDetailAccesLevels=savedAccessLevels.filter((element) => {
        return (element.name=="Credit Card Detail");
    });
    if(creditCardDetailAccesLevels.length>0)
      {
        this.isCreditCardDetailAccess=true;
      }
      else
      {
        this.isCreditCardDetailAccess=false;
      }  
      let deleteCreditCardAccesLevels=savedAccessLevels.filter((element) => {
        return (element.name=="Delete Credit Card");
    });
    if(deleteCreditCardAccesLevels.length>0)
      {
        this.isDeleteCreditCardAccess=true;
      }
      else
      {
        this.isDeleteCreditCardAccess=false;
      }  
      }
    });
    
  }
  else
  {
    
    this.isAddCreditCardAccess=true;
    this.isCreditCardDetailAccess=true;
    this.isEditCreditCardAccess=true;
    
  }
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
    //debugger;
    if(result.status==true)
    {
      //debugger;
      this.defaultCreditCard=result.default_card;
      this.allCreditCards=result.all_cards;
      this.totalCreditCards=result.all_cards.length;
      //debugger;
    }
    else
    {
    // debugger;
      this.allCreditCards=[];
      this.totalCreditCards=0;
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
    if(this.isCreditCardDetailAccess==true)
    {
      if(unique_id!="")
      {
        //debugger;
        this.navCtrl.push(CreditCardDetailPage,{unique_id:unique_id});
      }
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
