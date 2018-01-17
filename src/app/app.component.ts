import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController,NavController  } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import {LoginPage}  from '../pages/login/login';
import {RegisterPage}  from '../pages/register/register';
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
  public userLoggedIn:boolean=false;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,
		public statusBar: StatusBar,
		public splashScreen: SplashScreen,
    public menuController: MenuController,
    private storage: Storage,
    public userServiceObj:UserProvider,public sharedServiceObj:SharedProvider) {
    this.initializeApp();
    sharedServiceObj.isLoggedInEmitter.subscribe(item => this.setLoginStatus(item));
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      {title:"Login",component:LoginPage},
      {title:"Register",component:RegisterPage}
      //{ title: 'List', component: ListPage }
    ];
    this.setLoginInitialStatus();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      
      this.statusBar.styleDefault();
      this.splashScreen.hide();
     
    });
  }
  setLoginInitialStatus():void{
  let userInfo=this.storage.get('loggedInUserInfo')
  this.storage.get('loggedInUserInfo').then((data) => {
    
    if(data == null)
     {
      this.userLoggedIn=false;
     }
     else
     {
      //debugger;
      this.userLoggedIn=true;
      this.rootPage=DashboardPage;
      //this.nav.setRoot(DashboardPage);
     }
  });
  
  }
  setLoginStatus(item:any):void{
   
    this.userLoggedIn=item;
 // debugger;
    }
  openPage(pageNumber) {
    if(pageNumber=="1")
    {
      //debugger;
      this.nav.setRoot(HomePage);
    }
    else if(pageNumber=="2")
    {
      this.nav.setRoot(LoginPage);
    }
    if(pageNumber=="3")
    {
      this.nav.setRoot(RegisterPage);
    }
    if(pageNumber=="4")
    {
      this.nav.setRoot(DashboardPage);
    }
    //else if(page=="Login")
   // {

    //}
  }
  logOut()
  {
    this.storage.remove('userId');
    this.storage.remove('email');
    this.storage.remove('first_name');
    this.storage.remove('last_name');
    this.storage.remove('userType');
    this.storage.remove('loggedInUserInfo');
    this.storage.remove('fbAuthResp');
    this.storage.remove("fbMembershipResp");
if(this.userServiceObj.facebookObject!=undefined)
{
  if(this.userServiceObj.facebookObject.getAccessToken.length>0)
  {
   // debugger;
    this.userServiceObj.facebookObject.logout();
  }
 
}
    this.userLoggedIn=false;
    this.nav.setRoot(HomePage);
    //this.sharedServiceObj.setLoginStatus(false);
  }

}
