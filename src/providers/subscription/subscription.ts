import { HttpClient } from '@angular/common/http';
//import { HTTP } from '@ionic-native/http';

import { Http, Response,URLSearchParams,Headers,RequestOptions } from '@angular/http';
import { EventEmitter,Injectable } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController,Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import {Subject} from "rxjs/Subject";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {DashboardPage}  from '../../pages/dashboard/dashboard';
import {FbConfirmPage}  from '../../pages/modal-popup/fb-confirm/fb-confirm';
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
  private headers:Headers=new Headers();
  private headerOptions:RequestOptions=new RequestOptions();
  constructor(private http: Http,public sharedServiceObj:SharedProvider,
    private storage: Storage,public modalCtrl : ModalController) {
    console.log('Hello SubscriptionProvider Provider');
  }
  getServicePackagesList(){
    let url="";
    let data = new URLSearchParams();
    url=this.sharedServiceObj.registerationApiBaseUrl+'subscriptions/list';
    //debugger;
    data.append('service_id',this.sharedServiceObj.service_id);
    //debugger;
    let subscriptionList=this.http
    .post(url, data, this.headerOptions)
    .map(this.extractData)
    return subscriptionList; 
   }
   saveUserSubscription(subscriptionData:any){
     //debugger;
    let url="";
    let data = new URLSearchParams();
    url=this.sharedServiceObj.registerationApiBaseUrl+'subscriptions/addCreditCardAndCreateSubscription';
    //debugger;
    data.append('service_id',this.sharedServiceObj.service_id);
    data.append('member_id',subscriptionData.member_id);
    data.append('full_name',subscriptionData.full_name);
    data.append('cc',subscriptionData.cc_number);
    data.append('exp_month',subscriptionData.exp_month);
    data.append('exp_year',subscriptionData.exp_year);
    data.append('cvc',subscriptionData.cvc);
    data.append('service_plans_array',subscriptionData.service_plans_array.toString());
    //debugger;
    let subscriptionList=this.http
    .post(url, data, this.headerOptions)
    .map(this.extractData)
    return subscriptionList; 
   }
   private extractData(res: Response) {
    //debugger;
      return res.json();
        }
    private handleErrorObservable (error: Response | any) {
     //debugger;
      console.error(error.message || error);
      return Observable.throw(error.message || error);
        }
        private handleErrorPromise (error: Response | any) {
        //debugger; 
      console.error(error.message || error);
      return Promise.reject(error.message || error);
        }	
}
