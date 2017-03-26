import { Component, ViewChild } from '@angular/core';
import { Platform, AlertController} from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native'

import { HomePage } from '../pages/home/home';

import { AngularFire, FirebaseListObservable } from 'angularfire2';
import * as firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // @ViewChild('content') navCtrl: NavController;
  rootPage: any = HomePage
  user: any;
  email: string = "";
  picture: string = "";
  user_detail: any;
  user_uid: any;
  myInput: string = "";
  toggleDate: boolean = false;
  toggleItem1: boolean = false;
  toggleItem2: boolean = false;
  addTagItem: string;
  items1: string[] = [];
  items2: string[] = [];

  constructor(platform: Platform, public angfire: AngularFire,
    public alertCtrl: AlertController) {
    platform.ready().then(() => {
      StatusBar.styleDefault()
      Splashscreen.hide()
    });

    // store basic data of user 
    this.user = JSON.parse(window.localStorage.getItem('currentuser'));
    this.email = this.user.email;
    this.picture = this.user.picture;
    // store detail of user
    this.user_detail = JSON.parse(window.localStorage.getItem('firebase:authUser:AIzaSyDRnt4FM3wfjsIW3_oLQJSSsxN5oFF9Xeg:[DEFAULT]'));
    this.user_uid = this.user_detail.uid;
    //get tags from firebase
    const database_tags = this.angfire.database.object('users/' + this.user_uid + '/tags');
    database_tags.subscribe(response => {
      this.items1 = [];
      for (let i of response) {
        console.log("i: ", i);
        this.items1.push(i);
      }
    });
    // get locate from firebase
    const database_locates = this.angfire.database.object('users/' + this.user_uid + '/locates');
    database_locates.subscribe(response => {
      for (let i of response) {
        this.items2.push(i);
      }
    });
  }

  addImage() {
    const storageRef = firebase.storage().ref().child('image.jpg');
    storageRef.getDownloadURL().then(url => this.picture = url);
  }

  onInput($event) {
    console.log("onInput: ", $event);
  }

  onCancel($event) {
    console.log("onCancel: ", $event);
  }

  toggleForItem1() {
    this.toggleItem1 = !this.toggleItem1;
  }

  addTag() {
    console.log("tag: ");
    let alertTag = this.alertCtrl.create({
      title: '标签',
      message: "请输入标签",
      inputs: [
        {
          name: 'tag',
          placeholder: 'Tag'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.addTagItem = data.tag;
            this.items1.push(this.addTagItem);
            console.log("data: ", data.tag);
            const database_tags = this.angfire.database.object('users/' + this.user_uid + '/tags');
            database_tags.update(this.items1);
            console.log("dada: ", this.items1);
          }
        }
      ]
    });

    alertTag.present();
  }

  toggleForItem2() {
    this.toggleItem2 = !this.toggleItem2;
  }

  toggleForDate() {
    this.toggleDate = !this.toggleDate;
  }
}