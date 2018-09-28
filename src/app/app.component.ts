import { Component, ViewChild,AfterViewInit } from '@angular/core';
import { Nav, Platform, MenuController, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { SharedProvider } from '../providers/shared/shared';
import { UserProvider } from '../providers/user/user';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { DashboardTabsPage } from '../pages/tabs/dashboard-tabs/dashboard-tabs';
import { AllWebsitesPage } from '../pages/websites/all-websites/all-websites';
import { CreateWebsitePage } from '../pages/websites/create-website/create-website';
import { EditWebsitePage } from '../pages/websites/edit-website/edit-website';

import { AllLeadsPage } from '../pages/leads/all-leads/all-leads';
import { CreateLeadPage } from '../pages/leads/create-lead/create-lead';
import { LeadDetailPage } from '../pages/leads/lead-detail/lead-detail';
import { EditLeadPage } from '../pages/leads/edit-lead/edit-lead';

import { UserVerificationPage } from '../pages/user-verification/user-verification';

import { CreateAgentPage } from '../pages/setup/create-agent/create-agent';
import { GlobalPreferencesPage } from '../pages/setup/global-preferences/global-preferences';
import { ManageAgentsPage } from '../pages/setup/manage-agents/manage-agents';
import { MlsSettingsPage } from '../pages/setup/mls-settings/mls-settings';
import { SetupOptionPage } from '../pages/setup/setup-option/setup-option';
import { UserOptionPage } from '../pages/setup/user-option/user-option';

import { AccountInfoPage } from '../pages/account/account-info/account-info';
import { EditAccountPage } from '../pages/account/edit-account/edit-account';
import { AccountOptionPage } from '../pages/account/account-option/account-option';
import { BillingHistoryPage } from '../pages/account/billing-history/billing-history';
import { UpcomingSubscriptionPage } from '../pages/account/upcoming-subscription/upcoming-subscription';

import { ChangePasswordPage } from '../pages/account/change-password/change-password';
import { UpgradeCenterPage } from '../pages/account/upgrade-center/upgrade-center';

import { ViewCreditCardsPage } from '../pages/billing/view-credit-cards/view-credit-cards';
import { EditCreditCardPage } from '../pages/billing/edit-credit-card/edit-credit-card';
import { CreditCardDetailPage } from '../pages/billing/credit-card-detail/credit-card-detail';

import { AllHotSheetsPage } from '../pages/hotsheets/all-hot-sheets/all-hot-sheets';
import { CreateHotSheetPage } from '../pages/hotsheets/create-hot-sheet/create-hot-sheet';
import { EditHotSheetPage } from '../pages/hotsheets/edit-hot-sheet/edit-hot-sheet';
import { DashboardTabsComponent } from '../components/dashboard-tabs/dashboard-tabs';
import { ChatPage } from '../pages/chatmodule/chat/chat';

declare var google: any;
declare var firebase:any;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  tab1Root: any = DashboardPage;
  public isApp=false;
  public isWebBrowser=false;
  rootPage: any = HomePage;
  public userLoggedIn: boolean = false;
  public paidStatus:boolean=true;
  public allCountryCodes: any[] = [];
  public showWebsiteSubmenu=false;
  public showLeadsSubmenu=false;
  public showHotsheetsSubmenu=false;
  public isOwner:boolean=false;
  public isDashboard:boolean=true;
  public isWebsites:boolean=false;
  public isLeads:boolean=false;
  public isHotSheets:boolean=false;
  public isChats:boolean=false;
  public isRoles:boolean=false;
  public isAccount:boolean=false;
  public userGeneralInfo:any;
  public imgBaseUrl=this.sharedServiceObj.imgBucketUrl;
  public noImgUrl="../assets/imgs/profile-photo.jpg";
  public allUnreadMsg:number=0;
  //public totalUnreadMessage:number=0;
  public loadedWebsite:string="";
  public groupRef:any;
  public groupMemberRef:any;
  public chatRef:any;
  public userRef:any;
  public groupMembersData:any[]=[];
  public chatGroups:any[]=[];
  public chatData:any[]=[];
  public firebaseUserId:string="";
  public sideBarOption:string="1";
  public sideBarMenuBackGround:string="";
  public buttonColor:string="";
  public contentBackGrounColor:string="";
  public background_color_dweller="";
  public background_color_dweller_option="";
  public button_color_dweller="";
  public button_color_dweller_option="";
  public side_bar_color_dweller="";
  public side_bar_color_dweller_option="";
  public sidebar_menu_color:string="";
  public sidebar_menu_color_option:string="";
  public header_color="";
  public header_color_option="";
  public content_title_color="";
  public content_title_color_option="";
  public content_background:string="";
  public content_background_option:string="";
  public button_color="";
  public button_color_option="";
  public map_sidebar_color="";
  public map_sidebar_color_option="";
  public pagination_color="";
  public pagination_color_option="";
  public modal_background_color="";
  public modal_background_color_option="";
  
  pages: Array<{ title: string, component: any }>;
  public geoCoderData={
    country:"",
    countryCode:""
  }
  public userId:string="";
  public parentId:string="";
  public showSideMenue:boolean=false;
  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public menuController: MenuController,
    private storage: Storage,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider,
    private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder,private afs: AngularFirestore) {
      //debugger;
    this.initializeApp();
    sharedServiceObj.isLoggedInEmitter.subscribe(item => this.setLoginStatus(item));
    sharedServiceObj.isPaidEmitter.subscribe(item => this.setPaidStatus(item));
    sharedServiceObj.updateColorThemesEmitter.subscribe(item => this.applyThemeColors(item));
    //sharedServiceObj.unreadMsgCounterEmitter.subscribe(item => this.setUnreadMsgs(item));
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: "Login", component: LoginPage },
      { title: "Register", component: RegisterPage }
    ];
    this.setLoginInitialStatus();
   
