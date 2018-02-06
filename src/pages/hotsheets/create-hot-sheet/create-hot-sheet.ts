import { Component, ViewChild, NgZone, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, MenuController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { IMultiSelectOption,IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';

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
declare var google: any;
declare var latitudeSimplifier;
@IonicPage()
@Component({
  selector: 'page-create-hot-sheet',
  templateUrl: 'create-hot-sheet.html',
})
export class CreateHotSheetPage {
  public multiSelect:IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 3,
    displayAllSelectedText: true
};
public isApp=false;
  public msl_id:string="";
  public name:string="";
   public hotsheetCreateMsg:string="";
   public slug:string="";
   public allWebsiteList:any[]=[];
  public selectedWebsite:string="";
  public bedrooms:string="";
  public bathrooms:string="";
  public address:string="";
  public address_country:string="";
  public address_township:string="";
  public basement:string="";
  public date_listed:Date;
  public days_on_market:string="";
  public garage_size:string="";
  public listing_size:string="";
  public lot_size:string="";
  public parcel_num:string="";
  public school_district:string="";
  public school_elem:string="";
  public school_high:string="";
  public stories:string="";
  public year_built:string="";
  public status:any[]=[];
  public statusOptions: IMultiSelectOption[];
  public status_modal:string[]=[];
  public status_last_searched:any[]=[];
  public address_city:any[]=[];
  public address_city_options: IMultiSelectOption[];
  public address_city_modal:any[]=[];
  public address_city_last_searched:any[]=[];
  public address_subdivision:any[]=[];
  public address_subdivision_options: IMultiSelectOption[];
  public address_subdivision_modal:any[]=[];
  public address_subdivision_last_searched:any[]=[];
  public listing_type:any[]=[];
  public listingTypeOptions: IMultiSelectOption[];
  public listing_type_modal:any[]=[];
  public listing_type_last_searched:any[]=[];
  public address_zip_code:any[]=[];
  public address_zip_code_options:any[]=[];
  public address_zip_code_modal:any[]=[];
  public address_zip_code_last_searched:any[]=[];
  public neighbourhood:any[]=[];
  public neighbourhood_options: IMultiSelectOption[];
  public neighbourhood_modal:any[]=[];
  public neighbourhood_last_searched:any[]=[];
  public google_address:string="";
  public google_dist:string="";
  public google_prov:string="";
  public google_country:string="";
  public searchListObject:any;
  public selectedSearch : boolean=false;
  public showUpdateButton : boolean=true;
  public selectedLat:string="";
  public selectedLong:string="";
  public userId:string="";
  public brief_description:string="";
  public main_description:string="";
  public virtual_tour_url:string="";
  public video_url:string="";
  public sub_city:string="";
  public polygon_search:any;
  public headerImage:string="";
  public communityImage:string="";
  public agent_ids:any[]=[];
  public assigned_agent_id:string="";
  public local:string="";
  public administrative_area_level_1:string="";
  public community:string="";
  public zoom: number = 8;
  public drawingManager:any;
  public mapHeight:string="400";
  public isDrawing:boolean = false;
  //public isMap:boolean=false;
  // Google Map center
  public latitude: number = 51.673858;
  public longitude: number = 7.815982;
  public polygons:any[] = [];
  public toDrawing = false;
  public move:any=null;
  public mouseUp:any=null;
  public poly:any;
  public map_height:number;
 
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  constructor(private geolocation: Geolocation,public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform
    ,public listinServiceObj:ListingProvider,private crop: Crop,private camera: Camera) {
      if(this.platform.is('core') || this.platform.is('mobileweb')) {
        this.isApp=false;
      }
      else
      {
        this.isApp=true;
      }
    }

  ionViewDidLoad() {
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
      this.getAllWebsite();
    });
    //this.loadMap();
    this.loadSearchedField();
  }
  loadMap(lat:any,lng:any){
 
   // this.geolocation.getCurrentPosition().then((position) => {
 //debugger;
      //let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let latLng = new google.maps.LatLng(lat, lng);
      let mapOptions = {
        center: latLng,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.MAP,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_CENTER
        },
        //zoomControl: true,
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
     // debugger;
      
     this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.POLYGON
        ]
      }
    });
      //debugger;
      this.drawingManager.setMap(null);
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
      var centerControlDiv:any = document.createElement('div');
      centerControlDiv.id = 'map-control-container';
      //debugger;
      //var centerControl = new this.CenterControl(centerControlDiv, this.map);
     this.CenterControl(centerControlDiv, this.map);
      //debugger;
      centerControlDiv.index = 1;
      this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);
      google.maps.event.addDomListener(this.map, 'mousedown', this.mouseDownCallBack.bind(this));
     
    //}, (err) => {
    //  console.log(err);
    //});
  }
  mouseDownCallBack(e:any)
  {
  // debugger;
   //do it with the right mouse-button only
   if (!this.toDrawing) return;
   this.map.setOptions({
     draggable: false 
   });
   this.mouseUp=google.maps.event.addListener(this.map, 'mouseup',this.mouseUpCallBack.bind(this));
   this.move = google.maps.event.addListener(this.map, 'mousemove',this.mouseMoveCallBack.bind(this));
   
   //debugger;
  }
  mouseUpCallBack(e:any)
  {
    //debugger;
    google.maps.event.removeListener(this.mouseUp);
    google.maps.event.removeListener(this.move);
    var path = this.poly.getPath();
    //debugger;
    var ArrayforPolygontoUse= this.sharedServiceObj.simplyfierLatitude(path.b,12.5);
    //ar ArrayforPolygontoUse= simplify(path.b, 100, false);
  // debugger;
    path.b=ArrayforPolygontoUse;
  this.poly.setMap(null);
  this.poly = new google.maps.Polygon({
      map: this.map,
      path: path
    });
    this.polygons.push(this.poly);
   //debugger;
    
    this.map.setOptions({
      draggable: true
    });
    this.toDrawing = false;
    //debugger;
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
   // debugger;
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
    
    
  }
  
  ////////////////////////////////
  
  ////////////////////////////////
  loadSearchedField():void{
    //if(this.localStorageService.get("searchFieldsLocal")==undefined)
    //{
     this.listinServiceObj.getAvailableSearchFields()
      .subscribe((result) => this.loadAvailableSearchFields(result));
    //}
    //else
    //{
      this.loadSavedSearchedFields();
    //}
    }
    getAllWebsite():void{
      if(this.userId!="")
      {
        
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
        
      }
      
    }
    onWebsiteSelection($event:any):void{
       this.selectedWebsite=$event;
    }
    getAddress(data) {
     
     this.address=data.data.description;
     //debugger;
      this.selectedLat=data.data.geometry.location.lat;
      this.selectedLong=data.data.geometry.location.lng;
     
      data.data.address_components.forEach(element => {
        if(element.types[0]=="locality")
        {
          this.local=element.long_name;
        }
        if(element.types[0]=="administrative_area_level_1")
        {
          this.administrative_area_level_1=element.long_name;
        }
       });
       if(this.selectedLong!="")
       {
         //this.isMap=true;
         this.map_height=400;
         this.stopDrawing();
         this.loadMap(this.selectedLat,this.selectedLong);
       }
      
      
      //debugger;
    this.updateSearchObject();
       
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
    setSearchedFields(result:any):void{
     //debugger;
      ///////////////////////Load Text Boxes///////////////////////////////////
      
      this.msl_id=result.searchFieldsJson.mls_id;
      
      this.bedrooms=result.searchFieldsJson.bedrooms;
      this.bathrooms=result.searchFieldsJson.bathrooms;
      //debugger;
      this.address=result.searchFieldsJson.address;
      this.address_country=result.searchFieldsJson.address_country;
      this.address_township=result.searchFieldsJson.address_township;
      this.basement=result.searchFieldsJson.basement;
     
      this.days_on_market=result.searchFieldsJson.days_on_market;
      this.garage_size=result.searchFieldsJson.garage_size;
      this.listing_size=result.searchFieldsJson.listing_size;
      this.lot_size=result.searchFieldsJson.lot_size;
      this.parcel_num=result.searchFieldsJson.parcel_num;
      this.school_district=result.searchFieldsJson.school_district;
      this.school_elem=result.searchFieldsJson.school_elem;
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
        let optionsArray:any[]=[];
      this.status=result.searchFieldsJson.status;
    //  debugger;
      for(let i=0;i<this.status.length;i++){
     
        let obj={id:this.status[i],name:this.status[i]};
        optionsArray.push(obj);
      }
      this.statusOptions=optionsArray;
     //debugger;
      }
      if(result.searchFieldsJson.address_subdivision!=undefined)
      {
      
      let optionsArray:any[]=[];
      this.address_subdivision=result.searchFieldsJson.address_subdivision;
    //  debugger
      for(let i=0;i<this.address_subdivision.length;i++){
        
           let obj={id:this.address_subdivision[i],name:this.address_subdivision[i]};
           optionsArray.push(obj);
         }
         this.address_subdivision_options=optionsArray;
      //debugger;
      }
      if(result.searchFieldsJson.listing_type!=undefined)
      {
        //debugger;
        let optionsArray:any[]=[];
      this.listing_type=result.searchFieldsJson.listing_type;
     // debugger;
      for(let i=0;i<this.listing_type.length;i++){
        
           let obj={id:this.listing_type[i],name:this.listing_type[i]};
           optionsArray.push(obj);
         }
         this.listingTypeOptions=optionsArray;
      }
      if(result.searchFieldsJson.address_zip_code!=undefined)
      {
      //this.address_zip_code=result.searchFieldsJson.address_zip_code;
      let optionsArray:any[]=[];
      this.address_zip_code=result.searchFieldsJson.address_zip_code;
     // debugger
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
    //  debugger;
      for(let i=0;i<this.neighbourhood.length;i++){
        
           let obj={id:this.neighbourhood[i],name:this.neighbourhood[i]};
           optionsArray.push(obj);
         }
         this.neighbourhood_options=optionsArray;
      }
      /////////////////////////////////////////////////////////////////////////
     // this.loadLastSearchedValue();
    }
    loadLastSearchedValue():void{
      let lastSearchedObj=null;
      let lastSearchedString=null;
    this.storage.get('searchFilterObj').then((data) => {
      //debugger;
      if(data!=null)
      {
     lastSearchedString=data;
      }
    });

    lastSearchedObj=JSON.parse(JSON.parse(JSON.stringify(lastSearchedString)));
    //debugger;
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
           this.listing_size=lastSearchedObj.listing_size;
         }
         if(lastSearchedObj.lot_size)
         {
           this.lot_size=lastSearchedObj.lot_size;
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
         if(lastSearchedObj.listing_type)
         {
           this.listing_type_last_searched=lastSearchedObj.listing_type;
         }
        if(lastSearchedObj.listing_type)
         {
           this.listing_type_last_searched=lastSearchedObj.listing_type;
           this.listing_type_modal=this.listing_type_last_searched;
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
     
      }
    }
    
    }
    updateSearchObject():void{
    //debugger;
      this.searchListObject={msl_id:this.msl_id,bedrooms:this.bedrooms,bathrooms:this.bathrooms,address_township:this.address_township,days_on_market:this.days_on_market,
        date_listed:this.date_listed,garage_size:this.garage_size,listing_size:this.listing_size,lot_size:this.lot_size,
        parcel_num:this.parcel_num,school_district:this.school_district,school_elem:this.school_elem,school_high:this.school_high,
        status:this.status_modal,stories:this.stories,address_city:this.address_city_modal,address_subdivision:this.address_subdivision_modal,
        listing_type:this.listing_type_modal,address_zip_code:this.address_zip_code_modal,
        neighborhood:this.neighbourhood_modal,selectedLat:this.selectedLat,selectedLong:this.selectedLong
      }; 
    this.storage.set('searchFilterObj',JSON.stringify(this.searchListObject));
    }
    createHotSheet():void{
      //this.domainAccess=this.localStorageService.get('domainAccess');
      
    if(this.userId!="")
      {
      
         
        this.userServiceObj.checkHotSheetSlug(this.slug,this.userId.toString()).subscribe((result) => this.createHotSheetFinal(result));
      
        
      }
    }
    createHotSheetFinal(result:any):void{
      if(result.status!=false)
      {
    
    let json_search=this.storage.get("searchFilterObj");
     json_search.then((data) => {
       {
         if(data!=null)
         {
          this.polygons[0].getPath().getArray();
          if(this.polygons[0].getPath().getArray().length>0)
          {
            this.polygons[0].getPath().getArray().forEach(element => {
            this.polygon_search+= element.lat() + " " + element.lng() + ",";
            });
          }
         
          this.polygon_search = this.polygon_search.substring(0, this.polygon_search.length - 1);

           this.agent_ids=this.assigned_agent_id.split(',');
           //debugger;
          this.userServiceObj.createHotSheet(this.userId.toString(),this.selectedWebsite,
          this.sharedServiceObj.mlsServerId,this.name,this.slug,data,this.brief_description,
          this.main_description,this.virtual_tour_url,this.video_url,this.sub_city,
          this.communityImage,this.headerImage,this.local,this.administrative_area_level_1,
          this.community,this.agent_ids,this.polygon_search)
          .subscribe((result) => this.createHotSheetResp(result));
         }
      
       }
      });
    }
    else
    {
      this.ngZone.run(()=>{ 
      this.hotsheetCreateMsg="Slug already exists.";
      });
    }
     
     //this.pService.start();
    /*let json_search=this.localStorageService.get("searchFilterObj");
         //debugger;
    //this.pService.start();
    this.userServiceObj.createHotSheet(this.localStorageService.get('userId').toString(),this.domainAccess.userCredentials.website_id,this.sharedServiceObj.mlsServerId,this.name,this.slug,json_search)
      .subscribe((result) => this.createHotSheetResp(result));*/
    }
    createHotSheetResp(result:any):void{
    this.storage.remove('searchFilterObj');
    this.hotsheetCreateMsg="HotSheet has been created successfully.";
    this.ngZone.run(()=>{
      this.navCtrl.push(AllHotSheetsPage,{notificationMsg:this.hotsheetCreateMsg.toString()});
    });
    
    }
    takeHeaderPicture(){
    //  debugger;
      let options =
      {
        quality: 100,
        correctOrientation: true
      };
      this.camera.getPicture(options)
      .then((data) => {
       // this.photos = new Array<string>();
        this.crop
        .crop(data, {quality: 75,targetHeight:100,targetWidth:100})
        .then((newImage) => {
          alert(newImage);
          this.headerImage=newImage;
          //this.photos.push(newImage);
        }, error => {alert(error)});
      }, function(error) {
      //  debugger;
        console.log(error);
      });
    }
    takeCommunityPicture(){
      let options =
      {
        quality: 100,
        correctOrientation: true
      };
      this.camera.getPicture(options)
      .then((data) => {
       // this.photos = new Array<string>();
        this.crop
        .crop(data, {quality: 75,targetHeight:100,targetWidth:100})
        .then((newImage) => {
          alert(newImage);
          this.communityImage=newImage;
          
          //this.photos.push(newImage);
        }, error => {alert(error)});
      }, function(error) {
        console.log(error);
      });
    }
    /*searchListing():any{
      this.selectedSearch = !this.selectedSearch;
      this.localStorageService.set("showSearch",this.selectedSearch);
      this.sharedServiceObj.searchListing();
    
    }*/
    refreshValueSubDivision($event:any):void{
    
    }
    selectedSubDivision($event:any):void{
    //this.address_subdivision_modal.push($event.id);
    this.updateSearchObject();
    }
    removedSubDivision($event:any):void{
    this.address_subdivision_modal.splice(this.address_subdivision_modal.indexOf($event.id),1);
    this.updateSearchObject();
    }
    refreshValueAddressCity($event:any):void{
    
    }
    selectedAddressCity($event:any):void{
    //this.address_city_modal.push($event.id);
    this.updateSearchObject();
    }
    removedAddressCity($event:any):void{
      this.address_city_modal.splice(this.address_city_modal.indexOf($event.id),1);
      this.updateSearchObject();
    }
    refreshValueListingType($event:any):void{
    
    }
    selectedListingType($event:any):void{
    //this.listing_type_modal.push($event.id);
    this.updateSearchObject();
    }
    removedListingType($event:any):void{
      this.listing_type_modal.splice(this.listing_type_modal.indexOf($event.id),1);
      this.updateSearchObject();
    }
    refreshStatus($event:any):void{
    
    }
    selectedStatus($event:any):void{
     //debugger;
    //this.status_modal.push($event.id);
    this.updateSearchObject();
    }
    removedStatus($event:any):void{
      this.status_modal.splice(this.status_modal.indexOf($event.id),1);
      this.updateSearchObject();
    }
    refreshValueAddressZipCode($event:any):void{
    
    }
    selectedAddressZipCode($event:any):void{
    //this.address_zip_code_modal.push($event.id);
    this.updateSearchObject();
    }
    removedAddressZipCode($event:any):void{
      this.address_zip_code_modal.splice(this.address_zip_code_modal.indexOf($event.id),1);
      this.updateSearchObject();
    }
    refreshValueNeighbourHood($event:any):void{
    
    }
    selectedNeighbourHood($event:any):void{
    //this.neighbourhood_modal.push($event.id);
    this.updateSearchObject();
    }
    removedNeighbourHood($event:any):void{
      this.neighbourhood_modal.splice(this.neighbourhood_modal.indexOf($event.id),1);
      this.updateSearchObject();
    }
}
