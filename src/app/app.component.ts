import { Component, ViewChild,AfterViewInit } from '@angular/core';
import { Nav, Platform, MenuController, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
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
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  tab1Root: any = DashboardPage;
 
  rootPage: any = HomePage;
  public userLoggedIn: boolean = false;
  public allCountryCodes: any[] = [];
  public isApp=false;
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
    private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder) {
    this.initializeApp();
    sharedServiceObj.isLoggedInEmitter.subscribe(item => this.setLoginStatus(item));
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: "Login", component: LoginPage },
      { title: "Register", component: RegisterPage }
    ];
    this.setLoginInitialStatus();
    if(this.platform.is('core') || this.platform.is('mobileweb')) {
      this.isApp=false;
    }
    else
    {
      this.isApp=true;
    }
   // sharedServiceObj.navigationalPage.subscribe(item => {
   //   this.openSubPage(item)
 // });
  }
  ionViewWillEnter() { 
   //debugger;
   // this.menuController.enable(true); 
  }
  initializeApp() {
    this.platform.ready().then(() => {

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
  clearAllStorageElement() {
    this.storage.remove("userCurrentLocation");
    this.storage.remove("userCountryInfo");
    this.storage.remove("availableCountryList");
  }
  setUserCurrentGeoLocation() {
  
    this.geolocation.getCurrentPosition().then((resp) => {
  
      this.storage.set("userCurrentLatitude", resp.coords.latitude);
      this.storage.set("userCurrentLongitude", resp.coords.longitude);
      this.setUserCountry(resp.coords.latitude, resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }
  AfterViewInit(){
   // debugger;
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
     //this.nav.push(AllWebsitesPage);
      //this.sharedServiceObj.setNavigationalPage("5");
      this.nav.setRoot(DashboardTabsPage,{selectedPage:"5"});
    }
    if (pageNumber == "6") {
      this.nav.setRoot(DashboardTabsPage,{selectedPage:"6"});
      //this.sharedServiceObj.setNavigationalPage("6");
    }
    if (pageNumber == "7") {
      this.nav.setRoot(DashboardTabsPage,{selectedPage:"7"});
      //this.sharedServiceObj.setNavigationalPage("7");
    }
    if (pageNumber == "8") {
      this.nav.setRoot(DashboardTabsPage,{selectedPage:"8"});
      //this.sharedServiceObj.setNavigationalPage("8");
    }
    if (pageNumber == "9") {
      this.nav.setRoot(DashboardTabsPage,{selectedPage:"9"});
      //this.sharedServiceObj.setNavigationalPage("9");
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
        // debugger;
        this.userServiceObj.facebookObject.logout();
      }

    }
    this.userLoggedIn = false;
    this.nav.setRoot(HomePage);
    //this.sharedServiceObj.setLoginStatus(false);
  }

}
