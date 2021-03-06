import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController,LoadingController,Platform,
  MenuController,ActionSheetController,Tabs,ToastController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { CreateAgentPage } from '../create-agent/create-agent';
import { AgentDetailPage } from '../agent-detail/agent-detail';
import { EditAgentPage } from '../edit-agent/edit-agent';
import { UpgradeCenterPage } from '../../account/upgrade-center/upgrade-center';

import { AlertController } from 'ionic-angular';
import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';

/**
 * Generated class for the ManageAgentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-manage-agents',
  templateUrl: 'manage-agents.html',
})
export class ManageAgentsPage {
  public allAgents:any[]=[];
  public agentServices:any[]=[];
  public notificationMsg:string="";
  public userId:string="";
  public parentId:string="";
  public service_id:string="";
  public isOwner:boolean=false;
  public isEditAgentAccess:boolean=false;
  public isDeleteAgentAccess:boolean=false;
  public isCreateAgentAccess:boolean=false;
  public isAgentDetailAccess:boolean=false;
  public agentsFoundMessage:string="";
  public max_agents_added:boolean=false;
  public showCreateButton:boolean=false;
  public no_image_found:string="https://s3.us-west-2.amazonaws.com/central-system/img/default/profile_icon.png";
  public subscribedPackages:any;
  public totalIdxPluginAllowed:number=0;
  public totalAgentsAllowed:number=0;
  public totalMobileAppAllowed:number=0;
  public totalWebsiteAllowed:number=0;
  public loader:any;
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, 
    public platform: Platform,public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,private toastCtrl: ToastController) {
      if(this.navParams.get('notificationMsg')!=undefined)
      {
        this.notificationMsg=this.navParams.get('notificationMsg');
        let toast = this.toastCtrl.create({
          message: this.notificationMsg,
          duration: 3000,
          position: 'top',
          cssClass:'successToast'
        });
        
        toast.onDidDismiss(() => {
        });
        toast.present();
      }
      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 5000
      });
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
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
      this.showCreateButton=true;  
    }
    else
    {
      this.showCreateButton=false;
    }
  }
 createAgent()
 {
  if(this.totalAgentsAllowed>this.allAgents.length)
  {
   this.navCtrl.push(CreateAgentPage);
  }else{
    let toast = this.toastCtrl.create({
      message: "You are not allowed to add more agents. Please upgrade your package from upgrade center",
      duration: 3000,
      position: 'top',
      cssClass:'errorToast'
    });
    
    toast.onDidDismiss(() => {
      //console.log('Dismissed toast');
    });
    toast.present();
  }
 }
 ionViewDidLoad() {
  this.sharedServiceObj.updateColorThemeMethod(null);
  let member_id = this.storage.get('userId');
  member_id.then((data) => {
    this.userId=data;
    this.setSubscriptionPackageRestrictions();
    this.viewAllWebsite();
    this.loadAllAgents(null);
    this.setAccessLevels();
  });
}
setAccessLevels()
  {

    let parent_id = this.storage.get('parent_id');
      parent_id.then((data) => {
        if(data!=null)
        { 
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
      this.isEditAgentAccess=false;
    let allowed_access_options = this.storage.get('allowed_access_options');
    allowed_access_options.then((data) => {
      if(data!=null)
      {
        if(data!=false)
        {
        let savedAccessLevels:any[]=data;
      let editAgentAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="edit-agent");
    });
    if(editAgentAccesLevels.length>0)
      {
        this.isEditAgentAccess=true;
      }
      else
      {
        this.isEditAgentAccess=false;
      }
      let deleteAgentAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="delete-agent");
    });
    if(deleteAgentAccesLevels.length>0)
      {
        this.isDeleteAgentAccess=true;
      }
      else
      {
        this.isDeleteAgentAccess=false;
      }
      let agentDetailAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="agent-detail");
    });
    if(agentDetailAccesLevels.length>0)
      {
        this.isAgentDetailAccess=true;
      }
      else
      {
        this.isAgentDetailAccess=false;
      }
      let createAgentAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="create-agent");
    });
    if(createAgentAccesLevels.length>0)
      {
        this.isCreateAgentAccess=true;
      }
      else
      {
        this.isCreateAgentAccess=false;
      }
    }
      }
    });
    
  }
  else
  {
    
    this.isAgentDetailAccess=true;
    this.isCreateAgentAccess=true;
    this.isDeleteAgentAccess=true;
    this.isEditAgentAccess=true;
  }
  }
  setSubscriptionPackageRestrictions(){
    let that=this;
    let subscribedPlans=that.storage.get('subscribedPlans');
    subscribedPlans.then((subscribedPlanData) => {
      that.subscribedPackages=subscribedPlanData;
      that.subscribedPackages.forEach(element => {
      if(element.meta_data!=undefined){
        that.totalAgentsAllowed=that.totalAgentsAllowed+Number(element.meta_data.member);
        if(element.meta_data.type=="essential"){
          that.totalWebsiteAllowed=that.totalWebsiteAllowed+1;
          that.totalMobileAppAllowed=that.totalMobileAppAllowed+1;
if(that.service_id=="2"){
  that.totalIdxPluginAllowed=that.totalIdxPluginAllowed+1;
}
        }
        else{
          that.totalWebsiteAllowed=that.totalWebsiteAllowed+Number(element.meta_data.website);
          that.totalMobileAppAllowed=that.totalMobileAppAllowed+Number(element.meta_data.mobileApp);
if(that.service_id=="2"){
  that.totalIdxPluginAllowed=that.totalIdxPluginAllowed+Number(element.meta_data.idxplugin);
}
        }
      }
    });
      
    });
  }
loadAllAgents(refresher:any)
{
  if(this.userId.toString())
  {
    if(refresher!=null)
  {
    refresher.complete();
  }
  else
  {
    this.loader.present();
  }
  let generalWebsiteSettings = this.storage.get('generalWebsiteSettings');
        generalWebsiteSettings.then((data) => {
    this.userServiceObj.viewMemberAgents(this.userId.toString(),data.service_id)
  .subscribe((result) => this.loadAllAgentsResp(result));
        });
  }
  
}
loadAllAgentsResp(result:any)
{
  this.loader.dismiss();
  if(result.status==true)
  {
    this.allAgents=result.results;
    this.agentServices=result.services;
    if(result.services === false)
    {
      this.max_agents_added=false;
    }
    else
    {
      if(this.allAgents.length.toString()>=this.agentServices[0].max_users.toString())
      {
        this.max_agents_added=true;
        let actionSheet = this.actionSheetCtrl.create({
          title: 'Select any option',
          buttons: [
            {
              text: 'Please upgrade your account to add additional Agents/Users',
              handler: () => {
                this.ngZone.run(() => {
                  this.navCtrl.setRoot(UpgradeCenterPage);
                });
              }
            },
            {
              text: 'Cancel',
              handler: () => {
              }
            }
          ]
        });
        actionSheet.present();
      }else
      {
        this.max_agents_added=false;
      }
    }
  }
  else
  {
    this.max_agents_added=false;
    this.allAgents=[];
    this.agentServices=[];
    this.agentsFoundMessage="No agents found.";
    /*let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: this.agentsFoundMessage,
      buttons: ['Ok']
    });
    alert.present();*/
    let toast = this.toastCtrl.create({
      message: this.agentsFoundMessage,
      duration: 3000,
      position: 'top',
      cssClass:'errorToast'
    });
    
    toast.onDidDismiss(() => {
    });
    toast.present();
  }
}
deleteAgent(agent:any)
{

  let confirm = this.alertCtrl.create({
    title: 'Delete Agents?',
    message: 'Are you sure to delete this agent?',
    buttons: [
      {
        text: 'Cancel',
        handler: () => {
        }
      },
      {
        text: 'Ok',
        handler: () => {
          let selectedIndex = this.allAgents.indexOf(agent);
          if (selectedIndex >= 0) {
          this.allAgents.splice(selectedIndex, 1);
          }
          if(this.allAgents.length.toString()>=this.agentServices[0].max_users.toString())
    {
this.max_agents_added=true;
    }
    else
    {
      this.max_agents_added=false;
    }
          if(this.allAgents.length<=0)
          {
            this.agentsFoundMessage="All agents have been deleted.Please add new agent.";
            this.notificationMsg="";
          }
          this.userServiceObj.deleteAgent(agent.id.toString())
          .subscribe((result) => this.deleteAgentResp(result));
        }
      }
    ]
  });
  confirm.present();
}
deleteAgentResp(result:any):void{
  if(result.status==true)
  {
  }
  
  }
agentDetail(agent_id:string)
{
 if(this.isAgentDetailAccess==true)
 {
  if(agent_id!="")
  {
    this.navCtrl.push(AgentDetailPage,{agent_id:agent_id});
  }
 }
   
}
editAgent(agent_id:string)
{
  if(agent_id!="")
  {
    this.navCtrl.push(EditAgentPage,{agent_id:agent_id});
  }
}
}
