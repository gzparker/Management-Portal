import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
  MenuController,LoadingController,ToastController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { CreateWebsitePage } from '../../websites/create-website/create-website';
import { EditWebsitePage } from '../../websites/edit-website/edit-website';
import { WebsitesWebsiteLinksPage } from '../../websites/websites-website-links/websites-website-links';
import { AlertController } from 'ionic-angular';
import { MlsSettingsPage } from '../../setup/mls-settings/mls-settings';
import { EditLeadRoutingPage } from '../../leads/edit-lead-routing/edit-lead-routing';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';

/**
 * Generated class for the AllWebsitesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-all-websites',
  templateUrl: 'all-websites.html',
})
export class AllWebsitesPage {
  public notificationMsg:string="";
  public websiteId:string="";
  public allWebsiteList:any[]=[];
  public userId:string="";
  public websiteFoundMessage="";
  public showCreateButton:boolean=false;
  public isApp=false;
  public parentId:string="";
  public isOwner:boolean=false;
  public isWebsitePagesAccess:boolean=false;
  public isDeleteWebsiteAccess:boolean=false;
  public isCreateWebsiteAccess:boolean=false;
  public isEditWebsiteAccess:boolean=false;
  public isMlsSettings:boolean=false;
  public isViewWebsiteAccess:boolean=false;
  public imgBaseUrl=this.sharedServiceObj.imgBucketUrl;
  public noImgUrl=this.sharedServiceObj.noImageUrl;
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController,private toastCtrl: ToastController) {
      /*if(this.platform.is('core') || this.platform.is('mobileweb')) {
        this.isApp=false;
      }
      else
      {
        this.isApp=true;
      }*/
      this.isApp = (!document.URL.startsWith("http"));
      if(this.navParams.get('notificationMsg')!=undefined)
      {
        this.notificationMsg=this.navParams.get('notificationMsg');
        /*let alert = this.alertCtrl.create({
          title: 'Notification',
          subTitle: this.notificationMsg,
          buttons: ['Ok']
        });
        alert.present();*/
        /*let toast = this.toastCtrl.create({
          message: this.notificationMsg,
          duration: 3000,
          position: 'top',
          cssClass:'successToast'
        });
        
        toast.onDidDismiss(() => {
          
        });
        toast.present();*/
      }
      //debugger;
  }

  ionViewDidLoad() {
    this.sharedServiceObj.updateColorThemeMethod(null);
    //alert('welcome');
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      //alert('welcome too');
      this.userId=data;
      //debugger;
      this.viewAllWebsite(null);
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
      this.isCreateWebsiteAccess=false;
    this.isDeleteWebsiteAccess=false;
    this.isEditWebsiteAccess=false;
    this.isMlsSettings=false;
    this.isWebsitePagesAccess=false;
    let allowed_access_options = this.storage.get('allowed_access_options');
    allowed_access_options.then((data) => {
      if(data!=null)
      {
        if(data!=false)
        {
        let savedAccessLevels:any[]=data;
    //debugger;
      let createWebsiteAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="create-website");
    });
    if(createWebsiteAccesLevels.length>0)
      {
        this.isCreateWebsiteAccess=true;
      }
      else
      {
        this.isCreateWebsiteAccess=false;
      }
      let mlsSettingsAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="mls-settings");
    });
    if(mlsSettingsAccesLevels.length>0)
      {
        this.isMlsSettings=true;
      }
      else
      {
        this.isMlsSettings=false;
      }
    let editWebsiteAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="edit-website");
    });
    if(editWebsiteAccesLevels.length>0)
      {
        this.isEditWebsiteAccess=true;
      }
      else
      {
        this.isEditWebsiteAccess=false;
      }
    let deleteWebsiteAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="delete-website");
    });
    if(deleteWebsiteAccesLevels.length>0)
      {
        this.isDeleteWebsiteAccess=true;
      }
      else
      {
        this.isDeleteWebsiteAccess=false;
      }
    let viewPagesAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="view-pages-widgets");
    });
    if(viewPagesAccesLevels.length>0)
      {
        this.isWebsitePagesAccess=true;
      }
      else
      {
        this.isWebsitePagesAccess=false;
      }
    }
      }
    });
    
  }
  else
  {
    //debugger;
    this.isCreateWebsiteAccess=true;
    this.isDeleteWebsiteAccess=true;
    this.isEditWebsiteAccess=true;
    this.isMlsSettings=true;
    this.isWebsitePagesAccess=true;
  }
  }
  openInAppBrowser(redirectUrl:string)
  {
    window.open(redirectUrl, '_black');
    
  }
  websiteLinks(websiteId:string)
  {
    //debugger;
    this.ngZone.run(() => {
      this.navCtrl.push(WebsitesWebsiteLinksPage,{websiteId:websiteId.toString()});
      });
  }
  viewAllWebsite(refresher:any):void{
    //alert(this.userId);
    if(this.userId!="")
    {
      //alert(this.userId.toString());
      let loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 700
      });
      loader.present();
      if(refresher!=null)
    {
      refresher.complete();
    }
    //alert('yes');
     this.userServiceObj.allUserWebsites(this.userId.toString())
    .subscribe((result) => this.viewAllWebsiteResp(result));
    } 
  }
  viewAllWebsiteResp(result:any):void{
    //alert(result.status);
  this.showCreateButton=true;
    if(result.status==true)
    {
     //debugger;
      this.allWebsiteList=result.result;   
    }
    else
    {
      this.allWebsiteList=[];
      this.websiteFoundMessage="No website found.";
      /*let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: this.websiteFoundMessage,
        buttons: ['Ok']
      });
      alert.present();*/
      /*let toast = this.toastCtrl.create({
        message: this.websiteFoundMessage,
        duration: 3000,
        position: 'top',
        cssClass:'errorToast'
      });
      
      toast.onDidDismiss(() => {
      
      });
      toast.present();*/
    }
    //debugger;
  }
  
  deleteWebsite(website:any):void{

    let confirm = this.alertCtrl.create({
      title: 'Delete Website?',
      message: 'Are you sure to delete this website?',
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
            let selectedIndex = this.allWebsiteList.indexOf(website);
            if (selectedIndex >= 0) {
            this.allWebsiteList.splice(selectedIndex, 1);
            }
            if(this.allWebsiteList.length<=0)
            {
              this.websiteFoundMessage="All websites have been deleted.Please add new website.";
              this.notificationMsg="";
              /*let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: this.websiteFoundMessage,
                buttons: ['Ok']
              });
              alert.present();*/
              let toast = this.toastCtrl.create({
                message: this.websiteFoundMessage,
                duration: 3000,
                position: 'top',
                cssClass:'errorToast'
              });
              
              toast.onDidDismiss(() => {
                //console.log('Dismissed toast');
              });
              toast.present();
            }
           this.userServiceObj.deleteWebsite(this.userId.toString(),website.id)
           .subscribe((result) => this.deleteWebsiteResp(result,website));
         
          }
        }
      ]
    });
    confirm.present();  
  }
  deleteWebsiteResp(result:any,website:any):void{
    //debugger;
    if(result.status)
    {
    // this.viewAllWebsite();
    }
  }
  editLeadRouting(websiteId:string)
  {
    //debugger;
    this.navCtrl.push(EditLeadRoutingPage,{websiteId:websiteId});
  }
  createWebsite(){
   // debugger;
    //this.navCtrl.push(CreateWebsitePage);
    this.userServiceObj.checkWebsiteCount(this.userId.toString())
    .subscribe((result) => this.checkWebsiteCountResp(result));
  }
  checkWebsiteCountResp(result:any)
  {
//debugger;
if(result.status==true)
{
  this.navCtrl.push(CreateWebsitePage);
}
else
{
  let confirm = this.alertCtrl.create({
    title: 'Website Create?',
    message: result.message,
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
          this.navCtrl.push(CreateWebsitePage);
        }
      }
    ]
  });
  confirm.present(); 
}
  }
  viewPaperWorkStatus(website_id:string)
  {
    //debugger;
    this.navCtrl.push(MlsSettingsPage,{website_Id:website_id});
  }
  editWebsite(id:any){
    this.navCtrl.push(EditWebsitePage, {
      websiteId: id
    });
  }
}
