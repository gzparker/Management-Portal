import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
  MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../../dashboard/dashboard';
import { FbConfirmPage } from '../../fb-confirm/fb-confirm';
import { CreateWebsitePage } from '../../websites/create-website/create-website';
import { EditWebsitePage } from '../../websites/edit-website/edit-website';
import { DashboardTabsPage } from '../../tabs/dashboard-tabs/dashboard-tabs';
import { AlertController } from 'ionic-angular';
import { MlsSettingsPage } from '../../setup/mls-settings/mls-settings';
import { EditLeadRoutingPage } from '../../leads/edit-lead-routing/edit-lead-routing';
import { UserVerificationPage } from '../../user-verification/user-verification';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';

/**
 * Generated class for the AllWebsitesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
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
  public imgBaseUrl=this.sharedServiceObj.imgBucketUrl;
  public noImgUrl=this.sharedServiceObj.noImageUrl;
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController) {
      if(this.platform.is('core') || this.platform.is('mobileweb')) {
        this.isApp=false;
      }
      else
      {
        this.isApp=true;
      }
      if(this.navParams.get('notificationMsg')!=undefined)
      {
        this.notificationMsg=this.navParams.get('notificationMsg');
      }
  }

  ionViewDidLoad() {
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
      this.viewAllWebsite(null);
    });
  }
  viewAllWebsite(refresher:any):void{
    if(this.userId!="")
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
     this.userServiceObj.allUserWebsites(this.userId.toString())
    .subscribe((result) => this.viewAllWebsiteResp(result));
    } 
  }
  viewAllWebsiteResp(result:any):void{
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
    }    
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
    this.navCtrl.push(CreateWebsitePage);
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
