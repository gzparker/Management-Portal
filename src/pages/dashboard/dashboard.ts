import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
   MenuController,ActionSheetController,Tabs,ToastController,App } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { ISubscription } from "rxjs/Subscription";
import { AlertController } from 'ionic-angular';
import { FbConfirmPage } from '../fb-confirm/fb-confirm';
import { Chart } from 'chart.js';
import { SubscriptionPage } from '../subscription/subscription';

import { AllWebsitesPage } from '../websites/all-websites/all-websites';
import { AllLeadsPage } from '../leads/all-leads/all-leads';
import { AllHotSheetsPage } from '../hotsheets/all-hot-sheets/all-hot-sheets';

import { CreateAgentPage } from '../setup/create-agent/create-agent';
import { GlobalPreferencesPage } from '../setup/global-preferences/global-preferences';
import { ManageAgentsPage } from '../setup/manage-agents/manage-agents';
import { MlsSettingsPage } from '../setup/mls-settings/mls-settings';
import { SetupOptionPage } from '../setup/setup-option/setup-option';
import { NotificationSettingsPage } from '../setup/notification-settings/notification-settings';
import { UserOptionPage } from '../setup/user-option/user-option';

import { AccountInfoPage } from '../account/account-info/account-info';
import { EditAccountPage } from '../account/edit-account/edit-account';
import { AccountOptionPage } from '../account/account-option/account-option';
import { BillingHistoryPage } from '../../pages/account/billing-history/billing-history';
import { UpcomingSubscriptionPage } from '../../pages/account/upcoming-subscription/upcoming-subscription';

import { ChangePasswordPage } from '../account/change-password/change-password';
import { UpgradeCenterPage } from '../account/upgrade-center/upgrade-center';

import { ViewCreditCardsPage } from '../billing/view-credit-cards/view-credit-cards';
import { EditCreditCardPage } from '../billing/edit-credit-card/edit-credit-card';
import { CreditCardDetailPage } from '../billing/credit-card-detail/credit-card-detail';

import { CreateRolePage } from '../roles/create-role/create-role';
import { EditRolePage } from '../roles/edit-role/edit-role';
import { ViewRolesPage } from '../roles/view-roles/view-roles';

import { ChatPage } from '../chatmodule/chat/chat';

import { SharedProvider } from '../../providers/shared/shared';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  @ViewChild('barCanvas') barCanvas;
  barChart: any;
public totalSubMembers:string="";
public notificationMsg:string="";
public userId:string="";
public oldPageNumber:string="";
public memberCredentials:any;

