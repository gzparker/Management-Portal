import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import {DatePipe} from '@angular/common';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';

import { ViewCreditCardsPage } from '../../billing/view-credit-cards/view-credit-cards';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';

/**
 * Generated class for the AddCreditCardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-credit-card',
  templateUrl: 'add-credit-card.html',
})
export class AddCreditCardPage {
  public userId:string="";
  public full_name: string;
  public cc_number: string;
  public expiryDate: string="";
  public exp_month: string;
  public exp_year: string;
  public creditCardMsg: string = "";
  public cvc: string;
  public primary_source:boolean=false;
  public primary_source_data:string="";
  public calendarMinDate:any;
  public calendarMaxDate:any;
  public first_name:string="";
  public last_name:string="";
  public email:string="";
  public yearValues:any[]=[];
  public monthValues:any[]=[];
  public loader:any;
  //public calendarMinDate=new Date().toISOString();

  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, 
    public platform: Platform,public loadingCtrl: LoadingController) {
      this.setYearMonthValues();
     // this.expiryDate=new Date(new Date().getFullYear().toString()+"-"+(new Date().getMonth().toString())).toISOString();
      this.calendarMinDate=new Date();
      this.calendarMinDate.setFullYear(this.calendarMinDate.getFullYear(),0);
      this.calendarMinDate=this.calendarMinDate.toISOString();
      this.calendarMaxDate=new Date();
      this.calendarMaxDate.setFullYear(this.calendarMaxDate.getFullYear() + 50);
      this.calendarMaxDate=this.calendarMaxDate.toISOString();
  }

  ionViewDidLoad() {
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
    this.userId=data;
    let first_name = this.storage.get('first_name');
    first_name.then((data) => {
    this.first_name=data;
    });
    let last_name = this.storage.get('last_name');
    last_name.then((data) => {
    this.last_name=data;
    });
    let email = this.storage.get('email');
    email.then((data) => {
    this.email=data;
    });
    });
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
  saveCreditCard() {
      let dataObj = {
        member_id: "",
        full_name: "",
        first_name:"",
        last_name:"",
        email:"",
        cc_number: "",
        exp_month: "",
        exp_year: "",
        cvc: "",
        primary_source:""
      };
    /*if(this.primary_source)
    {
      this.primary_source_data="1";
    }
    else
    {
      this.primary_source_data="0";
    }*/
      dataObj.full_name = this.full_name;
      dataObj.first_name=this.first_name;
      dataObj.last_name=this.last_name;
      dataObj.email=this.email;
      dataObj.cc_number = this.cc_number;
      dataObj.exp_month = this.expiryDate.split("-")[1];
      dataObj.exp_year = this.expiryDate.split("-")[0];
      dataObj.cvc = this.cvc;
      //dataObj.primary_source=this.primary_source_data;
//debugger;
      let member_id = this.storage.get('userId');
      member_id.then((memberResp) => {
        //debugger;
        dataObj.member_id = memberResp;
    
        this.userServiceObj.addCreditCardDetail(dataObj).
          subscribe((result) => this.saveCreditCardResp(result));
      });
   
      }
      saveCreditCardResp(data: any) {
        //debugger;
        if (data.status == true) {
          this.ngZone.run(() => {
            this.navCtrl.push(ViewCreditCardsPage,{notificationMsg:data.message.toUpperCase()});
           
          });
        }
        else {
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: this.creditCardMsg,
            buttons: ['Ok']
          });
          alert.present();
          //this.creditCardMsg=data.message.toUpperCase();
        }
      }
}
