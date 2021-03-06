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
public serviceType:string="";
  public loadedWebsite:string="";
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, 
    public platform: Platform,public actionSheetCtrl: ActionSheetController,private _app: App) {
      this._app.setTitle(" - App Name");
      this.loadedWebsite=document.URL.toString();
      if(this.loadedWebsite.indexOf("localhost")>0)
    {
      this.serviceType="intagent";
    }
    else if(this.loadedWebsite.indexOf("intagent")>0)
    {
      this.serviceType="intagent";
    }
    else if(this.loadedWebsite.indexOf("idx")>0)
    {
      this.serviceType="idx";
    }
    else{
      this.serviceType="idx";
    }
      this.isApp = (!document.URL.startsWith("http"));
  }
  ionViewDidLoad()
  {
  }
  ionViewDidEnter()
  {
    this.loadGeneralWebsiteSettingsLocal();
  }
  loadGeneralWebsiteSettingsLocal()
  {
    var that=this;
    let serviceInfo=this.storage.get("generalWebsiteSettings");
    serviceInfo.then((result)=>
{
  if(result!=null){
    that.websiteBackgroundInfo=result;
    if(that.websiteBackgroundInfo!=undefined)
    {
      that.applyColors();
    }
  }
 else{
  that.loadGeneralWebsiteSettingsLive();
 } 
});

  }
  loadGeneralWebsiteSettingsLive()
  {
    if(!this.isApp){
      //alert('its not app');
      let dummyWebsiteUrl="";
      if(this.loadedWebsite[this.loadedWebsite.length-1]=="/")
      {
  dummyWebsiteUrl=this.loadedWebsite.substr(0,this.loadedWebsite.length-1)
      }
      else
      {
        dummyWebsiteUrl=this.loadedWebsite;
      }
      if(dummyWebsiteUrl=="https://configuration.menu"||dummyWebsiteUrl=="http://configuration.menu")
      {
        this.sharedServiceObj.getServiceDefaultInfoByUrl("https://idx.configuration.menu")
        .subscribe((result) => this.loadGeneralWebsiteSettingsResp(result));
      }
      else if(this.loadedWebsite.indexOf("localhost")>0)
      {
        
        this.sharedServiceObj.getServiceDefaultInfoByUrl("https://idx.configuration.menu")
        .subscribe((result) => this.loadGeneralWebsiteSettingsResp(result));
      }
      else
      {
        //alert(dummyWebsiteUrl.toString());
       this.sharedServiceObj.getServiceDefaultInfoByUrl(dummyWebsiteUrl.toString())
       .subscribe((result) => this.loadGeneralWebsiteSettingsResp(result));
      }
    }    
   else{
     //alert('its an app');
    this.sharedServiceObj.getServiceDefaultInfoByUrl("https://idx.configuration.menu")
    .subscribe((result) => this.loadGeneralWebsiteSettingsResp(result));
   } 
  }
  loadGeneralWebsiteSettingsResp(result:any)
  {
    var that=this;
if(result)
{
  //alert(JSON.stringify(result));
  this.storage.set("generalWebsiteSettings",result);
  that.websiteBackgroundInfo=result;
  that.applyColors();
  }
}
applyColors()
{
  
  let contentBackgroundElement=document.getElementsByClassName("background_color");
    
  for (let i = 0; i < contentBackgroundElement.length; i++) {
    contentBackgroundElement[i].setAttribute("style", "background:"+this.websiteBackgroundInfo.content_background+" !important;");
  }
  let sidebarElements=document.getElementsByClassName("sidebar_color");
    for (let i = 0; i < sidebarElements.length; i++) {
      sidebarElements[i].setAttribute("style", "background:"+this.websiteBackgroundInfo.sidebar_menu_color+" !important;");
    }
    let textBarElements=document.getElementsByClassName("text_color");
    for (let i = 0; i < textBarElements.length; i++) {
    
     textBarElements[i].setAttribute("style", "color:"+this.websiteBackgroundInfo.text_color+" !important;");
    }
    //////////////////////////////Button Color////////////////////////////////    
    let buttonColorElement=document.getElementsByClassName("button_color");
    
    for (let i = 0; i < buttonColorElement.length; i++) {
    
      buttonColorElement[i].setAttribute("style", "background:"+this.websiteBackgroundInfo.button_color+" !important;");
    }
    let buttonToggleElement=document.getElementsByClassName("btnToggle");
    
    for (let i = 0; i < buttonToggleElement.length; i++) {
    
      buttonToggleElement[i].setAttribute("style", "background:"+this.websiteBackgroundInfo.button_color+" !important;");
    }
    let buttonBadgeElement=document.getElementsByClassName("msgcounter");
    
    for (let i = 0; i < buttonBadgeElement.length; i++) {
    
      buttonBadgeElement[i].setAttribute("style", "background:"+this.websiteBackgroundInfo.button_color+" !important;");
    }
    let buttonBadgeInviteElement=document.getElementsByClassName("badgeInvite");
    
    for (let i = 0; i < buttonBadgeInviteElement.length; i++) {
    
      buttonBadgeInviteElement[i].setAttribute("style", "background:"+this.websiteBackgroundInfo.button_color+" !important;");
    }
    let buttonviewProfileElement=document.getElementsByClassName("viewProfile");
    
    for (let i = 0; i < buttonviewProfileElement.length; i++) {
    
      buttonviewProfileElement[i].setAttribute("style", "background:"+this.websiteBackgroundInfo.button_color+" !important;");
    }
    let buttonContactElement=document.getElementsByClassName("contactPhone");
    
    for (let i = 0; i < buttonContactElement.length; i++) {
    
      buttonContactElement[i].setAttribute("style", "background:"+this.websiteBackgroundInfo.button_color+" !important;");
    }
    let buttonContactChatElement=document.getElementsByClassName("contactChat");
    
    for (let i = 0; i < buttonContactChatElement.length; i++) {
    
      buttonContactChatElement[i].setAttribute("style", "background:"+this.websiteBackgroundInfo.button_color+" !important;");
    }
    let buttonContactEmailElement=document.getElementsByClassName("contactEmail");
    
    for (let i = 0; i < buttonContactEmailElement.length; i++) {
    
      buttonContactEmailElement[i].setAttribute("style", "background:"+this.websiteBackgroundInfo.button_color+" !important;");
    }
    let buttonContactInviteElement=document.getElementsByClassName("contactInvite");
    
    for (let i = 0; i < buttonContactInviteElement.length; i++) {
    
      buttonContactInviteElement[i].setAttribute("style", "background:"+this.websiteBackgroundInfo.button_color+" !important;");
    }
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
