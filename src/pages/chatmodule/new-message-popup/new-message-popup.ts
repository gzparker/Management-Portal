import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
   MenuController,ActionSheetController,Tabs, ViewController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { ISubscription } from "rxjs/Subscription";
import { AlertController } from 'ionic-angular';

import { ChatPage } from '../chat/chat';
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

import { SharedProvider } from '../../../providers/shared/shared';
import { UserProvider } from '../../../providers/user/user';

/**
 * Generated class for the NewMessagePopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var firebase:any;
@IonicPage()
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
      //debugger;
      if(data!=snapshot.val().fbId)
      {
        that.allAvailableContacts.push(snapshot.val());

      }
    
    
  });

    });
   // debugger;
  }
  filterContacts()
  {
    //this.allAvailableSearchedContacts=[];
    if(this.searchKeyword!="")
    {
      //crtuk
     
      this.allAvailableSearchedContacts = this.allAvailableContacts.filter(
        contact => contact.first_name.toLowerCase().indexOf(this.searchKeyword.toLowerCase()) > -1);
    }
    else
    {
      this.allAvailableSearchedContacts=[];
    }
      //let abc="ddfd";
      //debugger;
   // this.selectedCountryCode = foundCountry[0].country_code;
  }
  selectChatMember(availableContact:any)
  {
    this.newChatMember=availableContact;
    this.searchKeyword=this.newChatMember.first_name+" "+this.newChatMember.last_name;
    this.allAvailableSearchedContacts=[];
//debugger;
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
    this.navCtrl.push(ChatPage);
  });
}
}
 /*sendMessage(type:string) {
 let that=this;
    var deletedFor=["0"];
  
    var groupId="group";
    var memberId="1";
    var createDate=Date();
  
  if(this.description=="")
  {
    return false;
  }
    if(this.redirectUserId)
    {
    memberId=this.redirectUserId;
    
        if(memberId<this.firebaseUserId)
        {
       groupId="group"+"_"+memberId+"_"+this.firebaseUserId;
     }
     else
     {
  groupId="group"+"_"+this.firebaseUserId+"_"+memberId;
     }
   }
   else if(this.newChatMember.fbId)
   {
   
     memberId=this.newChatMember.fbId;
    
        if(memberId<this.firebaseUserId)
        {
       groupId="group"+"_"+memberId+"_"+this.firebaseUserId;
     }
     else
     {
  groupId="group"+"_"+this.firebaseUserId+"_"+memberId;
     }
   }
   else
   {
  groupId=this.groupId;
    
   }
  
    var groups=firebase.database().ref('groups');
    this.description=this.description;
    var groups=firebase.database().ref('groups').once('value', function(groupsVal) {

    if(groupsVal.exists())
    {
     
      firebase.database().ref('groups').orderByChild("groupId").equalTo(groupId).on("child_added", function(snapshot) {
        if(snapshot.val()){
     
          var returnedGroup=snapshot.val();
          createDate=returnedGroup.dateCreated;

          var fredRef=firebase.database().ref('groups/'+snapshot.key);
        fredRef.update({message:that.description,deletedFor:deletedFor,modifiedDate:Date()});
        that.saveMessage(groupId,memberId,type);
                         
                       }
                       else
                       {
                        that.saveGroup(groupId,memberId,type,createDate);
                        that.saveMessage(groupId,memberId,type);
                       }
      });
    }
    else
    {
      that.saveGroup(groupId,memberId,type,createDate);      
      that.saveMessage(groupId,memberId,type);                  
  
    }
    
                 
    
  });

   }
   saveGroup(groupId,memberId,type,createDate){
   let that=this;
    var deletedFor=["0"];
    var toUserName="";
    var toUserImage="";
  if(this.newChatMember)
  {
  if(this.newChatMember.first_name!=undefined)
  {
  toUserName=this.newChatMember.first_name+" "+this.newChatMember.last_name;
  }
  if(this.newChatMember.image_url!=undefined)
  {
  toUserImage=this.newChatMember.image_url;
  }
  }

  var groups=firebase.database().ref('groups');
   
                                  groups.push({
                                    fromUserName:that.loggedInUserInfo.memberCredentials.first_name,
                                    toUserName:toUserName,
                                      fromFbUserId: that.firebaseUserId,
                                      toFbUserId: memberId,
                                      isGroup:0,
                                      groupImage:"",
                                      fromUserImage:that.loggedInUserInfo.memberCredentials.image_url,
                                      toUserImage:toUserImage,
                                      groupTitle:"",
                                      message:that.description,
                                      dateCreated:createDate,
                                      provider: 'Firebase',
                                      deletedFor:deletedFor,
                                      groupId:groupId,
                                      modifiedDate:Date()
                                     
                                  }).then(function (ref) {
                                    
                                  });
  
   };
   saveMessage(groupId,memberId,type){
    let that=this;
    var readBy=this.firebaseUserId;
    var deletedFor=["0"];
    var msgDescription=this.description;
    var toImageUrl="";
    var toUserName="";
    var toUserImage="";
  
    var chat = firebase.database().ref('chats');
    if(type=="new")
  {
      
    if(this.newChatMember)
  {
  if(this.newChatMember.first_name!=undefined)
  {
  toUserName=this.newChatMember.first_name+" "+this.newChatMember.last_name;
  }
  if(this.newChatMember.image_url!=undefined)
  {
  toUserImage=this.newChatMember.image_url;
  }
  }

         
                                  chat.push({
                                    fromUserName:that.loggedInUserInfo.memberCredentials.first_name,
                                    toUserName:toUserName,
                                      fromFbUserId: that.firebaseUserId,
                                      toFbUserId: memberId,
                                      fromUserImage:that.loggedInUserInfo.memberCredentials.image_url,
                                      toUserImage:toImageUrl,
                                      message:msgDescription,
                                     imageData:that.chatImage,
                                      dateCreated: Date(),
                                      provider: 'Firebase',
                                      deletedFor:deletedFor,
                                      readBy:readBy,
                                      groupId:groupId
                                     
                                  }).then(function (ref) {
                                     //$scope.closeNewMessage();
                                     that.chatImage="";
                                   // ContactService.sendMessageNotification(memberId,that.loggedInUserInfo.memberCredentials.first_name,"",msgDescription,that.loggedInUserInfo.memberCredentials.image_url);
                                    //$state.go("app.chat", null, {reload: true, notify:true});
                                    that.ngZone.run(() => {
                                      that.navCtrl.push(ChatPage);
                                    });
                                  });
   }
  
   }*/
}