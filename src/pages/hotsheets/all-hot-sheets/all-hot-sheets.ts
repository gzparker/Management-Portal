import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, MenuController } from 'ionic-angular';
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
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform) {
      if(this.navParams.get('notificationMsg')!=undefined)
      {
        this.notificationMsg=this.navParams.get('notificationMsg');
      }
  }

  ionViewDidLoad() {
    
    let member_id = this.storage.get('userId');
    //debugger;
    member_id.then((data) => {
      this.userId=data;
      this.viewAllHotSheets();
    });
  }

  viewAllHotSheets():void{
    if(this.userId!="")
    {
      this.allHotSheetList=[];
     
  this.userServiceObj.allUserHotSheets(this.userId.toString())
    .subscribe((result) => this.viewAllHotSheetResp(result));
    }
    
  }
  viewAllHotSheetResp(result:any):void{
   
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
  deleteHotsheet(id:string):void{
    if(this.userId!="")
    {
   
  this.userServiceObj.deleteHotsheet(this.userId.toString(),id)
    .subscribe((result) => this.deleteHotsheetResp(result));
    }
  }
  deleteHotsheetResp(result:any):void{
  //debugger;
  if(result.status==true)
  {
   // debugger;
  this.viewAllHotSheets();
  }
  
  }
  createHotSheet()
  {
this.navCtrl.push(CreateHotSheetPage);
  }
}
