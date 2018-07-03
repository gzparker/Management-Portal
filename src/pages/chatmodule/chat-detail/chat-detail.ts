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
private CkeditorConfig = {uiColor: '#99000',removeButtons:'Underline,Subscript,Superscript,SpecialChar'
  ,toolbar: [
    { name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ 'Source'] },
    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', '-', 'RemoveFormat' ] },
    { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
    { name: 'links', items: [ 'Link', 'Unlink'] },
    { name: 'styles', items: ['Format', 'FontSize' ] }
  ]};
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
    }
    sharedServiceObj.chatOldMsgSentEmiter.subscribe(item => this.msgSentResp(item));
    
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
   //this.scrollToBottom();
   //debugger;
   setTimeout(() => {
    
    that.scrollToBottom();
  }, 400);
  }
  messageDetail(){
var that=this;
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
      let i=0;
    snapshot.forEach(element=>{
      that.users.push(element.val());
      i=i+1;

if(i==snapshot.numChildren()){
  //debugger;
//that.scrollToBottom();
}
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
  //debugger;
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
     if(that.content!=undefined&&that.content!=null)
     {
      that.content.scrollToBottom();
     }
   }
   setUserTyping(groupId:any,description:any){
    // debugger;
  let that=this;
//debugger;
  that.sharedServiceObj.setUserTyping(groupId,that.firebaseUserId);
  //debugger;
 // that.description=document.getElementById("chatDescription").innerText;
  //that.moveCaret();
  //document.getElementById("chatDescription").innerHTML=that.description;
  //document.getElementById("chatDescription").focus();
  //debugger;
  }
   setUserNotTyping(groupId:any){
    let that=this;
    //debugger;
    that.sharedServiceObj.setUserNotTyping(groupId);
    //document.getElementById("chatDescription").focus();
    //that.description=description.innerHTML;
  }
  sendMessage(type:string)
  {
   // debugger;
    this.sharedServiceObj.sendMessage(type,document.getElementById("chatDescription").innerHTML,undefined,this.firebaseUserId,
      undefined,this.groupId,this.loggedInUserInfo,this.chatImage,this.chatDetailArray);
  }
  msgSentResp(resp:any)
{
  var that=this;
if(resp=="1")
{
  this.ngZone.run(() => {
    this.messageSent="1";
    this.chatImage="";
    document.getElementById("chatDescription").innerHTML="";
    //this.description="";
    //document.getElementById("chatDescription").innerHTML="";
    that.scrollToBottom();
    //this.navCtrl.push(ChatPage);
  });
}
}
deleteSingleChat = function(groupId,chatId) {

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
    var fredRefChat=firebase.database().ref('chats/'+chatId);
    firebase.database().ref('chats/'+chatId).once('value', function(snapshot) {
      
      if(snapshot.exists())
      {
                                var deleteChating=snapshot.val();
                                
                                var deletedChatingArray=[];
                                var messageToUpdate="";
                                deletedChatingArray=deleteChating.deletedFor;
                                
                                deletedChatingArray.push(that.firebaseUserId);
                                fredRefChat.update({deletedFor:deletedChatingArray});
                                firebase.database().ref('chats').orderByChild("groupId").equalTo(groupId).on("value", function(chatDetailObj) {
                                      var messageExist="0";
                                      chatDetailObj.forEach(function(chatDetail) {
  if(chatDetail.val().deletedFor.indexOf(that.firebaseUserId)<0)
  {
    
  messageExist="1";
  messageToUpdate=chatDetail.val().message;
  
  }
  
                                      });
  
    firebase.database().ref('groups').orderByChild("groupId").equalTo(groupId).on("value", function(groupObj) {
      groupObj.forEach(function(group) {
    var selectedGroup=group;
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
                                  }
                                  });
  
     }
  }
]
});
confirm.present();  
  
    }
  private moveCaret(): void {

      /*let range = document.createRange(),
          pos = document.getElementById("chatDescription").innerText.length - 1,
          sel = window.getSelection();
  
      range.setStart(document.getElementById("chatDescription"), pos);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);*/
  }   
}
