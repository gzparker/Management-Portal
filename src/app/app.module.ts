import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { IonicStorageModule } from '@ionic/storage';
import { HTTP } from '@ionic-native/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Http, Response, URLSearchParams, Headers, RequestOptions, HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
//import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { SubscriptionPage } from '../pages/subscription/subscription';
import { FbConfirmPage } from '../pages/fb-confirm/fb-confirm';
import { UserVerificationPage } from '../pages/user-verification/user-verification';
import { VerificationCodePage } from '../pages/verification-code/verification-code';

import { AllWebsitesPage } from '../pages/websites/all-websites/all-websites';
import { CreateWebsitePage } from '../pages/websites/create-website/create-website';
import { EditWebsitePage } from '../pages/websites/edit-website/edit-website';
import { WebsiteDetailPage } from '../pages/websites/website-detail/website-detail';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserProvider } from '../providers/user/user';
import { SharedProvider } from '../providers/shared/shared';
import { SubscriptionProvider } from '../providers/subscription/subscription';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage, DashboardPage, FbConfirmPage, UserVerificationPage,WebsiteDetailPage,
    VerificationCodePage, SubscriptionPage,AllWebsitesPage,CreateWebsitePage,EditWebsitePage
    //ListPage
  ],
  imports: [
    BrowserModule, HttpModule,
    IonicModule.forRoot(MyApp), HttpClientModule,
    IonicStorageModule.forRoot({
      name: 'managementportal',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage, DashboardPage, FbConfirmPage, UserVerificationPage,WebsiteDetailPage,
    VerificationCodePage, SubscriptionPage,AllWebsitesPage,CreateWebsitePage,EditWebsitePage
    //ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook, HttpClientModule, HttpClient, HTTP, Geolocation, NativeGeocoder,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UserProvider,
    SharedProvider,
    SubscriptionProvider
  ]
})
export class AppModule { }
