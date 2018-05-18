import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, 
  MenuController,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";

import { CreateRolePage } from '../create-role/create-role';
import { EditRolePage } from '../edit-role/edit-role';

import { AlertController } from 'ionic-angular';
import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
import { SubscriptionProvider } from '../../../providers/subscription/subscription';

/**
 * Generated class for the ViewRolesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-roles',
  templateUrl: 'view-roles.html',
})
export class ViewRolesPage {
  public isApp=false;
  public allRoles:any[]=[];
  public userId:string="";
  public parentId:string="";
  public allRolesFound:string="";
  public notificationMsg:string="";
  public loader:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public subscriptionObj: SubscriptionProvider,
    public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, 
    public ngZone: NgZone,public menuCtrl: MenuController,public loadingCtrl: LoadingController,
    private crop: Crop,private camera: Camera,private imagePicker: ImagePicker) {
      if(this.navParams.get('notificationMsg')!=undefined)
      {
        this.notificationMsg=this.navParams.get('notificationMsg');
      }
      this.isApp = (!document.URL.startsWith("http"));
      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 5000
      });
  }

  ionViewDidLoad() {
    //debugger;
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
      let parent_id = this.storage.get('parent_id');
      parent_id.then((data) => {
        if(data!=null)
        {
      this.parentId=data;
      this.getAllRoles(null);
        }
        else
        {
          this.getAllRoles(null);
        }
      //debugger;
      });
      
    });
    
  }
createRole()
{
  this.navCtrl.push(CreateRolePage);
}
getAllRoles(refresher:any){
  //debugger;
  let member_id="";
  if(this.parentId!="")
  {
    member_id=this.parentId;
  }
  else
  {
    member_id=this.userId;
  }
  if(refresher!=null)
  {
    refresher.complete();
  }
  else
  {
    this.loader.present();
  }
  this.userServiceObj.loadAllRoles(member_id)
  .subscribe((result) => this.getAllRolesResp(result));
}
getAllRolesResp(result: any)
{

this.loader.dismiss();
if(result.status==true)
{
 //debugger;
  this.allRoles=result.results;
  //debugger;
}
else
{
  this.allRoles=[];
  this.allRolesFound="No roles found.";
}
}
deleteRole(role:any)
{

  let confirm = this.alertCtrl.create({
    title: 'Delete Role?',
    message: 'Are you sure to delete this role?',
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
          let selectedIndex = this.allRoles.indexOf(role);
          if (selectedIndex >= 0) {
          this.allRoles.splice(selectedIndex, 1);
          }
         
          if(this.allRoles.length<=0)
          {
            this.allRolesFound="All roles have been deleted.Please add new role.";
            this.notificationMsg="";
          }
          this.userServiceObj.deleteRole(role.id.toString())
          .subscribe((result) => this.deleteRoleResp(result));
        }
      }
    ]
  });
  confirm.present();
}
deleteRoleResp(result:any):void{
  //debugger;
  if(result.status==true)
  {
   // debugger;
 // this.viewAllHotSheets();
  }
  
  }
  editRole(role_id:string)
  {
    if(role_id!="")
    {
      this.navCtrl.push(EditRolePage,{role_id:role_id});
    }
  }
}
