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
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { GooglePlacesAutocompleteComponentModule } from 'ionic2-google-places-autocomplete';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
//import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { ContactusPage } from '../pages/contactus/contactus';
import { DashboardTabsPage } from '../pages/tabs/dashboard-tabs/dashboard-tabs';

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

import { AllLeadsPage } from '../pages/leads/all-leads/all-leads';
import { CreateLeadPage } from '../pages/leads/create-lead/create-lead';
import { LeadDetailPage } from '../pages/leads/lead-detail/lead-detail';
import { EditLeadPage } from '../pages/leads/edit-lead/edit-lead';

import { AllHotSheetsPage } from '../pages/hotsheets/all-hot-sheets/all-hot-sheets';
import { CreateHotSheetPage } from '../pages/hotsheets/create-hot-sheet/create-hot-sheet';
import { EditHotSheetPage } from '../pages/hotsheets/edit-hot-sheet/edit-hot-sheet';

import { CreateAgentPage } from '../pages/setup/create-agent/create-agent';
import { GlobalPreferencesPage } from '../pages/setup/global-preferences/global-preferences';
import { ManageAgentsPage } from '../pages/setup/manage-agents/manage-agents';
import { MlsSettingsPage } from '../pages/setup/mls-settings/mls-settings';
import { SetupOptionPage } from '../pages/setup/setup-option/setup-option';
import { UserOptionPage } from '../pages/setup/user-option/user-option';

import { AccountInfoPage } from '../pages/account/account-info/account-info';
import { EditAccountPage } from '../pages/account/edit-account/edit-account';
import { AccountOptionPage } from '../pages/account/account-option/account-option';
import { BillingInfoPage } from '../pages/account/billing-info/billing-info';
import { ChangePasswordPage } from '../pages/account/change-password/change-password';
import { EditBillingPage } from '../pages/account/edit-billing/edit-billing';
import { UpgradeCenterPage } from '../pages/account/upgrade-center/upgrade-center';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserProvider } from '../providers/user/user';
import { SharedProvider } from '../providers/shared/shared';
import { SubscriptionProvider } from '../providers/subscription/subscription';
import { ListingProvider } from '../providers/listing/listing';

@NgModule({
  declarations: [
    MyApp,HomePage,LoginPage,RegisterPage, DashboardPage, FbConfirmPage, UserVerificationPage,
    WebsiteDetailPage,LeadDetailPage,EditLeadPage,CreateLeadPage,AllLeadsPage,VerificationCodePage, 
    SubscriptionPage,AllWebsitesPage,CreateWebsitePage,EditWebsitePage,DashboardTabsPage,
    AllHotSheetsPage,ContactusPage,CreateAgentPage,GlobalPreferencesPage,ManageAgentsPage,
    MlsSettingsPage,SetupOptionPage,UserOptionPage,AccountInfoPage,AccountOptionPage,BillingInfoPage,
    ChangePasswordPage,EditBillingPage,UpgradeCenterPage,EditAccountPage,CreateHotSheetPage,EditHotSheetPage
  ],
  imports: [
    BrowserModule, HttpModule,
    IonicModule.forRoot(MyApp), HttpClientModule,MultiselectDropdownModule,
    Ng4GeoautocompleteModule.forRoot(),
    IonicStorageModule.forRoot({
      name: 'managementportal',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,HomePage,LoginPage,RegisterPage, DashboardPage, FbConfirmPage, UserVerificationPage,WebsiteDetailPage,
    LeadDetailPage,EditLeadPage,CreateLeadPage,AllLeadsPage,VerificationCodePage, SubscriptionPage,
    AllWebsitesPage,CreateWebsitePage,EditWebsitePage,DashboardTabsPage,AllHotSheetsPage,ContactusPage,
    CreateAgentPage,GlobalPreferencesPage,ManageAgentsPage,
    MlsSettingsPage,SetupOptionPage,UserOptionPage,AccountInfoPage,AccountOptionPage,BillingInfoPage,
    ChangePasswordPage,EditBillingPage,UpgradeCenterPage,EditAccountPage,CreateHotSheetPage,EditHotSheetPage
    //ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook, HttpClientModule, HttpClient, HTTP, Geolocation, NativeGeocoder,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UserProvider,
    SharedProvider,
    SubscriptionProvider,
    ListingProvider
  ]
})
export class AppModule { }
