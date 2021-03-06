import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, 
  MenuController,LoadingController,ToastController } from 'ionic-angular';
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
     public platform: Platform,public loadingCtrl: LoadingController,private toastCtrl: ToastController) {
      this.isApp = (!document.URL.startsWith("http"));
      if(this.navParams.get('notificationMsg')!=undefined)
      {
        this.notificationMsg=this.navParams.get('notificationMsg');
        let toast = this.toastCtrl.create({
          message: this.navParams.get('notificationMsg'),
          duration: 3000,
          position: 'top',
          cssClass:'successToast'
        });
        
        toast.onDidDismiss(() => {
        });
        toast.present();
      }
      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 5000
      });
  }

  ionViewDidLoad() {
    this.sharedServiceObj.updateColorThemeMethod(null);
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
      this.viewAllHotSheets(null);
      this.setAccessLevels();
    });
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  setAccessLevels()
  {

    let parent_id = this.storage.get('parent_id');
      parent_id.then((data) => {
        if(data!=null)
        {
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
      this.isCreateHotsheetAccess=false;
      this.isEditHotsheetAccess=false;
      this.isDeleteHotsheetAccess=false;
    let allowed_access_options = this.storage.get('allowed_access_options');
    allowed_access_options.then((data) => {
      if(data!=null)
      {
        if(data!=false)
        {
        let savedAccessLevels:any[]=data;
     
      let createHotsheetAccesLevels=savedAccessLevels.filter((element) => {
        return (element.key=="create-hotsheet");
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
        return (element.key=="edit-hotsheet");
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
        return (element.key=="delete-hotsheet");
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
      this.allHotSheetList=result.result;
    }
    else
    {
      this.allHotSheetList=[];
      this.hotsheetFoundMessage="No hotsheet found.";
    }
    
  }
  editHotsheet(id:string):void{
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
              let toast = this.toastCtrl.create({
                message: this.hotsheetFoundMessage,
                duration: 3000,
                position: 'top',
                cssClass:'errorToast'
              });
              
              toast.onDidDismiss(() => {
              });
              toast.present();
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
  if(result.status==true)
  {
  }
  
  }
  createHotSheet()
  {
this.navCtrl.push(CreateHotSheetPage);
  }
}
