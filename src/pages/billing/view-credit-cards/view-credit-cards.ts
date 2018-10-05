import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common'
import { AlertController,ToastController } from 'ionic-angular';

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
    public platform: Platform,public loadingCtrl: LoadingController,private toastCtrl: ToastController,public datepipe: DatePipe) {
      if(this.navParams.get('notificationMsg')!=undefined)
      {
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
        /*this.notificationMsg=this.navParams.get('notificationMsg');
        let alert = this.alertCtrl.create({
          title: 'Notification',
          subTitle: this.notificationMsg,
          buttons: ['Ok']
        });
        alert.present();*/
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
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  setExpDateFormate(exp_month:string,exp_year:string)
  {
    
    let formatedDate=new Date(exp_year+"/"+exp_month);
    //debugger;
    return this.datepipe.transform(formatedDate, 'MM/yy');
    //return formatedDate;
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
      this.isAddCreditCardAccess=false;
    this.isCreditCardDetailAccess=false;
    this.isEditCreditCardAccess=false;
    let allowed_access_options = this.storage.get('allowed_access_options');
    allowed_access_options.then((data) => {
      if(data!=null)
      {
        if(data!=false)
        {
        //debugger;
        let savedAccessLevels:any[]=data;
    //debugger;
     
      let addCreditCardAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="add-credit-card");
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
      let creditCardDetailAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="credit-card-detail");
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
        return (element.key=="delete-credit-card");
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
    //debugger;
      this.allCreditCards=[];
      this.totalCreditCards=0;
      this.creditCardsFoundMessage="No billing info found.";
      /*let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: this.creditCardsFoundMessage,
        buttons: ['Ok']
      });
      alert.present();*/
      let toast = this.toastCtrl.create({
        message: this.creditCardsFoundMessage,
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
              /*let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: this.creditCardsFoundMessage,
                buttons: ['Ok']
              });
              alert.present();*/
              let toast = this.toastCtrl.create({
                message: this.creditCardsFoundMessage,
                duration: 3000,
                position: 'top',
                cssClass:'errorToast'
              });
              
              toast.onDidDismiss(() => {
                //console.log('Dismissed toast');
              });
              
              toast.present();
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
