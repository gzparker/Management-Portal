import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
  MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../../dashboard/dashboard';
import { FbConfirmPage } from '../../fb-confirm/fb-confirm';

import { AllLeadsPage } from '../../leads/all-leads/all-leads';
import { LeadDetailPage } from '../../leads/lead-detail/lead-detail';
import { EditLeadPage } from '../../leads/edit-lead/edit-lead';

import { AlertController } from 'ionic-angular';

import { UserVerificationPage } from '../../user-verification/user-verification';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';

/**
 * Generated class for the CreateLeadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-lead',
  templateUrl: 'create-lead.html',
})
export class CreateLeadPage {
  public userLoggedId:boolean=false;
  public userType:string="1";
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
  public leadCreateMsg:string="";
  public domainAccess:any;
  public allWebsiteList:any[]=[];
  public allAgents:any[]=[];
  public selectedWebsite:string="";
  public userId:string="";
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
    member_id.then((data) => {
      this.userId=data;
      this.getAllWebsite();
      this.loadAllAgents();
    });
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
      this.loader.present();
  this.userServiceObj.allUserWebsites(this.userId.toString())
    .subscribe((result) => this.getAllWebsiteResp(result));
    }
    
  }
  getAllWebsiteResp(result:any):void{
    this.loader.dismiss();
    if(result.status==true)
    {
     // debugger;
      this.allWebsiteList=result.result;
      
    }
    
  }
  onWebsiteSelection($event:any):void{
     this.selectedWebsite=$event;
  }
  createLead():void{
    //this.domainAccess=this.localStorageService.get('domainAccess');
    if(this.userId!="")
    {
      //this.loader.present();
  this.userServiceObj.createLead(this.userId.toString(),this.selectedWebsite,this.email,
  this.password,this.firstName,this.lastName,
  this.officeNumber,this.mobileNumber,this.homeNumber,this.home_address_street,this.home_address_city,
  this.home_address_state_or_province,this.home_address_zipcode,
  this.work_address_street,this.work_address_city,this.work_address_state_or_province,this.work_zipcode,
this.assigned_agent_id,this.category,this.internal_notes)
    .subscribe((result) => this.createLeadResp(result));
 
    }
  }
  createLeadResp(result:any):void{
    //this.loader.dismiss();
  this.leadCreateMsg="Lead has been created successfully.";

  this.ngZone.run(() => {
    this.navCtrl.push(AllLeadsPage,{notificationMsg:this.leadCreateMsg.toUpperCase()});
  });
  }
  clearLeadForm():void{
    this.firstName="";
    this.lastName="";
    this.email="";
    this.website="";
    this.mobileNumber=null;
    this.officeNumber=null;
    this.homeNumber=null;
    this.navCtrl.push(AllLeadsPage);
  }
}
