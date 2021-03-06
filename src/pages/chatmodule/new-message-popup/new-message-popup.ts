import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
   MenuController,ActionSheetController,Tabs, ViewController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { ISubscription } from "rxjs/Subscription";
import { AlertController } from 'ionic-angular';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';

/**
 * Generated class for the NewMessagePopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var firebase:any;
@Component({
  selector: 'page-new-message-popup',
  templateUrl: 'new-message-popup.html',
})
export class NewMessagePopupPage {
public description:string="";
public newChatMember:any;
public allAvailableContacts:any[]=[];
public allAvailableSearchedContacts:any[]=[];
public keyword: string;
public searchKeyword:string="";
public newChatMemberSelected:any;
public isContact:string="";
public userId:string="";
public groupId:string="";
public redirectUserId:string="";
public firebaseUserId:string="";
public loggedInUserInfo:any;
public messageSent:string="0";
public chatImage:string="";
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, 
    public platform: Platform,public actionSheetCtrl: ActionSheetController,public viewCtrl: ViewController) {
      if(this.navParams.get('isContact')!=undefined)
   {
    this.isContact = this.navParams.get('isContact');
    }
    if(this.navParams.get('groupId')!=undefined)
   {
    this.groupId = this.navParams.get('groupId');
    }
    if(this.navParams.get('redirectUserId')!=undefined)
   {
    this.redirectUserId = this.navParams.get('redirectUserId');
    }
    sharedServiceObj.chatNewMsgSentEmiter.subscribe(item => this.msgSentResp(item));
  }

  ionViewDidLoad() {
    this.sharedServiceObj.updateColorThemeMethod(null);
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
      let firebaseUserId = this.storage.get('firebaseUserId');
      firebaseUserId.then((data) => {
      this.firebaseUserId=data;
      let loggedInUserInfo = this.storage.get('loggedInUserInfo');
      loggedInUserInfo.then((data) => {
this.loggedInUserInfo=data;
    this.loadAllContacts();
    });
    });
    });
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  closePopUp()
  {
    this.viewCtrl.dismiss();
  }
  loadAllContacts()
  {
    let that=this;
    let firebaseUserId = this.storage.get('firebaseUserId');
    firebaseUserId.then((data) => {
    var fredRef=firebase.database().ref('users').on('child_added', function(snapshot) {
      if(snapshot.val().first_name!=undefined&&snapshot.val().last_name!=undefined)
      {
        if(data!=snapshot.val().fbId)
        {
          that.allAvailableContacts.push(snapshot.val());
        }
      }
  });

    });
   
  }
  filterContacts()
  {
    if(this.searchKeyword!="")
    {
      this.allAvailableSearchedContacts = this.allAvailableContacts.filter(
        contact => (contact.first_name.toLowerCase()+" "+contact.last_name.toLowerCase()).indexOf(this.searchKeyword.toLowerCase()) > -1);
    }
    else
    {
      this.allAvailableSearchedContacts=[];
    }
  }
  selectChatMember(availableContact:any)
  {
    this.newChatMember=availableContact;
    this.searchKeyword=this.newChatMember.first_name+" "+this.newChatMember.last_name;
    this.allAvailableSearchedContacts=[];
  }
sendMessage(type:string)
{
this.sharedServiceObj.sendMessage(type,this.description,this.redirectUserId,this.firebaseUserId,
  this.newChatMember,this.groupId,this.loggedInUserInfo,this.chatImage,undefined);
}
msgSentResp(resp:any)
{
if(resp=="1")
{
  this.ngZone.run(() => {
   this.closePopUp();
  });
}
}
 
}
