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
 * Generated class for the ChatEmojiPopupoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var firebase:any;
@Component({
  selector: 'page-chat-emoji-popupover',
  templateUrl: 'chat-emoji-popupover.html',
})
export class ChatEmojiPopupoverPage {

  constructor(public navCtrl: NavController, public ngZone: NgZone, public navParams: NavParams, public fb: Facebook,
    public userServiceObj: UserProvider, public sharedServiceObj: SharedProvider, private storage: Storage,
    public modalCtrl: ModalController, public alertCtrl: AlertController, 
    public platform: Platform,public actionSheetCtrl: ActionSheetController,public viewCtrl: ViewController) {
  }
  selectEmoji(emojiCode:any)
  {
    this.viewCtrl.dismiss({"selectedEmoji" : emojiCode});
  }
  ionViewDidLoad() {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  ionViewDidEnter()
  {
    this.sharedServiceObj.updateColorThemeMethod(null);
  }
  closePopUp()
  {
    //debugger;
    this.viewCtrl.dismiss();
  }
}
