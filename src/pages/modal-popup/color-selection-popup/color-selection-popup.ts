import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
   MenuController,ActionSheetController,Tabs, ViewController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { ISubscription } from "rxjs/Subscription";
import { AlertController,ToastController } from 'ionic-angular';

import { DashboardTabsPage } from '../../tabs/dashboard-tabs/dashboard-tabs';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';


/**
 * Generated class for the ColorSelectionPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-color-selection-popup',
  templateUrl: 'color-selection-popup.html',
})
export class ColorSelectionPopupPage {
  public colorOptions:any[]=[{id:"base_color",name:"1st Color"},{id:"secondary_color",name:"2nd Color"},
  {id:"tertiary_color",name:"3rd Color"}];
  public selectedColorOption:string="";
  public option:string="";
  public customColor:string="";
  public oldSelectedColorOption:string="";
  public oldOption:string="";
  public oldCustomColor:string="";
  public colorBase:string="";
  public secondColor:string="";
  public thirdColor:string="";
  public selectedColorObj:any;
  public showCustomColor:boolean=false;
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, 
    public platform: Platform,public actionSheetCtrl: ActionSheetController,
    public viewCtrl: ViewController,private toastCtrl: ToastController) {
    if(this.navParams.get('selectedColor')!=undefined)
    {
      this.selectedColorObj=this.navParams.get('selectedColor');
      this.selectedColorOption=this.selectedColorObj.selectedColorOption;
      this.oldSelectedColorOption=this.selectedColorOption
      /*if(this.selectedColorObj.selectedColor==undefined||this.selectedColorObj.selectedColor==null)
      {
        this.customColor="#000000";
        this.oldCustomColor="";
        //debugger;
      }
      if(this.selectedColorObj.selectedColor=="")
      {
        this.customColor="#000000";
        this.oldCustomColor="";
        //debugger;
      }
      else
      {
        this.customColor=this.selectedColorObj.selectedColor;
        this.oldCustomColor=this.selectedColorObj.selectedColor;
      }*/
      this.customColor=this.selectedColorObj.selectedColor;
        this.oldCustomColor=this.selectedColorObj.selectedColor;
      //debugger;
      this.colorBase=this.selectedColorObj.colorBase;
      this.secondColor=this.selectedColorObj.secondColor;
      this.thirdColor=this.selectedColorObj.thirdColor;
      this.option=this.selectedColorObj.option;
      this.oldOption=this.selectedColorObj.option;
    // debugger;
    //this.option = this.navParams.get('option');
    }
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  ionViewDidLoad() {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  selectColor(){
    if(this.selectedColorOption=="custom")
    {
this.showCustomColor=true;
    }
    else
    {
      this.showCustomColor=false;
    }
  }
  closePopUp()
  {
    
    /*else
    {
      this.selectColor.
    }*/
   // debugger;
    let selectedColor={
      option:this.oldOption,
      selectedColorOption:this.oldSelectedColorOption,
      selectedColor:this.oldCustomColor,
      isCustomColor:false
    }
    //let selectedColor=this.selectedColorMethod();
    this.viewCtrl.dismiss(selectedColor);
  }
  saveColor()
  {
    //debugger;
    let selectedColor=this.selectedColorMethod();
    this.viewCtrl.dismiss(selectedColor);
  }
  selectedColorMethod()
  {
    let selectedColor={option:"",
      selectedColorOption:"",
      selectedColor:"",
      isCustomColor:false};
    selectedColor.option=this.option;
    selectedColor.selectedColorOption=this.selectedColorOption;
    if(this.selectedColorOption=="custom")
    {
      selectedColor.isCustomColor=true;
      selectedColor.selectedColor=this.customColor;
    }
    else
    {selectedColor.isCustomColor=false;
      selectedColor.selectedColor='';
    }
    return selectedColor;
  }
  setCustomColor(colorValue:any)
  {
this.customColor=colorValue;
//debugger;
  }
}
