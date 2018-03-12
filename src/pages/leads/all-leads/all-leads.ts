import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
  MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../../dashboard/dashboard';
import { FbConfirmPage } from '../../fb-confirm/fb-confirm';

import { CreateLeadPage } from '../../leads/create-lead/create-lead';
import { LeadDetailPage } from '../../leads/lead-detail/lead-detail';
import { EditLeadPage } from '../../leads/edit-lead/edit-lead';
import { EditLeadRoutingPage } from '../../leads/edit-lead-routing/edit-lead-routing';

import { AlertController } from 'ionic-angular';

import { UserVerificationPage } from '../../user-verification/user-verification';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';
import { AllWebsitesPage } from '../../websites/all-websites/all-websites';
/**
 * Generated class for the AllLeadsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-all-leads',
  templateUrl: 'all-leads.html',
})
export class AllLeadsPage {
  public notificationMsg:string="";
  public leadId:string="";
  public allLeadsList:any[]=[];
  public userWebsites:any[]=[];
  
  public leadsFoundMessage="";
  public userId:string="";
  
  public title: string = 'Delete Lead';
  public message: string = 'Are you sure to delete this lead!';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;
  public isOpen: boolean = false;
  public loader:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController) {
      if(this.navParams.get('notificationMsg')!=undefined)
      {
        this.notificationMsg=this.navParams.get('notificationMsg');
      }
      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 5000
      });
  }

  ionViewDidLoad() {
    let member_id = this.storage.get('userId');
    //debugger;
    member_id.then((data) => {
      this.userId=data;
      this.viewAllWebsite();
      this.viewAllLeads(null);
      
    });
  }
  createLead()
  {
    this.navCtrl.push(CreateLeadPage);
  }
  viewAllLeads(refresher:any):void{
    if(this.userId!="")
    {
      
    if(refresher!=null)
    {
      refresher.complete();
    }
    else
    {
      this.loader.present();
    }
  this.userServiceObj.allLeads(this.userId.toString())
    .subscribe((result) => this.viewAllLeadsResp(result));
    }
    
  }
  viewAllLeadsResp(result:any):void{
    this.loader.dismiss();
    if(result.status==true)
    {
      //debugger;
      this.allLeadsList=result.results;
    }
    else
    {
      this.allLeadsList=[];
      this.leadsFoundMessage="No leads found.";
    }
    
  }
  viewAllWebsite():void{
    if(this.userId!="")
    {
     this.userServiceObj.allUserWebsites(this.userId.toString())
    .subscribe((result) => this.viewAllWebsiteResp(result));
    } 
  }
  viewAllWebsiteResp(result:any):void{
  
    if(result.status==true)
    {
     // debugger;
      this.userWebsites=result.result;   
    }
    else
    {
      this.userWebsites=[];
    }
    
  }
  editLead(leadId:string){
this.navCtrl.push(EditLeadPage,{leadId:leadId});
  }
  leadDetail(leadId:string){
    this.navCtrl.push(LeadDetailPage,{leadId:leadId});
      }
  editLeadRouting(websiteId:string)
  {
    this.navCtrl.push(EditLeadRoutingPage,{websiteId:websiteId});
  }
  deleteLead(lead:any):void{

    let confirm = this.alertCtrl.create({
      title: 'Delete Lead?',
      message: 'Are you sure to delete this lead?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
         
          }
        },
        {
          text: 'Ok',
          handler: () => {
            let selectedIndex = this.allLeadsList.indexOf(lead);
            if (selectedIndex >= 0) {
            this.allLeadsList.splice(selectedIndex, 1);
            }
            if(this.allLeadsList.length<=0)
            {
              this.leadsFoundMessage="All leads have been deleted.Please add new lead.";
              this.notificationMsg="";
            }
            this.userServiceObj.deleteLead(lead.lead_id)
            .subscribe((result) => this.deleteLeadResp(result));
          }
        }
      ]
    });
    confirm.present();
   
  }
  deleteLeadResp(result:any):void{
    //debugger;
    if(result.status)
    {
     //this.viewAllLeads();
    }
  }
  sendToPaperWork():void{
    debugger;
    if(this.userWebsites.length==1)
    {
      this.navCtrl.push(EditLeadRoutingPage,{website_Id:this.userWebsites[0].id});
    }
    else
    {
      this.navCtrl.push(AllWebsitesPage,{notificationMsg:"which website would they like to edit the lead source".toUpperCase()});
    }
  }
}
