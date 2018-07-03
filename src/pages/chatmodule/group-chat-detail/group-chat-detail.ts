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

import { GroupMembersPage } from '../group-members/group-members';

import { ChatingImagePopUpPage } from '../chating-image-pop-up/chating-image-pop-up';
import { NewGroupPopupPage } from '../new-group-popup/new-group-popup';
import { NewMessagePopupPage } from '../new-message-popup/new-message-popup';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
/**
 * Generated class for the GroupChatDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var firebase:any;
@IonicPage()
@Component({
  selector: 'page-group-chat-detail',
  templateUrl: 'group-chat-detail.html',
})
export class GroupChatDetailPage {

  @ViewChild(Content) content: Content;
  public groupId:string="";
  public chatingUserName:string="";
  public firebaseUserId:string="";
  public returnedGroup:any;
  public users:any[]=[];
  public chatDetailArray:any[]=[];
  public isApp=false;
  public chatImage:string="";
  public description:string="";
  public userId:string="";
  public noImgUrl="../assets/imgs/profile-photo.jpg";
  public loggedInUserInfo:any;
public messageSent:string="0";

  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, 
    public platform: Platform,public actionSheetCtrl: ActionSheetController) {
      this.isApp = (!document.URL.startsWith("http"));
      if(this.navParams.get('groupId')!=undefined)
   {
    this.groupId = this.navParams.get('groupId');
    //debugger;
    }
    if(this.navParams.get('chatterName')!=undefined)
   {
    this.chatingUserName = this.navParams.get('chatterName');
    //;
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
    this.groupMessageDetail();
    });
    });
    });
  }
  ionViewDidEnter()
  {
    var that=this;
    setTimeout(() => {
    
      that.scrollToBottom();
    }, 400);
   //that.scrollToBottom();
  }
  setUserTyping(groupId){
let that=this;
//debugger;
    //var fredRef=firebase.database().ref('groups/'+groupId);
  //fredRef.update({userTyping:"1",typerId:that.firebaseUserId});
  that.sharedServiceObj.setUserTyping(groupId,that.firebaseUserId);
  }
   setUserNotTyping(groupId){
    let that=this;
    //debugger;
    //var fredRef=firebase.database().ref('groups/'+groupId);
  //fredRef.update({userTyping:"0"});
that.sharedServiceObj.setUserNotTyping(groupId);
   }
  groupMessageDetail() {
    var that=this;
    //debugger;
    that.chatDetailArray=[];
        var chatDetailArrayExist=[];
        firebase.database().ref('groups').orderByChild("groupId").equalTo(that.groupId).on("value", function(snapshot) {
          snapshot.forEach(element=>{
        that.returnedGroup=element;
      // debugger;
          });
        //debugger;
     //let test="ddf";
     //debugger;
        var fredRef=firebase.database().ref('users').on('value', function(snapshot) {
          that.users=[];
        snapshot.forEach(element=>{
          that.users.push(element.val());
        });
            
       
      });
      
      firebase.database().ref('chats').orderByChild("groupId").equalTo(that.groupId).on("value", function(snapshot) {
        that.chatDetailArray=[];
       let i=0;
     //debugger;
        snapshot.forEach(element => {
          that.chatDetailArray.push(element);
    i=i+1;
    if(i==snapshot.numChildren()){
      that.sharedServiceObj.markMessageAsRead(that.firebaseUserId,that.chatDetailArray)
        //    debugger;
    //that.scrollToBottom();
    }
    //if(snapshot.length-1==i)
    //{
      //
    //}
          
        });
        
      });
      });
      
 }
 saveGroupMessage(){
   var that=this;
  var readBy=[that.firebaseUserId];
if(document.getElementById("chatDescription").innerHTML=="")
{
return false;
}
var groupId=that.groupId;
 var deletedFor=["0"];
//debugger;
//var group =Firebase.get('groups','groupId',groupId);
//group.$loaded().then(function (){
  firebase.database().ref('groups').orderByChild("groupId").equalTo(groupId).on("child_added", function(snapshot) {
    if(snapshot.val()){
var selectedGroup=snapshot;

var fredRef=firebase.database().ref('groups/'+selectedGroup.key);
fredRef.update({deletedFor:deletedFor,modifiedDate:Date(),message:that.description});
var chat = firebase.database().ref('chats');
chat.push({
                               fromUserName:that.loggedInUserInfo.memberCredentials.first_name,
                               toUserName:"",
                                 fromFbUserId: that.firebaseUserId,
                                 toFbUserId: "",
                                 fromUserImage:that.loggedInUserInfo.memberCredentials.image_url,
                                 toUserImage:"",
                                 message:document.getElementById("chatDescription").innerHTML,
                                 imageData:that.chatImage,
                                 dateCreated: Date(),
                                 deletedFor:deletedFor,
                                 readBy:readBy,
                                 provider: 'Firebase',
                                 groupId:groupId
                                
                             }).then(function (ref) {
                              document.getElementById("chatDescription").innerHTML="";
                               that.scrollToBottom();
that.chatImage="";

                               //sendGroupMessageNotification($rootScope.first_name,$scope.contactData.description,groupId);
                             //$scope.contactData.description="";
                             });



//});
                            }
                          });
};
openEmoji()
   {
     var that=this;
     var modalPage = this.modalCtrl.create(ChatEmojiPopupoverPage);
     modalPage.onDidDismiss(data => {
       that.selectEmoji(data.selectedEmoji);
   });
     modalPage.present();
   }
   replaceEmoji(description)
   {
    return this.sharedServiceObj.replaceEmoji(description);
   }
   selectEmoji(emojiCode)
   {
     this.description=this.sharedServiceObj.selectEmoji(emojiCode,document.getElementById("chatDescription").innerHTML);
     
   }
 scrollToBottom()
   {
     var that=this;
     //debugger;
     if(that.content!=undefined&&that.content!=null)
     {
      that.content.scrollToBottom();
     }
     //;
   }
   manageGroups(groupId:string)
   {
    // debugger;
     this.navCtrl.push(GroupMembersPage, { groupId: groupId });
   }
   leaveGroup(groupId) {
     var that=this;
     let confirm = this.alertCtrl.create({
      title: 'Leave Group?',
      message: 'Are you sure you want to leave this Group?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Ok',
          handler: () => {
   firebase.database().ref('groupMembers').orderByChild("groupId").equalTo(that.groupId).on("value", function(snapshot) {
    snapshot.forEach(element => {
      if(element.val().userId==that.firebaseUserId)
    {
  var groupForDelete=firebase.database().ref('groupMembers/'+element.key).remove();
    that.navCtrl.setRoot(ChatPage);
    }
    });
   })
  }
}
]
});
confirm.present();  
    }
  deleteGroup(groupId) {
  var that=this;
  let confirm = this.alertCtrl.create({
    title: 'Delete Group?',
    message: 'Are you sure you want to delete this Group?',
    buttons: [
      {
        text: 'Cancel',
        handler: () => {
        }
      },
      {
        text: 'Ok',
        handler: () => {
    firebase.database().ref('groups').orderByChild("groupId").equalTo(groupId).once("value", function(snapshot) {
      snapshot.forEach((data)=>{
    
   // debugger;
     var groupForDelete=firebase.database().ref('groups/'+data.key).remove();
     that.navCtrl.setRoot(ChatPage);
                })
              });
            }
          }
        ]
        });
        confirm.present();  
          
    }
}
