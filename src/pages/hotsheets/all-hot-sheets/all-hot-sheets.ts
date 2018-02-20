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
  public loader:any;
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController,
     public platform: Platform,public loadingCtrl: LoadingController) {
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
    //debugger;
    member_id.then((data) => {
      this.userId=data;
      this.viewAllHotSheets(null);
    });
  }

  viewAllHotSheets(refresher:any):void{
    if(this.userId!="")
    {
      
      this.allHotSheetList=[];
      //let loader = this.loadingCtrl.create({
      //  content: "Please wait...",
      //  duration: 700
      //});
      //loader.present();
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
    this.navCtrl.push(EditHotSheetPage,{id:id});
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
