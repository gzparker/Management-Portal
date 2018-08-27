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

import { AlertController,ToastController } from 'ionic-angular';

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
declare var firebase:any;
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
  public first_name:string="";
  public last_name:string="";
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
  public groupRef:any;
  public groupMemberRef:any;
  public chatRef:any;
  public userRef:any;

  public loader:any;
  public isApp=false;
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
      //debugger;
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
        let toast = this.toastCtrl.create({
          message: this.notificationMsg,
          duration: 3000,
          position: 'top',
          cssClass:'successToast'
        });
        
        toast.onDidDismiss(() => {
          //console.log('Dismissed toast');
        });
        toast.present();
      }
      if(this.navParams.get('leadInfo')!=undefined)
      {
let leadInfo=this.navParams.get('leadInfo');
if(this.navParams.get('currentUser')!=undefined)
      {
        let currentUser=this.navParams.get('currentUser');
        this.userServiceObj.saveFireBaseUserInfo(leadInfo.email,leadInfo.password,leadInfo.webUserId,leadInfo.first_name,leadInfo.last_name,
          leadInfo.image_url,leadInfo.parent_id,leadInfo.is_submember,leadInfo.is_lead,leadInfo.website_id,currentUser);
      }
      
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
      this.viewAllWebsite();
      this.viewAllLeads(null);
      this.setAccessLevels();
    });
    let first_name_dummy=this.storage.get('first_name');
    first_name_dummy.then((data) => {
      this.first_name=data;
    });
    let last_name_dummy=this.storage.get('last_name');
    last_name_dummy.then((data) => {
      this.last_name=data;
    });
  }
  ionViewDidLeave()
  {
    if(this.groupRef!=undefined)
    {
      this.groupRef.off("value");
    }
if(this.userRef!=undefined)
{
  this.userRef.off("value");
}
if(this.chatRef!=undefined)
{
this.chatRef.off("value");
}
  }
  invitationPopUp(lead:any)
  {
    let message="Hi "+lead.first_name+" "+lead.last_name+", "+this.first_name+" "+this.last_name+" is requesting you download the Top Dweller App to search for homes with him. Please go here "+this.sharedServiceObj.idxChatAppLink.toString();
    let alert = this.alertCtrl.create({
      title: 'Send Invitation',
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: () => {
            this.sendAppInvitation(lead);
            //console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();

  }
  sendAppInvitation(lead:any)
  {
   //debugger;
    let message="Hi "+lead.first_name+" "+lead.last_name+", "+this.first_name+" "+this.last_name+" is requesting you download the Top Dweller App to search for homes with him. Please go here "+this.sharedServiceObj.idxChatAppLink.toString();
    this.userServiceObj.sendAppInvitation(lead.phone_mobile.toString(),message)
    .subscribe((result) => this.sendAppInvitationResp(result));
  }
  sendAppInvitationResp(result:any)
  {
   // debugger;
if(result.status)
{
  let toast = this.toastCtrl.create({
    message: result.message,
    duration: 3000,
    position: 'top',
    cssClass:'successToast'
  });
  
  toast.onDidDismiss(() => {
    //console.log('Dismissed toast');
  });
  toast.present();

}
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
     // debugger;
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
      let toast = this.toastCtrl.create({
        message: this.leadsFoundMessage,
        duration: 3000,
        position: 'top',
        cssClass:'errorToast'
      });
      
      toast.onDidDismiss(() => {
        //console.log('Dismissed toast');
      });
      toast.present();
      /*let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: this.leadsFoundMessage,
        buttons: ['Ok']
      });
      alert.present();*/
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
              let toast = this.toastCtrl.create({
                message: this.leadsFoundMessage,
                duration: 3000,
                position: 'top',
                cssClass:'errorToast'
              });
              
              toast.onDidDismiss(() => {
                //console.log('Dismissed toast');
              });
              toast.present();
              /*let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: this.leadsFoundMessage,
                buttons: ['Ok']
              });
              alert.present();*/
            }
            this.userRef=firebase.database().ref('users');
    this.userRef.orderByChild("webUserId").equalTo(lead.lead_id).on("value", function(snapshot) {
      snapshot.forEach(element => {
        if(element.val().is_lead=="1")
        {
      var fredRef=firebase.database().ref('users/'+element.key);
 //debugger;
fredRef.remove();
        }
//debugger;
      });
    });
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
