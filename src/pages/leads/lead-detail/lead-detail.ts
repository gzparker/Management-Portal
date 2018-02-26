import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
  MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../../dashboard/dashboard';
import { FbConfirmPage } from '../../fb-confirm/fb-confirm';

import { EditLeadPage } from '../edit-lead/edit-lead';
import { LeadHotsheetSubscribedPage } from '../lead-hotsheet-subscribed/lead-hotsheet-subscribed';
import { LeadSavedListingPage } from '../lead-saved-listing/lead-saved-listing';
import { LeadSavedSearchesPage } from '../lead-saved-searches/lead-saved-searches';

import { AlertController } from 'ionic-angular';

import { UserVerificationPage } from '../../user-verification/user-verification';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';
/**
 * Generated class for the LeadDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lead-detail',
  templateUrl: 'lead-detail.html',
})
export class LeadDetailPage {
  public leadId:string="";
  public userId:string="";
 public leadDetail:any;
 public savedListings:any;
 public saved_searches:any;
 public subscribed_hotsheets:any;
 public savedListingPage:any;
 public savedSearchesPage:any;
 public subscribedHotsheetPage:any;
 public selectedSegment:any="";

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
      this.savedListingPage=LeadSavedListingPage;
      this.savedSearchesPage=LeadSavedSearchesPage;
      this.subscribedHotsheetPage=LeadHotsheetSubscribedPage;
  }

  ionViewDidLoad() {
    let member_id = this.storage.get('userId');
    //debugger;
    member_id.then((data) => {
      //debugger;
      this.userId=data;
    if(this.navParams.get('leadId')!=undefined)
      {
        this.leadId=this.navParams.get('leadId');
        this.loadLeadDetail();
      }
    });
  }
  editLead(){
    if(this.leadId!="")
    {
      this.navCtrl.push(EditLeadPage,{leadId:this.leadId});
    }
      }
  loadLeadDetail(){
    if(this.userId!="")
    {
      //debugger;
      this.loader.present();
  this.userServiceObj.leadDetail(this.leadId,this.userId.toString())
    .subscribe((result) => this.editLeadResp(result));
    }
  }
  editLeadResp(result:any):void{
    this.loader.dismiss();
    if(result.status==true)
    {
   if(result.result)
   {
     debugger;
     this.leadDetail=result.result;
     this.saved_searches=result.saved_searches;
     this.savedListings=result.saved_listings;
     this.subscribed_hotsheets=result.subscribed_hotsheets;
     debugger;
  //this.editLeadModal.open();
   }
  
    }
   
  }
  segmentChanged(event:any)
  {
    if(event.value=="1")
    {
this.selectedSegment="1";
    }
    else if(event.value=="2")
    {
      this.selectedSegment="2";
    }
    else if(event.value=="3")
    {
      this.selectedSegment="3";
    }
  }
}
