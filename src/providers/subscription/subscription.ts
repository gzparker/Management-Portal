import { HttpClient } from '@angular/common/http';
//import { HTTP } from '@ionic-native/http';

import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { EventEmitter, Injectable } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DashboardPage } from '../../pages/dashboard/dashboard';
import { FbConfirmPage } from '../../pages/fb-confirm/fb-confirm';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { SharedProvider } from '../../providers/shared/shared';

/*
  Generated class for the SubscriptionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SubscriptionProvider {
  private headers: Headers = new Headers();
  private headerOptions: RequestOptions = new RequestOptions();
  private headersIDX: Headers = new Headers();
  private headerOptionsIDX: RequestOptions = new RequestOptions();
  constructor(private http: Http, public sharedServiceObj: SharedProvider,
    private storage: Storage, public modalCtrl: ModalController) {
    //console.log('Hello SubscriptionProvider Provider');
    //this.headers.append("IDX-API-KEY",this.sharedServiceObj.idxapiKey);
//this.headerOptions= new RequestOptions({ headers: this.headers });
this.headersIDX.append("IDXKEY",this.sharedServiceObj.idxapiKey);
this.headerOptionsIDX= new RequestOptions({ headers: this.headersIDX });
this.headers.append("REGISTRATIONKEY",this.sharedServiceObj.registerationApiKey);
this.headerOptions= new RequestOptions({ headers: this.headers });
  }
  getServicePackagesList(service_id:string) {
    let url = "";
    let data = new URLSearchParams();
    url = this.sharedServiceObj.registerationApiBaseUrl + 'subscriptions/listAll';
    //debugger;
    data.append('service_id', service_id);
    //data.append('interval', interval);
    //debugger;
    let subscriptionList = this.http
      .post(url, data, this.headerOptions)
      .map(this.extractData)
    return subscriptionList;
  }
  checkPromoCode(promo_code:any,service_id:string) {
    let url = "";
    let data = new URLSearchParams();
    url = this.sharedServiceObj.registerationApiBaseUrl + 'subscriptions/checkPromoCode';
    //debugger;
    data.append('service_id', service_id);
    data.append('promo_code', promo_code);
    //data.append('interval', interval);
    //debugger;
    let checkPromoCodeResp = this.http
      .post(url, data, this.headerOptions)
      .map(this.extractData)
    return checkPromoCodeResp;
  }
  checkStartUpPromoCode(plan_id:any,promo_code:any,service_id:string) {
    let url = "";
    let data = new URLSearchParams();
    url = this.sharedServiceObj.registerationApiBaseUrl + 'subscriptions/getPlanPromoDetail';
    //debugger;
    data.append('service_id', service_id);
    data.append('promo_code', promo_code);
    data.append('plan_id', plan_id);
    //data.append('interval', interval);
    //debugger;
    let promoCodeDetailResp = this.http
      .post(url, data, this.headerOptions)
      .map(this.extractData)
    return promoCodeDetailResp;
  }
  saveUserSubscription(subscriptionData: any,service_id:string) {
    //debugger;
    let url = "";
    let data = new URLSearchParams();
    url = this.sharedServiceObj.registerationApiBaseUrl + 'subscriptions/addCreditCardAndCreateSubscription';
    //debugger;

    data.append('service_id', service_id);
    data.append('member_id', subscriptionData.member_id);
    data.append('full_name', subscriptionData.full_name);
    data.append('cc', subscriptionData.cc_number);
    data.append('exp_month', subscriptionData.exp_month);
    data.append('exp_year', subscriptionData.exp_year);
    data.append('cvc', subscriptionData.cvc);
    data.append('service_plans_array', subscriptionData.service_plans_array.toString());
    data.append('mls_service_id',subscriptionData.mls_service_id);
    data.append('stripe_coupon_code',subscriptionData.stripe_coupon_code);
    data.append('startupPromoCodeId',subscriptionData.startupPromoCodeId);
    data.append('startupCost',subscriptionData.startupCost);
    
    //debugger;
    let subscriptionList = this.http
      .post(url, data, this.headerOptions)
      .map(this.extractData)
    return subscriptionList;
  }
  subscriptionBillingHistory(member_id:string,service_id:string)
  {
    let url = "";
    let data = new URLSearchParams();
    url = this.sharedServiceObj.registerationApiBaseUrl + 'subscriptions/getMyBillingHistory';
    data.append('service_id', service_id);
    data.append('member_id', member_id);
    //debugger;
    let billingHistoryList = this.http
      .post(url, data, this.headerOptions)
      .map(this.extractData)
    return billingHistoryList;
  }
  upcomingSubscriptionList(member_id:string,service_id:string)
  {
    let url = "";
    let data = new URLSearchParams();
    url = this.sharedServiceObj.registerationApiBaseUrl + 'subscriptions/mySubscriptions';
    data.append('service_id', service_id);
    data.append('member_id', member_id);
    //debugger;
    let upcomingSubscriptionList = this.http
      .post(url, data, this.headerOptions)
      .map(this.extractData)
    return upcomingSubscriptionList;
  }
  cancelSubscription(member_id:string,subscription_id:string,service_id:string)
  {
    let url = "";
    let data = new URLSearchParams();
    url = this.sharedServiceObj.registerationApiBaseUrl + 'subscriptions/cancelSubscription';
    data.append('service_id', service_id);
    data.append('member_id', member_id);
    data.append('subscription_id', subscription_id);
    let cancelSubscriptionResp = this.http
      .post(url, data, this.headerOptions)
      .map(this.extractData)
    return cancelSubscriptionResp;
  }
  checkSubscription()
  {
    let member_id = this.storage.get('userId');
    member_id.then((userId) => {
    let url = "";
    let data = new URLSearchParams();
    url = this.sharedServiceObj.registerationApiBaseUrl + 'subscriptions/checkActiveSubscriptions';
    data.append('master_id', userId);
    let checkSubscriptionResp = this.http
      .post(url, data, this.headerOptions)
      .map(this.extractData);

   // return checkSubscriptionResp;
    });
  }
  checkSubscriptionTimely()
  {
    //setInterval(() => {
     // this.checkSubscription();
  //}, 2 * 60 * 1000);
   
  }
  loadAllAvailableMLS()
  {
    //let member_id = this.storage.get('userId');
    //member_id.then((userId) => {
    let url = "";
    let data = new URLSearchParams();
    url = this.sharedServiceObj.apiBaseUrl + 'members/getAvailableMLS';

    let allAvailableMLS = this.http
      .post(url, data, this.headerOptionsIDX)
      .map(this.extractData);
return allAvailableMLS;
   // return checkSubscriptionResp;
   // });
  }
  loadUpgradeList(user_id:string,service_id:string,interval:string)
{
  let data = new URLSearchParams();
  data.append('member_id',user_id);
  data.append('service_id',service_id);
  data.append('interval',interval);
let upgradeCenterList=this.http
  .post(this.sharedServiceObj.registerationApiBaseUrl+'subscriptions/listUpgrades', data, this.headerOptions)
  .map(this.extractData)
  return upgradeCenterList;
}
upgradeDowngradePlan(user_id:string,service_id:string,subscription_plan_ids:any,action:string)
{
//debugger;
    let data = new URLSearchParams();
 data.append('member_id',user_id);
 if(subscription_plan_ids=="")
 {
  data.append('update_subscription_id_and_plan_id_json',subscription_plan_ids);
 }
 else
 {
  data.append('update_subscription_id_and_plan_id_json',JSON.stringify(subscription_plan_ids));
 }
 //debugger;
 data.append('service_id',service_id);
 data.append('action',action);
 //debugger;
  let upgradeResp=this.http
    .post(this.sharedServiceObj.registerationApiBaseUrl+'subscriptions/upgradeDowngradeMember', data, this.headerOptions)
    .map(this.extractData)
    return upgradeResp;
}
getServiceStartUpPlanList(service_id:string) {
  let url = "";
  let data = new URLSearchParams();
  url = this.sharedServiceObj.registerationApiBaseUrl + 'subscriptions/getServiceStartUpPlans';
  //debugger;
  data.append('service_id', service_id);
  //debugger;
  let subscriptionList = this.http
    .post(url, data, this.headerOptions)
    .map(this.extractData)
  return subscriptionList;
}
  private extractData(res: Response) {
  debugger;
    return res.json();
  }
  private handleErrorObservable(error: Response | any) {
    //debugger;
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }
  private handleErrorPromise(error: Response | any) {
    //debugger; 
    console.error(error.message || error);
    return Promise.reject(error.message || error);
  }
}
