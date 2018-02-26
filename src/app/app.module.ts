import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { IonicStorageModule } from '@ionic/storage';
import { HTTP } from '@ionic-native/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Http, Response, URLSearchParams, Headers, RequestOptions, HttpModule } from '@angular/http';
import {AccordionModule} from "ng2-accordion";
//import { ImageCropperModule } from "ng2-img-cropper/index";
import { ColorPickerModule } from 'ngx-color-picker';
import { ImageCropperModule } from 'ngx-image-cropper';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { Camera } from '@ionic-native/camera';
import { AgmCoreModule } from '@agm/core';

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
import { EditLeadRoutingPage } from '../pages/leads/edit-lead-routing/edit-lead-routing';
import { LeadHotsheetSubscribedPage } from '../pages/leads/lead-hotsheet-subscribed/lead-hotsheet-subscribed';
import { LeadSavedListingPage } from '../pages/leads/lead-saved-listing/lead-saved-listing';
import { LeadSavedSearchesPage } from '../pages/leads/lead-saved-searches/lead-saved-searches';

import { AllHotSheetsPage } from '../pages/hotsheets/all-hot-sheets/all-hot-sheets';
import { CreateHotSheetPage } from '../pages/hotsheets/create-hot-sheet/create-hot-sheet';
import { EditHotSheetPage } from '../pages/hotsheets/edit-hot-sheet/edit-hot-sheet';

import { CreateAgentPage } from '../pages/setup/create-agent/create-agent';
import { GlobalPreferencesPage } from '../pages/setup/global-preferences/global-preferences';
import { ManageAgentsPage } from '../pages/setup/manage-agents/manage-agents';
import { AgentDetailPage } from '../pages/setup/agent-detail/agent-detail';
import { EditAgentPage } from '../pages/setup/edit-agent/edit-agent';
import { MlsSettingsPage } from '../pages/setup/mls-settings/mls-settings';
import { SetupOptionPage } from '../pages/setup/setup-option/setup-option';
import { UserOptionPage } from '../pages/setup/user-option/user-option';

import { AccountInfoPage } from '../pages/account/account-info/account-info';
import { EditAccountPage } from '../pages/account/edit-account/edit-account';
import { AccountOptionPage } from '../pages/account/account-option/account-option';

import { ChangePasswordPage } from '../pages/account/change-password/change-password';

import { ViewCreditCardsPage } from '../pages/billing/view-credit-cards/view-credit-cards';
import { EditCreditCardPage } from '../pages/billing/edit-credit-card/edit-credit-card';
import { CreditCardDetailPage } from '../pages/billing/credit-card-detail/credit-card-detail';
import { UpgradeCenterPage } from '../pages/account/upgrade-center/upgrade-center';
import { BillingHistoryPage } from '../pages/account/billing-history/billing-history';
import { UpcomingSubscriptionPage } from '../pages/account/upcoming-subscription/upcoming-subscription';
import { GlobalSettingsPopupPage } from '../pages/modal-popup/global-settings-popup/global-settings-popup';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserProvider } from '../providers/user/user';
import { SharedProvider } from '../providers/shared/shared';
import { SubscriptionProvider } from '../providers/subscription/subscription';
import { ListingProvider } from '../providers/listing/listing';

@NgModule({
  declarations: [
    MyApp,HomePage,LoginPage,RegisterPage, DashboardPage, FbConfirmPage, UserVerificationPage,
    WebsiteDetailPage,LeadDetailPage,EditLeadPage,CreateLeadPage,AllLeadsPage,LeadHotsheetSubscribedPage,
    LeadSavedListingPage,LeadSavedSearchesPage,VerificationCodePage, 
    SubscriptionPage,AllWebsitesPage,CreateWebsitePage,EditWebsitePage,DashboardTabsPage,
    AllHotSheetsPage,ContactusPage,CreateAgentPage,GlobalPreferencesPage,ManageAgentsPage,
    MlsSettingsPage,SetupOptionPage,UserOptionPage,AccountInfoPage,AccountOptionPage,ViewCreditCardsPage,
    ChangePasswordPage,EditCreditCardPage,CreditCardDetailPage,UpgradeCenterPage,EditAccountPage,CreateHotSheetPage,EditHotSheetPage,
    EditLeadRoutingPage,UpcomingSubscriptionPage,BillingHistoryPage,AgentDetailPage,EditAgentPage,GlobalSettingsPopupPage
  ],
  imports: [
    BrowserModule, HttpModule,
    IonicModule.forRoot(MyApp), HttpClientModule,MultiselectDropdownModule,AccordionModule,
    IonicStorageModule.forRoot({
      name: 'managementportal',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA9aj3-17cojks6gicZZ_PY2t5ERVu25ac'
    }),ImageCropperModule,ColorPickerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,HomePage,LoginPage,RegisterPage, DashboardPage, FbConfirmPage, UserVerificationPage,WebsiteDetailPage,
    LeadDetailPage,EditLeadPage,CreateLeadPage,AllLeadsPage,LeadHotsheetSubscribedPage,
    LeadSavedListingPage,LeadSavedSearchesPage,VerificationCodePage, SubscriptionPage,
    AllWebsitesPage,CreateWebsitePage,EditWebsitePage,DashboardTabsPage,AllHotSheetsPage,ContactusPage,
    CreateAgentPage,GlobalPreferencesPage,ManageAgentsPage,
    MlsSettingsPage,SetupOptionPage,UserOptionPage,AccountInfoPage,AccountOptionPage,ViewCreditCardsPage,
    ChangePasswordPage,EditCreditCardPage,CreditCardDetailPage,UpgradeCenterPage,EditAccountPage,CreateHotSheetPage,EditHotSheetPage,
    EditLeadRoutingPage,UpcomingSubscriptionPage,BillingHistoryPage,AgentDetailPage,EditAgentPage,GlobalSettingsPopupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook, HttpClientModule, HttpClient, HTTP, Geolocation, NativeGeocoder,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UserProvider,
    SharedProvider,
    ImagePicker,
		Crop,
		Camera,
    SubscriptionProvider,
    ListingProvider
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
