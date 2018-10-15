import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, 
  MenuController,LoadingController,ToastController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";
import { PicturePopupPage } from '../../../pages/modal-popup/picture-popup/picture-popup';

import { ViewRolesPage } from '../view-roles/view-roles';

import { AlertController } from 'ionic-angular';
import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';

/**
 * Generated class for the EditRolePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-role',
  templateUrl: 'edit-role.html',
})
export class EditRolePage {
  public role_name:string="";
  public roleUpdateMsg:string="";
  public isActive:boolean=true;
  public userId:string="";
  public access_level_model:string="";
  public all_access_levels:any[]=[];
  public access_level:any[]=[];
  public testCheckbox:boolean=true;
  public parentId:string="";
 
  public role_id:string="";
  public roleDetail:any;
  public isApp=false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController,
    private crop: Crop,private camera: Camera,private imagePicker: ImagePicker,private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.sharedServiceObj.updateColorThemeMethod(null);
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
      if(this.navParams.get('role_id')!=undefined)
      {
       this.role_id = this.navParams.get('role_id');
       this.loadRoleDetail();
       this.getAllAccessLevels();
       }
    });
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  ngAfterContentInit(){
    //debugger;
   
     
    //debugger;
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
setSelectedAccessLevels(roleId:string)
{

let selectedIndex = this.access_level.indexOf(roleId);
    
    
    if (selectedIndex >= 0) {
    
      this.access_level.splice(selectedIndex, 1);

    }
    else {

      this.access_level.push(roleId);
    }
//debugger;
}
checkAccessLevelExistis(access_option)
{
  //debugger;
  let selectedIndex = this.access_level.indexOf(access_option);
      
    //debugger;
    if (selectedIndex >= 0) {
 return true;
   }
    else
   {
     return false;
   }
    //return true;
}
  loadRoleDetail()
  {
    this.userServiceObj.roleDetail(this.role_id)
    .subscribe((result) => this.loadRoleDetailResp(result));
  }
  loadRoleDetailResp(result:any)
  {
    if(result.status==true)
    {
      if(result.result)
      {
        this.roleDetail=result.result;
        //debugger;
        this.role_name=this.roleDetail.name;
        if(this.roleDetail.allowed_options!=null)
      {
        this.access_level=this.roleDetail.allowed_options.split(",");
        //debugger;
      }
      }
    }
    //debugger;
  }
  updateRole()
  {
   // debugger;
this.userServiceObj.updateRole(this.access_level,this.role_id,this.role_name)
.subscribe((result) => this.updateRoleResp(result));
  }
  updateRoleResp(result:any)
  {
if(result.status==true)
{
  this.roleUpdateMsg="Role has been updated successfully.";
  this.ngZone.run(() => {
    this.navCtrl.push(ViewRolesPage,{notificationMsg:this.roleUpdateMsg.toUpperCase()});
  });
}
else
{
  this.roleUpdateMsg="Role has not been updated successfully.";
  /*let alert = this.alertCtrl.create({
    title: 'Error',
    subTitle: this.roleUpdateMsg,
    buttons: ['Ok']
  });
  alert.present();*/
  let toast = this.toastCtrl.create({
    message: this.roleUpdateMsg,
    duration: 3000,
    position: 'top',
    cssClass:'errorToast'
  });
  
  toast.onDidDismiss(() => {
    //console.log('Dismissed toast');
  });
  toast.present();
}
    
  }

}
