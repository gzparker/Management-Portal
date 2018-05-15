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
  pages: Array<{ title: string, component: any }>;
  public geoCoderData={
    country:"",
    countryCode:""
  }
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
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: "Login", component: LoginPage },
      { title: "Register", component: RegisterPage }
    ];
    this.setLoginInitialStatus();
   

    this.isApp = (!document.URL.startsWith("http"));
   sharedServiceObj.signOutEmitter.subscribe(item => {
     this.logOut();
 });
  }
  ionViewWillEnter() { 
   //debugger;
   // this.menuController.enable(true); 
  }
  initializeApp() {
    this.platform.ready().then(() => {
this.setDeviceToken();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.clearAllStorageElement();
      
      this.loadAvailableCountries();
      this.setUserCurrentGeoLocation();
    });
  }
  ionViewDidLoad() {
    //debugger;
    
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
      }
      else {
        //debugger;
        this.userLoggedIn = true;
        this.rootPage = DashboardTabsPage;
        //this.rootPage = DashboardPage;
        //this.nav.setRoot(DashboardPage);
      }
    });

  }
  setLoginStatus(item: any): void {

    this.userLoggedIn = item;
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
    if (pageNumber == "3") {
      this.nav.setRoot(RegisterPage);
    }    
    if (pageNumber == "4") {     
     this.nav.setRoot(DashboardTabsPage);
    }
    if (pageNumber == "5") {  
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
  logOut() {
    this.storage.remove('userId');
    this.storage.remove('email');
    this.storage.remove('first_name');
    this.storage.remove('last_name');
    this.storage.remove('userType');
    this.storage.remove('loggedInUserInfo');
    this.storage.remove('fbAuthResp');
    this.storage.remove("fbMembershipResp");
    if (this.userServiceObj.facebookObject != undefined) {
      if (this.userServiceObj.facebookObject.getAccessToken.length > 0) {
        this.userServiceObj.facebookObject.logout();
      }

    }
    this.userLoggedIn = false;
    this.nav.setRoot(HomePage);
   
  }

}
