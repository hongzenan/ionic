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
  toggleItem1: boolean = false;
  toggleItem2: boolean = false;
  addTagItem: string;
  addLocateItem: string;
  items1: string[] = [];
  items2: string[] = [];
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
      console.log('tag in constructure: ', response);
      this.items1 = [];
      for (let i of response) {
        this.items1.push(i);
      }
    });
    // get locate from firebase
    const database_locates = this.angfire.database.object('users/' + this.user_uid + '/locates');
    database_locates.subscribe(response => {
      console.log('locate in constructure: ', response);
      this.items2 = [];
      for (let i of response) {
        this.items2.push(i);
      }
    });
    // get diarys from firebase
    const database_diarys = this.angfire.database.object('users/' + this.user_uid + '/diarys');
    database_diarys.subscribe(response => {
      console.log('diary in constructure: ', response);
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
    console.log("onInput: ", $event);
  }

  onCancel($event) {
    console.log("onCancel: ", $event);
  }

  toggleForItem1() {
    this.toggleItem1 = !this.toggleItem1;
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
            database_tags.set(this.items1);
            console.log("dada: ", this.items1);
          }
        }
      ]
    });

    alertTag.present();
  }

  deleteTag(item) {
    let index = this.items1.indexOf(item);
    if (index > -1) {
      console.log('index: ', index);
      this.items1.splice(index, 1);
      console.log('the last item: ', this.items1);
    }
    const database_tags = this.angfire.database.object('users/' + this.user_uid + '/tags');
    database_tags.set(this.items1);
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
          text: 'Cancel',
          handler: data => {
            console.log('add locate: ', data.locate);
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.addLocateItem = data.locate;
            console.log('locate: ', data);
            this.items2.push(this.addLocateItem);
            const database_locates = this.angfire.database.object('users/' + this.user_uid + '/locates');
            database_locates.set(this.items2);
            console.log('this item2: ', this.items2);
          }
        }
      ]
    });

    alertLocate.present();
  }

  deleteLocate(item) {
    let index = this.items2.indexOf(item);
    if (index > -1) {
      this.items2.splice(index, 1);
    }
    const database_locates = this.angfire.database.object('users/' + this.user_uid + '/locates');
    database_locates.set(this.items2);
  }

  toggleForItem2() {
    this.toggleItem2 = !this.toggleItem2;
  }

  toggleForDate() {
    this.toggleDate = !this.toggleDate;
  }

  // for calendar

}