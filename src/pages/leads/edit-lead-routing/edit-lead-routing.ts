import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
  MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { AllWebsitesPage } from '../../websites/all-websites/all-websites';

import { AlertController } from 'ionic-angular';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';

/**
 * Generated class for the EditLeadRoutingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-edit-lead-routing',
  templateUrl: 'edit-lead-routing.html',
})
export class EditLeadRoutingPage {
public websiteId:string="";
public leadRoutingDetail:any;
public userId:string="";
public leadRoutingFoundMessage="";
public send_to_email:boolean=false;
public send_to_email_addresses:string="";
public send_to_zillow_crm:boolean=false;
public send_to_intagent_crm:boolean=false;
public send_to_zapier:boolean=false;
public agent_microsites:boolean=false;
public send_to_roundrobin:boolean=false;
public leadRoutingUpdateMsg:string="";
public isItCrmLead:boolean=false;
public loader:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController) {
      if(this.navParams.get('websiteId')!=undefined)
      {
        this.websiteId=this.navParams.get('websiteId');
      }
      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 5000
      });
  }

  ionViewDidLoad() {
    this.sharedServiceObj.updateColorThemeMethod(null);
    this.loadLeadRouting();
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  loadLeadRouting()
  {
    if(this.websiteId!="")
    {
      this.loader.present();
      this.userServiceObj.viewLeadRouting(this.websiteId.toString())
      .subscribe((result) => this.leadRoutingResp(result));
    }
    
  }
  leadRoutingResp(result:any):void{
    if(result.status==true)
    {
      this.loader.dismiss();
      this.leadRoutingDetail=result.result;
      if(this.leadRoutingDetail!=undefined)
      {
        if(this.leadRoutingDetail.send_to_email==null||this.leadRoutingDetail.send_to_email=="0")
        {
          this.send_to_email=false;
        }
        else
        {
          this.isItCrmLead=true;
          this.send_to_email=true;
        }
        if(this.leadRoutingDetail.send_to_email_addresses!=undefined)
        {
          this.send_to_email_addresses=this.leadRoutingDetail.send_to_email_addresses;
        }
       
        if(this.leadRoutingDetail.send_to_zillow_crm==null||this.leadRoutingDetail.send_to_zillow_crm=="0")
        {
          this.send_to_zillow_crm=false;
        }
        else
        {
          this.send_to_zillow_crm=true;
        }
        if(this.leadRoutingDetail.send_to_intagent_crm==null||this.leadRoutingDetail.send_to_intagent_crm=="0")
        {
          this.send_to_intagent_crm=false;
        }
        else
        {
          this.send_to_intagent_crm=true;
        }
        if(this.leadRoutingDetail.send_to_zapier==null||this.leadRoutingDetail.send_to_zapier=="0")
        {
          this.send_to_zapier=false;
        }
        else
        {
          this.send_to_zapier=true;
        }
        if(this.leadRoutingDetail.agent_microsites==null||this.leadRoutingDetail.agent_microsites=="0")
        {
          this.agent_microsites=false;
        }
        else
        {
          this.agent_microsites=true;
        }
        if(this.leadRoutingDetail.send_to_roundrobin==null||this.leadRoutingDetail.send_to_roundrobin=="0")
        {
          this.send_to_roundrobin=false;
        }
        else
        {
          this.send_to_roundrobin=true;
        }
      }  
    }
    else
    {
      this.loader.dismiss();
      this.leadRoutingDetail=null;
      this.leadRoutingFoundMessage="No Info found.";
    }
    
  }
  updateLeadRouting()
  {
  let send_to_email_dummy="0";
  let send_to_zillow_crm_dummy="0";
  let send_to_intagent_crm_dummy="0";
  let send_to_zapier_dummy="0";
  let send_to_roundrobin_dummy="0";
  let agent_microsites_dummy="0";
  if(this.send_to_zillow_crm)
  {
    send_to_zillow_crm_dummy="1";
  }
  if(this.send_to_intagent_crm)
  {
    send_to_intagent_crm_dummy="1";
  }
  if(this.send_to_zapier)
  {
    send_to_zapier_dummy="1";
  }
  if(this.send_to_roundrobin)
  {
    send_to_roundrobin_dummy="1";
  }
  if(this.agent_microsites)
  {
    agent_microsites_dummy="1";
  }
  this.userServiceObj.updateLeadRouting(this.websiteId,this.send_to_email_addresses,send_to_zillow_crm_dummy,
  send_to_intagent_crm_dummy,send_to_zapier_dummy,agent_microsites_dummy,send_to_roundrobin_dummy)
    .subscribe((result) => this.updateLeadRoutingResp(result));
  
  }
  updateLeadRoutingResp(result:any)
  {
    if(result.status==true)
    {
      this.leadRoutingUpdateMsg="Lead Routing has been updated successfully.";

      this.ngZone.run(() => {
        this.navCtrl.push(AllWebsitesPage,{notificationMsg:this.leadRoutingUpdateMsg.toUpperCase()});
      });
    }
   
  }
}
