import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform,
   MenuController,ActionSheetController,Tabs,Content,LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";
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
  public chatImage:string="";
  public description:string="";
  public userId:string="";
  public noImgUrl="../assets/imgs/profile-photo.jpg";
  public loggedInUserInfo:any;
public messageSent:string="0";

public hideChatCropper:boolean=true;
public edit_chat_image:boolean=false;
public crop_chat_image:boolean=false;
public chatCropperSettings;
public dataChatImage:any;
public chatWidth:string="";
  public chatHeight:string="";
  public groupRef:any;
  public groupMemberRef:any;
  public chatRef:any;
  public userRef:any;
  //public chatImage:string="";
  public chatImageChangedEvent:any='';
private CkeditorConfig = {removeButtons:'Underline,Subscript,Superscript,SpecialChar'
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
    public platform: Platform,public actionSheetCtrl: ActionSheetController,public loadingCtrl: LoadingController) {
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
    this.messageDetail(null);
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
    
    that.scrollChatToBottom();
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
  messageDetail(refresher:any){
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
    var chatDetailArrayExist=[];
    //firebase.database().ref('groups').orderByChild("groupId").equalTo(that.groupId).on("value", function(snapshot) {
    that.groupRef=firebase.database().ref('groups');
    that.groupRef.orderByChild("groupId").equalTo(that.groupId).on("value", function(snapshot) {
      snapshot.forEach(element=>{
    that.returnedGroup=element;
      });
    //debugger;
 //let test="ddf";
 //debugger;
 that.userRef=firebase.database().ref('users');
 that.userRef.on('value', function(snapshot) {
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
  that.chatRef=firebase.database().ref('chats');
  that.chatRef.orderByChild("groupId").equalTo(that.groupId).on("value", function(snapshot) {
    that.chatDetailArray=[];
   let i=0;
    snapshot.forEach(element => {
      that.chatDetailArray.push(element);
i=i+1;
if(i==snapshot.numChildren()){
  that.sharedServiceObj.markMessageAsRead(that.firebaseUserId,that.chatDetailArray)
}
    });
    
  });
  });
   }

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
   scrollChatToBottom()
   {
     var that=this;
     if(that.content!=undefined&&that.content!=null)
     {
       
      if(this.content._scroll)
      {
       // debugger;
        that.content.scrollToBottom();
       }
      
     }
   }
   setUserTyping(groupId:any,description:any){
  
  let that=this;
  that.sharedServiceObj.setUserTyping(groupId,that.firebaseUserId);

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
   debugger;
    this.sharedServiceObj.sendMessage(type,document.getElementById("chatDescription").innerHTML,undefined,this.firebaseUserId,
      undefined,this.groupId,this.loggedInUserInfo,this.chatImage,this.chatDetailArray);
  }
  msgSentResp(resp:any)
{
  var that=this;
if(resp=="1")
{
  this.ngZone.run(() => {
    this.hideChatCropper=false;
      this.edit_chat_image=false;
      this.crop_chat_image=false;
      this.dataChatImage={};
      this.chatImage="";
    this.messageSent="1";
    this.chatImage="";
    document.getElementById("chatDescription").innerHTML="";
    //this.description="";
    //document.getElementById("chatDescription").innerHTML="";
    that.scrollChatToBottom();
    //this.navCtrl.push(ChatPage);
  });
}
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
    //firebase.database().ref('chats/'+chatId).once('value', function(snapshot) {
      chatIdRef.once('value', function(snapshot) {
      if(snapshot.exists())
      {
        debugger;
                                var deleteChating=snapshot.val();
                                
                                var deletedChatingArray=[];
                                var messageToUpdate="";
                                deletedChatingArray=deleteChating.deletedFor;
                                
                                deletedChatingArray.push(that.firebaseUserId);
                                chatIdRef.update({deletedFor:deletedChatingArray});
                                var chatDummyRef=firebase.database().ref('chats');
                                chatDummyRef.orderByChild("groupId").equalTo(groupId).once("value", function(chatDetailObj) {
                                  if(chatDetailObj.exists())
                                  {
                                      var messageExist="0";
                                      debugger;
                                      chatDetailObj.forEach(function(chatDetail) {
  if(chatDetail.val().deletedFor.indexOf(that.firebaseUserId)<0)
  {
    
  messageExist="1";
  messageToUpdate=chatDetail.val().message;
  
  }
  
                                      });
  var groupDummyRef=firebase.database().ref('groups');
  groupDummyRef.orderByChild("groupId").equalTo(groupId).once("value", function(groupObj) {
    if(groupObj.exists())
    {
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
  //groupDummyRef.off("value");
}
  });
  //chatDummyRef.off("value");
}
                                    });
                                    //chatIdRef.off("value");
                                  }
                                  });
                                    

  
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
