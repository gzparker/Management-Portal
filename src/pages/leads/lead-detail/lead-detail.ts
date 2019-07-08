import { Component, ViewChild, NgZone, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
  MenuController,LoadingController, ViewController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { EditLeadPage } from '../edit-lead/edit-lead';
import { LeadHotsheetSubscribedPage } from '../lead-hotsheet-subscribed/lead-hotsheet-subscribed';
import { LeadSavedListingPage } from '../lead-saved-listing/lead-saved-listing';
import { LeadSavedSearchesPage } from '../lead-saved-searches/lead-saved-searches';
import { HotsheetDetailPopupPage } from '../../modal-popup/hotsheet-detail-popup/hotsheet-detail-popup';
import { ListingDetailPopupPage } from '../../modal-popup/listing-detail-popup/listing-detail-popup';
import { EmailContactModalPage } from '../../modal-popup/email-contact-modal/email-contact-modal';
import { NewMessagePopupPage } from '../../chatmodule/new-message-popup/new-message-popup';

import { AlertController,ToastController } from 'ionic-angular';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';
/**
 * Generated class for the LeadDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google: any;
declare var firebase:any;
@Component({
  selector: 'page-lead-detail',
  templateUrl: 'lead-detail.html',
})
export class LeadDetailPage {
  public leadId:string="";
  public userId:string="";
 public leadDetail:any;
 public firebaseLeadDetail:any;
 public savedListings:any[]=[];
 public saved_searches:any[]=[];
 public subscribed_hotsheets:any[]=[];
 public savedListingPage:any;
 public savedSearchesPage:any;
 public subscribedHotsheetPage:any;
 public map_work_height:number;
 public map_home_height:number;
 public selectedSegment:any="1";
 public googleMapUrl:string="http://maps.google.com/maps?q=";
 public leadsDetailSegment:string="1";
 public internal_notes:string="";
 public emailMessage:string="";
 public noImgUrl=this.sharedServiceObj.noImageUrl;
 public isOpen: boolean = false;
 public parentId:string="";
 public isOwner:boolean=false;
 public isEditLeadAccess:boolean=false;
 
 public home_address_parts:string[]=[];
 public work_address_parts:string[]=[];
 public first_name:string="";
 public last_name:string="";
 public groupRef:any;
 public groupMemberRef:any;
 public chatRef:any;
 public userRef:any;
 public notificationMsg:string="";
public loader:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,public viewCtrl: ViewController) {
      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 5000
      });
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
          //console.log('Dismissed toast');
        });
        toast.present();
      }
      this.savedListingPage=LeadSavedListingPage;
      this.savedSearchesPage=LeadSavedSearchesPage;
      this.subscribedHotsheetPage=LeadHotsheetSubscribedPage;
  }

  ionViewDidLoad() {
    //this.sharedServiceObj.updateColorThemeMethod(null);
    let member_id = this.storage.get('userId');
    //debugger;
    member_id.then((data) => {
      //debugger;
      this.userId=data;
    if(this.navParams.get('leadId')!=undefined)
      {
        this.leadId=this.navParams.get('leadId');
        this.loadLeadDetail();
        this.setAccessLevels();
        
      }
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
  ionViewDidEnter()
  {
    //this.sharedServiceObj.updateColorThemeMethod(null);
    this.updateColorTheme();
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
  updateColorTheme()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
    //debugger;
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
      this.isEditLeadAccess=false;
    let allowed_access_options = this.storage.get('allowed_access_options');
    allowed_access_options.then((data) => {
      if(data!=null)
      {
        if(data!=false)
        {
        let savedAccessLevels:any[]=data;
    //debugger;
     
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
    }
      }
    });
    
  }
  else
  {
    
    this.isEditLeadAccess=true;
    
  }
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
      this.loader.present();
      this.loadFirebaseLeadDetail();
  this.userServiceObj.leadDetail(this.leadId,this.userId.toString())
    .subscribe((result) => this.editLeadResp(result));
    }
  }
  loadFirebaseLeadDetail()
  {
    var that=this;
    if(this.userId!="")
    {
    this.userRef=firebase.database().ref('users');
    this.userRef.orderByChild("webUserId").equalTo(this.leadId).on("value", function(snapshot) {
      snapshot.forEach(element => {
        if(element.val().is_lead=="1")
        {
          that.firebaseLeadDetail=element.val();
        }
      });
    });
  }
  }
  makePhoneCall(phoneNumber:string)
  {
    window.open('tel:'+phoneNumber);
  }
  editLeadResp(result:any):void{
    this.loader.dismiss();
    //debugger;
    if(result.status==true)
    {
   if(result.result)
   {
   // debugger;
     this.leadDetail=result.result;
   //  debugger;
     this.internal_notes=this.leadDetail.internal_notes;
    // debugger;
     if(result.result.home_google_place_id!=undefined||result.result.home_google_place_id!=null)
     {
       if(result.result.home_google_place_id!="")
       {
        this.map_home_height=400;
       // this.loadHomeMap(result.result.home_google_place_id);
       }
     else{
      this.map_home_height=0;
     }
     }
     else
     {
      this.map_home_height=0;
     }
     if(result.result.work_google_place_id!=undefined||result.result.work_google_place_id!=null)
     {
       if(result.result.work_google_place_id!="")
       {
        this.map_work_height=400;
        //this.loadWorkMap(result.result.work_google_place_id);
       }
     else{
      this.map_work_height=0;
     }
     }
     else
     {
      this.map_work_height=0;
     }
     //this.map_work_height=400;
     
     //this.loadWorkMap(result.result.work_googla
     if(result.saved_searches!=false)
     {
      this.saved_searches=result.saved_searches;
     }
     if(result.saved_listings!=false)
     {
      this.savedListings=result.saved_listings;
     }
     if(result.subscribed_hotsheets!=false)
     {
      this.subscribed_hotsheets=result.subscribed_hotsheets;
     }
     if(this.leadDetail.home_address)
     {
this.home_address_parts=this.leadDetail.home_address.split(",");
     }
    //debugger;
     if(this.leadDetail.work_address)
     {
this.work_address_parts=this.leadDetail.work_address.split(",");
     }
    //debugger;
    this.updateColorTheme();
  //this.editLeadModal.open();
   }
  
    }
   
  }
  updateLeadNotes()
  {
   //debugger;
   //this.loader.present();
    this.userServiceObj.updateLeadNotes(this.leadId,this.internal_notes).
    subscribe((result) => this.updateLeadNotesResp(result));
  }
  updateLeadNotesResp(result:any):void{
   // debugger;
  // this.loader.dismiss();
    if(result.status==true)
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
  callContact(lead:any)
  {
    window.open('tel:'+lead.phone_mobile);
  }
  emailContact(lead:any)
  {
  
    var modalPage = this.modalCtrl.create(EmailContactModalPage,{lead:lead});
    modalPage.present();
  }
  
  chatContact(lead:any)
  {
    var modalPage = this.modalCtrl.create(NewMessagePopupPage, { isContact: "1",redirectUserId:this.firebaseLeadDetail.fbId });
    modalPage.present();
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
    let message="Hi "+lead.first_name+" "+lead.last_name+", "+this.first_name+" "+this.last_name+" is requesting you download the Top Dweller App to search for homes with him. Please go here "+this.sharedServiceObj.idxChatAppLink.toString();
    //debugger;
    this.userServiceObj.sendAppInvitation(lead.phone_mobile.toString(),message)
    .subscribe((result) => this.sendAppInvitationResp(result));
  }
  sendAppInvitationResp(result:any)
  {
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
  openInAppBrowser(websiteUrl:string)
  {
    //debugger;
    if(websiteUrl.indexOf("http")>0)
    {
      window.open(websiteUrl, '_black');
    }
    else
    {
      window.open("http://"+websiteUrl, '_black');
    }
  }
  showHotsheetDetail(hotsheetObj:any)
  {
    var modalPage = this.modalCtrl.create(HotsheetDetailPopupPage,{hotsheetSelectedObj:hotsheetObj});
    modalPage.present();
  }
  showListingDetail(listingObj:any)
  {
    //debugger;
    var modalPage = this.modalCtrl.create(ListingDetailPopupPage,{listingSelectedObj:listingObj});
    modalPage.present();
  }
  openGoogleMapBrowser(address:string)
  {
    window.open(this.googleMapUrl+address, '_black');
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
