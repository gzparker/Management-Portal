import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
  MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../../dashboard/dashboard';
import { FbConfirmPage } from '../../fb-confirm/fb-confirm';

import { CreateLeadPage } from '../../leads/create-lead/create-lead';
import { AllLeadsPage } from '../../leads/all-leads/all-leads';

import { ManageAgentsPage } from '../../setup/manage-agents/manage-agents';

import { AlertController } from 'ionic-angular';

import { UserVerificationPage } from '../../user-verification/user-verification';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';

/**
 * Generated class for the EditLeadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-lead',
  templateUrl: 'edit-lead.html',
})
export class EditLeadPage {
  public leadId:string="";
  public userId:string="";
 
  public websiteId:string="";
public firstName:string="";
public lastName:string="";
public email:string="";
public website:string="";
public password:string="";
public mobileNumber:number;
public officeNumber:number;
public homeNumber:number;
public home_address_street:string='';
public home_address_city:string="";
public home_address_state_or_province:string="";
public home_address_zipcode:string="";
public work_address_street:string="";
public work_address_city:string="";
public work_address_state_or_province:string="";
public work_zipcode:string="";
public assigned_agent_id:string="";
public category:string="";
public internal_notes:string="";
public leadUpdateMsg:string="";
public allWebsiteList:any[]=[];
public allAgents:any[]=[];
public selectedWebsite:string="";
public loader:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController) {
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
      if(this.navParams.get('leadId')!=undefined)
      {
        //debugger;
       this.leadId = this.navParams.get('leadId');
       this.getAllWebsite();
       this.loadAllAgents();
       this.editLead(this.leadId);
       }
      
    });
  }
  editLead(leadId:string):void{
    if(this.userId!="")
    {
      this.loader.present();
  this.userServiceObj.leadDetail(leadId,this.userId.toString())
    .subscribe((result) => this.editLeadResp(result));
    }
  }
  onWebsiteSelection($event:any):void{
    this.selectedWebsite=$event;
    //debugger;
 }
 loadAllAgents()
    {
      if(this.userId.toString())
      {
        this.userServiceObj.viewMemberAgents(this.userId.toString())
      .subscribe((result) => this.loadAllAgentsResp(result));
      }
      
    }
    loadAllAgentsResp(result:any)
    {
     
      if(result.status==true)
      {
       
        this.allAgents=result.results;
        
      }
      else
      {
      
        this.allAgents=[];
      }
    }
 getAllWebsite():void{
   if(this.userId!="")
   {
     
 this.userServiceObj.allUserWebsites(this.userId.toString())
   .subscribe((result) => this.getAllWebsiteResp(result));
   }
   
 }
 getAllWebsiteResp(result:any):void{
   //debugger;
   if(result.status==true)
   {
    // debugger;
     this.allWebsiteList=result.result;
     
   }
   
 }
  editLeadResp(result:any):void{
    this.loader.dismiss();
    if(result.status==true)
    {
   if(result.result)
   {
  
     //this.clearLeadForm();
     this.firstName=result.result.first_name;
     this.lastName=result.result.last_name;
     this.email=result.result.email;
     this.mobileNumber=result.result.phone_mobile;
     this.officeNumber=result.result.phone_office;
     this.homeNumber=result.result.phone_home;
     this.leadId=result.result.lead_id;
     this.selectedWebsite=result.result.website_id;
     this.home_address_street=result.result.home_address_street;
     this.home_address_city=result.result.home_address_city;
     this.home_address_state_or_province=result.result.home_address_state_or_province;
     this.home_address_zipcode=result.result.home_address_zipcode;
     this.work_address_street=result.result.work_address_street;
     this.work_address_city=result.result.work_address_city;
     this.work_address_state_or_province=result.result.work_address_state_or_province;
     this.work_zipcode=result.result.work_zipcode;
     this.category=result.result.category;
     //debugger;
     if(result.result.assigned_agent_id!=undefined&&result.result.assigned_agent_id!='')
     {
      this.assigned_agent_id=result.result.assigned_agent_id.split(',');
     }
     
     this.internal_notes=result.result.internal_notes;
     //debugger;
  //this.editLeadModal.open();
   }
  
    }
   
  }
  updateLead():void{
  if(this.userId!="")
    {
     
      //this.loader.present();
      //debugger;
  this.userServiceObj.updateLead(this.userId,this.selectedWebsite,this.leadId,this.email,this.password,
    this.firstName,this.lastName,this.officeNumber,this.mobileNumber,this.homeNumber,
    this.home_address_street,this.home_address_city,
    this.home_address_state_or_province,this.home_address_zipcode,
    this.work_address_street,this.work_address_city,this.work_address_state_or_province,this.work_zipcode,
  this.assigned_agent_id,this.category,this.internal_notes)
    .subscribe((result) => this.updateLeadResp(result));
    }
  }
  updateLeadResp(result:any):void{
    //this.loader.dismiss();
  this.leadUpdateMsg="Lead has been updated successfully.";

  this.ngZone.run(() => {
    this.navCtrl.push(AllLeadsPage,{notificationMsg:this.leadUpdateMsg.toUpperCase()});
  });
  
  }
  editAgents()
  {
    this.ngZone.run(() => {
      this.navCtrl.push(ManageAgentsPage);
    });
  }
  clearLeadForm():void{
    this.firstName="";
    this.lastName="";
    this.email="";
    this.website="";
    this.selectedWebsite="";
    this.mobileNumber=null;
    this.officeNumber=null;
    this.homeNumber=null;
    this.navCtrl.push(AllLeadsPage);
  }
}
