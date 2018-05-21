import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, 
  MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { ManageAgentsPage } from '../manage-agents/manage-agents';
import { EditAgentPage } from '../edit-agent/edit-agent';

import { AlertController } from 'ionic-angular';
import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';

/**
 * Generated class for the AgentDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-agent-detail',
  templateUrl: 'agent-detail.html',
})
export class AgentDetailPage {
  public userId:string="";
  public agent_id:string="";
  public parentId:string="";
  public isOwner:boolean=false;
  public isEditAgentAccess:boolean=false;
  public agentDetail:any;
  public agentFoundMessage:string="";
  public no_image_found:string="https://s3.us-west-2.amazonaws.com/central-system/img/default/profile_icon.png";
  public loader:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController,
    private crop: Crop,private camera: Camera,private imagePicker: ImagePicker) {
      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 5000
      });
  }

  ionViewDidLoad() {
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
      if(this.navParams.get('agent_id')!=undefined)
      {
       this.agent_id = this.navParams.get('agent_id');
       this.loadAgentDetails();
       this.setAccessLevels();
       }
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
    let allowed_access_options = this.storage.get('allowed_access_options');
    allowed_access_options.then((data) => {
      if(data!=null)
      {
        //debugger;
        let savedAccessLevels:any[]=data;
    //debugger;
     
      let editAgentAccesLevels=savedAccessLevels.filter((element) => {
        return (element.name=="Edit Agent");
    });
    if(editAgentAccesLevels.length>0)
      {
        this.isEditAgentAccess=true;
      }
      else
      {
        this.isEditAgentAccess=false;
      }
      
      }
    });
    
  }
  else
  {
    
    this.isEditAgentAccess=true;
    
  }
  }
loadAgentDetails()
{
  if(this.userId.toString())
  {
   // debugger;
    this.userServiceObj.agentDetail(this.agent_id.toString())
    .subscribe((result) => this.loadAgentDetailsResp(result));
  }
  
}
loadAgentDetailsResp(result:any)
{
  this.loader.dismiss();
  if(result.status==true)
  {
    //debugger;
    if(result.result)
    {
      this.agentDetail=result.result;
    }
  }
  else
  {

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
