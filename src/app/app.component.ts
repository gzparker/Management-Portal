import { Component, ViewChild } from '@angular/core';
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
import { HomeComponent } from '../components/home/home';
import { SharedProvider } from '../providers/shared/shared';
import { UserProvider } from '../providers/user/user';
import { LoginComponent } from '../components/login/login';
import { DashboardPage } from '../pages/dashboard/dashboard';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  public userLoggedIn: boolean = false;
  public allCountryCodes: any[] = [];
  public isApp=false;
  pages: Array<{ title: string, component: any }>;

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
      //{ title: 'List', component: ListPage }
    ];
    this.setLoginInitialStatus();
    if(this.platform.is('core') || this.platform.is('mobileweb')) {
      this.isApp=false;
    }
    else
    {
      this.isApp=true;
    }
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
  clearAllStorageElement() {
    this.storage.remove("userCurrentLocation");
    this.storage.remove("userCountryInfo");
    this.storage.remove("availableCountryList");
  }
  setUserCurrentGeoLocation() {
    //debugger;
    this.geolocation.getCurrentPosition().then((resp) => {
      // debugger;
      // resp.coords.latitude
      // resp.coords.longitude
      this.storage.set("userCurrentLatitude", resp.coords.latitude);
      this.storage.set("userCurrentLongitude", resp.coords.longitude);
      this.setUserCountry(resp.coords.latitude, resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }
  setUserCountry(latitude: any, longitude: any) {
    //debugger;
    this.nativeGeocoder.reverseGeocode(latitude, longitude)
      .then((result: NativeGeocoderReverseResult) => {
        //console.log(JSON.stringify(result))
        //debugger;
        //alert(JSON.stringify(result));
        this.storage.set("userCountryInfo", result);
      })
      .catch((error: any) => {
        //debugger;
        // alert(error);
        //console.log(error)
      });
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
        this.rootPage = DashboardPage;
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
    //debugger;
    let countryCodesDummy = [];
    if (result.status == true) {
      this.storage.set("availableCountryList", result.countryArray);
    }

  }
  openPage(pageNumber) {
    if (pageNumber == "1") {
      //debugger;
      this.nav.setRoot(HomePage);
    }
    else if (pageNumber == "2") {
      this.nav.setRoot(LoginPage);
    }
    if (pageNumber == "3") {
      this.nav.setRoot(RegisterPage);
    }
    if (pageNumber == "4") {
      this.nav.setRoot(DashboardPage);
    }
    //else if(page=="Login")
    // {

    //}
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
