import { HttpClient } from '@angular/common/http';
import { Http, Response,URLSearchParams,Headers,RequestOptions } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import { EventEmitter,Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {Subject} from "rxjs/Subject";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the SharedProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class SharedProvider {
  public isLoggedInEmitter: EventEmitter<Boolean>;
  //public registerationApiBaseUrl="http://registration.menu/api/";
  public registerationApiBaseUrl="http://api.registration.menu/api/";
  private headers:Headers=new Headers();
   private headerOptions:RequestOptions=new RequestOptions();
   public service_id="2";
   public apiBaseUrl = "http://api.idx.company/api/";
  // public FB:any;
 
  constructor(private http: Http) {
    this.isLoggedInEmitter=new EventEmitter();
 
       // debugger;
  }
  public setLoginStatus(loginStatus:boolean){
    
    this.isLoggedInEmitter.emit(loginStatus);
}
 // this could also be a private method of the component class
 private extractData(res: Response) {
  //debugger;
    return res.json();
      }
  private handleErrorObservable (error: Response | any) {
   /// debugger;
    console.error(error.message || error);
    return Observable.throw(error.message || error);
      }
      private handleErrorPromise (error: Response | any) {
       
    console.error(error.message || error);
    return Promise.reject(error.message || error);
      }	
}
