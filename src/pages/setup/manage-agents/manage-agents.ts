import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { CreateAgentPage } from '../create-agent/create-agent';
import { AgentDetailPage } from '../agent-detail/agent-detail';
import { EditAgentPage } from '../edit-agent/edit-agent';

import { AlertController } from 'ionic-angular';
import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';

/**
 * Generated class for the ManageAgentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manage-agents',
  templateUrl: 'manage-agents.html',
})
export class ManageAgentsPage {
  public allAgents:any[]=[];
  public notificationMsg:string="";
  public userId:string="";
  public agentsFoundMessage="";
  public loader:any;
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, 
    public platform: Platform,public loadingCtrl: LoadingController) {
      if(this.navParams.get('notificationMsg')!=undefined)
      {
        this.notificationMsg=this.navParams.get('notificationMsg');
      }
      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 5000
      });
  }
  //openPage(pageNumber:string) {
    //this.sharedServiceObj.setNavigationalPage(pageNumber);
 // }
 createAgent()
 {
   this.navCtrl.push(CreateAgentPage);
 }
 ionViewDidLoad() {
  let member_id = this.storage.get('userId');
  member_id.then((data) => {
    this.userId=data;
    this.loadAllAgents(null);
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
    this.userServiceObj.viewMemberAgents(this.userId.toString())
  .subscribe((result) => this.loadAllAgentsResp(result));
  }
  
}
loadAllAgentsResp(result:any)
{
  //debugger;
  this.loader.dismiss();
  if(result.status==true)
  {
    //debugger;
    this.allAgents=result.results;
    
  }
  else
  {
   // debugger;
    this.allAgents=[];
    this.agentsFoundMessage="No agents found.";
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
         // console.log('Disagree clicked');
        }
      },
      {
        text: 'Ok',
        handler: () => {
          let selectedIndex = this.allAgents.indexOf(agent);
          if (selectedIndex >= 0) {
          this.allAgents.splice(selectedIndex, 1);
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
  //debugger;
  if(result.status==true)
  {
   // debugger;
 // this.viewAllHotSheets();
  }
  
  }
agentDetail(agent_id:string)
{
  //debugger;
   if(agent_id!="")
   {
     this.navCtrl.push(AgentDetailPage,{agent_id:agent_id});
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
