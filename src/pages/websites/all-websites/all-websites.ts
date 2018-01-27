import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
  MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../../dashboard/dashboard';
import { FbConfirmPage } from '../../fb-confirm/fb-confirm';
import { CreateWebsitePage } from '../../websites/create-website/create-website';
import { EditWebsitePage } from '../../websites/edit-website/edit-website';
import { AlertController } from 'ionic-angular';

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
  public websiteId:string="";
  public allWebsiteList:any[]=[];
  public userId:string="";
  public websiteFoundMessage="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AllWebsitesPage');
    
    let member_id = this.storage.get('userId');
    //debugger;
    member_id.then((data) => {
      this.userId=data;
      this.viewAllWebsite();
    });
   // this.viewAllWebsite();
 
  }
  viewAllWebsite():void{
//debugger;
    if(this.userId!="")
    {
      let loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 700
      });
      loader.present();
     this.userServiceObj.allUserWebsites(this.userId.toString())
    .subscribe((result) => this.viewAllWebsiteResp(result));
    }
    
  }
  viewAllWebsiteResp(result:any):void{
  
    if(result.status==true)
    {
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
      title: 'Use this lightsaber?',
      message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
           // console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            let selectedIndex = this.allWebsiteList.indexOf(website);
            if (selectedIndex >= 0) {
            this.allWebsiteList.splice(selectedIndex, 1);
            }
            if(this.allWebsiteList.length<=0)
            {
              this.websiteFoundMessage="All websites have been deleted.Please add new website.";
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
  createWebsite(){
    this.navCtrl.push(CreateWebsitePage);
  }
  editWebsite(id:any){
    this.navCtrl.push(EditWebsitePage, {
      websiteId: id
    });
  }
}
