import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';

import { CreateHotSheetPage } from '../create-hot-sheet/create-hot-sheet';
import { EditHotSheetPage } from '../edit-hot-sheet/edit-hot-sheet';
import { AlertController } from 'ionic-angular';
import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';


/**
 * Generated class for the AllHotSheetsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-all-hot-sheets',
  templateUrl: 'all-hot-sheets.html',
})
export class AllHotSheetsPage {
  public hotSheetId:string="";
  public allHotSheetList:any[]=[];
  public notificationMsg="";
  public userId:string="";
  public hotsheetFoundMessage="";
  public parentId:string="";
 public isOwner:boolean=false;
 public isCreateHotsheetAccess:boolean=false;
 public isEditHotsheetAccess:boolean=false;
 public isDeleteHotsheetAccess:boolean=false;
  public loader:any;
  public isApp=false;
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController,
     public platform: Platform,public loadingCtrl: LoadingController) {
      /*if(this.platform.is('core') || this.platform.is('mobileweb')) {
        this.isApp=false;
      }
      else
      {
        this.isApp=true;
      }*/
      this.isApp = (!document.URL.startsWith("http"));
      if(this.navParams.get('notificationMsg')!=undefined)
      {
        this.notificationMsg=this.navParams.get('notificationMsg');
      }
      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 5000
      });
  }

  ionViewDidLoad() {
    
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
      this.viewAllHotSheets(null);
      this.setAccessLevels();
    });
  }
  setAccessLevels()
  {

    let parent_id = this.storage.get('parent_id');
      parent_id.then((data) => {
        if(data!=null)
        {
          //debugger;    
      this.parentId=data;
      this.isOwner=false;
        }
       else
       {
      this.isOwner=true;
       }
       this.allowMenuOptions();
      
      });
  }
  allowMenuOptions()
  {
    if(this.isOwner==false)
    {
    let allowed_access_options = this.storage.get('allowed_access_options');
    allowed_access_options.then((data) => {
      if(data!=null)
      {
        //debugger;
        let savedAccessLevels:any[]=data;
    //debugger;
     
      let createHotsheetAccesLevels=savedAccessLevels.filter((element) => {
        return (element.name=="Create Hotsheet");
    });
    if(createHotsheetAccesLevels.length>0)
      {
        this.isCreateHotsheetAccess=true;
      }
      else
      {
        this.isCreateHotsheetAccess=false;
      }
      let editHotsheetAccesLevels=savedAccessLevels.filter((element) => {
        return (element.name=="Edit Hotsheet");
    });
    if(editHotsheetAccesLevels.length>0)
      {
        this.isEditHotsheetAccess=true;
      }
      else
      {
        this.isEditHotsheetAccess=false;
      }
      let deleteHotsheetAccesLevels=savedAccessLevels.filter((element) => {
        return (element.name=="Delete Hotsheet");
    });
    if(deleteHotsheetAccesLevels.length>0)
      {
        this.isDeleteHotsheetAccess=true;
      }
      else
      {
        this.isDeleteHotsheetAccess=false;
      }
      }
    });
    
  }
  else
  {
    
    this.isCreateHotsheetAccess=true;
    this.isEditHotsheetAccess=true;
    this.isDeleteHotsheetAccess=true;
    
  }
  }
  viewAllHotSheets(refresher:any):void{
    if(this.userId!="")
    {
      
      this.allHotSheetList=[];
    
      if(refresher!=null)
    {
      refresher.complete();
    }
    else
    {
      this.loader.present();
    }
  this.userServiceObj.allUserHotSheets(this.userId.toString())
    .subscribe((result) => this.viewAllHotSheetResp(result));
    }
    
  }
  viewAllHotSheetResp(result:any):void{
    this.loader.dismiss();
    if(result.status==true)
    {
      
     // debugger;
      this.allHotSheetList=result.result;
      
    }
    else
    {
      //debugger;
      this.allHotSheetList=[];
      this.hotsheetFoundMessage="No hotsheet found.";
    }
    
  }
  editHotsheet(id:string):void{
   // debugger;
   if(this.isEditHotsheetAccess==true)
   {
    this.navCtrl.push(EditHotSheetPage,{id:id});
   }
    
  }
  deleteHotsheet(hotsheet:any):void{
    
    let confirm = this.alertCtrl.create({
      title: 'Delete HotSheet?',
      message: 'Are you sure to delete this hotsheet?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
           // console.log('Disagree clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            let selectedIndex = this.allHotSheetList.indexOf(hotsheet);
            if (selectedIndex >= 0) {
            this.allHotSheetList.splice(selectedIndex, 1);
            }
            if(this.allHotSheetList.length<=0)
            {
              this.hotsheetFoundMessage="All hotsheets have been deleted.Please add new hotsheet.";
              this.notificationMsg="";
            }
            this.userServiceObj.deleteHotsheet(this.userId.toString(),hotsheet.id)
            .subscribe((result) => this.deleteHotsheetResp(result));
          }
        }
      ]
    });
    confirm.present();
  }
  deleteHotsheetResp(result:any):void{
  //debugger;
  if(result.status==true)
  {
   // debugger;
 // this.viewAllHotSheets();
  }
  
  }
  createHotSheet()
  {
this.navCtrl.push(CreateHotSheetPage);
  }
}
