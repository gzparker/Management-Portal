import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, 
  MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";

import { ViewRolesPage } from '../view-roles/view-roles';

import { AlertController } from 'ionic-angular';
import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';

/**
 * Generated class for the CreateRolePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-role',
  templateUrl: 'create-role.html',
})
export class CreateRolePage {
  public role_name:string="";
  public roleUpdateMsg:string="";
  public isActive:boolean=true;
  public userId:string="";
  public all_access_levels:any[]=[];
  public access_level:any[]=[];
  public parentId:string="";
  public roleCreateMsg:string="";
  public isApp=false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController,
    private crop: Crop,private camera: Camera,private imagePicker: ImagePicker) {
      this.isApp = (!document.URL.startsWith("http"));
  }

  ionViewDidLoad() {
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
      this.getAllAccessLevels();
    });
  }
  getAllAccessLevels()
  {
    this.userServiceObj.loadAllAccessLevels()
    .subscribe((result) => this.getAllAccessLevelsResp(result));

  }
  getAllAccessLevelsResp(result: any)
  {
    if(result.status==true)
    {
this.all_access_levels=result.results;
    }
    else
    {
      this.all_access_levels=[];
    }
    //debugger;
  }
  /*selectAllAccessLevels(option:any)
  {
debugger;
this.access_level=this.all_access_levels;
  }*/
  createRole()
  {
    this.userServiceObj.createRole(this.access_level,this.userId,this.role_name)
    .subscribe((result) => this.createRoleResp(result));
  }
  createRoleResp(result:any)
  {
    if(result.status==true)
    {
      this.roleCreateMsg="Role has been created successfully.";

      this.ngZone.run(() => {
        this.navCtrl.push(ViewRolesPage,{notificationMsg:this.roleCreateMsg.toUpperCase()});
      });
    }
    else if(result.status==false)
    {
      this.ngZone.run(() => {
      this.roleCreateMsg=result.message;
    });
    }
  }
}
