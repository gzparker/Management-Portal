import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
   MenuController,ActionSheetController,Tabs, ViewController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { ISubscription } from "rxjs/Subscription";
import { AlertController } from 'ionic-angular';

import { ChatAccountPage } from '../chat-account/chat-account';
import { ChatActivitiesPage } from '../chat-activities/chat-activities';
import { ChatDetailPage } from '../chat-detail/chat-detail';
import { ChatEmojiPopupoverPage } from '../chat-emoji-popupover/chat-emoji-popupover';
import { ChatFriendsPage } from '../chat-friends/chat-friends';
import { ChatFriendsActivePage } from '../chat-friends-active/chat-friends-active';
import { ChatFriendsMessengerPage } from '../chat-friends-messenger/chat-friends-messenger';
import { ChatGroupsPage } from '../chat-groups/chat-groups';
import { ChatsPage } from '../chats/chats';
import { ChatingImagePopUpPage } from '../chating-image-pop-up/chating-image-pop-up';
import { NewGroupPopupPage } from '../new-group-popup/new-group-popup';
import { NewMessagePopupPage } from '../new-message-popup/new-message-popup';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var firebase:any;
@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  public chatGroups:any[]=[];
  public chatGroupsOld:any[]=[];
  public groupMembersData:any[]=[];
  public groupMembersDataOld:any[]=[];
  public firebaseUserId:string="";
  public searchText:string="";
  public isApp=false;
  public users:any[]=[];
  public usersOld:any[]=[];
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, 
    public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, 
    public platform: Platform,public actionSheetCtrl: ActionSheetController,public viewCtrl: ViewController) {
      this.isApp = (!document.URL.startsWith("http"));
  }
  ionViewDidLoad() {
    var that=this;
    let firebaseUserIdData = this.storage.get('firebaseUserId');
    firebaseUserIdData.then((data) => {
    this.firebaseUserId=data;
    //let abc="dfdf";
    //debugger;
this.getMessages();
    });
  }
  showNewGroupPopUp()
  {
    var modalPage = this.modalCtrl.create(NewGroupPopupPage);
    modalPage.present();
  }
  showNewMessagePopUp()
  {
    var modalPage = this.modalCtrl.create(NewMessagePopupPage, { isContact: "2" });
    modalPage.present();
  }
  searchChat=function()
  {
    var searchText=this.searchText;
   var that=this;
   //debugger;
      var chatMatches = this.chatGroupsOld.filter( function(chat) {
if(chat.val().isGroup=="0")
        {
        if(that.firebaseUserId==chat.val().fromFbUserId)
        {
        if(chat.val().toUserName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 ) return true;
      }
      else
      {
 if(chat.val().fromUserName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 ) return true;
      }
    }
    else if(chat.val().isGroup=="1")
    {
if(chat.val().groupTitle.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 ) return true;
    }
      });

      that.chatGroups=chatMatches;
      //let abc="dfd";
     // debugger;
      that.users=this.usersOld;
      that.groupMembersData=this.groupMembersDataOld;

  }
  getMessages() {
    var that=this;
    //debugger;
    this.chatGroups=[];
   this.chatGroupsOld=[];
  var fredRef=firebase.database().ref('users').on('child_added', function(snapshot) {
    //debugger;
      that.users.push(snapshot.val());
      that.usersOld.push(snapshot.val());
     // debugger;
});
    this.loadAllGroupMembers();
    this.loadAllChatGroups();
   
   }
loadAllGroupMembers()
{
  var that=this;
  
  var fredRef=firebase.database().ref('groupMembers').on('child_added', function(snapshot) {
    //debugger;
    that.groupMembersData.push(snapshot.val());
    that.groupMembersDataOld.push(snapshot.val());
   // debugger;
});
}
loadAllChatGroups()
{
  var that=this;
  var fredRef=firebase.database().ref('groups').on('child_added', function(snapshot) {
    that.chatGroups.push(snapshot);
    that.chatGroupsOld.push(snapshot);
    //let abc="ssd";
    //debugger;
    //debugger;
});
var chatsObjRef=firebase.database().ref('chats').once('value', function(chatsObjRefVal) {

 if(chatsObjRefVal.exists())
 {
   that.countUnreadMessages();
 }
});

}
countUnreadMessages()
{
  //debugger;
var that=this;
  that.chatGroups.forEach(function(groupData) {
if(groupData.val().deletedFor!=undefined)
{
if(groupData.val().deletedFor.indexOf(that.firebaseUserId)<0)
{
 if(groupData.val().isGroup==0)
 {
  if(groupData.val().fromFbUserId==that.firebaseUserId||groupData.val().toFbUserId==that.firebaseUserId)
  {
    that.totalUnreadMessages(groupData.val());

  }
 }
 else if(groupData.val().isGroup==1)
 {
if(that.groupMembersData)
{
  that.groupMembersData.forEach(function(groupMember) {
  if(groupMember.userId==that.firebaseUserId&&groupMember.groupId==groupData.val().groupId)
  {
    that.totalUnreadMessages(groupData.val());
   
  }
  });
}
 }
}
}
});

}
totalUnreadMessages(groupData)
{
  var that=this;
  let allUnreadMessage=0;
  var unreadCounter=0;
    firebase.database().ref('chats').orderByChild("groupId").equalTo(groupData.groupId).on("child_added", function(snapshot) {
      if(snapshot.val()){
if(snapshot.val().readBy.indexOf(that.firebaseUserId)<0)
{
  unreadCounter=unreadCounter+1;
}
      }});
      if(unreadCounter>0)
{
allUnreadMessage=allUnreadMessage+unreadCounter;
  groupData.unreadMessagesCounter=unreadCounter;
  that.storage.set("allUnreadMessage",allUnreadMessage);
  
}

}
deleteGroupChat(groupId,id) {
 //debugger;
 var that=this;
 var groupRef=firebase.database().ref('groups/'+id);

 //var groupRef=Firebase.firebaseRef().child('groups/'+id);
//var deleteGroup=firebase.database().getById('groups',id);
var deleteGroupObjRef=firebase.database().ref('groups/'+id).once('value', function(deleteGroupRefVal) {
 // debugger;
  if(deleteGroupRefVal.exists())
 {
  // let abc="dfdf";
  // debugger;
  var deletedGroup=deleteGroupRefVal.val();
                            
  var deletedGroupArray=[];
  deletedGroupArray=deletedGroup.deletedFor;
  
  deletedGroupArray.push(that.firebaseUserId);
 
  groupRef.update({deletedFor:deletedGroupArray});

 }
 firebase.database().ref('chats').orderByChild("groupId").equalTo(groupId).on("child_added", function(chatForDelete) {
  if(chatForDelete.val()){
    firebase.database().ref('chats/'+chatForDelete.key).once('value', function(deleteChatRefVal) {
if(deleteChatRefVal.exists())
{
  var deleteChating=deleteChatRefVal.val();
  
  var deletedChatingArray=[];
  deletedChatingArray=deleteChating.deletedFor;
  
  deletedChatingArray.push(that.firebaseUserId);
 //debugger;
 let fredRef=firebase.database().ref('chats/'+chatForDelete.key)
  fredRef.update({deletedFor:deletedChatingArray});
}
  
  
    });
  }});
 
});

that.getMessages();              

}
convertToDate(modifiedDate)
{
  if(modifiedDate)
  {
    return new Date(modifiedDate);
  }
else
{
  return "";
}
}
}
