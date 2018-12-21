import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, MenuController,
  ActionSheetController,App } from 'ionic-angular';
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
  public contentBackgrounColor:string="";
  public contentTitleColor:string="";
  public paginationColor:string="";
  public modalBackgroundColor:string="";

  public loadedWebsite:string="";
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, 
    public platform: Platform,public actionSheetCtrl: ActionSheetController,private _app: App) {
      this._app.setTitle(" - App Name");
      this.loadedWebsite=document.URL.toString();
      this.isApp = (!document.URL.startsWith("http"));
     // this.setBackgroundInfo();
     this.sharedServiceObj.updateColorThemeMethod(null);
     this.loadGeneralWebsiteSettings();
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  /*loadGeneralWebsiteSettings()
  {
    if(this.loadedWebsite.indexOf("localhost")>0)
    {
      this.sharedServiceObj.getServiceDefaultInfoByUrl("https://intagent.configuration.menu")
      .subscribe((result) => this.loadGeneralWebsiteSettingsResp(result));
    }
    else
    {
     this.sharedServiceObj.getServiceDefaultInfoByUrl(this.loadedWebsite.toString())
     .subscribe((result) => this.loadGeneralWebsiteSettingsResp(result));
    }

  }*/
  loadGeneralWebsiteSettings()
  {
    debugger;
    var that=this;
    let serviceInfo=this.storage.get("generalWebsiteSettings");
    serviceInfo.then((result)=>
{
  debugger;
  that.websiteBackgroundInfo=result;

  document.getElementById("appPageTitle").innerText=that.websiteBackgroundInfo.service_name;
  
  if(result.header_color)
  {
    
      that.headerColor=result.header_color;
 
}
if(result.sidebar_menu_color)
{
 
    that.sideBarMenuColor=result.sidebar_menu_color;

}
if(result.button_color)
{
  that.buttonColor=result.button_color;
}
if(result.text_color)
{
that.textColor=result.text_color;
}
if(result.text_color)
{
that.textColor=result.text_color;
}
if(result.text_color)
{
that.textColor=result.text_color;
}
if(result.content_background)
{
that.contentBackgrounColor=result.content_background;
}
if(result.content_title_color)
{
that.contentTitleColor=result.content_title_color;
}
if(result.pagination_color)
{
that.paginationColor=result.pagination_color;
}
if(result.modal_background_color)
{
that.modalBackgroundColor=result.modal_background_color;
}

});
debugger;
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
