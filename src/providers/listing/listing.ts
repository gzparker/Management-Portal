import { HttpClient } from '@angular/common/http';
//import { HTTP } from '@ionic-native/http';

import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { EventEmitter, Injectable } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { DashboardPage } from '../../pages/dashboard/dashboard';
import { FbConfirmPage } from '../../pages/fb-confirm/fb-confirm';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { SharedProvider } from '../../providers/shared/shared';

/*
  Generated class for the ListingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ListingProvider {
  private allListings:any[]=[];
  private headers: Headers = new Headers();
  private headerOptions: RequestOptions = new RequestOptions();
  private headersIDX: Headers = new Headers();
  private headerOptionsIDX: RequestOptions = new RequestOptions();
  public searchListingEmitter: EventEmitter<String>;
  constructor(private http : Http,private sharedServiceObj:SharedProvider) {
    this.headersIDX.append("IDXKEY",this.sharedServiceObj.idxapiKey);
    this.headerOptionsIDX= new RequestOptions({ headers: this.headersIDX });
    this.headers.append("REGISTRATIONKEY",this.sharedServiceObj.registerationApiKey);
    this.headerOptions= new RequestOptions({ headers: this.headers });
  }
  
 getBrokerListingForSale(brokerId:string){
// debugger;
    let data = new URLSearchParams();
  data.append('mls_server_id', this.sharedServiceObj.mlsServerId);
 data.append('broker_id',brokerId);

  let searchedListing=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'listings/getFeaturedListingsByBroker', data, this.headerOptionsIDX)
    .map(this.extractListingData)
    return searchedListing;
}
getAgentListingForSale(agentId:string){
 
    let data = new URLSearchParams();
  data.append('mls_server_id', this.sharedServiceObj.mlsServerId);
 data.append('agent_id',agentId);

  let searchedListing=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'listings/getFeaturedListingsByAgent', data, this.headerOptionsIDX)
    .map(this.extractListingData)
    return searchedListing;
}
getOfficeListingForSale(officeId:string){
 
    let data = new URLSearchParams();
  data.append('mls_server_id', this.sharedServiceObj.mlsServerId);
 data.append('office_id',officeId);

  let searchedListing=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'listings/getFeaturedListingsByOffice', data, this.headerOptions)
    .map(this.extractListingData)
    return searchedListing;
}
getAvailableSearchFields(){

    let data = new URLSearchParams();
  data.append('mls_server_id', this.sharedServiceObj.mlsServerId);
 //debugger;
  let searchFields=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'listings/getSearchFields', data, this.headerOptionsIDX)
    .map(this.extractData)
    return searchFields;
}
getSearchResult(searchListObj:any){

    let data = new URLSearchParams();
  data.append('mls_server_id', this.sharedServiceObj.mlsServerId);
 data.append('search_filter_json',searchListObj);

  let searchedListing=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'listings/getSearchResults', data, this.headerOptionsIDX)
    .map(this.extractListingData)
    return searchedListing;
}

loadListingDetail(listingId:any){
let data = new URLSearchParams();
  data.append('mls_server_id', this.sharedServiceObj.mlsServerId);
 data.append('id',listingId);
  let searchedListing=this.http
    .post(this.sharedServiceObj.apiBaseUrl+'listings/getListingByID', data, this.headerOptionsIDX)
    .map(this.extractListingData)
    return searchedListing;
}
private extractListingData(res: Response) {

	return res.json();
    }
  // this could also be a private method of the component class
private extractData(res: Response) {

	return res.json();
    }
private handleErrorObservable (error: Response | any) {
  
	console.error(error.message || error);
	return Observable.throw(error.message || error);
    }
    private handleErrorPromise (error: Response | any) {
     
	console.error(error.message || error);
	return Promise.reject(error.message || error);
    }
}
