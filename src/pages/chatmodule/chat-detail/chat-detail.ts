import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
   MenuController,ActionSheetController,Tabs,Content } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { ISubscription } from "rxjs/Subscription";
import { AlertController } from 'ionic-angular';
import { ChatPage } from '../chat/chat';
import { ChatAccountPage } from '../chat-account/chat-account';
import { ChatActivitiesPage } from '../chat-activities/chat-activities';
import { ChatEmojiPopupoverPage } from '../chat-emoji-popupover/chat-emoji-popupover';
import { ChatFriendsPage } from '../chat-friends/chat-friends';
import { ChatFriendsActivePage } from '../chat-friends-active/chat-friends-active';
import { ChatFriendsMessengerPage } from '../chat-friends-messenger/chat-friends-messenger';
import { ChatGroupsPage } from '../chat-groups/chat-groups';
import { ChatsPage } from '../chats/chats';
import { ChatingImagePopUpPage } from '../chating-image-pop-up/chating-image-pop-up';
import { NewGroupPopupPage } from '../new-group-popup/new-group-popup';
import { NewMessagePopupPage } from '../new-message-popup/new-message-popup';
import { GroupChatDetailPage } from '../group-chat-detail/group-chat-detail';
import { GroupMembersPage } from '../group-members/group-members';

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';
/**
 * Generated class for the ChatDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var firebase:any;
@IonicPage()
@Component({
  selector: 'page-chat-detail',
  templateUrl: 'chat-detail.html',
})
export class ChatDetailPage {
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
    sharedServiceObj.chatOldMsgSentEmiter.subscribe(item => this.msgSentResp(item));
    //debugger;
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
    this.messageDetail();
    });
    });
    });
  }
  ionViewDidEnter()
  {
    var that=this;
   this.scrollToBottom();
  }
  messageDetail(){
var that=this;
//debugger;
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
that.scrollToBottom();
}
//if(snapshot.length-1==i)
//{
  //
//}
      
    });
    
  });
  });
  
  
  
   }
   scrollToBottom()
   {
     var that=this;
     if(this.content!=undefined)
     {
      that.content.scrollToBottom();
     }
     
   }
   setUserTyping=function(groupId){
    // debugger;
let that=this;
    var fredRef=firebase.database().ref('groups/'+groupId);
  
  //The following 2 function calls are equivalent
  fredRef.update({userTyping:"1",typerId:that.firebaseUserId});
  }
   setUserNotTyping=function(groupId){

    var fredRef=firebase.database().ref('groups/'+groupId);
   
  //The following 2 function calls are equivalent
  fredRef.update({userTyping:"0"});
  }
  sendMessage(type:string)
  {
   // debugger;
    this.sharedServiceObj.sendMessage(type,this.description,undefined,this.firebaseUserId,
      undefined,this.groupId,this.loggedInUserInfo,this.chatImage,this.chatDetailArray);
  }
  msgSentResp(resp:any)
{
if(resp=="1")
{
  this.ngZone.run(() => {
    this.messageSent="1";
    this.chatImage="";
    this.description="";
    //this.navCtrl.push(ChatPage);
  });
}
}
deleteSingleChat = function(groupId,chatId) {
var that=this;
  //var fredRef=firebase.database().ref('chats/'+chatId);
  //debugger;
    var fredRefChat=firebase.database().ref('chats/'+chatId);
    firebase.database().ref('chats/'+chatId).once('value', function(snapshot) {
      
      if(snapshot.exists())
      {
                                var deleteChating=snapshot.val();
                                
                                var deletedChatingArray=[];
                                var messageToUpdate="";
                                deletedChatingArray=deleteChating.deletedFor;
                                
                                deletedChatingArray.push(that.firebaseUserId);
                            //debugger;
                                fredRefChat.update({deletedFor:deletedChatingArray});
                                firebase.database().ref('chats').orderByChild("groupId").equalTo(groupId).on("value", function(chatDetailObj) {
                                      var messageExist="0";
                                      //var chatDetailsArray=chatDetails;
                                      chatDetailObj.forEach(function(chatDetail) {
  if(chatDetail.val().deletedFor.indexOf(that.firebaseUserId)<0)
  {
    
  messageExist="1";
  messageToUpdate=chatDetail.val().message;
  
  }
  
                                      });
                               
  //var group =Firebase.get('groups','groupId',groupId);
  //group.$loaded().then(function (){
    firebase.database().ref('groups').orderByChild("groupId").equalTo(groupId).on("value", function(groupObj) {
      groupObj.forEach(function(group) {
    var selectedGroup=group;
   //debugger;
    var fredRefGroup=firebase.database().ref('groups/'+selectedGroup.key);
   if(messageExist=="0")
   {
                                var deletedGroupArray=[];
                                deletedGroupArray=selectedGroup.val().deletedFor;
                                
                                deletedGroupArray.push(that.firebaseUserId);
                               
                                fredRefGroup.update({deletedFor:deletedGroupArray});
    }
    else
    {
      
    }
  });
  });

                                    });
                                //that.messageDetail();
                                  }
                                  });
  
    
  
    }
}
