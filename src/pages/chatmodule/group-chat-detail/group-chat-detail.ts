import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
   MenuController,ActionSheetController,Tabs,Content,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { ISubscription } from "rxjs/Subscription";
import { AlertController,ToastController } from 'ionic-angular';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";
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
  @ViewChild('chatImageCropper', undefined)
  chatImageCropper:ImageCropperComponent;
  @ViewChild(Content) content: Content;
  public groupId:string="";
  public chatingUserName:string="";
  public firebaseUserId:string="";
  public returnedGroup:any;
  public users:any[]=[];
  public chatDetailArray:any[]=[];
  public isApp=false;
  public description:string="";
  public userId:string="";
  public noImgUrl="../assets/imgs/profile-photo.jpg";
  public loggedInUserInfo:any;
public messageSent:string="0";
public chatImage:string="";
public hideChatImageSelect:boolean=false;
public hideChatCropper:boolean=true;
public edit_chat_image:boolean=false;
public crop_chat_image:boolean=false;
public chatCropperSettings;
public dataChatImage:any;
public chatWidth:string="";
  public chatHeight:string="";

  public chatImageChangedEvent:any='';
  public groupRef:any;
  public groupMemberRef:any;
  public chatRef:any;
  public userRef:any;
  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, 
    public platform: Platform,public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,private toastCtrl: ToastController) {
      this.isApp = (!document.URL.startsWith("http"));
      if(this.navParams.get('groupId')!=undefined)
   {
    this.groupId = this.navParams.get('groupId');
    }
    if(this.navParams.get('chatterName')!=undefined)
   {
    this.chatingUserName = this.navParams.get('chatterName');
    }
    this.hideChatCropper=false;
    this.chatCropperSettings = new CropperSettings();
    this.chatCropperSettings.width = 100;
    this.chatCropperSettings.height = 100;
    this.chatCropperSettings.croppedWidth = 1280;
    this.chatCropperSettings.croppedHeight = 1000;
    this.chatCropperSettings.canvasWidth = 500;
    this.chatCropperSettings.canvasHeight = 300;
    this.chatCropperSettings.minWidth = 10;
    this.chatCropperSettings.minHeight = 10;

    this.chatCropperSettings.rounded = false;
    this.chatCropperSettings.keepAspect = false;

    this.chatCropperSettings.noFileInput = true;
    this.dataChatImage= {};
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
    this.groupMessageDetail(null);
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
  }
  ionViewDidLeave()
  {
    if(this.groupRef!=undefined)
    {
      this.groupRef.off("value");
    }
if(this.userRef!=undefined)
{
  this.userRef.off("value");
}
if(this.chatRef!=undefined)
{
this.chatRef.off("value");
}
  }
  ionViewWillLeave()
  {
    if(this.groupRef!=undefined)
    {
      this.groupRef.off("value");
    }
if(this.userRef!=undefined)
{
  this.userRef.off("value");
}
if(this.chatRef!=undefined)
{
this.chatRef.off("value");
}
  }
  openImageOptions() {
    let buttonsArray=[];
    if(this.isApp)
    {
      buttonsArray=[
       {
         text: 'Select Image',
         
         handler: () => {
           this.takeUserPhoto('gallery');
         }
       },{
         text: 'Take Image',
         handler: () => {
           this.takeUserPhoto('gallery');
         }
       }
       ,
       {
         text: 'Cancel',
         
         handler: () => {
           console.log('Cancel clicked');
         }
       }
     ];
    }
    else
    {
     buttonsArray=[
       {
         text: 'Upload Image',
         handler: () => {
           this.hideChatImageSelect=true;
           //this.scrollChatToBottom();
           //this.uploadImage();
         }
       },
       {
         text: 'Cancel',
         
         handler: () => {
          this.hideChatImageSelect=false;
         }
       }
     ]
    }
   let actionSheet = this.actionSheetCtrl.create({
     buttons: buttonsArray
   });

   actionSheet.present();
 }
 takeUserPhoto(option:string)
{
//debugger;
}
  setUserTyping(groupId){
let that=this;
  that.sharedServiceObj.setUserTyping(groupId,that.firebaseUserId);
  }
   setUserNotTyping(groupId){
    let that=this;
that.sharedServiceObj.setUserNotTyping(groupId);
   }
  groupMessageDetail(refresher:any) {
    var that=this;
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 700
    });
    loader.present();
    if(refresher!=null)
  {
    refresher.complete();
  }
    that.chatDetailArray=[];
        var chatDetailArrayExist=[];
        that.groupRef=firebase.database().ref('groups');
        that.groupRef.orderByChild("groupId").equalTo(that.groupId).on("value", function(snapshot) {
          snapshot.forEach(element=>{
        that.returnedGroup=element;
      // debugger;
          });
      
     that.userRef=firebase.database().ref('users');
     that.userRef.on('value', function(snapshot) {
          that.users=[];
        snapshot.forEach(element=>{
          that.users.push(element.val());
        });
            
       
      });
      that.chatRef=firebase.database().ref('chats');
      that.chatRef.orderByChild("groupId").equalTo(that.groupId).on("value", function(snapshot) {
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
  var readBy=[];
  readBy.push(that.firebaseUserId);
if(document.getElementById("chatDescription").innerHTML=="")
{
  let alert = this.alertCtrl.create({
    title: 'Message Alert',
    subTitle: 'Please type something in message box.',
    buttons: ['Dismiss']
  });
  alert.present();
return false;
}
var groupId=that.groupId;
 var deletedFor=["0"];
//debugger;
//var group =Firebase.get('groups','groupId',groupId);
//group.$loaded().then(function (){
  var groupDummyRef=firebase.database().ref('groups');
  groupDummyRef.orderByChild("groupId").equalTo(groupId).on("child_added", function(snapshot) {
    if(snapshot.exists()){
      
var selectedGroup=snapshot.val();

var fredRef=firebase.database().ref('groups/'+snapshot.key);
fredRef.update({deletedFor:deletedFor,modifiedDate:Date(),message:document.getElementById("chatDescription").innerHTML});
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
                              //debugger;
                               that.scrollToBottom();
                               that.hideChatImageSelect=false;
that.chatImage="";
that.hideChatCropper=false;
that.edit_chat_image=false;
that.crop_chat_image=false;
that.dataChatImage={};
that.chatImage="";
                               //sendGroupMessageNotification($rootScope.first_name,$scope.contactData.description,groupId);
                             //$scope.contactData.description="";
                             });



//});
                            
                            groupDummyRef.off("child_added");
                          }
                          });
                          //groupDummyRef.off("child_added");
};
openEmoji()
   {
     var that=this;
     var modalPage = this.modalCtrl.create(ChatEmojiPopupoverPage);
     modalPage.onDidDismiss(data => {
      if(data!=undefined)
      {
        if(data.selectedEmoji!=undefined||data.selectedEmoji!=null)
        {
         that.selectEmoji(data.selectedEmoji);
        }
      }
      
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
      if(this.content._scroll)
      {
      that.content.scrollToBottom();
      }
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
            var groupMemberRef=firebase.database().ref('groupMembers');
            groupMemberRef.orderByChild("groupId").equalTo(that.groupId).on("value", function(snapshot) {
if(snapshot.exists())
{
    snapshot.forEach(element => {
      if(element.val().userId==that.firebaseUserId)
    {
  var groupForDelete=firebase.database().ref('groupMembers/'+element.key).remove();
    that.navCtrl.setRoot(ChatPage);
    }
    });
    groupMemberRef.off("value");
  }
   });
   
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
          var groupDummyRef=firebase.database().ref('groups');
          groupDummyRef.orderByChild("groupId").equalTo(groupId).once("value", function(snapshot) {
if(snapshot.exists())
{
      snapshot.forEach((data)=>{
    
   // debugger;
     var groupForDelete=firebase.database().ref('groups/'+data.key).remove();
     that.navCtrl.setRoot(ChatPage);
                });
                groupDummyRef.off("value");
              } 
              });
              
            }
          }
        ]
        });
        confirm.present();  
          
    }
    deleteSingleChat(groupId,chatId) {

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
          var chatIdRef=firebase.database().ref('chats/'+chatId);
          chatIdRef.once('value', function(snapshot) {
            
            if(snapshot.exists())
            {
                                      var deleteChating=snapshot.val();
                                      
                                      var deletedChatingArray=[];
                                      var messageToUpdate="";
                                      deletedChatingArray=deleteChating.deletedFor;
                                      
                                      deletedChatingArray.push(that.firebaseUserId);
                                      chatIdRef.update({deletedFor:deletedChatingArray});
                                      var chatDummyRef=firebase.database().ref('chats');
                                      chatDummyRef.orderByChild("groupId").equalTo(groupId).once("value", function(chatDetailObj) {
                                            var messageExist="0";
                                            chatDetailObj.forEach(function(chatDetail) {
        if(chatDetail.val().deletedFor.indexOf(that.firebaseUserId)<0)
        {
          
        messageExist="1";
        messageToUpdate=chatDetail.val().message;
        
        }
        
                                            });
        var groupDummyRef=firebase.database().ref('groups');
        groupDummyRef.orderByChild("groupId").equalTo(groupId).once("value", function(groupObj) {
if(groupObj.exists()){
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
       // groupDummyRef.off("value");
      }
        });
      
                                          });
//chatDummyRef.off("value");
                                        }
                                        });
                                        //chatIdRef.off("value");
           }
        }
      ]
      });
      confirm.present();  
        
          }
    chatFileChangeListener($event) {
      this.hideChatCropper=true;
      this.edit_chat_image=true;
      this.crop_chat_image=true;
      var image:any = new Image();
      var file:File = $event.target.files[0];
      var myReader:FileReader = new FileReader();
      var that = this;
      myReader.onloadend = function (loadEvent:any) {
          image.src = loadEvent.target.result;
          //that.chatImageCropper.setImage(image);
          image.onload = function () {
            that.chatCropperSettings.croppedWidth=this.width;
            that.chatCropperSettings.croppedHeight=this.height;
            that.chatImageCropper.setImage(image);
          }
      };
  
      myReader.readAsDataURL(file);
  }
  showHideChatCropper(){
    this.crop_chat_image=false;
    const self = this;
if(this.edit_chat_image)
{
  this.hideChatCropper=true;
  if(this.chatImage!="")
  {
   // this.companyCropperLoaded=true;
    var image:any = new Image();
    image.src = this.chatImage;
            image.onload = function () {
              self.chatImageCropper.setImage(image); 
            }
 }
  
}
else
{
  this.hideChatCropper=false;
}
  }
  chatImageCropped(image:any)
    {
      if(this.crop_chat_image)
      {
        this.chatCropperSettings.croppedWidth=image.width;
        this.chatCropperSettings.croppedHeight=image.height;
        
        let that=this;
        this.resizeChatImage(this.dataChatImage.image, data => {
        
          that.chatImage=data;
          that.chatImage=data;
          this.createChatImageThumbnail(that.chatImage);
            });
      }
     else
     {
       this.crop_chat_image=true;
     } 
     
    }
    createChatImageThumbnail(bigMatch:any) {
      let that=this;
      //debugger;
        this.generateChatImageFromImage(bigMatch, 500, 500, 0.5, data => {
          
      that.dataChatImage.image=data;
        });
      }
      generateChatImageFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
        var canvas: any = document.createElement("canvas");
        var image:any = new Image();
        //image.width=this.companyCropperSettings.croppedWidth;
        //image.height=this.companyCropperSettings.croppedHeight;
        var that=this;
     //debugger;
        image.src = img;
        image.onload = function () {
         
          var width=that.chatCropperSettings.croppedWidth;
          var height=that.chatCropperSettings.croppedHeight;
         //debugger;
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          //debugger;
          canvas.width = width;
          canvas.height = height;
          that.chatWidth = width;
          that.chatHeight = height;
          //debugger;
          var ctx = canvas.getContext("2d");
     
          ctx.drawImage(image, 0, 0, width, height);
     
          // IMPORTANT: 'jpeg' NOT 'jpg'
          var dataUrl = canvas.toDataURL('image/jpeg', quality);
     
          callback(dataUrl)
        }
        
      }
      resizeChatImage(img:any,callback)
      {
        var canvas: any = document.createElement("canvas");
        var image:any = new Image();
       
        var that=this;
    
        image.src = img;
        image.onload = function () {
         
          var width=that.chatCropperSettings.croppedWidth;
          var height=that.chatCropperSettings.croppedHeight;
        
          canvas.width = width;
          canvas.height = height;
    
          var ctx = canvas.getContext("2d");
     
          ctx.drawImage(image, 0, 0, width, height);
    
          var dataUrl = canvas.toDataURL('image/jpeg', 1);
    
         callback(dataUrl)
        }
      }
}
