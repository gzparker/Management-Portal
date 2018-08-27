import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, MenuController,ActionSheetController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { ISubscription } from "rxjs/Subscription";
import { AlertController } from 'ionic-angular';

import { LoginPage } from '../../pages/login/login';
import { RegisterPage } from '../../pages/register/register';
import { SharedProvider } from '../../providers/shared/shared';
import { UserProvider } from '../../providers/user/user';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public isApp=false;
  public websiteBackgroundInfo:any;
  public headerColor:string="";
  public sideBarMenuColor:string="";
  public buttonColor:string="";
  public textColor:string="";
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, 
    public platform: Platform,public actionSheetCtrl: ActionSheetController) {
      this.isApp = (!document.URL.startsWith("http"));
      this.setBackgroundInfo();
  }
  setBackgroundInfo()
  {
    var that=this;
    let generalWebsiteSettings = this.storage.get('generalWebsiteSettings');
    generalWebsiteSettings.then((data) => {
        if(data!=null)
        {
          that.websiteBackgroundInfo=data;
          if(data.header_color)
          {
            if(data.header_color=="base_color")
            {
              that.headerColor=data.color_base;
          }
          if(data.header_color=="secondary_color")
          {
            that.headerColor=data.color_secondary;
        }
          if(data.header_color=="tertiary_color")
            {
              that.headerColor=data.color_tertiary;
          }
         
         // debugger;
        }
        if(data.sidebar_menu_color)
        {
          if(data.sidebar_menu_color=="base_color")
          {
            that.sideBarMenuColor=data.color_base;
        }
        if(data.sidebar_menu_color=="secondary_color")
          {
            that.sideBarMenuColor=data.color_secondary;
        }
        if(data.sidebar_menu_color=="tertiary_color")
          {
            that.sideBarMenuColor=data.color_tertiary;
        }
        
       // debugger;
      }
      if(data.button_color)
      {
        if(data.button_color=="base_color")
        {
          that.buttonColor=data.color_base;
      }
      if(data.button_color=="secondary_color")
        {
          that.buttonColor=data.color_secondary;
      }
      if(data.button_color=="tertiary_color")
        {
          that.buttonColor=data.color_tertiary;
      }
      
     // debugger;
    }
    if(data.text_color)
    {
      if(data.text_color=="base_color")
      {
        that.textColor=data.color_base;
    }
    if(data.text_color=="secondary_color")
      {
        that.textColor=data.color_secondary;
    }
    if(data.text_color=="tertiary_color")
      {
        that.textColor=data.color_tertiary;
    }
    
  
  }
  //debugger;
      }
      });
  }
openPage(pagenumber:string){
  if(pagenumber=='2')
  {
    this.navCtrl.setRoot(LoginPage);
  }
  if(pagenumber=='3')
  {
    this.navCtrl.setRoot(RegisterPage);
  }
}

}