//debugger;
    this.isApp = (!document.URL.startsWith("http"));
    this.loadedWebsite=document.URL.toString();
   sharedServiceObj.signOutEmitter.subscribe(item => {
     this.logOut();
 });
 
  }
  ionViewWillEnter() { 
  // debugger;
   // this.menuController.enable(true); 
  }
  
  
  initializeApp() {
    this.platform.ready().then(() => {
     // debugger;
      //this.loadGeneralWebsiteSettings();
     this.setDeviceToken();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.clearAllStorageElement();
      this.loadWebsiteInfoByDomain();
      this.loadAvailableCountries();
      this.setUserCurrentGeoLocation();
      //this.applyThemeColors(null);
      var that=this;
     
    firebase.database().ref('chats').on("child_added", function(snapshot) {
      //debugger;
      that.loadAllMsgCounter();
    });
     // this.loadAllMsgCounter();
      /*let allUnreadMessage = this.storage.get('allUnreadMessage');
    allUnreadMessage.then((data) => {
      this.setUnreadMsgs(data);
    });*/
    });
  }
  ionViewDidLoad() {
    //debugger;
    //this.menuController.enable(false);
    
  }
  applyThemeColors(colorObject:any)
  {
  if(colorObject!=null)
  {
  // debugger;
  if(colorObject.option=="header_color")
  {
    this.header_color=colorObject.selectedColor
  }
  if(colorObject.option=="content_title_color")
  {
    this.content_title_color=colorObject.selectedColor
  }
  if(colorObject.option=="button_color")
  {
    this.button_color=colorObject.selectedColor
  }
  if(colorObject.option=="side_bar_menu_color")
  {
    this.sidebar_menu_color=colorObject.selectedColor
  }
  if(colorObject.option=="content_background_color")
  {
    this.content_background=colorObject.selectedColor
  }
  if(colorObject.option=="map_sidebar_color")
  {
    this.map_sidebar_color=colorObject.selectedColor
  }
  if(colorObject.option=="pagination_color")
  {
    this.pagination_color=colorObject.selectedColor
  }
  if(colorObject.option=="modal_background_color")
  {
    this.modal_background_color=colorObject.selectedColor
  }
  if(colorObject.option=="side_bar_color_dweller")
  {
    this.side_bar_color_dweller=colorObject.selectedColor
  }
  if(colorObject.option=="button_color_dweller")
  {
    this.button_color_dweller=colorObject.selectedColor
  }
  if(colorObject.option=="background_color_dweller")
  {
    this.background_color_dweller=colorObject.selectedColor
  }
}
//debugger;
  let sidebarElements=document.getElementsByClassName("sidebar_color");
    for (let i = 0; i < sidebarElements.length; i++) {
     // debugger;
      sidebarElements[i].setAttribute("style", "background:"+this.sidebar_menu_color+" !important;");
    }

    //////////////////////////////Button Color////////////////////////////////
   /* let buttonColorElement=document.getElementsByClassName("button_color");
    
    for (let i = 0; i < buttonColorElement.length; i++) {
    //debugger;
      buttonColorElement[i].setAttribute("style", "background-color:"+this.button_color+" !important;");
    }
    let buttonContactElement=document.getElementsByClassName("contactPhone");
    
    for (let i = 0; i < buttonContactElement.length; i++) {
    
      buttonContactElement[i].setAttribute("style", "background-color:"+this.button_color+" !important;");
    }
    let buttonContactChatElement=document.getElementsByClassName("contactChat");
    
    for (let i = 0; i < buttonContactChatElement.length; i++) {
    
      buttonContactChatElement[i].setAttribute("style", "background-color:"+this.button_color+" !important;");
    }
    let buttonContactEmailElement=document.getElementsByClassName("contactEmail");
    
    for (let i = 0; i < buttonContactEmailElement.length; i++) {
    
      buttonContactEmailElement[i].setAttribute("style", "background-color:"+this.button_color+" !important;");
    }
    let buttonContactInviteElement=document.getElementsByClassName("contactInvite");
    
    for (let i = 0; i < buttonContactInviteElement.length; i++) {
    
      buttonContactInviteElement[i].setAttribute("style", "background-color:"+this.button_color+" !important;");
    }
    let buttonSegmentElement=document.getElementsByClassName("segment-button");
    
    for (let i = 0; i < buttonSegmentElement.length; i++) {
    
      buttonSegmentElement[i].setAttribute("style", "color:"+this.button_color+" !important;");
      buttonSegmentElement[i].setAttribute("style", "border-color:"+this.button_color+" !important;");
    }
    let buttonSegmentActivatedElement=document.getElementsByClassName("segment-activated");
    
    for (let i = 0; i < buttonSegmentActivatedElement.length; i++) {
    
      buttonSegmentActivatedElement[i].setAttribute("style", "color:"+this.button_color+" !important;");
      buttonSegmentActivatedElement[i].setAttribute("style", "background-color:"+this.button_color+" !important;");
    }
    /////////////////////////////////Content Background/////////////////////////////////////////
    let contentBackgroundElement=document.getElementsByClassName("background_color");
    
    for (let i = 0; i < contentBackgroundElement.length; i++) {

      contentBackgroundElement[i].setAttribute("style", "background:"+this.content_background+" !important;");
    }
    let contentBackgroundColorEnabledElement=document.getElementsByClassName("colorEnabled");
    
    for (let i = 0; i < contentBackgroundColorEnabledElement.length; i++) {

      contentBackgroundColorEnabledElement[i].setAttribute("style", "background:"+this.content_background+" !important;");
    }
    let contentSearchBarIosElement=document.getElementsByClassName("searchbar-ios");
    
    for (let i = 0; i < contentSearchBarIosElement.length; i++) {

      contentSearchBarIosElement[i].setAttribute("style", "border-color:"+this.content_background+" !important;");
    }
    let contentSearchBarMdIosElement=document.getElementsByClassName("searchbar-md");
    
    for (let i = 0; i < contentSearchBarMdIosElement.length; i++) {

      contentSearchBarMdIosElement[i].setAttribute("style", "border-color:"+this.content_background+" !important;");
    }
    let contentSearchWpMdIosElement=document.getElementsByClassName("searchbar-wp");
    
    for (let i = 0; i < contentSearchWpMdIosElement.length; i++) {

      contentSearchWpMdIosElement[i].setAttribute("style", "border-color:"+this.content_background+" !important;");
    }*/
    ////////////////////////////////////////////////////////////////////////////////////////////
  }
  toggleSideBar(){
   // debugger;
if(this.sideBarOption=="1")
{
  this.sideBarOption="2";
}
else if(this.sideBarOption=="2")
{
  this.sideBarOption="3";
}
else if(this.sideBarOption=="3")
{
  this.sideBarOption="1";
}
  }
  loadWebsiteInfoByDomain()
  {
    //debugger
    //this.userServiceObj.loadAllWebsiteInfoByDomain(document.URL.toString())
    //.subscribe((result) => this.loadWebsiteInfoByDomainResp(result));
    let dummyWebsiteUrl="";
    if(this.loadedWebsite[this.loadedWebsite.length-1]=="/")
    {
dummyWebsiteUrl=this.loadedWebsite.substr(0,this.loadedWebsite.length-1)
    }
    else
    {
      dummyWebsiteUrl=this.loadedWebsite;
    }
    //debugger;
    if(dummyWebsiteUrl.indexOf("localhost")>0)
    {
     // debugger;
     this.userServiceObj.loadAllWebsiteInfoByDomain("cotierproperties.com")
    .subscribe((result) => this.loadWebsiteInfoByDomainResp(result));
    }
    else
    {
      this.userServiceObj.loadAllWebsiteInfoByDomain(dummyWebsiteUrl)
      .subscribe((result) => this.loadWebsiteInfoByDomainResp(result));
    }
    
  }
  loadWebsiteInfoByDomainResp(result:any)
  {
//debugger;
this.storage.set("websiteInfo",result.result);
  }
  setDeviceToken(){
    //debugger;
    const messaging = firebase.messaging();
    messaging.usePublicVapidKey("BFLnyRGk5TlJYMkX6X-H7xZWikEdVZL9tE5t3x_q2mh4P3OM-kHkOmhlmYUGSxSV6BYdCbuSpwcBCQ3Oc0Gb3t4");
//debugger;
messaging.requestPermission()
.then(function() {
 
})
.then(function(token) {
//debugger;
//send this token to server
  console.log(token); // Display user token
})
.catch(function(err) { // Happen if user deney permission
//debugger;
  console.log('Unable to get permission to notify.', err);
});
messaging.getToken().then((currentToken)=> {
  if (currentToken) {
  //debugger;
  //alert(currentToken);
    this.storage.set("firebase_token",currentToken);
    
  } else {
 
    console.log('No Instance ID token available. Request permission to generate one.');
    
  }
}).catch(function(err) {
 // debugger;
  console.log('An error occurred while retrieving token. ', err);
  //showToken('Error retrieving Instance ID token. ', err);
  //setTokenSentToServer(false);
});
messaging.onMessage(function(payload){
    console.log('onMessage',payload);
})
  }
  clearAllStorageElement() {
    this.storage.remove("userCurrentLocation");
    this.storage.remove("userCountryInfo");
    this.storage.remove("availableCountryList");
  }
  setUserCurrentGeoLocation() {
    if(!this.isApp)
    {
     // alert("webbrowser");
      if (window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition((position)=> {
          this.storage.set("userCurrentLatitude", position.coords.latitude);
          this.storage.set("userCurrentLongitude", position.coords.longitude);
          this.setUserCountry(position.coords.latitude, position.coords.longitude);
  //debugger;
        }, function() {
         
        });
      } else {
        // Browser doesn't support Geolocation
       
      }
    }
else
{

this.geolocation.getCurrentPosition().then((resp) => {

      this.storage.set("userCurrentLatitude", resp.coords.latitude);
      this.storage.set("userCurrentLongitude", resp.coords.longitude);
      this.setUserCountry(resp.coords.latitude, resp.coords.longitude);
    }).catch((error) => {
      alert("error"+error);
      console.log('Error getting location', error);
    });
}
    

  }
  AfterViewInit(){
   // debugger;
  }
  loadAllMsgCounter()
{
  var that=this;
  let i=0;
 // debugger;
  let firebaseUserIdData = this.storage.get('firebaseUserId');
  firebaseUserIdData.then((data) => {
  this.firebaseUserId=data;
 
  var fredRef=firebase.database().ref('groups').on('value', function(snapshot) {
    if(snapshot.exists())
    {
      that.chatGroups=[];
      snapshot.forEach(element => {
        i=i+1;
    that.chatGroups.push(element);
    if(i==snapshot.numChildren())
    {
      firebase.database().ref('chats').on("value", function(snapshot) {
        let j=0;
       // debugger;
        //that.chatRef.orderByChild("groupId").equalTo(groupData.val().groupId).on("value", function(snapshot) {
       if(snapshot.exists()){
        that.chatData=[];
        snapshot.forEach(element => {
          j=j+1;
          that.chatData.push(element);
          if(j==snapshot.numChildren())
          {
            that.allUnreadMsg=0;
            //debugger;
            that.countUnreadMessages();
          }
      
        });
       }});
    }
      });
  }
});

/*var chatsObjRef=firebase.database().ref('chats').on('value', function(chatsObjRefVal) {
 if(chatsObjRefVal.exists())
 {
   that.countUnreadMessages();
 }
});*/
  });
}
countUnreadMessages()
{
 //debugger;
var that=this;
let i=0;
  that.chatGroups.forEach(function(groupData) {
if(groupData.val().deletedFor!=undefined)
{
if(groupData.val().deletedFor.indexOf(that.firebaseUserId)<0)
{
 if(groupData.val().isGroup==0)
 {
  if(groupData.val().fromFbUserId==that.firebaseUserId||groupData.val().toFbUserId==that.firebaseUserId)
  {
    that.totalUnreadMessages(groupData,i);
  }
 }
 else if(groupData.val().isGroup==1)
 {
   //debugger;
//if(that.groupMembersData)
//{
  //that.groupMembersData.forEach(function(groupMember) {
    var fredRef=firebase.database().ref('groupMembers').on('child_added', function(snapshot) {
  if(snapshot.val().userId==that.firebaseUserId&&snapshot.val().groupId==groupData.val().groupId)
  {
    //debugger;
    that.totalUnreadMessages(groupData,i);
   
  }
});
 // });
//}
 }
}
}
i=i+1;
});

}
totalUnreadMessages(groupData:any,arrIndex:any)
{
//debugger;
  var that=this;
  let totalUnreadMessage=0;
  var unreadCounter=0;
  let i=0;
  that.chatData.forEach(function(chatDataItem) {
    i=i+1;
    if(chatDataItem.val().groupId==groupData.val().groupId)
{
  if(chatDataItem.val().readBy.indexOf(that.firebaseUserId)<0)
{
  unreadCounter=unreadCounter+1;
  //debugger;
}
}
if(i==that.chatData.length)
{
  if(unreadCounter>0)
  {
  //debugger;
  //totalUnreadMessage=totalUnreadMessage+unreadCounter;
  that.allUnreadMsg=that.allUnreadMsg+unreadCounter;
  //debugger;
    
    //debugger;
  }
  else
  {
   // debugger;
    //that.allUnreadMsg=0;
    //that.sharedServiceObj.setUnreadMsgs(that.allUnreadMsg.toString());
    //that.storage.set("allUnreadMessage",that.allUnreadMsg.toString());
  }
  that.sharedServiceObj.setUnreadMsgs(that.allUnreadMsg.toString());
  //that.storage.set("allUnreadMessage",that.allUnreadMsg.toString());
}
  });
    /*firebase.database().ref('chats').orderByChild("groupId").equalTo(groupData.val().groupId).on("value", function(snapshot) {
     if(snapshot.exists()){
      i=0;
      let totalUnreadMessage=0;
  var unreadCounter=0;
      snapshot.forEach(element => {
        //debugger;
        i=i+1;
if(element.val().readBy.indexOf(that.firebaseUserId)<0)
{
  unreadCounter=unreadCounter+1;
}
if(i==snapshot.numChildren())
{
  //debugger;
  if(unreadCounter>0)
  {
  // debugger;
  totalUnreadMessage=totalUnreadMessage+unreadCounter;
  that.allUnreadMsg=that.allUnreadMsg+totalUnreadMessage;
  debugger;
    that.sharedServiceObj.setUnreadMsgs(that.allUnreadMsg.toString());
    that.storage.set("allUnreadMessage",that.allUnreadMsg.toString());
    //debugger;
  }
  else
  {
   // debugger;
    that.allUnreadMsg=0;
    that.sharedServiceObj.setUnreadMsgs(that.allUnreadMsg.toString());
    that.storage.set("allUnreadMessage",that.allUnreadMsg.toString());
  }
}

});
    }
});*/
}    

  setUnreadMsgs(msgCounter:string)
  {
//this.allUnreadMsg=msgCounter;
  }
  setUserCountry(latitude: any, longitude: any) {
 
    if(this.isApp)
    {
   //alert('app');
      this.nativeGeocoder.reverseGeocode(latitude, longitude)
      .then((result: NativeGeocoderReverseResult) => {
      //debugger;
//alert(JSON.stringify(result));
        this.storage.set("userCountryInfo", result);
        //this.setGeoCodeInfo(result.countryName,result.countryCode);
      })
      .catch((error: any) => {
      
      });
    }
    else
    {
     //alert('no app');
      var latlng = new google.maps.LatLng(latitude, longitude);
      var geocoder = new google.maps.Geocoder;
   
       geocoder.geocode({'location': latlng}, (results, status)=> {
        if (status === 'OK') {
          if (results[0]) {
         
          results[0].address_components.forEach(element => {
            if(element.types[0]=="country")
            {
            
             this.setGeoCodeInfo(element.long_name,element.short_name);
            }
          });
          } else {
          
          }
        
        } else {
        //  alert('not inside');
        }
      });
   
    }
   
  }
  setGeoCodeInfo(countryName:any,countryCode:any)
  {
  //  debugger;
this.geoCoderData.country=countryName;
this.geoCoderData.countryCode=countryCode;
this.storage.set("userCountryInfo", this.geoCoderData);
  }
  setLoginInitialStatus(): void {
    let userInfo = this.storage.get('loggedInUserInfo')
    this.storage.get('loggedInUserInfo').then((data) => {

      if (data == null) {
        this.userLoggedIn = false;
this.showSideMenue=false;
      }
      else {
        this.showSideMenue=true;
        this.setAccessLevels();
        this.setUserGeneralInfo();
        //debugger;
        this.userLoggedIn = true;
        this.rootPage = DashboardTabsPage;
        //this.rootPage = DashboardPage;
        //this.nav.setRoot(DashboardPage);
      }
    });

  }
  setLoginStatus(item: any): void {
//debugger;
    this.userLoggedIn = item;
    if(item==true)
    {
      this.showSideMenue=true;
    }
    else
    {
      this.showSideMenue=false;
    }
    this.loadAllMsgCounter();
    this.setAccessLevels();
    this.setUserGeneralInfo();
    // debugger;
  }
  setPaidStatus(item: any):void{
    this.paidStatus=item;
  }
  loadAvailableCountries() {
    if (this.allCountryCodes == undefined) {
      this.userServiceObj.loadCountryCodes()
        .subscribe((result) => this.getAllCountryCodesResp(result));
    }
    else if (this.allCountryCodes.length <= 0) {
      this.userServiceObj.loadCountryCodes()
        .subscribe((result) => this.getAllCountryCodesResp(result));
    }
  }
  getAllCountryCodesResp(result: any): void {
    let countryCodesDummy = [];
    if (result.status == true) {
      this.storage.set("availableCountryList", result.countryArray);
    }

  }

  openPage(pageNumber) {
    //debugger;
    if (pageNumber == "1") {
      this.nav.setRoot(HomePage);
    }
    else if (pageNumber == "2") {
      this.nav.setRoot(LoginPage);
    }
    else if(pageNumber == "3") {
      this.nav.setRoot(RegisterPage);
    }    
    else if (pageNumber == "4") {     
     this.nav.setRoot(DashboardTabsPage);
    }
    else if(pageNumber == "27")
    {
      this.nav.setRoot(ChatPage);
    }
    else{
      this.nav.setRoot(DashboardTabsPage,{selectedPage:pageNumber});
    }
    /*if (pageNumber == "5") {  
      this.nav.setRoot(DashboardTabsPage,{selectedPage:"5"});
    }
    if (pageNumber == "6") {
      this.nav.setRoot(DashboardTabsPage,{selectedPage:"6"});   
    }
    if (pageNumber == "7") {
      this.nav.setRoot(DashboardTabsPage,{selectedPage:"7"});   
    }
    if (pageNumber == "8") {
      this.nav.setRoot(DashboardTabsPage,{selectedPage:"8"});
    }
    if (pageNumber == "9") {
      this.nav.setRoot(DashboardTabsPage,{selectedPage:"9"});
    }
    if (pageNumber == "23") {
      this.nav.setRoot(DashboardTabsPage,{selectedPage:"23"});
    }
    if (pageNumber == "26") {
      this.nav.setRoot(DashboardTabsPage,{selectedPage:"26"});
    }*/
  }
  editAccount()
  {
this.nav.push(EditAccountPage,{userId:this.userId});
  }
  subMenueToggle(option:string)
  {
    if(option=='4')
    {
      this.showWebsiteSubmenu=!this.showWebsiteSubmenu;
      this.showLeadsSubmenu=false;
      this.showHotsheetsSubmenu=false;
    }
else if(option=='5')
{
  this.showLeadsSubmenu=!this.showLeadsSubmenu;
  this.showHotsheetsSubmenu=false;
  this.showWebsiteSubmenu=false;
}
else if(option=='6')
{
  this.showHotsheetsSubmenu=!this.showHotsheetsSubmenu;
  this.showLeadsSubmenu=false;
  this.showWebsiteSubmenu=false;
}

  }
  setUserGeneralInfo()
  {
    let userInfo = this.storage.get('globalSettings')
    this.storage.get('globalSettings').then((data) => {

      if (data != null) {
        this.userGeneralInfo=data;
        this.background_color_dweller=data.background_color_dweller;
        this.background_color_dweller_option=data.background_color_dweller_option;
        this.button_color_dweller=data.button_color_dweller;
        this.button_color_dweller_option=data.button_color_dweller_option;
        this.side_bar_color_dweller=data.side_bar_color_dweller;
        this.side_bar_color_dweller_option=data.side_bar_color_dweller_option;
        this.header_color=data.header_color;
        this.header_color_option=data.header_color_option;
        this.content_title_color=data.content_title_color;
        this.content_title_color_option=data.content_title_color_option;
        this.button_color=data.button_color;
        this.button_color_option=data.button_color_option;
        this.map_sidebar_color=data.map_sidebar_color;
        this.map_sidebar_color_option=data.map_sidebar_color_option;
        this.pagination_color=data.pagination_color;
        this.pagination_color_option=data.pagination_color_option;
        this.modal_background_color=data.modal_background_color;
        this.modal_background_color_option=data.modal_background_color_option;
        this.applyThemeColors(null);
//debugger;
      }
    });
  }
  setAccessLevels()
  {

    let parent_id = this.storage.get('parent_id');
      parent_id.then((data) => {
        if(data!=null)
        {
         // debugger;    
      this.parentId=data;
      this.isOwner=false;
        }
       else
       {
         //debugger;
      this.isOwner=true;
       }
       this.allowMenuOptions();
      
      });
      //debugger;
  }
  allowMenuOptions()
  {
    if(this.isOwner==false)
    {
     // debugger;
      this.isAccount=false;
    this.isHotSheets=false;
    this.isLeads=false;
    this.isRoles=false;
    this.isWebsites=false;
    let allowed_access_options = this.storage.get('allowed_access_options');
    allowed_access_options.then((data) => {
      if(data!=null)
      {
        if(data!=false)
        {
        //debugger;
        this.isAccount=true;
        let savedAccessLevels:any[]=data;

       // debugger;
        let websiteAccesLevels=savedAccessLevels.filter((element) => {
          return (element.key=="view-websites");
      });
      if(websiteAccesLevels.length>0)
      {
        this.isWebsites=true;
      }
      else
      {
        this.isWebsites=false;
      }
      let leadAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="view-leads");
    });
    if(leadAccesLevels.length>0)
      {
        this.isLeads=true;
      }
      else
      {
        this.isLeads=false;
      }
      let hotsheetAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="view-hotsheets");
    });
    if(hotsheetAccesLevels.length>0)
      {
        this.isHotSheets=true;
      }
      else
      {
        this.isHotSheets=false;
      }
    let accountAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="setup"||element.key=="view-agents");
    });
    if(accountAccesLevels.length>0)
      {
        this.isAccount=true;
      }
      else
      {
        this.isAccount=false;
      }
    let chatAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="chats");
    });
    if(chatAccesLevels.length>0)
      {
        this.isChats=true;
      }
      else
      {
        this.isChats=true;
      }  
    }
      }
    });
    
  }
  else
  {
   // debugger;
    this.isAccount=true;
    this.isChats=true;
    this.isDashboard=true;
    this.isHotSheets=true;
    this.isLeads=true;
    this.isRoles=true;
    this.isWebsites=true;
  }
  //debugger;
  }
  logOut() {
    let that=this;
    this.showSideMenue=false;
    this.storage.remove('userId');
    this.storage.remove('email');
    this.storage.remove('first_name');
    this.storage.remove('last_name');
    this.storage.remove('userType');
    this.storage.remove('loggedInUserInfo');
    this.storage.remove('fbAuthResp');
    this.storage.remove("fbMembershipResp");
    this.storage.remove("parent_id");
    this.storage.remove("allowed_access_options");
    this.storage.remove('is_submember');
    this.storage.remove('allUnreadMessage');
    //debugger;
    let firebaseUserId = this.storage.get('firebaseUserId');
    firebaseUserId.then((data) => {
    var fredRef=firebase.database().ref('users/'+data);
 //debugger;
//The following 2 function calls are equivalent
fredRef.update({isOnline:'0'}).then(function() {
  //debugger;
  // Update successful.
  that.storage.remove('firebaseUserId');
  }, function(error) {
  debugger;
  // An error happened.
  });

    });
    
   // debugger;
    if (this.userServiceObj.facebookObject != undefined) {
      if (this.userServiceObj.facebookObject.getAccessToken.length > 0) {
        this.userServiceObj.facebookObject.logout();
      }

    }
    this.userLoggedIn = false;
    this.nav.setRoot(HomePage);
   
  }

}