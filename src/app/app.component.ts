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
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { SharedProvider } from '../providers/shared/shared';
import { UserProvider } from '../providers/user/user';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { DashboardTabsPage } from '../pages/tabs/dashboard-tabs/dashboard-tabs';

import { EditAccountPage } from '../pages/account/edit-account/edit-account';

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
  public isWebBrowser=false;rootPage: any = HomePage;public userLoggedIn: boolean = false;
  public paidStatus:boolean=false;public allCountryCodes: any[] = [];public showWebsiteSubmenu=false;
  public showLeadsSubmenu=false;public showHotsheetsSubmenu=false;public isOwner:boolean=false;
  public isDashboard:boolean=true;public isWebsites:boolean=false;public isLeads:boolean=false;
  public isHotSheets:boolean=false;public isChats:boolean=false;public isRoles:boolean=false;
  public isAccount:boolean=false;public userGeneralInfo:any;public imgBaseUrl=this.sharedServiceObj.imgBucketUrl;
  public noImgUrl="../assets/imgs/profile-photo.jpg";public allUnreadMsg:number=0;public loadedWebsite:string="";
  public groupRef:any;public groupMemberRef:any;public chatRef:any;public userRef:any;public groupMembersData:any[]=[];
  public chatGroups:any[]=[];public chatData:any[]=[];public firebaseUserId:string="";public sideBarOption:string="1";
  public sideBarMenuBackGround:string="";public buttonColor:string="";public contentBackGrounColor:string="";
  public background_color_dweller="";public background_color_dweller_option="";public button_color_dweller="";
  public button_color_dweller_option="";public side_bar_color_dweller="";public side_bar_color_dweller_option="";
  public sidebar_menu_color:string="";public sidebar_menu_color_option:string="";
  public header_color="";public header_color_option="";public content_title_color="";
  public content_title_color_option="";public content_background:string="";public content_background_option:string="";
  public button_color="";public button_color_option="";public map_sidebar_color="";public map_sidebar_color_option="";
  public pagination_color="";public pagination_color_option="";public modal_background_color="";
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
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: "Login", component: LoginPage },
      { title: "Register", component: RegisterPage }
    ];
    this.setLoginInitialStatus();
    this.isApp = (!document.URL.startsWith("http"));
    this.loadedWebsite=document.URL.toString();
   sharedServiceObj.signOutEmitter.subscribe(item => {
     this.logOut();
 });
 
  }
  ionViewWillEnter() { 
  }
  
  
  initializeApp() {
    this.platform.ready().then(() => {
     this.setDeviceToken();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.clearAllStorageElement();
      this.loadGeneralWebsiteSettings();
      this.loadAvailableCountries();
      this.setUserCurrentGeoLocation();
      var that=this;
     
    firebase.database().ref('chats').on("child_added", function(snapshot) {
      that.loadAllMsgCounter();
    });
  
    });
  }
  ionViewDidLoad() {
  }
  applyThemeColors(colorObject:any)
  {
  if(colorObject!=null)
  {
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
  let sidebarElements=document.getElementsByClassName("sidebar_color");
    for (let i = 0; i < sidebarElements.length; i++) {
      sidebarElements[i].setAttribute("style", "background:"+this.sidebar_menu_color+" !important;");
    }

    //////////////////////////////Button Color////////////////////////////////    
    let buttonColorElement=document.getElementsByClassName("button_color");
    
    for (let i = 0; i < buttonColorElement.length; i++) {
    
      buttonColorElement[i].setAttribute("style", "background:"+this.button_color+" !important;");
    }
    let buttonToggleElement=document.getElementsByClassName("btnToggle");
    
    for (let i = 0; i < buttonToggleElement.length; i++) {
    
      buttonToggleElement[i].setAttribute("style", "background:"+this.button_color+" !important;");
    }
    let buttonBadgeElement=document.getElementsByClassName("msgcounter");
    
    for (let i = 0; i < buttonBadgeElement.length; i++) {
    
      buttonBadgeElement[i].setAttribute("style", "background:"+this.button_color+" !important;");
    }
    let buttonBadgeInviteElement=document.getElementsByClassName("badgeInvite");
    
    for (let i = 0; i < buttonBadgeInviteElement.length; i++) {
    
      buttonBadgeInviteElement[i].setAttribute("style", "background:"+this.button_color+" !important;");
    }
    let buttonviewProfileElement=document.getElementsByClassName("viewProfile");
    
    for (let i = 0; i < buttonviewProfileElement.length; i++) {
    
      buttonviewProfileElement[i].setAttribute("style", "background:"+this.button_color+" !important;");
    }
    let buttonContactElement=document.getElementsByClassName("contactPhone");
    
    for (let i = 0; i < buttonContactElement.length; i++) {
    
      buttonContactElement[i].setAttribute("style", "background:"+this.button_color+" !important;");
    }
    let buttonContactChatElement=document.getElementsByClassName("contactChat");
    
    for (let i = 0; i < buttonContactChatElement.length; i++) {
    
      buttonContactChatElement[i].setAttribute("style", "background:"+this.button_color+" !important;");
    }
    let buttonContactEmailElement=document.getElementsByClassName("contactEmail");
    
    for (let i = 0; i < buttonContactEmailElement.length; i++) {
    
      buttonContactEmailElement[i].setAttribute("style", "background:"+this.button_color+" !important;");
    }
    let buttonContactInviteElement=document.getElementsByClassName("contactInvite");
    
    for (let i = 0; i < buttonContactInviteElement.length; i++) {
    
      buttonContactInviteElement[i].setAttribute("style", "background:"+this.button_color+" !important;");
    }
    
    /////////////////////////////////Content Background/////////////////////////////////////////
    /*let contentBackgroundElement=document.getElementsByClassName("background_color");
    
    for (let i = 0; i < contentBackgroundElement.length; i++) {

      contentBackgroundElement[i].setAttribute("style", "background:"+this.content_background+" !important;");
    }*/

    let contentBackgroundElement=document.getElementsByClassName("background_color");
    
    for (let i = 0; i < contentBackgroundElement.length; i++) {
      contentBackgroundElement[i].setAttribute("style", "background:"+this.content_background+" !important;");
    }
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
  loadGeneralWebsiteSettings()
  {
    
    let dummyWebsiteUrl="";
    if(this.loadedWebsite[this.loadedWebsite.length-1]=="/")
    {
dummyWebsiteUrl=this.loadedWebsite.substr(0,this.loadedWebsite.length-1)
    }
    else
    {
      dummyWebsiteUrl=this.loadedWebsite;
    }
    if(dummyWebsiteUrl=="https://configuration.menu"||dummyWebsiteUrl=="http://configuration.menu")
    {
      this.sharedServiceObj.getServiceDefaultInfoByUrl("https://idx.configuration.menu")
      .subscribe((result) => this.loadGeneralWebsiteSettingsResp(result));
    }
    else if(this.loadedWebsite.indexOf("localhost")>0)
    {
      this.sharedServiceObj.getServiceDefaultInfoByUrl("https://intagent.configuration.menu")
      .subscribe((result) => this.loadGeneralWebsiteSettingsResp(result));
    }
    else
    {
     this.sharedServiceObj.getServiceDefaultInfoByUrl(dummyWebsiteUrl.toString())
     .subscribe((result) => this.loadGeneralWebsiteSettingsResp(result));
    }

  }
  loadGeneralWebsiteSettingsResp(result:any)
  {
    var that=this;
if(result)
{
  this.storage.set("generalWebsiteSettings",result);
 
  }
}
  setDeviceToken(){
    const messaging = firebase.messaging();
    messaging.usePublicVapidKey(this.sharedServiceObj.idxFirebasePublicKey);
    //this.storage.get('firebase_token').then((data) => {
      //if(data == null){
messaging.requestPermission()
.then(function() {
})
.then(function(token) {
  this.storage.set("firebase_token",token);
  debugger;
})
.catch(function(err) {
  console.log('Unable to get permission to notify.', err);
});
messaging.getToken().then((currentToken)=> {
  if (currentToken) {
    this.storage.set("firebase_token",currentToken);
    debugger;
  } else {
 
    console.log('No Instance ID token available. Request permission to generate one.');
    
  }
}).catch(function(err) {
  console.log('An error occurred while retrieving token. ', err);
});
    //}
  //});
messaging.onMessage(function(payload){
  debugger;
    console.log('onMessage',payload);
})
  }
  clearAllStorageElement() {
    this.storage.remove("userCurrentLocation");
    this.storage.remove("userCountryInfo");
    //this.storage.remove("availableCountryList");
  }
  setUserCurrentGeoLocation() {
    if(!this.isApp)
    {
      if (window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition((position)=> {
          this.storage.set("userCurrentLatitude", position.coords.latitude);
          this.storage.set("userCurrentLongitude", position.coords.longitude);
          this.setUserCountry(position.coords.latitude, position.coords.longitude);
        }, function() {
         
        });
      } else {
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
  }
  loadAllMsgCounter()
{
  var that=this;
  let i=0;
  let firebaseUserIdData = this.storage.get('firebaseUserId');
  firebaseUserIdData.then((data) => {
  this.firebaseUserId=data;
  var fredRef=firebase.database().ref('groups').on('value', function(snapshot) {
    if(snapshot.exists())
    {
      that.chatGroups=[];
      snapshot.forEach(element => {
        if(element.key!=undefined)
        {
        i=i+1;
    that.chatGroups.push(element);
    if(i==snapshot.numChildren())
    {
      firebase.database().ref('chats').on("value", function(snapshot) {
        let j=0;
       // debugger;
        //that.chatRef.orderByChild("groupId").equalTo(groupData.val().groupId).on("value", function(snapshot) {
       if(snapshot.exists()){
         if(element.key!=undefined)
         {
        that.chatData=[];
        snapshot.forEach(element => {
          j=j+1;
          that.chatData.push(element);
          if(j==snapshot.numChildren())
          {
            that.allUnreadMsg=0;
            that.countUnreadMessages();
          }
      
        });
      }
       }});
    }
  }
      });
  }
});
  });
}
countUnreadMessages()
{
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
    var fredRef=firebase.database().ref('groupMembers').on('child_added', function(snapshot) {
  if(snapshot.val().userId==that.firebaseUserId&&snapshot.val().groupId==groupData.val().groupId)
  {
    that.totalUnreadMessages(groupData,i);
   
  }
});
 }
}
}
i=i+1;
});

}
totalUnreadMessages(groupData:any,arrIndex:any)
{
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
}
}
if(i==that.chatData.length)
{
  if(unreadCounter>0)
  {
  that.allUnreadMsg=that.allUnreadMsg+unreadCounter;
  }
  else
  {
  }
  that.sharedServiceObj.setUnreadMsgs(that.allUnreadMsg.toString());
}
  });
}    

  setUnreadMsgs(msgCounter:string)
  {
  }
  setUserCountry(latitude: any, longitude: any) {
 
    if(this.isApp)
    {
      this.nativeGeocoder.reverseGeocode(latitude, longitude)
      .then((result: NativeGeocoderReverseResult) => {
        this.storage.set("userCountryInfo", result);
      })
      .catch((error: any) => {
      
      });
    }
    else
    {
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
        }
      });
   
    }
   
  }
  setGeoCodeInfo(countryName:any,countryCode:any)
  {
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
        this.userLoggedIn = true;
        this.rootPage = DashboardTabsPage;
      }
    });

  }
  setLoginStatus(item: any): void {
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
  }
  setPaidStatus(item: any):void{
    this.paidStatus=item;
  }
  loadAvailableCountries() {
    this.storage.get('availableCountryList').then((data) => {
      if(data!=null) {
        //debugger;
        this.storage.set("availableCountryList", data);
      } else {
        //this.storage.set("availableCountryList", data);
        //debugger;
        this.userServiceObj.loadCountryCodes()
        .subscribe((result) => this.getAllCountryCodesResp(result));
      }
    });
    /*if (this.allCountryCodes == undefined) {
      this.userServiceObj.loadCountryCodes()
        .subscribe((result) => this.getAllCountryCodesResp(result));
    }
    else if (this.allCountryCodes.length <= 0) {
      this.userServiceObj.loadCountryCodes()
        .subscribe((result) => this.getAllCountryCodesResp(result));
    }*/
  }
  getAllCountryCodesResp(result: any): void {
    let countryCodesDummy = [];
    if (result.status == true) {
      this.storage.set("availableCountryList", result.countryArray);
    }

  }

  openPage(pageNumber) {
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
        this.sidebar_menu_color=data.sidebar_menu_color;
        this.sidebar_menu_color_option=data.sidebar_menu_color_option;
        this.content_background=data.content_background;
        this.content_background_option=data.content_background_option;
        this.map_sidebar_color=data.map_sidebar_color;
        this.map_sidebar_color_option=data.map_sidebar_color_option;
        this.pagination_color=data.pagination_color;
        this.pagination_color_option=data.pagination_color_option;
        this.modal_background_color=data.modal_background_color;
        this.modal_background_color_option=data.modal_background_color_option;
        this.applyThemeColors(null);
      }
    });
  }
  setAccessLevels()
  {

    let parent_id = this.storage.get('parent_id');
      parent_id.then((data) => {
        if(data!=null)
        {
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
        this.isAccount=true;
        let savedAccessLevels:any[]=data;
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
    this.isAccount=true;
    this.isChats=true;
    this.isDashboard=true;
    this.isHotSheets=true;
    this.isLeads=true;
    this.isRoles=true;
    this.isWebsites=true;
  }
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
    let firebaseUserId = this.storage.get('firebaseUserId');
    firebaseUserId.then((data) => {
    var fredRef=firebase.database().ref('users/'+data);
fredRef.update({isOnline:'0'}).then(function() {

  that.storage.remove('firebaseUserId');
  }, function(error) {

  });

    });

    if (this.userServiceObj.facebookObject != undefined) {
      if (this.userServiceObj.facebookObject.getAccessToken.length > 0) {
        this.userServiceObj.facebookObject.logout();
      }

    }
    this.userLoggedIn = false;
    this.nav.setRoot(HomePage);
   
  }

}