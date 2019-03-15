import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { Facebook } from '@ionic-native/facebook';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { IonicStorageModule } from '@ionic/storage';
import { HTTP } from '@ionic-native/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Http, Response, URLSearchParams, Headers, RequestOptions, HttpModule } from '@angular/http';
import {AccordionModule} from "ng2-accordion";
import { IonicImageLoader } from 'ionic-image-loader';
import { CKEditorModule } from 'ng2-ckeditor';
import { ChartsModule } from 'ng2-charts';
import { ClipboardModule } from 'ngx-clipboard';

import { ColorPickerModule } from 'ngx-color-picker';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { TimezonePickerModule } from 'ng2-timezone-selector';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { Camera } from '@ionic-native/camera';
//import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AgmCoreModule } from '@agm/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BrMaskerModule } from 'brmasker-ionic-3';

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
import { WebsitesWebsiteLinksPage } from '../pages/websites/websites-website-links/websites-website-links';

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
import { NotificationSettingsPage } from '../pages/setup/notification-settings/notification-settings';

import { AccountInfoPage } from '../pages/account/account-info/account-info';
import { EditAccountPage } from '../pages/account/edit-account/edit-account';
import { AccountOptionPage } from '../pages/account/account-option/account-option';

import { ChangePasswordPage } from '../pages/account/change-password/change-password';

import { ViewCreditCardsPage } from '../pages/billing/view-credit-cards/view-credit-cards';
import { AddCreditCardPage } from '../pages/billing/add-credit-card/add-credit-card';
import { EditCreditCardPage } from '../pages/billing/edit-credit-card/edit-credit-card';
import { CreditCardDetailPage } from '../pages/billing/credit-card-detail/credit-card-detail';

import { UpgradeCenterPage } from '../pages/account/upgrade-center/upgrade-center';
import { BillingHistoryPage } from '../pages/account/billing-history/billing-history';
import { UpcomingSubscriptionPage } from '../pages/account/upcoming-subscription/upcoming-subscription';
import { GlobalSettingsPopupPage } from '../pages/modal-popup/global-settings-popup/global-settings-popup';
import { HotsheetDetailPopupPage } from '../pages/modal-popup/hotsheet-detail-popup/hotsheet-detail-popup';
import { ListingDetailPopupPage } from '../pages/modal-popup/listing-detail-popup/listing-detail-popup';
import { EmailContactModalPage } from '../pages/modal-popup/email-contact-modal/email-contact-modal';
import { ColorSelectionPopupPage } from '../pages/modal-popup/color-selection-popup/color-selection-popup';
import { PicturePopupPage } from '../pages/modal-popup/picture-popup/picture-popup';


import { CreateRolePage } from '../pages/roles/create-role/create-role';
import { EditRolePage } from '../pages/roles/edit-role/edit-role';
import { ViewRolesPage } from '../pages/roles/view-roles/view-roles';

import { ChatPage } from '../pages/chatmodule/chat/chat';
import { ChatAccountPage } from '../pages/chatmodule/chat-account/chat-account';
import { ChatActivitiesPage } from '../pages/chatmodule/chat-activities/chat-activities';
import { ChatDetailPage } from '../pages/chatmodule/chat-detail/chat-detail';
import { ChatEmojiPopupoverPage } from '../pages/chatmodule/chat-emoji-popupover/chat-emoji-popupover';
import { ChatFriendsPage } from '../pages/chatmodule/chat-friends/chat-friends';
import { ChatFriendsActivePage } from '../pages/chatmodule/chat-friends-active/chat-friends-active';
import { ChatFriendsMessengerPage } from '../pages/chatmodule/chat-friends-messenger/chat-friends-messenger';
import { ChatGroupsPage } from '../pages/chatmodule/chat-groups/chat-groups';
import { ChatsPage } from '../pages/chatmodule/chats/chats';
import { ChatingImagePopUpPage } from '../pages/chatmodule/chating-image-pop-up/chating-image-pop-up';
import { NewGroupPopupPage } from '../pages/chatmodule/new-group-popup/new-group-popup';
import { NewMessagePopupPage } from '../pages/chatmodule/new-message-popup/new-message-popup';
import { GroupChatDetailPage } from '../pages/chatmodule/group-chat-detail/group-chat-detail';
import { GroupMembersPage } from '../pages/chatmodule/group-members/group-members';


