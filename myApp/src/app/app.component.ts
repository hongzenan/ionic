import { Component, NgZone } from '@angular/core';
import { Platform, AlertController, Events } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HomePage } from '../pages/home/home';

import { AngularFire } from 'angularfire2';
import { FileChooser } from "ionic-native";
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
  pictureTemp: string = "";
  total_items = 0;
  selected_items = 0;
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
  firestore = firebase.storage();
  // filter
  tagSelected: boolean = false;
  lastTagItem: string = "";
  locationSelected: boolean = false;
  lastLocationItem: string = "";
  database_tags: any;
  database_locates: any;
  database_diarys: any;
  observableTags: any;
  observableLocates: any;
  observableDiarys: any;
  nativepath: any;
  observalbePicture: any;


  constructor(platform: Platform, public angfire: AngularFire,
    public alertCtrl: AlertController, public zone: NgZone, public events: Events) {
    platform.ready().then(() => {
      StatusBar.styleDefault()
      Splashscreen.hide()
    });

    this.listenTotalItems();
    this.listenLogin();
    this.listenSignout();

    this.toUnsubscribe();
    this.getRealData();

    this.downloadimage();
  }

  getRealData() {
    // store basic data of user 
    this.user = JSON.parse(window.localStorage.getItem('currentuser')) || {};
    this.email = this.user.email || "";
    this.picture = this.user.picture || "";
    // store detail of user
    this.user_detail = JSON.parse(window.localStorage.getItem('firebase:authUser:AIzaSyDRnt4FM3wfjsIW3_oLQJSSsxN5oFF9Xeg:[DEFAULT]')) || {};
    this.user_uid = this.user_detail.uid || "";
    if (window.localStorage.getItem('currentuser')) {
      //get tags from firebase
      this.database_tags = this.angfire.database.object('users/' + this.user_uid + '/tags');
      this.observableTags = this.database_tags.subscribe(response => {
        this.tags = [];
        for (let i of response) {
          this.tags.push(i);
        }
        window.localStorage.setItem('tags', JSON.stringify(this.tags));
      });
      // get locate from firebase
      this.database_locates = this.angfire.database.object('users/' + this.user_uid + '/locates');
      this.observableLocates = this.database_locates.subscribe(response => {
        this.locates = [];
        for (let i of response) {
          this.locates.push(i);
        }
        window.localStorage.setItem('locates', JSON.stringify(this.locates));
      });
      // get diarys from firebase
      this.database_diarys = this.angfire.database.object('users/' + this.user_uid + '/diarys');
      this.observableDiarys = this.database_diarys.subscribe(response => {
        this.diarys = [];
        for (let i of response) {
          this.diarys.push(i);
        }
        window.localStorage.setItem('diarys', JSON.stringify(this.diarys));
      });
    }
  }

  touxiang() {
    FileChooser.open().then((url) => {
      (<any>window).FilePath.resolveNativePath(url, (result) => {
        this.nativepath = result;
        this.uploadimages();
      });
    });
  }

  downloadimage() {
    if (this.user_uid) {
      const database_picture = this.angfire.database.object('users/' + this.user_uid + '/picture');
      this.observalbePicture = database_picture.subscribe((resp) => {
        if (resp) {
          this.pictureTemp = resp.$value;
        }

        if (this.pictureTemp) {
          this.firestore.ref().child('images/' + this.user_uid + '/' + this.pictureTemp).getDownloadURL().then((url) => {
            this.zone.run(() => {
              this.picture = url;
            });
          });
        } else {
          this.picture = "../assets/logo.jpg";
        }
      });
    }
  }

  uploadimages() {
    (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
      res.file((resFile) => {
        let reader = new FileReader();
        reader.readAsArrayBuffer(resFile);
        reader.onloadend = (evt: any) => {
          let imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
          let array_path = this.nativepath.split('/');
          let lastOfArray = array_path[array_path.length - 1];
          let imageStore = this.firestore.ref().child('images/' + this.user_uid + '/' + lastOfArray);
          imageStore.put(imgBlob).then((res) => {
            this.picture = lastOfArray;
            const database_picture = this.angfire.database.object('users/' + this.user_uid + '/picture');
            database_picture.set(this.picture);
            alert('Upload Success');
            alert('picture: ' + lastOfArray);
            this.downloadimage();
          }).catch((err) => {
            alert('Upload Failed');
          });
        }
      });
    });
  }

  onInput(event) {
    if (event.target.value) {
      this.events.publish('query:select', event.target.value);
    }
    if (event.target.value == "" || event.target.value == undefined) {
      this.events.publish('query:unselect');
    }
  }

  onCancel(event) {
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
    if (!this.toggleDate) {
      this.events.publish('calc:unselect', 'date');
    }
  }

  selectTag(item) {
    if (item == this.lastTagItem) {
      this.tagSelected = !this.tagSelected;
    } else {
      this.tagSelected = true;
    }
    this.lastTagItem = item;
    if (this.tagSelected) {
      this.events.publish('tag:select', item, "tag");
    } else {
      this.events.publish('tag:unselect', "tag");
    }
  }

  selectLocation(item) {
    if (item == this.lastLocationItem) {
      this.locationSelected = !this.locationSelected;
    } else {
      this.locationSelected = true;
    }
    this.lastLocationItem = item;
    if (this.locationSelected) {
      this.events.publish('location:select', item, "location");
    } else {
      this.events.publish('location:unselect', "location");
    }
  }

  listenTotalItems() {
    this.events.subscribe('total:items', (total, selected) => {
      this.total_items = total || 0;
      this.selected_items = selected;
    });
  }

  listenLogin() {
    this.events.subscribe('login', () => {
      this.toUnsubscribe();
      this.getRealData();
      this.downloadimage();
    });
  }

  listenSignout() {
    this.events.subscribe('signout', () => {
      this.diarys = [];
      this.tags = [];
      this.locates = [];
      this.picture = "";
      this.observableTags.unsubscribe();
      this.observableLocates.unsubscribe();
      this.observableDiarys.unsubscribe();
      this.observalbePicture.unsubscribe();
    });
  }

  toUnsubscribe() {
    if (this.observableDiarys) {
      this.observableTags.unsubscribe();
      this.observableLocates.unsubscribe();
      this.observableDiarys.unsubscribe();
      this.observalbePicture.unsubscribe();
    }
  }
}