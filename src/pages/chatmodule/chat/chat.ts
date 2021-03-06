import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
   MenuController,ActionSheetController,Tabs, ViewController,LoadingController,ToastController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';

import { ChatDetailPage } from '../chat-detail/chat-detail';
import { NewGroupPopupPage } from '../new-group-popup/new-group-popup';
import { NewMessagePopupPage } from '../new-message-popup/new-message-popup';
import { GroupChatDetailPage } from '../group-chat-detail/group-chat-detail';
import { GroupMembersPage } from '../group-members/group-members';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var firebase:any;
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
  public notificationMsg:string="";
  public isApp=false;
  public users:any[]=[];
  public usersOld:any[]=[];
  public noImgUrl="../assets/imgs/profile-photo.jpg";
  public groupRef:any;
  public groupMemberRef:any;
  public chatRef:any;
  public userRef:any;
  
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, 
    public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, 
    public platform: Platform,public actionSheetCtrl: ActionSheetController,
    public viewCtrl: ViewController,public loadingCtrl: LoadingController,private toastCtrl: ToastController) {
      this.isApp = (!document.URL.startsWith("http"));
      //sharedServiceObj.chatNewMsgSentEmiter.subscribe(item => this.msgSentResp(item));
      sharedServiceObj.groupCreationEmiter.subscribe(item => this.groupCreationResp(item));
      if(this.navParams.get('notificationMsg')!=undefined&&this.navParams.get('notificationMsg')!='')
      {
        this.notificationMsg=this.navParams.get('notificationMsg');
        
        let toast = this.toastCtrl.create({
          message: this.navParams.get('notificationMsg'),
          duration: 3000,
          position: 'top',
          cssClass:'successToast'
        });
        
        toast.onDidDismiss(() => {
          //console.log('Dismissed toast');
        });
        
        toast.present();
      }
  }
  ionViewDidLoad() {
    this.sharedServiceObj.updateColorThemeMethod(null);
  this.groupRef=firebase.database().ref('groups');
  this.userRef=firebase.database().ref('users');
  this.chatRef=firebase.database().ref('chats');
  this.groupMemberRef=firebase.database().ref('groupMembers');
  }
  ionViewDidEnter()
  {
    var that=this;
    this.sharedServiceObj.updateColorThemeMethod(null);
    let firebaseUserIdData = this.storage.get('firebaseUserId');
    firebaseUserIdData.then((data) => {
    this.firebaseUserId=data;
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 700
    });
    loader.present();
    
this.getMessages(null);
this.sharedServiceObj.updateColorThemeMethod(null);
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
  
  manageGroups(groupId:string,groupKey:string)
  {
   // debugger;
    this.navCtrl.push(GroupMembersPage, { groupId: groupId,groupKey:groupKey });
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
  getMessages(refresher:any) {
    var that=this;
    this.ngZone.run(() => {
    this.chatGroups=[];
    this.chatGroupsOld=[];
  var fredRef=firebase.database().ref('users').on('value', function(snapshot) {
    that.users=[];
    that.usersOld=[];
    snapshot.forEach((data)=>{
      that.users.push(data.val());
      that.usersOld.push(data.val());
    })
});
    this.loadAllGroupMembers();
    this.loadAllChatGroups();
});
   }
   msgSentResp(resp:any)
{
if(resp=="1")
{
  this.ngZone.run(() => {
    //this.navCtrl.push(ChatPage);
    //this.closePopUp();
    //this.getMessages(null);
  });
}
}
groupCreationResp(resp:any)
{
if(resp=="1")
{
  this.ngZone.run(() => {
    //this.navCtrl.push(ChatPage);
    //this.closePopUp();
    this.getMessages(null);
  });
}
}
loadAllGroupMembers()
{
  var that=this;
  that.groupMembersData=[];
  that.groupMembersDataOld=[];
  var fredRef=firebase.database().ref('groupMembers').on('value', function(snapshot) {
    //debugger;
    that.groupMembersData=[];
  that.groupMembersDataOld=[];
    snapshot.forEach((data)=>{
      //debugger;
      that.groupMembersData.push(data.val());
      that.groupMembersDataOld.push(data.val());
      //debugger;
    });
    
    //debugger;
});
/*var fredRefDel=firebase.database().ref('groupMembers').on('child_removed', function(snapshot) {
  that.groupMembersData=[];
  that.groupMembersDataOld=[];
  snapshot.forEach((data)=>{
    that.groupMembersData.push(data.val());
    that.groupMembersDataOld.push(data.val());
  });
  //that.groupMembersDataOld.push(snapshot.val());
});*/
}
loadAllChatGroups()
{
  var that=this;
  that.chatGroups=[];
  that.chatGroupsOld=[];
  var fredRef=firebase.database().ref('groups').on('value', function(snapshot) {
    if(snapshot.exists())
    {
      that.chatGroups=[];
      that.chatGroupsOld=[];
      snapshot.forEach(element => {
        if(element.key!=undefined)
        {
          that.chatGroups.push(element);
          that.chatGroupsOld.push(element);
        }
    
      });
  }
});
var chatsObjRef=firebase.database().ref('chats').on('value', function(chatsObjRefVal) {
 if(chatsObjRefVal.exists())
 {
   //that.countUnreadMessages();
 }
});

}
imageExists(image_url){

  var http = new XMLHttpRequest();

  http.open('HEAD', image_url, false);
  http.send();

  return http.status != 404;

}
countUnreadMessages()
{
var that=this;
let i=0;
  that.chatGroups.forEach(function(groupData) {
if(groupData.val().deletedFor!=undefined)
{
if(groupData.val().deletedFor.indexOf(that.firebaseUserId)<0)
{
 if(groupData.val().isGroup==0)
 {
  if(groupData.val().fromFbUserId==that.firebaseUserId||groupData.val().toFbUserId==that.firebaseUserId)
  {
    that.totalUnreadMessages(groupData,i);
  }
 }
 else if(groupData.val().isGroup==1)
 {
if(that.groupMembersData)
{
  that.groupMembersData.forEach(function(groupMember) {
  if(groupMember.userId==that.firebaseUserId&&groupMember.groupId==groupData.val().groupId)
  {
    that.totalUnreadMessages(groupData,i);
  }
  });
}
 }
}
}
i=i+1;
});
}
totalUnreadMessages(groupData:any,arrIndex:any)
{
 // debugger;
  var that=this;
  let allUnreadMessage=0;
  var unreadCounter=0;
  let i=0;
    firebase.database().ref('chats').orderByChild("groupId").equalTo(groupData.val().groupId).on("value", function(snapshot) {
      i=0;
      snapshot.forEach(element => {
        i=i+1;
if(element.val().readBy.indexOf(that.firebaseUserId)<0)
{
  unreadCounter=unreadCounter+1;
}
if(i==snapshot.numChildren())
{
  if(unreadCounter>0)
  {
  allUnreadMessage=allUnreadMessage+unreadCounter;
    let chatGroupsOld=that.chatGroups;
    that.chatGroups=[];
    that.chatGroups=chatGroupsOld;
    that.sharedServiceObj.setUnreadMsgs(allUnreadMessage.toString());
    that.storage.set("allUnreadMessage",allUnreadMessage.toString());
  }
  else
  {
    that.sharedServiceObj.setUnreadMsgs("0");
    that.storage.set("allUnreadMessage","0");
  }
}

});
});
}
deleteGroupChat(group,groupId,id) {
 var that=this;
 let confirm = this.alertCtrl.create({
  title: 'Delete Chat?',
  message: 'Are you sure you want to delete this chat?',
  buttons: [
    {
      text: 'Cancel',
      handler: () => {
      }
    },
    {
      text: 'Ok',
      handler: () => {
 var groupRef=firebase.database().ref('groups/'+id);

 groupRef.once('value', function(deleteGroupRefVal) {

  if(deleteGroupRefVal.exists())
 {
  let selectedIndex = that.chatGroups.indexOf(group);
  if (selectedIndex >= 0) {
  that.chatGroups.splice(selectedIndex, 1);
  }
  var deletedGroup=deleteGroupRefVal.val();
                            
  var deletedGroupArray=[];
  deletedGroupArray=deletedGroup.deletedFor;
  
  deletedGroupArray.push(that.firebaseUserId);
 
  groupRef.update({deletedFor:deletedGroupArray});
 // debugger;
  groupRef.off("value");
 }
 var chatDummyRef=firebase.database().ref('chats');
 chatDummyRef.orderByChild("groupId").equalTo(groupId).on("child_added", function(chatForDelete) {
   if(chatForDelete.exists())
   {
  //that.chatRef.orderByChild("groupId").equalTo(groupId).on("child_added", function(chatForDelete) {
  if(chatForDelete.val()){
    var chatIdRef=firebase.database().ref('chats/'+chatForDelete.key);
    firebase.database().ref('chats/'+chatForDelete.key).once('value', function(deleteChatRefVal) {
if(deleteChatRefVal.exists())
{
  var deleteChating=deleteChatRefVal.val();
  
  var deletedChatingArray=[];
  deletedChatingArray=deleteChating.deletedFor;
  
  deletedChatingArray.push(that.firebaseUserId);
 let fredRef=firebase.database().ref('chats/'+chatForDelete.key)
  fredRef.update({deletedFor:deletedChatingArray});
  chatIdRef.off("value");
}
    });
    
  }
  chatDummyRef.off("child_added");
}
});

});

that.getMessages(null);              
   
}
}
]
});
confirm.present();
}
chatDetail(groupId:string,fromFbUserId:string,fromUserName:string,toUserName:string,type:string)
{
 // debugger;
  let chatterName="";
  if(fromFbUserId==this.firebaseUserId)
  {
    chatterName=toUserName
  }
else
{
  chatterName=fromUserName;
}
if(type=="1")
{
  this.ngZone.run(() => {
    this.navCtrl.push(ChatDetailPage, { groupId: groupId,chatterName:chatterName });
  });
}
else if(type=="2")
{
  this.ngZone.run(() => {
    //debugger;
    this.navCtrl.push(GroupChatDetailPage, { groupId: groupId,chatterName:chatterName });
  });
}
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