import { UserProvider } from '../providers/user/user';
import { SharedProvider } from '../providers/shared/shared';
import { SubscriptionProvider } from '../providers/subscription/subscription';
import { ListingProvider } from '../providers/listing/listing';
var firebaseConfig = {
  apiKey: "AIzaSyCVqAS3m173SeNpNMCxFX6k8vvls50lH00",
    authDomain: "idx-company.firebaseapp.com",
    databaseURL: "https://idx-company.firebaseio.com",
    projectId: "idx-company",
    storageBucket: "idx-company.appspot.com",
    messagingSenderId: "244299399814"
};
@NgModule({
  declarations: [
    MyApp,HomePage,LoginPage,RegisterPage, DashboardPage, FbConfirmPage, UserVerificationPage,
    WebsiteDetailPage,LeadDetailPage,EditLeadPage,CreateLeadPage,AllLeadsPage,LeadHotsheetSubscribedPage,
    LeadSavedListingPage,LeadSavedSearchesPage,VerificationCodePage, 
    SubscriptionPage,AllWebsitesPage,CreateWebsitePage,EditWebsitePage,WebsitesWebsiteLinksPage,DashboardTabsPage,
    AllHotSheetsPage,ContactusPage,CreateAgentPage,GlobalPreferencesPage,ManageAgentsPage,
    MlsSettingsPage,SetupOptionPage,UserOptionPage,AccountInfoPage,AccountOptionPage,ViewCreditCardsPage,
    ChangePasswordPage,EditCreditCardPage,CreditCardDetailPage,UpgradeCenterPage,EditAccountPage,CreateHotSheetPage,EditHotSheetPage,
    EditLeadRoutingPage,UpcomingSubscriptionPage,
    BillingHistoryPage,AgentDetailPage,EditAgentPage,GlobalSettingsPopupPage,AddCreditCardPage,CreateRolePage,EditRolePage,ViewRolesPage,ChatPage,ChatAccountPage,
    ChatActivitiesPage,ChatDetailPage,ChatEmojiPopupoverPage,ChatFriendsActivePage,ChatFriendsActivePage,
    ChatFriendsMessengerPage,ChatGroupsPage,ChatsPage,ChatingImagePopUpPage,NewGroupPopupPage,
    NewMessagePopupPage,GroupChatDetailPage,GroupMembersPage,ChatFriendsPage,ListingDetailPopupPage,
    HotsheetDetailPopupPage,EmailContactModalPage,ColorSelectionPopupPage,PicturePopupPage,NotificationSettingsPage
  ],
  imports: [
    BrowserModule, HttpModule,CKEditorModule,
    IonicModule.forRoot(MyApp), HttpClientModule,MultiselectDropdownModule,AccordionModule,
    IonicStorageModule.forRoot({
      name: 'managementportal',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA9aj3-17cojks6gicZZ_PY2t5ERVu25ac'
    }),ColorPickerModule,TimezonePickerModule,BrMaskerModule,IonicImageLoader.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,ChartsModule, ClipboardModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,HomePage,LoginPage,RegisterPage, DashboardPage, FbConfirmPage, UserVerificationPage,WebsiteDetailPage,
    LeadDetailPage,EditLeadPage,CreateLeadPage,AllLeadsPage,LeadHotsheetSubscribedPage,
    LeadSavedListingPage,LeadSavedSearchesPage,VerificationCodePage, SubscriptionPage,
    AllWebsitesPage,CreateWebsitePage,WebsitesWebsiteLinksPage,EditWebsitePage,DashboardTabsPage,AllHotSheetsPage,ContactusPage,
    CreateAgentPage,GlobalPreferencesPage,ManageAgentsPage,
    MlsSettingsPage,SetupOptionPage,UserOptionPage,AccountInfoPage,AccountOptionPage,ViewCreditCardsPage,
    ChangePasswordPage,EditCreditCardPage,CreditCardDetailPage,UpgradeCenterPage,EditAccountPage,CreateHotSheetPage,EditHotSheetPage,
    EditLeadRoutingPage,UpcomingSubscriptionPage,BillingHistoryPage,AgentDetailPage,
    EditAgentPage,GlobalSettingsPopupPage,AddCreditCardPage,CreateRolePage,EditRolePage,ViewRolesPage,
    ChatPage,ChatAccountPage,EmailContactModalPage,ColorSelectionPopupPage,
    ChatActivitiesPage,ChatDetailPage,ChatEmojiPopupoverPage,ChatFriendsActivePage,ChatFriendsActivePage,
    ChatFriendsMessengerPage,ChatGroupsPage,ChatsPage,ChatingImagePopUpPage,NewGroupPopupPage,NewMessagePopupPage,
    NewMessagePopupPage,GroupChatDetailPage,GroupMembersPage,ChatFriendsPage,
    ListingDetailPopupPage,HotsheetDetailPopupPage,PicturePopupPage,NotificationSettingsPage
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
    DatePipe,
    //InAppBrowser,
    SubscriptionProvider,
    ListingProvider
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