private subscription: ISubscription;

  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, 
    public platform: Platform,public actionSheetCtrl: ActionSheetController,private toastCtrl: ToastController) {
      if(this.navParams.get('notificationMsg')!=undefined&&this.navParams.get('notificationMsg')!='')
      {
        this.notificationMsg=this.navParams.get('notificationMsg');
        let toast = this.toastCtrl.create({
          message: this.navParams.get('notificationMsg'),
          duration: 3000,
          position: 'top',
          cssClass:'successToast'
        });
        
        toast.onDidDismiss(() => {
        });
        
        toast.present();
      }
      if(this.navParams.get('selectedPage')!=undefined&&this.navParams.get('selectedPage')!='')
      {
        this.openPage(this.navParams.get('selectedPage'));
      }
  }

  ionViewDidLoad() {
    let parent_id = this.storage.get('parent_id');
    parent_id.then((data) => {
     let loggedInUserInfo = this.storage.get('loggedInUserInfo');
     loggedInUserInfo.then((data) => {
this.memberCredentials=data.memberCredentials;
if(this.memberCredentials!=null){
}
        
       
     });
      
    
    });
    
  }
  ionViewWillUnload(){
    
  }
  ionViewWillEnter(){
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
    this.userId=data;
    this.loadAllAgents();
  });
    let parent_id = this.storage.get('parent_id');
    parent_id.then((data) => {
     // debugger;
     let loggedInUserInfo = this.storage.get('loggedInUserInfo');
     loggedInUserInfo.then((data) => {
     this.memberCredentials=data.memberCredentials;
    //this.getUserDetailedInfo();
        this.loadDashboardCharts();
     });
    });
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  loadAllAgents()
{
  let generalWebsiteSettings = this.storage.get('generalWebsiteSettings');
        generalWebsiteSettings.then((data) => {
    this.userServiceObj.viewMemberAgents(this.userId.toString(),data.service_id)
  .subscribe((result) => this.loadAllAgentsResp(result));
        });
  
}
loadAllAgentsResp(result:any)
{
  
  if(result.status==true)
  {
   //debugger;
//this.allSubmembers=result.results;
  
    if(result.results.length>0)
    {
this.totalSubMembers=result.results.length.toString();
    }
   
  }
  else
  {
   
    //this.allAgents=[];
   this.totalSubMembers="0";
  }
}
loadDashboardCharts()
{
//  debugger;
  this.userServiceObj.getUsersChartsData(this.userId)
        .subscribe((result) => this.loadDashboardChartsResp(result));
}
loadDashboardChartsResp(result:any){
//debugger;
let leads_by_months:any[]=result.leads_by_month_chart;
let leads_chart_values:any[]=[];
let leadCountExists:boolean=false;

if(leads_by_months!=null&&leads_by_months.length>0)
{
  for(let i=1;i<=12;i++)
  {
  let found_lead=leads_by_months.find( month_leads => month_leads.mth === i.toString() );
  if(found_lead)
  {
    leads_chart_values.push(found_lead.totalLeads);
  }
  else
  {
    leads_chart_values.push("0");
  }
  }
}
else
{
  leads_chart_values.push("0");
}

//debugger;
this.barChart = new Chart(this.barCanvas.nativeElement, {
 
  type: 'bar',
  data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "June","July","Aug","Sept","Oct","Nov","Dec"],
      datasets: [{
          label: '# of Leads',
          data: leads_chart_values,
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
              'rgba(255,99,132,1)',
              'rgba(255,99,132,1)',
              'rgba(255,99,132,1)',
              'rgba(255,99,132,1)',
              'rgba(255,99,132,1)',
              'rgba(255,99,132,1)',
              'rgba(255,99,132,1)',
              'rgba(255,99,132,1)',
              'rgba(255,99,132,1)',
              'rgba(255,99,132,1)',
              'rgba(255,99,132,1)',
              'rgba(255,99,132,1)'
          ],
          borderWidth: 1
      }]
  },
  options: {
      scales: {
          yAxes: [{
              ticks: {
                  beginAtZero:true
              }
          }]
      }
  }

});

}
  getUserDetailedInfo(): void {
    //debugger;
    let subscribed_services = this.storage.get('subscribed_services');
    subscribed_services.then((subscribed_services_data) => {
      //debugger;
      if (subscribed_services_data != undefined) {
        if (subscribed_services_data.subscribed_services!=undefined){
        if (subscribed_services_data.subscribed_services.length > 0) {

          //debugger;
          if (subscribed_services_data.subscribed_services[0].service_status == null) {
         
            this.ngZone.run(() => {
              this.sharedServiceObj.setPaidStatus(false);
              this.storage.set('paid_status', '0');
              //debugger;
              this.navCtrl.push(SubscriptionPage, { full_name: this.memberCredentials.first_name + " " + this.memberCredentials.last_name });
            });
          }
          else
          {
            this.sharedServiceObj.setPaidStatus(true);
            //debugger;
            this.storage.set('paid_status', '1');
            let userGlobalSettingsResp = this.storage.get('globalSettings');
            userGlobalSettingsResp.then((data) => {
        if(data!=null)
        {
      if(data.photo_company==null&&data.photo_personal==null&&
        data.timezone==null)
      {
       // debugger;
        this.redirectToGlobalPreferences(true);
      }
      else
      {
        //debugger;
        this.redirectToGlobalPreferences(false);
      }
    }
    });
          }
        }
      }
      else
      {
        this.ngZone.run(() => {
          this.sharedServiceObj.setPaidStatus(false);
          this.storage.set('paid_status', '0');
          //debugger;
          this.navCtrl.push(SubscriptionPage, { full_name: this.memberCredentials.first_name + " " + this.memberCredentials.last_name });
        });
      }
    }
    });
    
      //this.userServiceObj.getMemberInfo(this.userId)
        //.subscribe((result) => this.userDetailedInfoResp(result));
  }
  userDetailedInfoResp(status: any) {
    if (status.status == true) {
      if (status.result != undefined) {
        if (status.result.subscribed_services!=undefined){
        if (status.result.subscribed_services.length > 0) {

          
          if (status.result.subscribed_services[0].service_status == null) {
         
            this.ngZone.run(() => {
              this.sharedServiceObj.setPaidStatus(false);
              this.storage.set('paid_status', '0');
              //debugger;
              this.navCtrl.push(SubscriptionPage, { full_name: status.result.first_name + " " + status.result.last_name });
            });
          }
          else
          {
            this.sharedServiceObj.setPaidStatus(true);
            this.storage.set('paid_status', '1');
            let userGlobalSettingsResp = this.storage.get('globalSettings');
            userGlobalSettingsResp.then((data) => {
        if(data!=null)
        {
      if(data.photo_company==null&&data.photo_personal==null&&
        data.timezone==null)
      {
        this.redirectToGlobalPreferences(true);
      }
      else
      {
        this.redirectToGlobalPreferences(false);
      }
    }
    });
          }
        }
      }
      else
      {
        this.ngZone.run(() => {
          this.sharedServiceObj.setPaidStatus(false);
          this.storage.set('paid_status', '0');
          //debugger;
          this.navCtrl.push(SubscriptionPage, { full_name: status.result.first_name + " " + status.result.last_name });
        });
      }
    }
    }
    else
    {
     // debugger;
    }
  }
