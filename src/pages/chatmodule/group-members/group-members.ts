import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
   MenuController,ActionSheetController,Tabs,Content } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { ISubscription } from "rxjs/Subscription";
import { AlertController } from 'ionic-angular';
import { ChatPage } from '../chat/chat';
import { ChatsPage } from '../chats/chats';
import { ChatAccountPage } from '../chat-account/chat-account';
import { ChatActivitiesPage } from '../chat-activities/chat-activities';
import { ChatDetailPage } from '../chat-detail/chat-detail';
import { ChatEmojiPopupoverPage } from '../chat-emoji-popupover/chat-emoji-popupover';
import { ChatFriendsPage } from '../chat-friends/chat-friends';
import { ChatFriendsActivePage } from '../chat-friends-active/chat-friends-active';
import { ChatFriendsMessengerPage } from '../chat-friends-messenger/chat-friends-messenger';
import { ChatGroupsPage } from '../chat-groups/chat-groups';

import { GroupChatDetailPage } from '../group-chat-detail/group-chat-detail';

import { ChatingImagePopUpPage } from '../chating-image-pop-up/chating-image-pop-up';
import { NewGroupPopupPage } from '../new-group-popup/new-group-popup';
import { NewMessagePopupPage } from '../new-message-popup/new-message-popup';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
/**
 * Generated class for the GroupMembersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var firebase:any;
@IonicPage()
@Component({
  selector: 'page-group-members',
  templateUrl: 'group-members.html',
})
export class GroupMembersPage {
  public noImgUrl="../assets/imgs/profile-photo.jpg";
  public groupId:string="";
  public groupMembersData:any[]=[];
  public groupMembersItem:any[]=[];
  public allAvailableContacts:any[]=[];
  public loggedInUserInfo:any;
  public firebaseUserId:any;
  public userId:string="";
  public groupKey:string="";
  public groupTitle:string="";
  public notificationMsg:string="";
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, 
    public platform: Platform,public actionSheetCtrl: ActionSheetController) {
    if(this.navParams.get('groupId')!=undefined)
   {
    this.groupId = this.navParams.get('groupId');
    }
    if(this.navParams.get('groupKey')!=undefined)
   {
    this.groupKey = this.navParams.get('groupKey');
   }
  }
  
  ionViewDidLoad() {
    var that=this;
    let member_id = this.storage.get('userId');
    member_id.then((data) => {
      this.userId=data;
      let firebaseUserId = this.storage.get('firebaseUserId');
      firebaseUserId.then((data) => {
      this.firebaseUserId=data;
      let loggedInUserInfo = this.storage.get('loggedInUserInfo');
      loggedInUserInfo.then((data) => {
this.loggedInUserInfo=data;
    this.groupDetails();
    this.loadAllContacts();
    });
    });
    });
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  loadAllContacts()
  {
    //debugger;
    let that=this;
    that.allAvailableContacts=[];
    let firebaseUserId = this.storage.get('firebaseUserId');
    firebaseUserId.then((data) => {
    var fredRef=firebase.database().ref('users').on('child_added', function(snapshot) {
      //debugger;
      if(data!=snapshot.val().fbId)
      {
        if(that.groupMembersData.length>0)
        {
          //debugger;
          if(snapshot.val().fbId!=undefined&&snapshot.val().fbId!=null)
          {

            if(!that.groupMembersData.find(groupMember => groupMember.val().userId === snapshot.val().fbId.toString()))
            {
              that.allAvailableContacts.push(snapshot.val());
            }
          }
        }
        else
        {
          that.allAvailableContacts.push(snapshot.val());
        }
        
        
      }
  });
    });
   // debugger;
  }
  updateGroup()
  {

    var that=this;
    var createDate=Date();
    var groupRef=firebase.database().ref('groups/'+that.groupKey);
    groupRef.update({groupTitle:that.groupTitle});
    let i=0;
    var groupMembers=firebase.database().ref('groupMembers');
    that.groupMembersItem.forEach(function(memberData) {
      var name="";
      //debugger;
      var fbId="";
      var image_url="";
if(memberData.first_name!=undefined)
{
name=memberData.first_name;
}
if(memberData.last_name!=undefined)
{
name=name+" "+memberData.last_name;
}
if(memberData.fbId)
{
fbId=memberData.fbId;
}
if(memberData.image_url)
{
image_url=memberData.image_url;
}                                   //debugger;
groupMembers.push({
memberName:name,
userId:fbId,
image:image_url,
dateCreated:createDate,
groupId:that.groupId,
provider: 'Firebase'
});

i=i+1;
i=i;
//debugger;

    });
    this.ngZone.run(() => {
      //debugger;
      this.navCtrl.push(ChatPage, { notificationMsg: "Group updated successfully."});
    });
  }
  groupDetails() {
  var that=this;
  that.groupMembersData=[];
  firebase.database().ref('groups').orderByChild("groupId").equalTo(that.groupId).on("child_added", function(snapshot) {
    if(snapshot.val()){
      that.groupTitle=snapshot.val().groupTitle;
    }});
  firebase.database().ref('groupMembers').orderByChild("groupId").equalTo(that.groupId).on("child_added", function(snapshot) {
    if(snapshot.val()){
      that.groupMembersData.push(snapshot);
    }});
    
  }
  deleteMember(memberId) {
     var that=this;
     let confirm = this.alertCtrl.create({
      title: 'Delete Group Member?',
      message: 'Are you sure you want to delete this member?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Ok',
          handler: () => {
      var groupForDelete=firebase.database().ref('groupMembers/'+memberId).remove();
      that.groupDetails();
      that.loadAllContacts();
    }
  }
]
});
confirm.present();   
    }
}
