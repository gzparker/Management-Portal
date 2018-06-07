import { HttpClient } from '@angular/common/http';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Storage } from '@ionic/storage';
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
  public isPaidEmitter: EventEmitter<Boolean>;
  public navigationalPage: EventEmitter<String>;
  public signOutEmitter: EventEmitter<String>;
  //public registerationApiBaseUrl="http://registration.menu/api/";
  public registerationApiBaseUrl = "https://api.registration.menu/api/";
  //public idxapikey:string="1761ea8f043c53e44e3ccd90c18b0404c20152f0";
  public idxapiKey:string="14s1eol3f043c58344e3ccd90c18b0404c20152f";
  public registerationApiKey="mf8fXFYtl3DqRpxzu1XZWTD1GNHtUSqQ";
  public idxFirebasePublicKey="BFLnyRGk5TlJYMkX6X-H7xZWikEdVZL9tE5t3x_q2mh4P3OM-kHkOmhlmYUGSxSV6BYdCbuSpwcBCQ3Oc0Gb3t4";
  public defaultNoImage="assets/imgs/noImage.png";
  private headers: Headers = new Headers();
  private headerOptions: RequestOptions = new RequestOptions();
  private headersIDX: Headers = new Headers();
  private headerOptionsIDX: RequestOptions = new RequestOptions();
  public service_id = "2";
  public mlsServerId = "23";
  public apiBaseUrl = "https://api.idx.company/api/";
  //public imgBucketUrl="https://cdn.published.website/";
  public imgBucketUrl="https://s3-us-west-2.amazonaws.com/central-system/usr/";
  public noImageUrl="././assets/imgs/noImage.png";
  // public FB:any;

  constructor(private http: Http,private storage: Storage) {
    this.isLoggedInEmitter = new EventEmitter();
    this.isPaidEmitter=new EventEmitter();
    this.navigationalPage=new EventEmitter();
    this.signOutEmitter=new EventEmitter();
    this.headersIDX.append("IDXKEY",this.idxapiKey);
this.headerOptionsIDX= new RequestOptions({ headers: this.headersIDX });
this.headers.append("REGISTRATIONKEY",this.registerationApiKey);
this.headerOptions= new RequestOptions({ headers: this.headers });
    // debugger;
  }
  simplyfierLatitude (source, kink)
