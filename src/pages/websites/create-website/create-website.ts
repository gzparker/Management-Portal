import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
  MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { FbConfirmPage } from '../../fb-confirm/fb-confirm';
import { AllWebsitesPage } from '../../websites/all-websites/all-websites';
import { EditLeadRoutingPage } from '../../leads/edit-lead-routing/edit-lead-routing';
import { AlertController } from 'ionic-angular';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";

import { UserVerificationPage } from '../../user-verification/user-verification';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';
/**
 * Generated class for the CreateWebsitePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-website',
  templateUrl: 'create-website.html',
})
export class CreateWebsitePage {
  public website_domain:string="";
  public identity_name:string="";
  public websiteCreateMsg:string="";
  public isActive:boolean=true;
  public intagent_website:boolean=true;
  public userId:string="";
  public website_a_record_location:string="";
  public identity_phone_number:string="";
  public homepage_description:string="";
  public homepageMeta_description:string="";
  public homepage_search_text:string="";
  public homepage_meta_title:string="";
  private CkeditorConfig = {uiColor: '#99000',removeButtons:'Underline,Subscript,Superscript,SpecialChar'
  ,toolbar: [
    { name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ 'Source'] },
    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', '-', 'RemoveFormat' ] },
    { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
    { name: 'links', items: [ 'Link', 'Unlink'] },
    { name: 'styles', items: ['Format', 'FontSize' ] }
  ]};
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController) {
      
  }

  ionViewDidLoad() {
    let member_id = this.storage.get('userId');
    //debugger;
    member_id.then((data) => {
      this.userId=data;
    });
  }
  
  homepageDescBlured(quill) {
    //console.log('editor blur!', quill);
  }
 
  homepageDescFocused(quill) {
    //console.log('editor focus!', quill);
  }
 
  homepageDescCreated(quill) {
   // this.editor = quill;
    //console.log('quill is ready! this is current quill instance object', quill);
  }
 
  homepageDescChanged(html) {
//debugger;
this.homepage_description=html;
 
  }
  homepageMetaDescBlured(quill) {
    //console.log('editor blur!', quill);
  }
 
  homepageMetaDescFocused(quill) {
    //console.log('editor focus!', quill);
  }
 
  homepageMetaDescCreated(quill) {
   // this.editor = quill;
    //console.log('quill is ready! this is current quill instance object', quill);
  }
 
  homepageMetaDescChanged(html) {
//debugger;
this.homepageMeta_description=html;
 
  }
  createWebsite():void{
    if(this.userId!=""){
    //this.domainAccess=this.localStorageService.get('domainAccess');
    let isActiveFinal="1";
    let intagentWebsiteFinal:number=1;
     //if(this.domainAccess)
     //{
       if(this.isActive==true)
       {
         isActiveFinal="1";
       }
       else
       {
         isActiveFinal="0";
       }
       if(this.intagent_website==true)
       {
intagentWebsiteFinal=1
       }
       else
       {
intagentWebsiteFinal=0;
       }
       if(this.website_domain.indexOf("http://www")<0 && this.website_domain.indexOf("https://www")<0)
       {
         //debugger;
         this.website_domain="http://www."+this.website_domain;
       }
       else
       {
         this.website_domain=this.website_domain;
       }
  this.userServiceObj.createWebsite(this.userId,isActiveFinal,this.website_domain,this.identity_name,
    intagentWebsiteFinal,this.website_a_record_location,this.identity_phone_number,this.homepage_description,
    this.homepageMeta_description,this.homepage_search_text,this.homepage_meta_title)
    .subscribe((result) => this.createWebsiteResp(result));
    // }
      }
  }
  createWebsiteResp(result:any):void{
 //debugger;
  this.websiteCreateMsg="Website has been created successfully.";
  this.ngZone.run(() => {
  this.navCtrl.push(EditLeadRoutingPage,{websiteId:result.website_id});
  });
  }
}