redirectToGlobalPreferences(status:boolean)
{
  debugger;
if(status==true)
{
  let showGlobalPopUp = this.storage.get('showGlobalPopUp');
  showGlobalPopUp.then((data) => {
  if(data==null)
    {
  let actionSheet = this.actionSheetCtrl.create({
    title: 'Select any option',
    buttons: [
      {
        text: 'Upload Company Picture',
        handler: () => {
          this.navCtrl.setRoot(GlobalPreferencesPage, { route: "subscribe" });
        }
      },
      {
        text: "No Thanks",
        handler: () => {
          this.storage.set('showGlobalPopUp','no');
        }
      },
      {
        text: 'Cancel',
        handler: () => {
        }
      }
    ]
  });
  actionSheet.present();
}

});
}

}
  openPage(pageNumber) {
   //debugger;
    if (pageNumber == "4") {
      //this.navCtrl.setRoot(DashboardPage);
    }
    if (pageNumber == "5") {
      this.navCtrl.push(AllWebsitesPage);
    }
    if (pageNumber == "6") {
      this.navCtrl.setRoot(AllLeadsPage);
    }
    if (pageNumber == "7") {
      this.navCtrl.setRoot(AllHotSheetsPage);
    }
    if (pageNumber == "8") {
      this.navCtrl.setRoot(SetupOptionPage);
    }
    if (pageNumber == "9") {
      this.navCtrl.setRoot(AccountOptionPage);
    }
    if (pageNumber == "10") {
      this.navCtrl.push(GlobalPreferencesPage);
    }
    if (pageNumber == "11") {
      this.navCtrl.push(MlsSettingsPage);
    }
    if (pageNumber == "12") {
      this.navCtrl.push(UserOptionPage);
    }
    if (pageNumber == "13") {
      this.navCtrl.push(ManageAgentsPage);
    }
    if (pageNumber == "14") {
      this.navCtrl.push(CreateAgentPage);
    }
    if (pageNumber == "15") {
      this.navCtrl.push(AccountInfoPage);
    }
    if (pageNumber == "16") {
      this.navCtrl.push(ViewCreditCardsPage);
    }
    if (pageNumber == "17") {
      this.navCtrl.push(ChangePasswordPage);
    }
    if (pageNumber == "18") {
      this.navCtrl.push(EditCreditCardPage);
    }
    if (pageNumber == "19") {
      this.navCtrl.push(UpgradeCenterPage);
    }
    if (pageNumber == "20") {
      this.navCtrl.push(CreditCardDetailPage);
    }
    if (pageNumber == "21") {
      this.navCtrl.push(BillingHistoryPage);
    }
    if (pageNumber == "22") {
      this.navCtrl.push(UpcomingSubscriptionPage);
    }
    if (pageNumber == "23") {
      this.navCtrl.push(ViewRolesPage);
    }
    if (pageNumber == "24") {
      this.navCtrl.push(CreateRolePage);
    }
    if (pageNumber == "25") {
      this.navCtrl.push(EditRolePage);
    }
    if (pageNumber == "26") {
      this.navCtrl.push(EditAccountPage);
    }
    if (pageNumber == "27") {
      this.navCtrl.push(ChatPage);
    }
    if (pageNumber == "28") {
      this.navCtrl.push(NotificationSettingsPage);
    }
    
  }
}