/* source[] Input coordinates in GLatLngs 	*/
/* kink	in metres, kinks above this depth kept  */
/* kink depth is the height of the triangle abc where a-b and b-c are two consecutive line segments */
{
    var	n_source, n_stack, n_dest, start, end, i, sig;    
    var dev_sqr, max_dev_sqr, band_sqr;
    var x12, y12, d12, x13, y13, d13, x23, y23, d23;
    var F = ((Math.PI / 180.0) * 0.5 );
    var index = new Array(); /* aray of indexes of source points to include in the reduced line */
	var sig_start = new Array(); /* indices of start & end of working section */
    var sig_end = new Array();	

    /* check for simple cases */

    if ( source.length < 3 ) 
        return(source);    /* one or two points */

    /* more complex case. initialize stack */
		
	n_source = source.length;
    band_sqr = kink * 360.0 / (2.0 * Math.PI * 6378137.0);	/* Now in degrees */
    band_sqr *= band_sqr;
    n_dest = 0;
    sig_start[0] = 0;
    sig_end[0] = n_source-1;
    n_stack = 1;

    /* while the stack is not empty  ... */
    while ( n_stack > 0 ){
    
        /* ... pop the top-most entries off the stacks */

        start = sig_start[n_stack-1];
        end = sig_end[n_stack-1];
        n_stack--;

        if ( (end - start) > 1 ){  /* any intermediate points ? */        
                    
                /* ... yes, so find most deviant intermediate point to
                       either side of line joining start & end points */                                   
            
            x12 = (source[end].lng() - source[start].lng());
            y12 = (source[end].lat() - source[start].lat());
            if (Math.abs(x12) > 180.0) 
                x12 = 360.0 - Math.abs(x12);
            x12 *= Math.cos(F * (source[end].lat() + source[start].lat()));/* use avg lat to reduce lng */
            d12 = (x12*x12) + (y12*y12);

            for ( i = start + 1, sig = start, max_dev_sqr = -1.0; i < end; i++ ){                                    

                x13 = (source[i].lng() - source[start].lng());
                y13 = (source[i].lat() - source[start].lat());
                if (Math.abs(x13) > 180.0) 
                    x13 = 360.0 - Math.abs(x13);
                x13 *= Math.cos (F * (source[i].lat() + source[start].lat()));
                d13 = (x13*x13) + (y13*y13);

                x23 = (source[i].lng() - source[end].lng());
                y23 = (source[i].lat() - source[end].lat());
                if (Math.abs(x23) > 180.0) 
                    x23 = 360.0 - Math.abs(x23);
                x23 *= Math.cos(F * (source[i].lat() + source[end].lat()));
                d23 = (x23*x23) + (y23*y23);
                                
                if ( d13 >= ( d12 + d23 ) )
                    dev_sqr = d23;
                else if ( d23 >= ( d12 + d13 ) )
                    dev_sqr = d13;
                else
                    dev_sqr = (x13 * y12 - y13 * x12) * (x13 * y12 - y13 * x12) / d12;// solve triangle

                if ( dev_sqr > max_dev_sqr  ){
                    sig = i;
                    max_dev_sqr = dev_sqr;
                }
            }

            if ( max_dev_sqr < band_sqr ){   /* is there a sig. intermediate point ? */
                /* ... no, so transfer current start point */
                index[n_dest] = start;
                n_dest++;
            }
            else{
                /* ... yes, so push two sub-sections on stack for further processing */
                n_stack++;
                sig_start[n_stack-1] = sig;
                sig_end[n_stack-1] = end;
                n_stack++;
                sig_start[n_stack-1] = start;
                sig_end[n_stack-1] = sig;
            }
        }
        else{
                /* ... no intermediate points, so transfer current start point */
                index[n_dest] = start;
                n_dest++;
        }
    }

    /* transfer last point */
    index[n_dest] = n_source-1;
    n_dest++;

    /* make return array */
    var r = new Array();
    for(var j=0; j < n_dest; j++)
        r.push(source[index[j]]);
    return r;
    
}

public setLogOut(){
this.signOutEmitter.emit();
}
  public setLoginStatus(loginStatus: boolean) {
    this.isLoggedInEmitter.emit(loginStatus);
  }
  public setPaidStatus(paidStatus: boolean)
  {
this.isPaidEmitter.emit(paidStatus);
  }
  public setNavigationalPage(option:string)
  {
   // debugger;
    this.navigationalPage.emit(option);
  }
  trim (str) {
  return str.replace(/^\s+|\s+$/gm,'');
}

rgbaToHex (rgba) {
    var parts = rgba.substring(rgba.indexOf("(")).split(","),
        r:any = parseInt(this.trim(parts[0].substring(1)), 10),
        g:any = parseInt(this.trim(parts[1]), 10),
        b:any = parseInt(this.trim(parts[2]), 10),
        a:any = parseFloat(this.trim(parts[3].substring(0, parts[3].length - 1))).toFixed(2);

    return ('#' + r.toString(16) + g.toString(16) + b.toString(16) + (a * 255).toString(16).substring(0,2));
}

getServiceDefaultInfoByUrl(domain:string){

    let data = new URLSearchParams();
 //data.append('lead_id',lead_id);
 data.append('domain',domain);
 //debugger;
  let websiteDefaultSettingsResp=this.http
    .post(this.registerationApiBaseUrl+'general/getServiceDefaultInfoByDomainUrl', data, this.headerOptions)
    .map(this.extractData)
    return websiteDefaultSettingsResp;
}
  // this could also be a private method of the component class
  private extractData(res: Response) {
   //debugger;
    return res.json();
  }
  private handleErrorObservable(error: Response | any) {
 //debugger;
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }
  private handleErrorPromise(error: Response | any) {

    console.error(error.message || error);
    return Promise.reject(error.message || error);
  }
}
