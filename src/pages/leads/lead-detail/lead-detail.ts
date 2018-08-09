import { Component, ViewChild, NgZone, ElementRef } from '@angular/core';
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

import { AlertController,ToastController } from 'ionic-angular';

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
declare var google: any;
@IonicPage()
@Component({
  selector: 'page-lead-detail',
  templateUrl: 'lead-detail.html',
})
export class LeadDetailPage {
  public leadId:string="";
  public userId:string="";
 public leadDetail:any;
 public savedListings:any[]=[];
 public saved_searches:any[]=[];
 public subscribed_hotsheets:any[]=[];
 public savedListingPage:any;
 public savedSearchesPage:any;
 public subscribedHotsheetPage:any;
 public map_work_height:number;
 public map_home_height:number;
 public selectedSegment:any="1";
 public leadsDetailSegment:string="1";
 public internal_notes:string="";
 public noImgUrl=this.sharedServiceObj.noImageUrl;
 public isOpen: boolean = false;
 public parentId:string="";
 public isOwner:boolean=false;
 public isEditLeadAccess:boolean=false;
 public googleMapUrl:string="http://maps.google.com/maps?q=";
 public home_address_parts:string[]=[];
 public work_address_parts:string[]=[];

public loader:any;
@ViewChild('mapHome') mapHomeElement: ElementRef;
mapHome: any;
@ViewChild('mapWork') mapWorkElement: ElementRef;
mapWork: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController,private toastCtrl: ToastController) {
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
  loadHomeMap(placeId:any){
    this.map_home_height=400;
    //debugger;
      // this.geolocation.getCurrentPosition().then((position) => {
    //debugger;
         //let latLng = new google.maps.LatLng(37.4419, -122.1419);
         let mapOptions = {
         // center: latLng,
           zoom: 14,
           mapTypeId: google.maps.MapTypeId.MAP,
           mapTypeControl: true,
           mapTypeControlOptions: {
             style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
             position: google.maps.ControlPosition.TOP_CENTER
           },
           zoomControl: true,
           zoomControlOptions: {
             style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
             position: google.maps.ControlPosition.LEFT_TOP
           },
           scaleControl: true,
           streetViewControl: true,
           streetViewControlOptions: {
             position: google.maps.ControlPosition.LEFT_TOP
           }
         };
    //debugger;
         this.mapHome = new google.maps.Map(this.mapHomeElement.nativeElement, mapOptions);
         var request = {
          placeId: placeId
        };
      //debugger;
        var infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(this.mapHome);
      var that=this;
     // debugger;
        service.getDetails(request, (place, status)=> {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            //debugger;
            var marker = new google.maps.Marker({
              map: that.mapHome,
              position: place.geometry.location
            });
            that.mapHome.fitBounds(place.geometry.viewport);
          }
        });
      
      
     }
  loadWorkMap(placeId:any){
    this.map_work_height=400;
    let mapOptions = {
      // center: latLng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.MAP,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_CENTER
        },
        zoomControl: true,
        zoomControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.LEFT_TOP
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
          position: google.maps.ControlPosition.LEFT_TOP
        }
      };
 //debugger;
      this.mapWork = new google.maps.Map(this.mapWorkElement.nativeElement, mapOptions);
      var request = {
       placeId: placeId
     };
   //debugger;
     var infowindow = new google.maps.InfoWindow();
     var service = new google.maps.places.PlacesService(this.mapWork);
   var that=this;
  // debugger;
     service.getDetails(request, (place, status)=> {
       if (status == google.maps.places.PlacesServiceStatus.OK) {
         //debugger;
         var marker = new google.maps.Marker({
           map: that.mapWork,
           position: place.geometry.location
         });
         that.mapWork.fitBounds(place.geometry.viewport);
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
    //debugger;
    if(result.status==true)
    {
   if(result.result)
   {
    // debugger;
     this.leadDetail=result.result;
     this.internal_notes=this.leadDetail.internal_notes;
    // debugger;
     if(result.result.home_google_place_id!=undefined||result.result.home_google_place_id!=null)
     {
       if(result.result.home_google_place_id!="")
       {
        this.map_home_height=400;
        this.loadHomeMap(result.result.home_google_place_id);
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
        this.loadWorkMap(result.result.work_google_place_id);
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
     
     //this.loadWorkMap(result.result.work_google_place_id);
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
     if(this.leadDetail.work_address)
     {
this.work_address_parts=this.leadDetail.work_address.split(",");
     }
    //debugger;
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
