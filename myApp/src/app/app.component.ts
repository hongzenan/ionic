import { Component } from '@angular/core';
import { Platform, AlertController, NavController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native'

import { HomePage } from '../pages/home/home';
import { AddTagPage } from '../pages/add-tag/add-tag';

import { AngularFire, FirebaseListObservable } from 'angularfire2';
import * as firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
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
  items1: string[] = [];
  items2: string[] = [];

  constructor(platform: Platform, public angfire: AngularFire,
    public alertCtrl: AlertController, public navCtrl: NavController) {
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
      for (let i of response) {
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
    this.navCtrl.push(AddTagPage);
  }

  toggleForItem2() {
    this.toggleItem2 = !this.toggleItem2;
  }

  toggleForDate() {
    this.toggleDate = !this.toggleDate;
  }
}