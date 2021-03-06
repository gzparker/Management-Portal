import { Component, ViewChild, NgZone, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, MenuController,
  LoadingController,ToastController,ActionSheetController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { IMultiSelectOption,IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";

import { Observable } from 'rxjs/Observable';

import { Geolocation } from '@ionic-native/geolocation';
import { PicturePopupPage } from '../../../pages/modal-popup/picture-popup/picture-popup';
import { AllHotSheetsPage } from '../all-hot-sheets/all-hot-sheets';
import { AlertController } from 'ionic-angular';
import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { ListingProvider } from '../../../providers/listing/listing';
/**
 * Generated class for the CreateHotSheetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var CKEDITOR: any;
declare var google: any;
declare var latitudeSimplifier;
@Component({
  selector: 'page-create-hot-sheet',
  templateUrl: 'create-hot-sheet.html'
})
export class CreateHotSheetPage {
 
  @ViewChild('searchbar', { read: ElementRef }) searchbar: ElementRef;
  addressElement: HTMLInputElement = null;
  listSearch: string = '';
  public hideHeaderCropper:boolean=true;public hideCommunityCropper:boolean=true;public hideSlideShowCropper:boolean=true;
  public edit_header_image:boolean=false;public edit_community_image:boolean=false;public edit_slideshow_image:boolean=false;
  public crop_header_image:boolean=false;public crop_community_image:boolean=false;public crop_slideshow_image:boolean=false;
  public isHeaderExist:boolean=false;public headerCropperSettings;public communityCropperSettings;
  public slideShowCropperSettings;public croppedWidth:Number;public croppedHeight:Number;public dataHeaderImage:any;
  public dataCommunityImage:any;public dataSlideShowImage:any;public headerWidth:string="";public headerHeight:string="";
  public communityWidth:string="";public communityHeight:string="";public slideShowWidth:string="";public slideShowHeight:string="";
  public meta_title:string="";public meta_description:string="";
  public multiSelect:IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 3,
    displayAllSelectedText: true
};
public isApp=false;public isWebBrowser=false;public msl_id:string="";public name:string="";public hotsheet_Title:string="";
  public advanceSearchOption:boolean=false;public additionalInfoOption:boolean=false;public hotsheetCreateMsg:string="";
  public slug:string="";public allWebsiteList:any[]=[];public selectedWebsite:string="";public bedrooms:string="";
  public bathrooms:string="";public address:string="";public address_country:string="";public address_township:string="";
  public basement:string="";public date_listed:Date;public days_on_market:string="";public garage_size:string="";
  public unit_size_min:string="";public unit_size_max:string="";public lot_size_modal:string="0";public lot_size_min:string="";
  public lot_size_max:string="";public lot_size_type:string="sqft";public year_built_min:string="";public year_built_max:string="";
  public dols:string="-1";public parcel_num:string="";public school_district:string="";public school_elem:string="";
  public school_high:string="";public stories:string="";public year_built:string="";public status:any[]=[];
  public geoLocationOptions = {
    types: ['(cities)'],
    componentRestrictions: {country: "us"}
   };
  public statusOptions:any[]=[{id:"all",name:"All"},{id:"for_sale",name:"For Sale"},{id:"for_rent",name:"For Rent"},
  {id:"pending",name:"Pending"},{id:"recently_sold",name:"Recently Sold"},{id:"pre_selling",name:"Pre Selling"},{id:"buy_me_out",name:"Buy Me Out"}
  ,{id:"rent_to_own",name:"Rent to own"}];
  public homeTypeOptions:any[]=[{id:"house",name:"Houses"},{id:"cnd",name:"Condos/Apartments"},{id:"land",name:"Lots/Land"},
  {id:"comm",name:"Commercial"}];
  public listingTypeOptions:any[]=[{id:"for_sale",name:"For Sale"},{id:"for_rent",name:"For Rent"},{id:"recently_sold",name:"Recently Sold"}];
  public lotSizeOptions:any[]=[{id:"0",name:"Any"},{id:"2000",name:"2000+ sqft"},{id:"3000",name:"3,000+ sqft"},
  {id:"4000",name:"4,000+ sqft"},{id:"5000",name:"5,000+ sqft"},{id:"7500",name:"7,500+ sqft"},{id:"10890",name:".25+ acre / 10,890+ sqft"}
  ,{id:"21780",name:".5+ acre / 21,780+ sqft"},{id:"43560",name:"1+ acre"},{id:"87120",name:"2+ acres"},{id:"217800",name:"5+ acres"},
  {id:"435600",name:"10+ acres"},{id:"custom",name:"Custom size"}];
  public CkeditorConfig = {removeButtons:'Underline,Subscript,Superscript,SpecialChar'
  ,toolbar: [
    { name: 'document', groups: [], items: ['Source'] },
    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline'] },
    { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
    { name: 'links', items: [] },
    { name: 'styles', items: ['Format', 'FontSize' ] }
  ]};
  public status_modal:string="all";public status_last_searched:string="";public address_city:any[]=[];
  public address_city_options:any[]=[];public address_city_modal:any[]=[];public address_city_last_searched:any[]=[];
  public address_subdivision:any[]=[];public address_subdivision_options:any[]=[];public address_subdivision_modal:any[]=[];
  public address_subdivision_last_searched:any[]=[];public price:any={lower: 0, upper: 600000000};
  public listing_type:any[]=["for_sale","for_rent","recently_sold"];public home_type_modal:any[]=["house","cnd","land","comm"];
  public address_zip_code:any[]=[];public address_zip_code_options:any[]=[];public address_zip_code_modal:any[]=[];
  public address_zip_code_last_searched:any[]=[];public neighbourhood:any[]=[];public neighbourhood_options:any[]=[];
  public neighbourhood_modal:any[]=[];public neighbourhood_last_searched:any[]=[];public google_address:string="";
  public google_dist:string="";public google_prov:string="";public google_country:string="";public searchListObject:any;
  public selectedSearch : boolean=false;public showUpdateButton : boolean=true;public selectedLat:string="";
  public selectedLong:string="";public userId:string="";public brief_description:string="";public main_description:string="";
  public virtual_tour_url:string="";public video_url:string="";public city:string="";public sub_city:string="";
  public polygon_search:any="";public headerImage:string="";public communityImage:string="";public showCustom:boolean=false;
  public communityImageArray:string[]=[];public dataCommunityImageArray:any[]=[];public slideShowImage:string="";
  public slideShowImageArray:string[]=[];public dataSlideShowImageArray:any[]=[];public allAgents:any[]=[];
  public assigned_agent_id:any[]=[];public listing_size_min:string="";public listing_size_max:string="";
  public local:string="";public neighbourhoodAddress:string="";public administrative_area_level_1:string="";
  public community:string="";public zoom: number = 8;public drawingManager:any;public isDrawing:boolean = false;
  public latitude: number = 51.673858;public longitude: number = 7.815982;public polygons:any[] = [];
  public toDrawing = false;public move:any=null;public mouseUp:any=null;public poly:any;public map_height:number;
  public parent_id:string="";public headerImageChangedEvent:any='';public communityImageChangedEvent:any='';
  public allListingTypeChecked:boolean=false;public allHotSheetList:any[]=[];public validYear:boolean=true;
  public validPrice:boolean=true;
  
  public mapLocation:any;public loader:any;
  public north_east_lat:any;public north_east_lon:any;public south_west_lat:any;public south_west_lon:any;
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  constructor(private geolocation: Geolocation,public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform
    ,public listinServiceObj:ListingProvider,public actionsheetCtrl: ActionSheetController,
    private crop: Crop,private camera: Camera,private imagePicker: ImagePicker,
    public loadingCtrl: LoadingController,private toastCtrl: ToastController) {
      this.isApp = (!document.URL.startsWith("http"));
      this.hideCommunityCropper=false;
      this.hideHeaderCropper=false;
      this.hideSlideShowCropper=false;
      if(this.platform.is('core')) {
        this.isWebBrowser=true;
      }
      this.headerCropperSettings = new CropperSettings();
      this.headerCropperSettings.width = 100;
      this.headerCropperSettings.height = 100;
      this.headerCropperSettings.croppedWidth = 1280;
      this.headerCropperSettings.croppedHeight = 1000;
      this.headerCropperSettings.canvasWidth = 500;
      this.headerCropperSettings.canvasHeight = 300;
      this.headerCropperSettings.minWidth = 10;
      this.headerCropperSettings.minHeight = 10;
  
      this.headerCropperSettings.rounded = false;
      this.headerCropperSettings.keepAspect = false;
  
      this.headerCropperSettings.noFileInput = true;

      this.communityCropperSettings = new CropperSettings();
      this.communityCropperSettings.width = 100;
      this.communityCropperSettings.height = 100;
      this.communityCropperSettings.croppedWidth = 1280;
      this.communityCropperSettings.croppedHeight = 1000;
      this.communityCropperSettings.canvasWidth = 500;
      this.communityCropperSettings.canvasHeight = 300;
      this.communityCropperSettings.minWidth = 10;
      this.communityCropperSettings.minHeight = 10;
  
      this.communityCropperSettings.rounded = false;
      this.communityCropperSettings.keepAspect = false;
  
      this.communityCropperSettings.noFileInput = true;

      this.slideShowCropperSettings = new CropperSettings();
      this.slideShowCropperSettings.width = 100;
      this.slideShowCropperSettings.height = 100;
      this.slideShowCropperSettings.croppedWidth = 1280;
      this.slideShowCropperSettings.croppedHeight = 1000;
      this.slideShowCropperSettings.canvasWidth = 500;
      this.slideShowCropperSettings.canvasHeight = 300;
      this.slideShowCropperSettings.minWidth = 10;
      this.slideShowCropperSettings.minHeight = 10;
  
      this.slideShowCropperSettings.rounded = false;
      this.slideShowCropperSettings.keepAspect = false;
  
      this.slideShowCropperSettings.noFileInput = true;
      this.dataHeaderImage= {};
      this.dataCommunityImage={};
      this.dataSlideShowImage={};
      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 5000
      });
    }

  ionViewDidLoad() {
    //debugger;
    let that=this;
    this.sharedServiceObj.updateColorThemeMethod(null);
    CKEDITOR.disableAutoInline = true;
    CKEDITOR.inline( 'brief_description', {removeButtons:'Underline,Subscript,Superscript,SpecialChar'
    ,toolbar: [
      { name: 'document', groups: [], items: ['Source'] },
      { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline'] },
      { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
      { name: 'links', items: [] },
      { name: 'styles', items: ['Format', 'FontSize' ] }
    ]});
    CKEDITOR.inline( 'main_description', {removeButtons:'Underline,Subscript,Superscript,SpecialChar'
    ,toolbar: [
      { name: 'document', groups: [], items: ['Source'] },
      { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline'] },
      { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
      { name: 'links', items: [] },
      { name: 'styles', items: ['Format', 'FontSize' ] }
    ]});
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
      this.getAllWebsite();
      this.loadAllAgents();
      this.viewAllHotSheets();
    });
    
      if(!this.isWebBrowser)
    {
      if (window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition((position)=> {
      if(position.coords.latitude!=undefined&&position.coords.longitude!=undefined)
      {
        this.map_height=400;
        this.loadMap(position.coords.latitude, position.coords.longitude);
        this.initAutocomplete();
      }
    }, function() {
       
    }, {maximumAge:0, timeout:10000});
  } else {
    // Browser doesn't support Geolocation
  }
}
else
{
 
  this.geolocation.getCurrentPosition(that.sharedServiceObj.geooptions).then((position) => {
    if(position.coords.latitude!=undefined&&position.coords.longitude!=undefined)
      {
     //   debugger;
        this.map_height=400;
        this.loadMap(position.coords.latitude, position.coords.longitude);
        this.initAutocomplete();
      }
  });
}
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  setCurrenttPosition(result:any)
  {

  }
  setHotSheetDefaultTitle()
  {
   // debugger;
   if(this.hotsheet_Title=="")
   {
    this.hotsheet_Title=this.name;
   }
  else if(this.hotsheet_Title==this.name.substring(0,this.name.length-1))
    {
      this.hotsheet_Title=this.name;
    }
  }
  viewAllHotSheets():void{
    if(this.userId!="")
    {
      
      this.allHotSheetList=[];
    //debugger;
  this.userServiceObj.allUserHotSheets(this.userId.toString())
    .subscribe((result) => this.viewAllHotSheetResp(result));
    }
    
  }
  viewAllHotSheetResp(result:any):void{
    
    if(result.status==true)
    {
      
     //debugger;
      this.allHotSheetList=result.result;
      
    }
    else
    {
      //debugger;
      this.allHotSheetList=[];
  
    }
    
  }
  validateYear(){
    //debugger;
//this.validYear=true;
if(this.year_built_max<this.year_built_min)
    {
      this.validYear=false;
    }
else{
  this.validYear=true;
}
  }
  validatePropertySize(){
    //debugger;
    if(this.unit_size_max<this.unit_size_min)
    {
      this.validPrice=false;
    }
else{
  this.validPrice=true;
}
  }
  mapsSearchBar(ev: any) {
    // set input to the value of the searchbar
    //this.search = ev.target.value;
    //console.log(ev);
    const autocomplete = new google.maps.places.Autocomplete(ev,this.geoLocationOptions);
    autocomplete.bindTo('bounds', this.map);
    return new Observable((sub: any) => {
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          sub.error({
            message: 'Autocomplete returned place with no geometry'
          });
        } else {
          sub.next(place.geometry.location);
          sub.complete();
        }
      });
    });
  }

  initAutocomplete(): void {
   
    this.addressElement = this.searchbar.nativeElement.querySelector('.searchbar-input');
    
    this.createAutocomplete(this.addressElement).subscribe((location) => {
      //console.log('Searchdata', location);

      let options = {
        center: location,
        zoom: 10
      };
      this.map.setOptions(options);
     // this.addMarker(location, "Mein gesuchter Standort");

    });
  }

  createAutocomplete(addressEl: HTMLInputElement): Observable<any> {
    const autocomplete = new google.maps.places.Autocomplete(addressEl,this.geoLocationOptions);
    autocomplete.bindTo('bounds', this.map);
    return new Observable((sub: any) => {
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          sub.error({
            message: 'Autocomplete returned place with no geometry'
          });
        } else {
          
          sub.next(place.geometry.location);
          this.getAddress(place);
          //sub.complete();
        }
      });
    });
  }
  loadMap(lat:any,lng:any){
 //debugger;
   // this.geolocation.getCurrentPosition().then((position) => {
 //debugger;
      //let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let latLng = new google.maps.LatLng(lat, lng);
      let mapOptions = {
        center: latLng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.MAP,
        mapTypeControl: false,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_CENTER
        },
        zoomControl: true,
        zoomControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.LEFT_TOP
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
          position: google.maps.ControlPosition.LEFT_TOP
        }
      };
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  
     this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.POLYGON
        ]
      }
    });
      this.drawingManager.setMap(null);
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
      var centerControlDiv:any = document.createElement('div');
      centerControlDiv.id = 'map-control-container';
     this.CenterControl(centerControlDiv, this.map);
      centerControlDiv.index = 1;
      this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);
      google.maps.event.addDomListener(this.map, 'mousedown', this.mouseDownCallBack.bind(this));
      google.maps.event.addDomListener(this.map, 'idle', this.setMapCoordinates.bind(this));
  }
  mouseDownCallBack(e:any)
  {
   if (!this.toDrawing) return;
   this.map.setOptions({
     draggable: false 
   });
   this.mouseUp=google.maps.event.addListener(this.map, 'mouseup',this.mouseUpCallBack.bind(this));
   this.move = google.maps.event.addListener(this.map, 'mousemove',this.mouseMoveCallBack.bind(this));
  }
  mouseUpCallBack(e:any)
  {
    google.maps.event.removeListener(this.mouseUp);
    google.maps.event.removeListener(this.move);
    var path = this.poly.getPath();
    var ArrayforPolygontoUse= this.sharedServiceObj.simplyfierLatitude(path.j,12.5);
  
    path.j=ArrayforPolygontoUse;
  this.poly.setMap(null);
  this.poly = new google.maps.Polygon({
      map: this.map,
      path: path
    });
    this.polygons.push(this.poly);
    this.polygons[0].getPath().getArray();
          if(this.polygons[0].getPath().getArray().length>0)
          {
            this.polygons[0].getPath().getArray().forEach(element => {
            this.polygon_search+= element.lat() + " " + element.lng() + ",";
            });
          }
          this.map.setOptions({
            draggable: true
          });
          this.toDrawing = false;
          this.ngZone.run(() => {
          this.polygon_search = this.polygon_search.substring(0, this.polygon_search.length - 1);
          });
    
  }
  mouseMoveCallBack(e:any)
  {
    //debugger;
    this.poly.getPath().push(e.latLng);
  }
 CenterControl(controlDiv, map) {
  // debugger;
    // Map Controls
    // Zoom In DIV
    //let _thisNew=this;
    var controlUI = document.createElement('div');
    controlUI.id = 'Map-Zoom-In';
    controlUI.title = 'Zoom IN';
    controlDiv.appendChild(controlUI);
    //debugger;
    // Draw Map DIV
    var controlUI3 = document.createElement('div');
    controlUI3.id = 'Map-Draw';
    controlUI3.title = 'Draw';
    controlDiv.appendChild(controlUI3);
    // Draw Map Icon
    var controlText3 = document.createElement('div');
    controlText3.innerHTML = '<div id="map-draw-icon">Draw</div>';
    controlUI3.appendChild(controlText3);
    // Setup the click event listeners: simply set the map to
    // Chicago
    
    google.maps.event.addDomListener(controlUI3, 'click', () => {
      if (this.isDrawing) {
        
        this.stopDrawing();
       
      } else {
      this.startDrawing();
      this.poly = new google.maps.Polyline({
        map: map,
        clickable: false
      });
      this.isDrawing = true;
      map.setOptions({
        draggable: false
      });
    //  setTimeout(function () {
        console.log('draw Start');
        this.toDrawing = true;
     // }, 100);
      
      }
    });
  }
 startDrawing() {
    // drawingManager.setMap(map);
   //debugger;
    this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    this.map.setOptions({
      draggable: false
    });
    this.poly = new google.maps.Polyline({
      map: this.map,
      clickable:false
   });

  this.isDrawing = true;

 
  //debugger;
  }
  
  stopDrawing() {
   //debugger;
   this.isDrawing = false;
   if(this.drawingManager!=undefined)
   {
    this.drawingManager.setDrawingMode(null);
   }
   if(this.poly!=undefined)
   { 
    this.poly.setMap(null);
   }
   if(this.map!=undefined)
   {
   this.map.setOptions({
   draggable: true
   });
   google.maps.event.removeListener(this.move);
  google.maps.event.removeListener(this.mouseUp);
  }
  if(this.polygons.length>0)
  {
    for (let i = 0; i < this.polygons.length; i++) {
      this.polygons[i].setMap(null);
    }
    this.polygons = [];
  }
  this.ngZone.run(() => {
  this.polygon_search="";
  });
    
  }
 
  ////////////////////////////////
  changePrice($event:any)
  {
//debugger;
  }
  onHotSheetBreifDescBlured(quill) {
    //console.log('editor blur!', quill);
  }
 
  onHotSheetBreifDescFocused(quill) {
    //console.log('editor focus!', quill);
  }
 
  onHotSheetBreifDescCreated(quill) {
   // this.editor = quill;
    //console.log('quill is ready! this is current quill instance object', quill);
  }
 
  onHotSheetBreifDescChanged(html) {
//debugger;
this.brief_description=html;
 
  }
  onHotSheetDescBlured(quill) {
    //console.log('editor blur!', quill);
  }
 
  onHotSheetDescFocused(quill) {
    //console.log('editor focus!', quill);
  }
 
  onHotSheetDescCreated(quill) {
   // this.editor = quill;
    //console.log('quill is ready! this is current quill instance object', quill);
  }
 
  onHotSheetDescChanged(html) {
//debugger;
this.main_description=html;
 
  }

  onHotSheetMetaDescBlured(quill) {
    //console.log('editor blur!', quill);
  }
 
  onHotSheetMetaDescFocused(quill) {
    //console.log('editor focus!', quill);
  }
 
  onHotSheetMetaDescCreated(quill) {
   // this.editor = quill;
    //console.log('quill is ready! this is current quill instance object', quill);
  }
 
  onHotSheetMetaDescChanged(html) {
//debugger;
this.meta_description=html;
 
  }
  toggleAdvanceSearch(){
//this.advanceSearchOption=!this.advanceSearchOption;
if(this.advanceSearchOption==true)
    {
      this.advanceSearchOption=false;
    }
    else
    {
      this.advanceSearchOption=true;
    }
  }
  toggleAdditionalInfo(){
    if(this.additionalInfoOption==true)
    {
      this.additionalInfoOption=false;
    }
    else
    {
      this.additionalInfoOption=true;
    }
    //this.additionalInfoOption=!this.additionalInfoOption;
      }
  loadSearchedField():void{
    //if(this.localStorageService.get("searchFieldsLocal")==undefined)
    //{
    // this.listinServiceObj.getAvailableSearchFields()
      //.subscribe((result) => this.loadAvailableSearchFields(result));
    //}
    //else
    //{
      //this.loadSavedSearchedFields();
    //}
    }
    getAllWebsite():void{
      if(this.userId!="")
      { 
        this.loader.present();
    this.userServiceObj.allUserWebsites(this.userId.toString())
      .subscribe((result) => this.getAllWebsiteResp(result));
      }
    }
    getAllWebsiteResp(result:any):void{
      //debugger;
      if(result.status==true)
      {
       // debugger;
        this.allWebsiteList=result.result;
        if(this.allWebsiteList.length==1)
        {
          this.selectedWebsite=this.allWebsiteList[0].id;
        }
      }
      
    }
    loadAllAgents()
{
  if(this.userId.toString())
  {
    let generalWebsiteSettings = this.storage.get('generalWebsiteSettings');
        generalWebsiteSettings.then((data) => {
    this.userServiceObj.viewMemberAgents(this.userId.toString(),data.service_id)
  .subscribe((result) => this.loadAllAgentsResp(result));
        });
  }
  
}
loadAllAgentsResp(result:any)
{
  this.loader.dismiss();
  //debugger;
  if(result.status==true)
  {
   //debugger;
    this.allAgents=result.results;
    
  }
  else
  {
  // debugger;
    this.allAgents=[];
  }
}
    onWebsiteSelection($event:any):void{
       this.selectedWebsite=$event;
    }
    getAddress(data) {
    
     this.address=data.formatted_address;
      this.selectedLat=data.geometry.location.lat();
      this.selectedLong=data.geometry.location.lng();
      this.local='';
      this.neighbourhoodAddress='';
      this.slug="";

      data.address_components.forEach(element => {

        if(element.types[0]=="locality")
        {

          this.local=element.long_name;
this.city=element.long_name;

        }
        if(element.types[0]=="neighborhood")
        {
          this.neighbourhoodAddress=element.long_name;
          this.sub_city=element.long_name; 
        }
        if(element.types[0]=="administrative_area_level_1")
        {
          this.administrative_area_level_1=element.long_name;
        }
        

       });
     
       if(this.selectedLong!="")
       {
         this.map_height=400;
         this.stopDrawing();
         this.loadMap(this.selectedLat,this.selectedLong);
       }
       
       this.setSlugValue();
     
      }
    setSlugValue(){
     let localParts=this.local.split(' ');
     this.local='';
     for(let i=0;i<=localParts.length-1;i++)
      {
        if(this.local=='')
        {
          this.local=localParts[i];
        }
        else
        {
          this.local=this.local+"-"+localParts[i];
        }
      }
    let neighbourhoodAddressParts=this.neighbourhoodAddress.split(' ');
     this.neighbourhoodAddress='';
     for(let i=0;i<=neighbourhoodAddressParts.length-1;i++)
      {
        if(this.neighbourhoodAddress=='')
        {
          this.neighbourhoodAddress=neighbourhoodAddressParts[i];
        }
        else
        {
          this.neighbourhoodAddress=this.neighbourhoodAddress+"-"+neighbourhoodAddressParts[i];
        }
      }
      if(this.neighbourhoodAddress!='')
      {
        this.slug=this.local+"/"+this.neighbourhoodAddress;
      }
      else
      {
        this.slug=this.local;
      }
      this.ngZone.run(() => {
        this.polygon_search="";
        this.slug=this.slug.toLocaleLowerCase();
        });
      
    }  
    loadSavedSearchedFields():void{
      this.storage.get("searchFieldsLocal").then((data)=>{
        if(data != null)
        {
          //debugger;
          this.setSearchedFields(data);
        }
      
      });
    }
    loadAvailableSearchFields(result:any):void{
     // debugger;
      this.storage.get("searchFieldsLocal").then((data)=>{
        if(data!=null)
        {
          if(JSON.stringify(result)==JSON.stringify(data))
    {
    
    }
    else
    {
      
    this.storage.set("searchFieldsLocal",result);
    this.setSearchedFields(result);
    }
        }
        else
        {
          this.storage.set("searchFieldsLocal",result);
          this.setSearchedFields(result);
        }
      });
     
    }
    setMapCoordinates(e:any)
   {
    //debugger;
    this.selectedLat=this.map.center.lat();
    this.selectedLong=this.map.center.lng();
    this.mapLocation=this.map.getBounds().getSouthWest().lat().toString()+","+this.map.getBounds().getSouthWest().lng().toString()
    +","+this.map.getBounds().getNorthEast().lat().toString()+","+this.map.getBounds().getNorthEast().lng();
  this.north_east_lat=this.map.getBounds().getNorthEast().lat();
  this.north_east_lon=this.map.getBounds().getNorthEast().lng();
  this.south_west_lat=this.map.getBounds().getSouthWest().lat();
  this.south_west_lon=this.map.getBounds().getSouthWest().lng();
   }
    allListingTypeSelected()
    {
     // debugger;
this.allListingTypeChecked=true;
    }
    setSearchedFields(result:any):void{
     //debugger;
      ///////////////////////Load Text Boxes///////////////////////////////////
      
      this.msl_id=result.searchFieldsJson.mls_id;
      
      this.bedrooms=result.searchFieldsJson.bedrooms;
      this.bathrooms=result.searchFieldsJson.bathrooms;
      //debugger;
      this.address=result.searchFieldsJson.address;
      this.address_country=result.searchFieldsJson.address_country;
     // this.address_township=result.searchFieldsJson.address_township;
      this.basement=result.searchFieldsJson.basement;
     
      this.days_on_market=result.searchFieldsJson.days_on_market;
      this.garage_size=result.searchFieldsJson.garage_size;
     // this.listing_size=result.searchFieldsJson.listing_size;
     if(result.searchFieldsJson.lot_size_min!=undefined)
       {
         this.lot_size_min=result.searchFieldsJson.lot_size_min;
       }
       if(result.searchFieldsJson.lot_size_max!=undefined)
       {
         this.lot_size_max=result.searchFieldsJson.lot_size_max;
       }
       if(result.searchFieldsJson.lot_size_type!=undefined)
       {
         this.lot_size_type=result.searchFieldsJson.lot_size_type;
       }
      /*this.lot_size_min=result.searchFieldsJson.lot_size_min;
      this.lot_size_max=result.searchFieldsJson.lot_size_max;*/
      if(result.searchFieldsJson.lot_size)
      {
this.lot_size_modal=result.searchFieldsJson.lot_size;
      }
      if(result.searchFieldsJson.home_type)
         {
           this.home_type_modal=result.searchFieldsJson.home_type;
         }
        if(result.searchFieldsJson.listing_type)
         {
           this.listing_type=result.searchFieldsJson.listing_type;
         }
      this.parcel_num=result.searchFieldsJson.parcel_num;
      //this.school_district=result.searchFieldsJson.school_district;
     // this.school_elem=result.searchFieldsJson.school_elem;
      this.school_high=result.searchFieldsJson.school_high;
      this.year_built=result.searchFieldsJson.year_built;
      this.stories=result.searchFieldsJson.stories;
      ////////////////////////////////////////////////////////////////////////
      ///////////////////////Load Drop Downs///////////////////////////////////
      if(result.searchFieldsJson.address_city!=undefined)
      {
        let optionsArray:any[]=[];
      this.address_city=result.searchFieldsJson.address_city;
    //  debugger;
      for(let i=0;i<this.address_city.length;i++){
        
           let obj={id:this.address_city[i],name:this.address_city[i]};
           optionsArray.push(obj);
         }
         this.address_city_options=optionsArray;
     
      }
      if(result.searchFieldsJson.status!=undefined)
      {
      }
      if(result.searchFieldsJson.address_subdivision!=undefined)
      {
      
      let optionsArray:any[]=[];
      this.address_subdivision=result.searchFieldsJson.address_subdivision;
      for(let i=0;i<this.address_subdivision.length;i++){
        
           let obj={id:this.address_subdivision[i],name:this.address_subdivision[i]};
           optionsArray.push(obj);
         }
         this.address_subdivision_options=optionsArray;
      }
      if(result.searchFieldsJson.address_zip_code!=undefined)
      {
      let optionsArray:any[]=[];
      this.address_zip_code=result.searchFieldsJson.address_zip_code;
      for(let i=0;i<this.address_zip_code.length;i++){
        
           let obj={id:this.address_zip_code[i],name:this.address_zip_code[i]};
           optionsArray.push(obj);
         }
         this.address_zip_code_options=optionsArray;
      }
      if(result.searchFieldsJson.neighborhood!=undefined)
      {
      let optionsArray:any[]=[];
      this.neighbourhood=result.searchFieldsJson.neighborhood;
      for(let i=0;i<this.neighbourhood.length;i++){
        
           let obj={id:this.neighbourhood[i],name:this.neighbourhood[i]};
           optionsArray.push(obj);
         }
         this.neighbourhood_options=optionsArray;
      }
      if(result.searchFieldsJson.north_east_lat!=undefined)
         {
           this.north_east_lat=result.searchFieldsJson.north_east_lat;
         }
         if(result.searchFieldsJson.north_east_lon!=undefined)
         {
           this.north_east_lon=result.searchFieldsJson.north_east_lon;
         }
         if(result.searchFieldsJson.south_west_lat!=undefined)
         {
           this.south_west_lat=result.searchFieldsJson.south_west_lat;
         }
         if(result.searchFieldsJson.south_west_lon!=undefined)
         {
           this.south_west_lon=result.searchFieldsJson.south_west_lon;
         }
      /////////////////////////////////////////////////////////////////////////
    }
    loadLastSearchedValue():void{
      let lastSearchedObj=null;
      let lastSearchedString=null;
    this.storage.get('searchFilterObj').then((data) => {
      if(data!=null)
      {
     lastSearchedString=data;
      }
    });

    lastSearchedObj=JSON.parse(JSON.parse(JSON.stringify(lastSearchedString)));
    if(lastSearchedObj!=null)
    {
      if(lastSearchedObj)
      {
         if(lastSearchedObj.bedrooms)
         {
           this.bedrooms=lastSearchedObj.bedrooms;
         }
         if(lastSearchedObj.bedrooms)
         {
           this.bathrooms=lastSearchedObj.bathrooms;
         }
         if(lastSearchedObj.msl_id)
         {
           this.msl_id=lastSearchedObj.msl_id;
         }
         if(lastSearchedObj.address)
         {
          
           this.address=lastSearchedObj.address;
         }
        
        if(lastSearchedObj.address_township)
         {
           this.address_township=lastSearchedObj.address_township;
         }
         if(lastSearchedObj.days_on_market)
         {
           this.days_on_market=lastSearchedObj.days_on_market;
         }
        if(lastSearchedObj.date_listed)
         {
           this.date_listed=new Date(lastSearchedObj.date_listed);
         }
         if(lastSearchedObj.garage_size)
         {
           this.garage_size=lastSearchedObj.garage_size;
         }
         if(lastSearchedObj.listing_size)
         {
         }
         if(lastSearchedObj.lot_size)
      {
this.lot_size_modal=lastSearchedObj.lot_size;
      }
         if(lastSearchedObj.lot_size_min)
         {
           this.lot_size_min=lastSearchedObj.lot_size_min;
         }
         if(lastSearchedObj.lot_size_max)
         {
           this.lot_size_max=lastSearchedObj.lot_size_max;
         }
         if(lastSearchedObj.lot_size_type)
         {
           this.lot_size_type=lastSearchedObj.lot_size_type;
         }
         if(lastSearchedObj.parcel_num)
         {
           this.parcel_num=lastSearchedObj.parcel_num;
         }
         if(lastSearchedObj.school_district)
         {
           this.school_district=lastSearchedObj.school_district;
         }
         if(lastSearchedObj.school_elem)
         {
           this.school_elem=lastSearchedObj.school_elem;
         }
         if(lastSearchedObj.school_elem)
         {
           this.school_elem=lastSearchedObj.school_elem;
         }
         if(lastSearchedObj.school_high)
         {
           this.school_high=lastSearchedObj.school_high;
         }
         if(lastSearchedObj.school_high)
         {
           this.school_high=lastSearchedObj.school_high;
         }
         if(lastSearchedObj.school_high)
         {
           this.school_high=lastSearchedObj.school_high;
         }
         if(lastSearchedObj.school_high)
         {
           this.school_high=lastSearchedObj.school_high;
         }
         if(lastSearchedObj.stories)
         {
           this.stories=lastSearchedObj.stories;
         }
         if(lastSearchedObj.home_type)
         {
           this.home_type_modal=lastSearchedObj.home_type;
         }
        if(lastSearchedObj.listing_type)
         {
           this.listing_type=lastSearchedObj.listing_type;
         }
         if(lastSearchedObj.status)
         {
          
           this.status_last_searched=lastSearchedObj.status;
           
           this.status_modal=this.status_last_searched;
         }
         if(lastSearchedObj.address_city)
         {
           this.address_city_last_searched=lastSearchedObj.address_city;
           this.address_city_modal=this.address_city_last_searched;
         }
         if(lastSearchedObj.address_subdivision)
         {
           this.address_subdivision_last_searched=lastSearchedObj.address_subdivision;
           this.address_subdivision_modal=this.address_subdivision_last_searched;
         }
         if(lastSearchedObj.address_zip_code)
         {
           this.address_zip_code_last_searched=lastSearchedObj.address_zip_code;
           this.address_zip_code_modal=this.address_zip_code_last_searched;
         }
         if(lastSearchedObj.neighborhood)
         {
           this.neighbourhood_last_searched=lastSearchedObj.neighborhood;
           this.neighbourhood_modal=this.neighbourhood_last_searched;
         }
         if(lastSearchedObj.selectedLat)
         {
           this.selectedLat=lastSearchedObj.selectedLat;
         }
         if(lastSearchedObj.selectedLong)
         {
           this.selectedLong=lastSearchedObj.selectedLong;
         }
         if(lastSearchedObj.north_east_lat!=undefined)
         {
           this.north_east_lat=lastSearchedObj.north_east_lat;
         }
         if(lastSearchedObj.north_east_lon!=undefined)
         {
           this.north_east_lon=lastSearchedObj.north_east_lon;
         }
         if(lastSearchedObj.south_west_lat!=undefined)
         {
           this.south_west_lat=lastSearchedObj.south_west_lat;
         }
         if(lastSearchedObj.south_west_lon!=undefined)
         {
           this.south_west_lon=lastSearchedObj.south_west_lon;
         }
      }
    }
    
    }
    updateSearchObject():void{
      let isAllSelected:boolean=false;
      let finalPrice=this.price.lower.toString()+"-"+this.price.upper.toString();
          if(this.lot_size_modal=="custom")
      {
        this.showCustom=true;
      }
      else
      {
        this.showCustom=false;
      }
      if(isAllSelected)
      {
      this.searchListObject={msl_id:this.msl_id,bedrooms:this.bedrooms,bathrooms:this.bathrooms,address_township:this.address_township,days_on_market:this.days_on_market,
        date_listed:this.date_listed,garage_size:this.garage_size,lot_size_min:this.lot_size_min,
        lot_size_max:this.lot_size_max,lot_size_type:this.lot_size_type,
        parcel_num:this.parcel_num,school_district:this.school_district,school_elem:this.school_elem,school_high:this.school_high,
        listing_type:this.listing_type,stories:this.stories,address_city:this.address_city_modal,address_subdivision:this.address_subdivision_modal,
        home_type:this.home_type_modal,address_zip_code:this.address_zip_code_modal,lot_size:this.lot_size_modal,
        neighborhood:this.neighbourhood_modal,selectedLat:this.selectedLat,selectedLong:this.selectedLong,
        listing_size_max:this.listing_size_max,listing_size_min:this.listing_size_min,price:finalPrice,
        destinct_for_sale_listing_types:"all",map_location:this.mapLocation,year_built_min:this.year_built_min,
        year_built_max:this.year_built_max,dols:this.dols,unit_size_max:this.unit_size_max,unit_size_min:this.unit_size_min,
        north_east_lat:this.north_east_lat,north_east_lon:this.north_east_lon,south_west_lat:this.south_west_lat,south_west_lon:this.south_west_lon
      };
    }
    else
    {
      this.searchListObject={msl_id:this.msl_id,bedrooms:this.bedrooms,bathrooms:this.bathrooms,address_township:this.address_township,days_on_market:this.days_on_market,
        date_listed:this.date_listed,garage_size:this.garage_size,
        lot_size_min:this.lot_size_min,lot_size_max:this.lot_size_max,lot_size_type:this.lot_size_type,
        parcel_num:this.parcel_num,school_district:this.school_district,school_elem:this.school_elem,school_high:this.school_high,
        listing_type:this.listing_type,stories:this.stories,address_city:this.address_city_modal,address_subdivision:this.address_subdivision_modal,
        home_type:this.home_type_modal,address_zip_code:this.address_zip_code_modal,lot_size:this.lot_size_modal,
        neighborhood:this.neighbourhood_modal,selectedLat:this.selectedLat,selectedLong:this.selectedLong,
        listing_size_max:this.listing_size_max,listing_size_min:this.listing_size_min,price:finalPrice,
        destinct_for_sale_listing_types:"all",map_location:this.mapLocation,year_built_min:this.year_built_min,
        year_built_max:this.year_built_max,dols:this.dols,unit_size_max:this.unit_size_max,unit_size_min:this.unit_size_min,
        north_east_lat:this.north_east_lat,north_east_lon:this.north_east_lon,south_west_lat:this.south_west_lat,south_west_lon:this.south_west_lon
      };
    }
    }
    addMoreGalleryImage(option:string)
  {
if(!this.isApp){
    if(option=="community")
    {
      let commObj={imageData:"",imageDataDummy:"",imageWidth:"",imageHeight:""};
      commObj.imageDataDummy=this.dataCommunityImage.image;
      commObj.imageData=this.communityImage;
      commObj.imageWidth=this.communityWidth;
      commObj.imageHeight=this.communityHeight;
      this.dataCommunityImageArray.push(commObj);
  this.hideCommunityCropper=false;
  this.dataCommunityImage={};
    }
    if(option=="slideShow")
    {
      let commObj={imageData:"",imageDataDummy:"",imageWidth:"",imageHeight:""};
      commObj.imageDataDummy=this.dataSlideShowImage.image;
      commObj.imageData=this.slideShowImage;
      commObj.imageWidth=this.slideShowWidth;
      commObj.imageHeight=this.slideShowHeight;
      this.dataSlideShowImageArray.push(commObj);
  this.hideSlideShowCropper=false;
  this.dataSlideShowImage={};
    }
  }else{
    if(option=="community")
    {
      let commObj={imageData:""};
      commObj.imageData=this.communityImage;
      this.dataCommunityImageArray.push(commObj);
  this.dataCommunityImage={};
    }
    if(option=="slideShow")
    {
      let commObj={imageData:""};
      commObj.imageData=this.slideShowImage;
      this.dataSlideShowImageArray.push(commObj);
      this.dataSlideShowImage={};
    }
  }
  }
    createHotSheet():void{
if(!this.isApp){
      if(this.dataCommunityImage.image!=undefined&&this.dataCommunityImage.image!='')
      {
        let commObj={imageData:"",imageDataDummy:"",imageWidth:"",imageHeight:""};
        commObj.imageDataDummy=this.dataCommunityImage.image;
        commObj.imageData=this.communityImage;
        commObj.imageWidth=this.communityWidth;
        commObj.imageHeight=this.communityHeight;
        this.dataCommunityImageArray.push(commObj);
        this.hideCommunityCropper=false;
        this.dataCommunityImage={};
      }
      if(this.dataSlideShowImage.image!=undefined&&this.dataSlideShowImage.image!='')
      {
        let commObj={imageData:"",imageDataDummy:"",imageWidth:"",imageHeight:""};
        commObj.imageDataDummy=this.dataSlideShowImage.image;
        commObj.imageData=this.slideShowImage;
        commObj.imageWidth=this.slideShowWidth;
        commObj.imageHeight=this.slideShowHeight;
        this.dataSlideShowImageArray.push(commObj);
        this.hideSlideShowCropper=false;
        this.dataSlideShowImage={};
      }
    }else if(this.isApp){
      if(this.communityImage!=undefined&&this.communityImage!='')
      {
        let commObj={imageData:""};
      commObj.imageData=this.communityImage;
      this.dataCommunityImageArray.push(commObj);
      this.dataCommunityImage={};
      }
      if(this.slideShowImage!=undefined&&this.slideShowImage!='')
      {
        let commObj={imageData:""};
      commObj.imageData=this.slideShowImage;
      this.dataSlideShowImageArray.push(commObj);
      this.dataSlideShowImage={};
      }
    }
    if(this.userId!="")
      {
        this.userServiceObj.checkHotSheetSlug(this.slug,this.userId.toString()).subscribe((result) => this.createHotSheetFinal(result));
      }
    }
    createHotSheetFinal(result:any):void{
      if(result.status!=false)
      {
    this.updateSearchObject();
          this.userServiceObj.createHotSheet(this.userId.toString(),this.selectedWebsite,
          this.sharedServiceObj.mlsServerId,this.name,this.hotsheet_Title,this.slug,
          JSON.stringify(this.searchListObject),CKEDITOR.instances['brief_description'].getData(),
          CKEDITOR.instances['main_description'].getData(),this.virtual_tour_url,this.video_url,this.sub_city,
          this.dataCommunityImageArray,this.headerImage,this.city,this.administrative_area_level_1,
          this.community,this.assigned_agent_id,this.polygon_search,
          this.meta_description,this.meta_title,this.parent_id,this.dataSlideShowImageArray)
          .subscribe((result) => this.createHotSheetResp(result));
    }
    else
    {
      this.ngZone.run(()=>{ 
      this.hotsheetCreateMsg="Slug already exists.";
      let toast = this.toastCtrl.create({
        message: this.hotsheetCreateMsg,
        duration: 3000,
        position: 'top',
        cssClass:'errorToast'
      });
      
      toast.onDidDismiss(() => {
      });
      toast.present();
      });
    }
     
    }
    createHotSheetResp(result:any):void{
    this.storage.remove('searchFilterObj');
  
    this.hotsheetCreateMsg="HotSheet has been created successfully.";
    this.ngZone.run(()=>{
      CKEDITOR.instances['brief_description'].destroy(true);
      CKEDITOR.instances['main_description'].destroy(true);
      document.getElementById('brief_description').remove();
      document.getElementById('main_description').remove();
      this.navCtrl.setRoot(AllHotSheetsPage,{notificationMsg:this.hotsheetCreateMsg.toString()});
    });
    
    }
    editImage(imageType:string){
      var that=this;
     
      //debugger;
      let selectedImageOption={
        mode:"edit",
        croppedWidth:this.headerCropperSettings.croppedWidth,
        croppedHeight:this.headerCropperSettings.croppedHeight,
        websiteImage:this.headerImage,
        imageType:imageType
      };
      //debugger;
      //document.remo
      //document.getElementById("canvas").remove();
     var modalColor = this.modalCtrl.create(PicturePopupPage,{selectedImageOption:selectedImageOption});
      modalColor.onDidDismiss(data => {
        if(data)
        {
          that.setWebsiteImage(data);
        }
        
   });
     modalColor.present();
    }
    setWebsiteImage(imageObject:any)
    {
  //debugger;
      this.loadEditedImage(imageObject,imageObject.imageType);
    }
    loadEditedImage(imageObject:any,imageType:any)
    {
      const self = this;
     
         if(imageType=="header")
         {
          self.headerCropperSettings.croppedWidth = imageObject.croppedWidth;
          self.headerCropperSettings.croppedHeight = imageObject.croppedHeight;
          
         self.resizeHeaderImage(imageObject.websiteImage, data => {
          self.headerImage=data;
            self.createHeaderImageThumbnail(self.headerImage);
          });
         }

    }
    headerFileChangeListener($event) {
      this.hideHeaderCropper=true;
      this.edit_header_image=true;
      this.crop_header_image=true;
      var image:any = new Image();
      this.isHeaderExist=true;
      var file:File = $event.target.files[0];
      var myReader:FileReader = new FileReader();
      var that = this;
      myReader.onloadend = function (loadEvent:any) {
          image.src = loadEvent.target.result;
          //that.headerImageCropper.setImage(image);
          image.onload = function () {
            that.headerCropperSettings.croppedWidth=this.width;
            that.headerCropperSettings.croppedHeight=this.height;
            that.headerImage=this.src;
            that.createHeaderImageThumbnail(that.headerImage);
            //that.headerImageCropper.setImage(image);
          }
      };
  
      myReader.readAsDataURL(file);
  }
  /*showHideHeaderCropper(){
    this.crop_header_image=false;
    const self = this;
if(this.edit_header_image)
{
  this.hideHeaderCropper=true;
  if(this.headerImage!="")
  {
   // this.companyCropperLoaded=true;
    var image:any = new Image();
    image.src = this.headerImage;
            image.onload = function () {
              self.headerImageCropper.setImage(image); 
            }
 }
  
}
else
{
  this.hideHeaderCropper=false;
}
  }*/
  /*showHideCommunityCropper(){
    this.crop_community_image=false;
    const self = this;
if(this.edit_community_image)
{
  this.hideCommunityCropper=true;
  if(this.communityImage!="")
  {
   // this.companyCropperLoaded=true;
    var image:any = new Image();
    image.src = this.communityImage;
            image.onload = function () {
              self.communityImageCropper.setImage(image); 
            }
 }
  
}
else
{
  this.hideCommunityCropper=false;
}
  }*/
    headerImageCropped(image:any)
    {
      if(this.crop_header_image)
      {
        this.headerCropperSettings.croppedWidth=image.width;
        this.headerCropperSettings.croppedHeight=image.height;
        
        let that=this;
        this.resizeHeaderImage(this.dataHeaderImage.image, data => {
        
          that.headerImage=data;
          this.createHeaderImageThumbnail(that.headerImage);
            });
      }
     else
     {
       this.crop_header_image=true;
     } 
     
    }
    communityFileChangeListener($event) {
      this.crop_community_image=true;
      this.edit_community_image=true;
      this.hideCommunityCropper=true;
      var image:any = new Image();
      var file:File = $event.target.files[0];
      var myReader:FileReader = new FileReader();
      var that = this;
      myReader.onloadend = function (loadEvent:any) {
          image.src = loadEvent.target.result;
          image.onload = function () {
            that.communityCropperSettings.croppedWidth=this.width;
            that.communityCropperSettings.croppedHeight=this.height;
            that.communityImage=this.src;
            that.createCommunityImageThumbnail(that.communityImage);
            //that.commun
          //that.communityImageCropper.setImage(image);
          }
      };
  
      myReader.readAsDataURL(file);
  }
    communtiyImageCropped(image:any)
    {
      if(this.crop_community_image)
      {
        this.communityCropperSettings.croppedWidth=image.width;
        this.communityCropperSettings.croppedHeight=image.height;
             
             let that=this;
              this.resizeCommunityImage(this.dataCommunityImage.image, data => {
              
                that.communityImage=data;
                
                this.createCommunityImageThumbnail(that.communityImage);
                  });
      }
else
{
  this.crop_community_image=true;
}
    }
    slideShowFileChangeListener($event) {
      this.crop_slideshow_image=true;
      this.edit_slideshow_image=true;
      this.hideSlideShowCropper=true;
      var image:any = new Image();
      var file:File = $event.target.files[0];
      var myReader:FileReader = new FileReader();
      var that = this;
      myReader.onloadend = function (loadEvent:any) {
          image.src = loadEvent.target.result;
          image.onload = function () {
            that.slideShowCropperSettings.croppedWidth=this.width;
            that.slideShowCropperSettings.croppedHeight=this.height;
            that.slideShowImage=this.src;
            that.createSlideShowImageThumbnail(that.slideShowImage);
            //that.commun
          //that.communityImageCropper.setImage(image);
          }
      };
  
      myReader.readAsDataURL(file);
  }
    slideShowImageCropped(image:any)
    {
      if(this.crop_slideshow_image)
      {
        this.slideShowCropperSettings.croppedWidth=image.width;
        this.slideShowCropperSettings.croppedHeight=image.height;
             
             let that=this;
              this.resizeSlideShowImage(this.dataSlideShowImage.image, data => {
              
                that.slideShowImage=data;
                
                this.createSlideShowImageThumbnail(that.slideShowImage);
                  });
      }
else
{
  this.crop_slideshow_image=true;
}
    }  
  deleteGalleryImage(imageObj,option:string)
  {
    if(option=="community")
    {
      let selectedIndex = this.dataCommunityImageArray.indexOf(imageObj);
      if (selectedIndex >= 0) {
      this.dataCommunityImageArray.splice(selectedIndex, 1);
      }
    }
    if(option=="slideShow")
    {
      let selectedIndex = this.dataSlideShowImageArray.indexOf(imageObj);
      if (selectedIndex >= 0) {
      this.dataSlideShowImageArray.splice(selectedIndex, 1);
      }
    }
  }
  openHeaderPicture(){
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Option',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Take photo',
          icon: 'ios-camera-outline',
          handler: () => {
            this.takeHeaderPicture();
          }
        },
        {
          text: 'Choose photo from Gallery',
          icon: 'ios-images-outline',
          handler: () => {
            this.selectHeaderPicture();
          }
        }
  ]
  });
  actionSheet.present();
  }
    takeHeaderPicture(){
//debugger;
      var that=this;
      let options =
      {
      allowEdit: true,
      destinationType: that.camera.DestinationType.DATA_URL,
      encodingType: that.camera.EncodingType.JPEG,
      mediaType: that.camera.MediaType.PICTURE,
      sourceType: that.camera.PictureSourceType.CAMERA
      };
      that.camera.getPicture(options)
      .then((data) => {
        that.headerImage="data:image/jpeg;base64," +data;

        if(that.isApp)
        {
          that.crop
       .crop(that.headerImage, {quality: 75,targetHeight:100,targetWidth:100})
      .then((newImage) => {

          that.headerImage=newImage;
        }, error => {

        });
        }
      }, function(error) {

        console.log(error);
      });

    }
    selectHeaderPicture()
    {
      var that=this;
      let options =
      {
      allowEdit: true,
      destinationType: that.camera.DestinationType.DATA_URL,
      encodingType: that.camera.EncodingType.JPEG,
      mediaType: that.camera.MediaType.PICTURE,
      sourceType: that.camera.PictureSourceType.SAVEDPHOTOALBUM
      };
      that.camera.getPicture(options)
      .then((data) => {
        that.headerImage="data:image/jpeg;base64," +data;
        if(that.isApp)
        {
          that.crop
       .crop(that.headerImage, {quality: 75,targetHeight:100,targetWidth:100})
      .then((newImage) => {
          that.headerImage=newImage;
        }, error => {
        });
        }
      }, function(error) {

        console.log(error);
      });
    }
    openCommunityPicture(){
      let actionSheet = this.actionsheetCtrl.create({
        title: 'Option',
        cssClass: 'action-sheets-basic-page',
        buttons: [
          {
            text: 'Take photo',
            icon: 'ios-camera-outline',
            handler: () => {
              this.takeCommunityPicture();
            }
          },
          {
            text: 'Choose photo from Gallery',
            icon: 'ios-images-outline',
            handler: () => {
              this.selectCommunityPicture();
            }
          }
    ]
    });
    actionSheet.present();
    }
    takeCommunityPicture(){
      var that=this;
      let options =
      {
      allowEdit: true,
      destinationType: that.camera.DestinationType.DATA_URL,
      encodingType: that.camera.EncodingType.JPEG,
      mediaType: that.camera.MediaType.PICTURE,
      sourceType: that.camera.PictureSourceType.CAMERA
      };
      that.camera.getPicture(options)
      .then((data) => {
        that.communityImage="data:image/jpeg;base64," +data;
        if(that.isApp)
        {
          that.crop
          .crop(that.communityImage, {quality: 75,targetHeight:100,targetWidth:100})
          .then((newImage) => {
            that.communityImage=newImage;
            
          }, error => {
          });
        }
        
      }, function(error) {
        console.log(error);
      });
    }
    selectCommunityPicture(){
      var that=this;
      let options =
      {
      allowEdit: true,
      destinationType: that.camera.DestinationType.DATA_URL,
      encodingType: that.camera.EncodingType.JPEG,
      mediaType: that.camera.MediaType.PICTURE,
      sourceType: that.camera.PictureSourceType.SAVEDPHOTOALBUM
      };
      that.camera.getPicture(options)
      .then((data) => {
        that.communityImage="data:image/jpeg;base64," +data;
        if(that.isApp)
        {
          that.crop
          .crop(that.communityImage, {quality: 75,targetHeight:100,targetWidth:100})
          .then((newImage) => {
            that.communityImage=newImage;
            
          }, error => {
          });
        }
        
      }, function(error) {
        console.log(error);
      });
    }
    openSlideShowPicture(){
      let actionSheet = this.actionsheetCtrl.create({
        title: 'Option',
        cssClass: 'action-sheets-basic-page',
        buttons: [
          {
            text: 'Take photo',
            icon: 'ios-camera-outline',
            handler: () => {
              this.takeSlideShowPicture();
            }
          },
          {
            text: 'Choose photo from Gallery',
            icon: 'ios-images-outline',
            handler: () => {
              this.selectSlideShowPicture();
            }
          }
    ]
    });
    actionSheet.present();
    }
    takeSlideShowPicture(){
      var that=this;
      let options =
      {
      allowEdit: true,
      destinationType: that.camera.DestinationType.DATA_URL,
      encodingType: that.camera.EncodingType.JPEG,
      mediaType: that.camera.MediaType.PICTURE,
      sourceType: that.camera.PictureSourceType.CAMERA
      };
      that.camera.getPicture(options)
      .then((data) => {
        that.slideShowImage="data:image/jpeg;base64," +data;
        if(that.isApp)
        {
          that.crop
          .crop(that.slideShowImage, {quality: 75,targetHeight:100,targetWidth:100})
          .then((newImage) => {
            that.slideShowImage=newImage;
            
          }, error => {
          });
        }
        
      }, function(error) {
        console.log(error);
      });
    }
    selectSlideShowPicture(){
      var that=this;
      let options =
      {
      allowEdit: true,
      destinationType: that.camera.DestinationType.DATA_URL,
      encodingType: that.camera.EncodingType.JPEG,
      mediaType: that.camera.MediaType.PICTURE,
      sourceType: that.camera.PictureSourceType.SAVEDPHOTOALBUM
      };
      that.camera.getPicture(options)
      .then((data) => {
        that.slideShowImage="data:image/jpeg;base64," +data;
        if(that.isApp)
        {
          that.crop
          .crop(that.slideShowImage, {quality: 75,targetHeight:100,targetWidth:100})
          .then((newImage) => {
            that.slideShowImage=newImage;
            
          }, error => {
          });
        }
        
      }, function(error) {
        console.log(error);
      });
    }
   /////////////////////Generate Thumbnail//////////////////////

  createCommunityImageThumbnail(bigMatch:any) {
    let that=this;
   
    //debugger;
      this.generateCommunityImageFromImage(bigMatch, 500, 500, 0.5, data => {
        
    that.dataCommunityImage.image=data;
    //debugger;
      });
    }
    generateCommunityImageFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
      var canvas: any = document.createElement("canvas");
      var image:any = new Image();
      //image.width=this.companyCropperSettings.croppedWidth;
      //image.height=this.companyCropperSettings.croppedHeight;
      var that=this;
   //debugger;
      image.src = img;
      image.onload = function () {
       
        var width=that.communityCropperSettings.croppedWidth;
        var height=that.communityCropperSettings.croppedHeight;
       //debugger;
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        //debugger;
        canvas.width = width;
        canvas.height = height;
        that.communityWidth = width;
        that.communityHeight = height;
        //debugger;
        var ctx = canvas.getContext("2d");
   
        ctx.drawImage(image, 0, 0, width, height);
   
        // IMPORTANT: 'jpeg' NOT 'jpg'
        var dataUrl = canvas.toDataURL('image/jpeg', quality);
   
        callback(dataUrl)
      }
      
    }
    resizeCommunityImage(img:any,callback)
    {
      var canvas: any = document.createElement("canvas");
      var image:any = new Image();
     
      var that=this;
  
      image.src = img;
      image.onload = function () {
       
        var width=that.communityCropperSettings.croppedWidth;
        var height=that.communityCropperSettings.croppedHeight;
      
        canvas.width = width;
        canvas.height = height;
  
        var ctx = canvas.getContext("2d");
   
        ctx.drawImage(image, 0, 0, width, height);
  
        var dataUrl = canvas.toDataURL('image/jpeg', 1);
  
       callback(dataUrl)
      }
    }
    createHeaderImageThumbnail(bigMatch:any) {
      let that=this;
      
        this.generateHeaderImageFromImage(bigMatch, 500, 500, 0.5, data => {
          //that.dataCommunityImageArray.push(commObj);
      that.dataHeaderImage.image=data;
      //debugger;
        });
      }
      generateHeaderImageFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
        var canvas: any = document.createElement("canvas");
        var image:any = new Image();
        //image.width=this.companyCropperSettings.croppedWidth;
        //image.height=this.companyCropperSettings.croppedHeight;
        var that=this;
     //debugger;
        image.src = img;
        image.onload = function () {
         
          var width=that.headerCropperSettings.croppedWidth;
          var height=that.headerCropperSettings.croppedHeight;
         //debugger;
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          //debugger;
          canvas.width = width;
          canvas.height = height;
          that.headerWidth = width;
          that.headerHeight = height;
          //debugger;
          var ctx = canvas.getContext("2d");
     
          ctx.drawImage(image, 0, 0, width, height);
     
          // IMPORTANT: 'jpeg' NOT 'jpg'
          var dataUrl = canvas.toDataURL('image/jpeg', quality);
     
          callback(dataUrl)
        }
        
      }
      resizeHeaderImage(img:any,callback)
      {
        var canvas: any = document.createElement("canvas");
        var image:any = new Image();
       
        var that=this;
    
        image.src = img;
        image.onload = function () {
         
          var width=that.headerCropperSettings.croppedWidth;
          var height=that.headerCropperSettings.croppedHeight;
        
          canvas.width = width;
          canvas.height = height;
    
          var ctx = canvas.getContext("2d");
     
          ctx.drawImage(image, 0, 0, width, height);
    
          var dataUrl = canvas.toDataURL('image/jpeg', 1);
    
         callback(dataUrl)
        }
      }
      createSlideShowImageThumbnail(bigMatch:any) {
        let that=this;
       
        //debugger;
          this.generateSlideShowImageFromImage(bigMatch, 500, 500, 0.5, data => {
            
        that.dataSlideShowImage.image=data;
        //debugger;
          });
        }
        generateSlideShowImageFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
          var canvas: any = document.createElement("canvas");
          var image:any = new Image();
          //image.width=this.companyCropperSettings.croppedWidth;
          //image.height=this.companyCropperSettings.croppedHeight;
          var that=this;
       //debugger;
          image.src = img;
          image.onload = function () {
           
            var width=that.slideShowCropperSettings.croppedWidth;
            var height=that.slideShowCropperSettings.croppedHeight;
           //debugger;
            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            //debugger;
            canvas.width = width;
            canvas.height = height;
            that.slideShowWidth = width;
            that.slideShowHeight = height;
            //debugger;
            var ctx = canvas.getContext("2d");
       
            ctx.drawImage(image, 0, 0, width, height);
       
            // IMPORTANT: 'jpeg' NOT 'jpg'
            var dataUrl = canvas.toDataURL('image/jpeg', quality);
       
            callback(dataUrl)
          }
          
        }
        resizeSlideShowImage(img:any,callback)
        {
          var canvas: any = document.createElement("canvas");
          var image:any = new Image();
         
          var that=this;
      
          image.src = img;
          image.onload = function () {
           
            var width=that.slideShowCropperSettings.croppedWidth;
            var height=that.slideShowCropperSettings.croppedHeight;
          
            canvas.width = width;
            canvas.height = height;
      
            var ctx = canvas.getContext("2d");
       
            ctx.drawImage(image, 0, 0, width, height);
      
            var dataUrl = canvas.toDataURL('image/jpeg', 1);
      
           callback(dataUrl)
          }
        }
   ////////////////////////////////////////////////////////////////////////
    refreshValueSubDivision($event:any):void{
    
    }
    selectedSubDivision($event:any):void{
  
    }
    removedSubDivision($event:any):void{
    this.address_subdivision_modal.splice(this.address_subdivision_modal.indexOf($event.id),1);
   // this.updateSearchObject();
    }
    refreshValueAddressCity($event:any):void{
    
    }
    selectedAddressCity($event:any):void{
    //this.address_city_modal.push($event.id);
  //  this.updateSearchObject();
    }
    removedAddressCity($event:any):void{
      this.address_city_modal.splice(this.address_city_modal.indexOf($event.id),1);
    //  this.updateSearchObject();
    }
    refreshValueListingType($event:any):void{
    
    }
    selectedListingType(value:any):void{
      
      if(value=="all")
      {
        //let selectedOptions:any[]=[];
        //this.listingTypeOptions.forEach(function(element){
          
          //selectedOptions.push(element.id);
          
        //});
       // debugger;
        //this.listing_type_modal=selectedOptions;
      }
    //this.listing_type_modal.push($event.id);
  //  this.updateSearchObject();
    }
    removedListingType($event:any):void{
      //this.listing_type_modal.splice(this.listing_type_modal.indexOf($event.id),1);
    //  this.updateSearchObject();
    }
    refreshStatus($event:any):void{
    
    }
    selectedStatus($event:any):void{
     //debugger;
    //this.status_modal.push($event.id);
  //  this.updateSearchObject();
    }
    removedStatus($event:any):void{
      //this.status_modal.splice(this.status_modal.indexOf($event.id),1);
    //  this.updateSearchObject();
    }
    refreshValueAddressZipCode($event:any):void{
    
    }
    selectedAddressZipCode($event:any):void{
    //this.address_zip_code_modal.push($event.id);
  //  this.updateSearchObject();
    }
    removedAddressZipCode($event:any):void{
      this.address_zip_code_modal.splice(this.address_zip_code_modal.indexOf($event.id),1);
    //  this.updateSearchObject();
    }
    refreshValueNeighbourHood($event:any):void{
    
    }
    selectedNeighbourHood($event:any):void{
    //this.neighbourhood_modal.push($event.id);
    //this.updateSearchObject();
    }
    removedNeighbourHood($event:any):void{
      this.neighbourhood_modal.splice(this.neighbourhood_modal.indexOf($event.id),1);
    //  this.updateSearchObject();
    }
}
