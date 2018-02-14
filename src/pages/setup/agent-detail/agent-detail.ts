import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, 
  MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import {ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';
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
  public agentDetail:any;
  public agentFoundMessage:string="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController,
    private crop: Crop,private camera: Camera,private imagePicker: ImagePicker) {
  }

  ionViewDidLoad() {
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
      if(this.navParams.get('agent_id')!=undefined)
      {
       this.agent_id = this.navParams.get('agent_id');
       this.loadAgentDetails();
       }
    });
  }
loadAgentDetails()
{
  if(this.userId.toString())
  {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 700
    });
    loader.present();
  
    this.userServiceObj.agentDetail(this.agent_id.toString())
  .subscribe((result) => this.loadAgentDetailsResp(result));
  }
  
}
loadAgentDetailsResp(result:any)
{
  //debugger;
  if(result.status==true)
  {
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
