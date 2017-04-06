import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HomePage } from '../pages/home/home';

import { AngularFire } from 'angularfire2';
import * as firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // @ViewChild('content') navCtrl: NavController;
  rootPage: any = HomePage
  // the basic user information
  user: any;
  email: string = "";
  picture: string = "";
  // user detail and user_uid
  user_detail: any;
  user_uid: any;
  // search input
  myInput: string = "";
  // for toggle items
  toggleDate: boolean = false;
  toggleTags: boolean = false;
  toggleLocates: boolean = false;
  addTagItem: string;
  addLocateItem: string;
  tags: string[] = [];
  locates: string[] = [];
  diarys: any[] = [];


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
      this.tags = [];
      for (let i of response) {
        this.tags.push(i);
      }
      window.localStorage.setItem('tags', JSON.stringify(this.tags));
    });
    // get locate from firebase
    const database_locates = this.angfire.database.object('users/' + this.user_uid + '/locates');
    database_locates.subscribe(response => {
      this.locates = [];
      for (let i of response) {
        this.locates.push(i);
      }
      window.localStorage.setItem('locates', JSON.stringify(this.locates));
    });
    // get diarys from firebase
    const database_diarys = this.angfire.database.object('users/' + this.user_uid + '/diarys');
    database_diarys.subscribe(response => {
      this.diarys = [];
      for (let i of response) {
        this.diarys.push(i);
      }
      window.localStorage.setItem('diarys', JSON.stringify(this.diarys));
    });
  }

  addImage() {
    const storageRef = firebase.storage().ref().child('image.jpg');
    storageRef.getDownloadURL().then(url => this.picture = url);
  }

  onInput($event) {
  }

  onCancel($event) {
  }

  toggleForTags() {
    this.toggleTags = !this.toggleTags;
  }

  addTag() {
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
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            this.addTagItem = data.tag;
            this.tags.push(this.addTagItem);
            const database_tags = this.angfire.database.object('users/' + this.user_uid + '/tags');
            database_tags.set(this.tags);
          }
        }
      ]
    });

    alertTag.present();
  }

  deleteTag(item) {
    let index = this.tags.indexOf(item);
    if (index > -1) {
      this.tags.splice(index, 1);
    }
    const database_tags = this.angfire.database.object('users/' + this.user_uid + '/tags');
    database_tags.set(this.tags);
  }

  addLocate() {
    let alertLocate = this.alertCtrl.create({
      title: '位置',
      message: '请输入位置',
      inputs: [
        {
          name: 'locate',
          placeholder: 'Locate'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            this.addLocateItem = data.locate;
            this.locates.push(this.addLocateItem);
            const database_locates = this.angfire.database.object('users/' + this.user_uid + '/locates');
            database_locates.set(this.locates);
          }
        }
      ]
    });

    alertLocate.present();
  }

  deleteLocate(item) {
    let index = this.locates.indexOf(item);
    if (index > -1) {
      this.locates.splice(index, 1);
    }
    const database_locates = this.angfire.database.object('users/' + this.user_uid + '/locates');
    database_locates.set(this.locates);
  }

  toggleForLocates() {
    this.toggleLocates = !this.toggleLocates;
  }

  toggleForDate() {
    this.toggleDate = !this.toggleDate;
  }
}