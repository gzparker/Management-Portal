import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, MenuController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';

import { AlertController } from 'ionic-angular';
import { DashboardTabsPage } from '../../tabs/dashboard-tabs/dashboard-tabs';

import { ManageAgentsPage } from '../manage-agents/manage-agents';
import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { GlobalPreferencesPage } from '../../setup/global-preferences/global-preferences';
import { MlsSettingsPage } from '../../setup/mls-settings/mls-settings';
import { UserOptionPage } from '../../setup/user-option/user-option';
/**
 * Generated class for the SetupOptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setup-option',
  templateUrl: 'setup-option.html',
})
export class SetupOptionPage {
  public userId:string="";
  public parentId:string="";
  public isOwner:boolean=false;
  public isGlobalPreference:boolean=false;
  public isAgents:boolean=false;
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetupOptionPage');
    this.setAccessLevels();
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
      
    let globalPreferenceAccesLevels=savedAccessLevels.filter((element) => {
        return (element.name=="Global Preference");
    });
    if(globalPreferenceAccesLevels.length>0)
      {
        this.isGlobalPreference=true;
      }
      else
      {
        this.isGlobalPreference=false;
      }
      let usersAccesLevels=savedAccessLevels.filter((element) => {
        return (element.name=="View Agents");
    });
    if(usersAccesLevels.length>0)
      {
        this.isAgents=true;
      }
      else
      {
        this.isAgents=false;
      } 
      }
    });
  }
  else
  {
    //debugger;
    this.isGlobalPreference=true;
    this.isAgents=true;
    
  }
  }
  openPage(pageNumber:string) {
    if(pageNumber=="10")
    {
      this.navCtrl.push(GlobalPreferencesPage);
    }
    else if(pageNumber=="12")
    {
      this.navCtrl.push(ManageAgentsPage);
    }
    //debugger;
    //this.sharedServiceObj.setNavigationalPage(pageNumber);
    //this.navCtrl.setRoot(DashboardTabsPage,{selectedPage:pageNumber.toString()});
  }
}
