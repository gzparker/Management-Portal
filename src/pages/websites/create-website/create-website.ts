import { Component, ViewChild, NgZone,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
  MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { FbConfirmPage } from '../../fb-confirm/fb-confirm';
import { AllWebsitesPage } from '../../websites/all-websites/all-websites';
import { EditLeadRoutingPage } from '../../leads/edit-lead-routing/edit-lead-routing';
import { AlertController } from 'ionic-angular';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";
import { PicturePopupPage } from '../../../pages/modal-popup/picture-popup/picture-popup';

import { UserVerificationPage } from '../../user-verification/user-verification';
import { ColorSelectionPopupPage } from '../../modal-popup/color-selection-popup/color-selection-popup';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';
/**
 * Generated class for the CreateWebsitePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var CKEDITOR: any;
declare var google: any;
declare var firebase:any;
@IonicPage()
@Component({
  selector: 'page-create-website',
  templateUrl: 'create-website.html',
})
export class CreateWebsitePage {
  @ViewChild('searchTargetCityBar', { read: ElementRef }) searchTargetCityBar: ElementRef
  searchTargetCityElement: HTMLInputElement = null;
  public website_domain:string="";
  public identity_name:string="";
  public websiteCreateMsg:string="";
  public isActive:boolean=true;
  public intagent_website:boolean=true;
  public userId:string="";
  public website_a_record_location:string="";
  public targetCityDummy:string="";
  public target_city:string="";
  public target_place_id:string="";
  public identity_phone_number:string="";
  public homepage_description:string="";
  public homepageMeta_description:string="";
  public homepage_search_text:string="";
  public homepage_meta_title:string="";
  public allMls:any[]=[];
  public mls_server_id:any[]=[];
  public office_id:string="";
  public broker_id:string="";
  public agent_id:string="";
  public service_id:string="";
  public colorBase:string="";
  public secondColor:string="";
  public thirdColor:string="";
  public headerColor:string="";
  public headerColorOption:string="";
  public textColor:string="";
  public textColorOption:string="";
  public buttonColor:string="";
  public buttonColorOption:string="";
  public backgroundColor:string="";
  public backgroundColorOption:string="";
  public sideBarMenuColor:string="";
  public sideBarMenuColorOption:string="";
  public contentTitleColor:string="";
  public contentTitleColorOption:string="";
  public paginationColor:string="";
  public paginationColorOption:string="";
  public modalBackgroundColor:string="";
  public modalBackgroundColorOption:string="";
  public mapSidebarColor:string="";
  public mapSidebarColorOption:string="";
  public isCustomColor:string="0";
  public login_register_popup_time:string="8000";
  public isSsl:boolean=false;
  public show_open_houses:boolean=false;
  public show_new_listings:boolean=false;
  public feature_agent_listings:boolean=false;
  public feature_broker_listings:boolean=false;
  public feature_office_listings:boolean=false;
  public customColorOption:boolean=false;
  public customColorOptionModal:boolean=false;
  public geoLocationOptions = {
    types: ['(cities)'],
    componentRestrictions: {country: "us"}
   };
  public CkeditorConfig = {removeButtons:'Underline,Subscript,Superscript,SpecialChar'
  ,toolbar: [
    { name: 'document', groups: [], items: ['Source'] },
    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline'] },
    { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
    { name: 'links', items: [] },
    { name: 'styles', items: ['Format', 'FontSize' ] }
  ]};
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController) {
      let generalWebsiteSettings = this.storage.get('generalWebsiteSettings');
    generalWebsiteSettings.then((data) => {
      this.service_id=data.service_id;
    });
  }

  ionViewDidLoad() {
    this.sharedServiceObj.updateColorThemeMethod(null);
    CKEDITOR.disableAutoInline = true;
    CKEDITOR.inline('homepage_description', {removeButtons:'Underline,Subscript,Superscript,SpecialChar'
    ,toolbar: [
      { name: 'document', groups: [], items: ['Source'] },
      { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline'] },
      { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
      { name: 'links', items: [] },
      { name: 'styles', items: ['Format', 'FontSize' ] }
    ]});
    let member_id = this.storage.get('userId');
    //debugger;
    member_id.then((data) => {
      this.userId=data;
    });
    this.initCityAutocomplete();
    this.loadAllAvailableMLS();
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  initCityAutocomplete(): void {
   
    this.searchTargetCityElement = this.searchTargetCityBar.nativeElement.querySelector('.searchbar-input');
    this.createCityAutocomplete(this.searchTargetCityElement).subscribe((location) => {
      
    });
  }
  createCityAutocomplete(addressEl: HTMLInputElement): Observable<any> {
    const autocomplete = new google.maps.places.Autocomplete(addressEl,this.geoLocationOptions);
    
    return new Observable((sub: any) => {
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          sub.error({
            message: 'Autocomplete returned place with no geometry'
          });
        } else {
          
          sub.next(place.geometry.location);
          this.getCityAddress(place);
          
        }
      });
    });
  }
  getCityAddress(data) {

    this.target_place_id=data.place_id;
    data.address_components.forEach(element => {
      if(element.types[0]=="locality")
      {
    this.target_city=element.long_name; 
      }
     });
    //debugger;
     }
  loadAllAvailableMLS()
  {
    this.subscriptionObj.loadAllAvailableMLS()
    .subscribe((result) => this.allAvailableMLSResp(result)); 
  }
  allAvailableMLSResp(resp: any)
  {
if(resp.status==true)
{
  this.allMls=resp.available_mls;
}
else
{
  this.allMls=[];
}
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
    let show_new_listing_dummy="0";
    let show_open_houses_dummy="0";
    let feature_agent_listings_dummy="0";
    let feature_broker_listings_dummy="0";
    let feature_office_listings_dummy="0";
    let isSsl_dummy="0";
    if(this.show_open_houses)
       {
         show_open_houses_dummy="1";
       }
       if(this.show_new_listings)
       {
        show_new_listing_dummy="1";
       }
       if(this.feature_agent_listings)
       {
        feature_agent_listings_dummy="1";
       }
       if(this.feature_broker_listings)
       {
        feature_broker_listings_dummy="1";
       }
       if(this.feature_office_listings)
       {
        feature_office_listings_dummy="1";
       }
       if(this.isSsl)
       {
        isSsl_dummy="1";
       }
    //this.domainAccess=this.localStorageService.get('domainAccess');
    let isActiveFinal="1";
    let intagentWebsiteFinal:number=1;
     //if(this.domainAccess)
     //{
       /*if(this.isActive==true)
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
       }*/
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
    intagentWebsiteFinal,this.website_a_record_location,this.identity_phone_number,document.getElementById("homepage_description").innerHTML,
    this.homepageMeta_description,this.homepage_search_text,this.homepage_meta_title,this.mls_server_id,
    this.agent_id,this.office_id,this.broker_id,this.headerColor,this.sideBarMenuColor,
    this.colorBase,this.secondColor,this.thirdColor,
    this.buttonColor,this.textColor,this.backgroundColor,this.headerColorOption,this.sideBarMenuColorOption,
    this.buttonColorOption,this.textColorOption,this.backgroundColorOption,this.customColorOptionModal,this.contentTitleColor,
    this.contentTitleColorOption,this.paginationColor,this.paginationColorOption,this.modalBackgroundColor,this.modalBackgroundColorOption,
    this.mapSidebarColor,this.mapSidebarColorOption,show_new_listing_dummy,show_open_houses_dummy,feature_agent_listings_dummy,
    feature_broker_listings_dummy,feature_office_listings_dummy,isSsl_dummy,this.login_register_popup_time,this.target_city,this.target_place_id)
    .subscribe((result) => this.createWebsiteResp(result));
    // }
      }
  }
  createWebsiteResp(result:any):void{
 //debugger;
  this.websiteCreateMsg="Website has been created successfully.";
  
  this.ngZone.run(() => {
    CKEDITOR.instances['homepage_description'].destroy(true);
  this.navCtrl.setRoot(EditLeadRoutingPage,{websiteId:result.website_id});
  });
  }
  ////////////////////////////////////////////////////////////////////////
  toggleCustomColor(){
    //this.customColorOption=!this.customColorOption;
   // debugger;
    if(this.customColorOption==true)
    {
      //this.customColorOption=false;
      //this.isCustomColor="0";
    }
    else
    {
      //this.customColorOption=true;
      //this.isCustomColor="1";
    }
      }
      showColorPopUp(option:string){
        var that=this;
        var selectedColor={
          option:"",
          selectedColorOption:"",
          selectedColor:""
        }
        if(option=='header_color')
        {
    selectedColor.option=option;
    selectedColor.selectedColorOption=this.headerColorOption;
    selectedColor.selectedColor=this.headerColor;
        }
        if(option=='side_bar_menu_color')
        {
    selectedColor.option=option;
    selectedColor.selectedColorOption=this.sideBarMenuColorOption;
    selectedColor.selectedColor=this.sideBarMenuColor;
        }
        if(option=='content_background_color')
        {
    selectedColor.option=option;
    selectedColor.selectedColorOption=this.backgroundColorOption;
    selectedColor.selectedColor=this.backgroundColor;
        }
        if(option=='button_color')
        {
    selectedColor.option=option;
    selectedColor.selectedColorOption=this.buttonColorOption;
    selectedColor.selectedColor=this.buttonColor;
        }
        if(option=='content_title_color')
        {
    selectedColor.option=option;
    selectedColor.selectedColorOption=this.contentTitleColorOption;
    selectedColor.selectedColor=this.contentTitleColor;
        }
        if(option=='pagination_color')
        {
    selectedColor.option=option;
    selectedColor.selectedColorOption=this.paginationColorOption;
    selectedColor.selectedColor=this.paginationColor;
        }
        if(option=='modal_background_color')
        {
    selectedColor.option=option;
    selectedColor.selectedColorOption=this.modalBackgroundColorOption;
    selectedColor.selectedColor=this.modalBackgroundColor;
        }
        if(option=='map_sidebar_color')
        {
    selectedColor.option=option;
    selectedColor.selectedColorOption=this.mapSidebarColorOption;
    selectedColor.selectedColor=this.mapSidebarColor;
        }
        var modalColor = this.modalCtrl.create(ColorSelectionPopupPage,{selectedColor:selectedColor});
        modalColor.onDidDismiss(data => {
         // console.log(data);
          //debugger;
          that.setColorProperties(data);
     });
        modalColor.present();
      }
      setColorProperties(options:any)
      {
    //debugger;
    if(options.option=='header_color')
    {
    this.headerColorOption=options.selectedColorOption;
    if(options.selectedColor!='')
    {
      this.headerColor=options.selectedColor;
     // debugger;
    }
    else
    {
    if(this.headerColorOption=="base_color")
    {
    this.headerColor=this.colorBase;
    }
    else if(this.headerColorOption=="secondary_color")
    {
    this.headerColor=this.secondColor;
    }
    else if(this.headerColorOption=="tertiary_color")
    {
    this.headerColor=this.thirdColor;
    //debugger;
    }
    else if(this.headerColorOption=="default")
    {
    this.headerColorOption="";
    this.headerColor="";
    }
    }
    //debugger;
    }
    else if(options.option=='side_bar_menu_color')
    {
      this.sideBarMenuColorOption=options.selectedColorOption;
      if(options.selectedColor!='')
    {
      this.sideBarMenuColor=options.selectedColor;
    }
    else
    {
    if(this.sideBarMenuColorOption=="base_color")
    {
    this.sideBarMenuColor=this.colorBase;
    }
    else if(this.sideBarMenuColorOption=="secondary_color")
    {
    this.sideBarMenuColor=this.secondColor;
    }
    else if(this.sideBarMenuColorOption=="tertiary_color")
    {
    this.sideBarMenuColor=this.thirdColor;
    }
    else if(this.sideBarMenuColorOption=="default")
    {
    this.sideBarMenuColorOption="";
    this.sideBarMenuColor="";
    }
    }
    }
    else if(options.option=='content_background_color')
    {
      this.backgroundColorOption=options.selectedColorOption;
      if(options.selectedColor!='')
    {
      this.backgroundColor=options.selectedColor;
    }
    else
    {
    if(this.backgroundColorOption=="base_color")
    {
    this.backgroundColor=this.colorBase;
    }
    else if(this.backgroundColorOption=="secondary_color")
    {
    this.backgroundColor=this.secondColor;
    }
    else if(this.backgroundColorOption=="tertiary_color")
    {
    this.backgroundColor=this.thirdColor;
    }
    else if(this.backgroundColorOption=="default")
    {
    this.backgroundColorOption="";
    this.backgroundColor="";
    }
    }
    }
    else if(options.option=='button_color')
    {
      this.buttonColorOption=options.selectedColorOption;
      if(options.selectedColor!='')
    {
      this.buttonColor=options.selectedColor;
    }
    else
    {
    if(this.buttonColorOption=="base_color")
    {
    this.buttonColor=this.colorBase;
    }
    else if(this.buttonColorOption=="secondary_color")
    {
    this.buttonColor=this.secondColor;
    }
    else if(this.buttonColorOption=="tertiary_color")
    {
    this.backgroundColor=this.thirdColor;
    }
    else if(this.buttonColorOption=="default")
    {
    this.buttonColorOption="";
    this.buttonColor="";
    }
    }
    }
    else if(options.option=='content_title_color')
    {
      this.contentTitleColorOption=options.selectedColorOption;
      if(options.selectedColor!='')
    {
      this.contentTitleColor=options.selectedColor;
    }
    else
    {
    if(this.contentTitleColorOption=="base_color")
    {
    this.contentTitleColor=this.colorBase;
    }
    else if(this.contentTitleColorOption=="secondary_color")
    {
    this.contentTitleColor=this.secondColor;
    }
    else if(this.contentTitleColorOption=="tertiary_color")
    {
    this.contentTitleColor=this.thirdColor;
    }
    else if(this.contentTitleColorOption=="default")
    {
    this.contentTitleColorOption="";
    this.contentTitleColor="";
    }
    }
    }
    else if(options.option=='pagination_color')
    {
      this.paginationColorOption=options.selectedColorOption;
      if(options.selectedColor!='')
    {
      this.paginationColor=options.selectedColor;
    }
    else
    {
    if(this.paginationColorOption=="base_color")
    {
    this.paginationColor=this.colorBase;
    }
    else if(this.paginationColorOption=="secondary_color")
    {
    this.paginationColor=this.secondColor;
    }
    else if(this.paginationColorOption=="tertiary_color")
    {
    this.paginationColor=this.thirdColor;
    }
    else if(this.paginationColorOption=="default")
    {
    this.paginationColorOption="";
    this.paginationColor="";
    }
    }
    }
    else if(options.option=='modal_background_color')
    {
      this.modalBackgroundColorOption=options.selectedColorOption;
      if(options.selectedColor!='')
    {
      this.modalBackgroundColor=options.selectedColor;
    }
    else
    {
    if(this.modalBackgroundColorOption=="base_color")
    {
    this.modalBackgroundColor=this.colorBase;
    }
    else if(this.modalBackgroundColorOption=="secondary_color")
    {
    this.modalBackgroundColor=this.secondColor;
    }
    else if(this.modalBackgroundColorOption=="tertiary_color")
    {
    this.modalBackgroundColor=this.thirdColor;
    }
    else if(this.modalBackgroundColorOption=="default")
    {
    this.modalBackgroundColorOption="";
    this.modalBackgroundColor="";
    }
    }
    }
    else if(options.option=='map_sidebar_color')
    {
      this.mapSidebarColorOption=options.selectedColorOption;
      if(options.selectedColor!='')
    {
      this.mapSidebarColor=options.selectedColor;
    }
    else
    {
    if(this.mapSidebarColorOption=="base_color")
    {
      this.mapSidebarColor=this.colorBase;
    }
    else if(this.mapSidebarColorOption=="secondary_color")
    {
      this.mapSidebarColor=this.secondColor;
    }
    else if(this.mapSidebarColorOption=="tertiary_color")
    {
      this.mapSidebarColor=this.thirdColor;
    }
    else if(this.mapSidebarColorOption=="default")
    {
      this.mapSidebarColorOption="";
      this.mapSidebarColor="";
    }
    }
    }
      }
  ///////////////////////////////////////////////////////////////////////
}
