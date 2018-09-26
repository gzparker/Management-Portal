import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import {DatePipe} from '@angular/common';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';

import { AccountOptionPage } from '../../account/account-option/account-option';

import { ChangePasswordPage } from '../../account/change-password/change-password';
import { UpgradeCenterPage } from '../../account/upgrade-center/upgrade-center';

import { ViewCreditCardsPage } from '../../billing/view-credit-cards/view-credit-cards';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';

/**
 * Generated class for the EditCreditCardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-credit-card',
  templateUrl: 'edit-credit-card.html',
})
export class EditCreditCardPage {
  public cardDetail:any;
  public updateCardMsg:string="";
  public userId:string="";
  public cc_number: string;
  public uniquer_id:string="";
  public full_name: string="";
  public expiryDate: any;
  public exp_month: string="";
  public exp_year: string="";
  public zipCode:string="";
  public cvc:string="";
  public primary_source:boolean=false;
  public primary_source_data:string="";
  public yearValues:any[]=[];
  public monthValues:any[]=[];
  public loader:any;
  //public calendarMinDate=new Date().toISOString();
  public calendarMinDate:any;
  public calendarMaxDate:any;
  

  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, 
    public platform: Platform,public loadingCtrl: LoadingController) {
      this.setYearMonthValues();
      this.calendarMinDate=new Date();
      this.calendarMinDate.setFullYear(this.calendarMinDate.getFullYear(),0);
      this.calendarMinDate=this.calendarMinDate.toISOString();
      this.calendarMaxDate=new Date();
      this.calendarMaxDate.setFullYear(this.calendarMaxDate.getFullYear() + 50);
      this.calendarMaxDate=this.calendarMaxDate.toISOString();
      //debugger;
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
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
    this.userId=data;
    this.loadCreditCardDetail();
    });
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  setYearMonthValues()
  {
    let currentYear=parseInt(new Date().getFullYear().toString());
    for(let i=currentYear;i<=currentYear+50;i++)
    {
      this.yearValues.push(i);
    }
    for(let i=1;i<=12;i++)
    {
      this.monthValues.push(i);
    }
    this.expiryDate=new Date(new Date().getFullYear().toString()+"-"+(new Date().getMonth().toString())).toISOString();
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
this.full_name=this.cardDetail.name;
this.zipCode=this.cardDetail.address_zip;
this.cc_number="xxx-"+this.cardDetail.last4;
this.cvc=this.cardDetail.cvc;
if(this.cardDetail.primary_source==null||this.cardDetail.primary_source=="0")
{
this.primary_source=false;
}
else
{
  this.primary_source=true;
}
this.expiryDate=this.cardDetail.exp_year+"-"+(parseInt(this.cardDetail.exp_month)).toString();
//debugger;
this.expiryDate=new Date(this.expiryDate).toISOString();
//debugger;
}
  }
  updateCreditCard()
  {
    //this.loader.present();
    if(this.primary_source)
    {
      this.primary_source_data="1";
    }
    else
    {
      this.primary_source_data="0";
    }
    this.exp_month = this.expiryDate.split("-")[1];
    this.exp_year = this.expiryDate.split("-")[0];
    this.userServiceObj.updateCreditCardDetail(this.userId.toString(),this.sharedServiceObj.service_id,
    this.uniquer_id,this.full_name,this.exp_year,this.exp_month,this.zipCode,this.primary_source_data,this.cvc)
    .subscribe((result) => this.updateCreditCardResp(result));
  }
 updateCreditCardResp(result:any)
 {
  //this.loader.dismiss();
if(result.status==true)
{
  this.navCtrl.push(ViewCreditCardsPage,{notificationMsg:result.message.toUpperCase()})
}
 }

}
