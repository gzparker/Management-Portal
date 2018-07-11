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
  public searchedLeadsList:any[]=[];
  public userWebsites:any[]=[];
  
  public searchLeadTerm:string="";
  public leadsFoundMessage="";
  public userId:string="";
  public category:string="";
  
  public title: string = 'Delete Lead';
  public message: string = 'Are you sure to delete this lead!';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;
  public isOpen: boolean = false;
  public parentId:string="";
  public isOwner:boolean=false;
  public isCreateLeadAccess:boolean=false;
  public isEditLeadAccess:boolean=false;
  public isLeadDetailAccess:boolean=false;
  public isDeleteLeadAccess:boolean=false;
  public isLeadSetupAccess:boolean=false;
  
  public loader:any;
  public isApp=false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController) {
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
      this.setAccessLevels();
    });
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
      this.isCreateLeadAccess=false;
    this.isDeleteLeadAccess=false;
    this.isEditLeadAccess=false;
    this.isLeadDetailAccess=false;
    this.isLeadSetupAccess=false;
    let allowed_access_options = this.storage.get('allowed_access_options');
    allowed_access_options.then((data) => {
      if(data!=null)
      {
        if(data!=false)
        {
        //debugger;
        let savedAccessLevels:any[]=data;
    //debugger;
      let createLeadAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="create-lead");
    });
    if(createLeadAccesLevels.length>0)
      {
        this.isCreateLeadAccess=true;
      }
      else
      {
        this.isCreateLeadAccess=false;
      }
      let editLeadAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="edit-lead");
    });
    if(editLeadAccesLevels.length>0)
      {
        this.isEditLeadAccess=true;
      }
      else
      {
        this.isEditLeadAccess=false;
      }
    let leadDetailAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="lead-detail");
    });
    if(leadDetailAccesLevels.length>0)
      {
        this.isLeadDetailAccess=true;
      }
      else
      {
        this.isLeadDetailAccess=false;
      }
    let deleteLeadAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="delete-lead");
    });
    if(deleteLeadAccesLevels.length>0)
      {
        this.isDeleteLeadAccess=true;
      }
      else
      {
        this.isDeleteLeadAccess=false;
      }
    let leadSetupAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="leads-setup");
    });
    if(leadSetupAccesLevels.length>0)
      {
        this.isLeadSetupAccess=true;
      }
      else
      {
        this.isLeadSetupAccess=false;
      } 
      }
    }
    });
    
  }
  else
  {
    //debugger;
    this.isCreateLeadAccess=true;
    this.isDeleteLeadAccess=true;
    this.isEditLeadAccess=true;
    this.isLeadDetailAccess=true;
    this.isLeadSetupAccess=true;
  }
  }
  createLead()
  {
    this.navCtrl.push(CreateLeadPage);
  }
  setLeadFilteredItems()
  {
this.searchedLeadsList=this.filterItems(this.searchLeadTerm);
  }
  filterItems(searchTerm){
    //debugger;
    return this.allLeadsList.filter((item) => {
        return (item.first_name.toLowerCase()+" "+item.last_name.toLowerCase()).indexOf(searchTerm.toLowerCase()) > -1;
    });
}
filterItemsByCategory()
{
 // debugger;
  this.viewAllLeads(null);
  
}
  viewAllLeads(refresher:any):void{
    if(this.userId!="")
    {
      
    if(refresher!=null)
    {
      refresher.complete();
    }
    //else
   // {
     // this.loader.present();
    //}
  this.userServiceObj.allLeads(this.userId.toString(),this.category.toString())
    .subscribe((result) => this.viewAllLeadsResp(result));
    }
    
  }
  viewAllLeadsResp(result:any):void{
    this.loader.dismiss();
    if(result.status==true)
    {
     // debugger;
      //debugger;
      this.allLeadsList=result.results;
      this.searchedLeadsList=result.results;
      
      if(this.category!="")
      {
        this.setLeadFilteredItems();
      }
      //debugger;
    }
    else
    {
      this.allLeadsList=[];
      this.searchedLeadsList=[];
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
    if(this.isLeadDetailAccess==true)
    {
      this.navCtrl.push(LeadDetailPage,{leadId:leadId});
    }
    
      }
  editLeadRouting(websiteId:string)
  {
    //debugger;
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
            this.userServiceObj.deleteLead(lead.lead_id,this.userId)
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
    //debugger;
    if(this.userWebsites.length==1)
    {
      this.navCtrl.push(EditLeadRoutingPage,{websiteId:this.userWebsites[0].id});
    }
    else
    {
      this.navCtrl.push(AllWebsitesPage,{notificationMsg:"which website would they like to edit the lead source".toUpperCase()});
    }
  }
}
