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
 * Generated class for the NewGroupPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var firebase:any;
@Component({
  selector: 'page-new-group-popup',
  templateUrl: 'new-group-popup.html',
})
export class NewGroupPopupPage {
  public description:string="";
  public groupTitle:string="";
  public newChatMember:any;
  public allAvailableContacts:any[]=[];
  public allAvailableSearchedContacts:any[]=[];
  public groupMembersData:any[]=[];
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
  loadAllContacts()
  {
    let that=this;
    let firebaseUserId = this.storage.get('firebaseUserId');
    firebaseUserId.then((data) => {
    var fredRef=firebase.database().ref('users').on('child_added', function(snapshot) {
      if(data!=snapshot.val().fbId)
      {
        if(snapshot.val().fbId!=undefined&&snapshot.val().fbId!=null)
          {
            //debugger;
            if(snapshot.val().is_lead!="1"){
              that.allAvailableContacts.push(snapshot.val());
            }
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
  createGroup=function(type){
    var that=this;
     var deletedFor=["0"];
    var createDate=Date();
    var desc=that.groupTitle;
    var groupId=that.firebaseUserId+"_"+Date();
    
   var groups = firebase.database().ref('groups');
   var groupMembers=firebase.database().ref('groupMembers');
  if(type=="new")
  {

                                  groups.push({
                                    fromUserName:that.loggedInUserInfo.memberCredentials.first_name,
                                    toUserName:"",
                                      fromFbUserId: that.firebaseUserId,
                                      toFbUserId: "",
                                      isGroup:1,
                                      groupImage:"",
                                      fromUserImage:that.loggedInUserInfo.memberCredentials.image_url,
                                      toUserImage:"",
                                      groupTitle:that.groupTitle,
                                      message:"",
                                      dateCreated:createDate,
                                      provider: 'Firebase',
                                      deletedFor:deletedFor,
                                      groupId:groupId,
                                      modifiedDate:Date()
                                     
                                  }).then(function (ref) {
                                    
                                  });
                                  groupMembers.push({
    memberName:that.loggedInUserInfo.memberCredentials.first_name,
    userId:that.firebaseUserId,
    image:that.loggedInUserInfo.memberCredentials.image_url,
    dateCreated:createDate,
    groupId:groupId,
    provider: 'Firebase'
  });
  let i=0;
                                   that.groupMembersData.forEach(function(memberData) {
                                     var name="";
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
}
  groupMembers.push({
    memberName:name,
    userId:fbId,
    image:image_url,
    dateCreated:createDate,
    groupId:groupId,
    provider: 'Firebase'
  });
  
  i=i+1;
  i=i;
if(i==that.groupMembersData.length){
  that.sharedServiceObj.createGroupEmitter();
  that.closePopUp();

}
                                   });
  
  }
}
  closePopUp()
  {
    this.viewCtrl.dismiss();
  }
  selectChatMember(availableContact:any)
  {
    this.newChatMember=availableContact;
    this.searchKeyword=this.newChatMember.first_name+" "+this.newChatMember.last_name;
    this.allAvailableSearchedContacts=[];
  }
}
