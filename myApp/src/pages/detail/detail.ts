import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';

import { ImagesPage } from '../images/images';
import { ImageDetailPage } from '../image-detail/image-detail';
import { DatePicker } from 'ionic2-date-picker/ionic2-date-picker';

import { AngularFire } from 'angularfire2';
import { Http } from '@angular/http';
import { FileChooser, Camera, CameraOptions } from 'ionic-native';
import firebase from 'firebase';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

/*
  Generated class for the Detail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
  providers: [DatePicker]
})
export class DetailPage {
  // user
  user_uid: any;
  user_detail: any;
  // date
  item: any;
  date: Date;
  dateContain = {
    date: "",
    day: "",
    year: "",
    month: "",
    hours: "",
    minutes: ""
  }
  monthNames = [
    "一月", "二月", "三月",
    "四月", "五月", "六月", "七月",
    "八月", "九月", "十月",
    "十一月", "十二月"
  ]
  weekDayNames = [
    "星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"
  ]
  event = {
    timeStarts: ''
  }
  text = {
    title: '',
    content: 'aa'
  }
  diarys: any[] = [];
  locates: string[] = [];
  tags: string[] = [];
  RadioLocationOpen: boolean;
  location = "";
  RadioTagOpen: boolean;
  tag = "";
  lastImage: string = '';
  imagesForStorage: string[] = [];
  picturesToTransfer: string[] = [];

  nativepath: any;
  firestore = firebase.storage();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public actionCtrl: ActionSheetController, public datePicker: DatePicker,
    public angfire: AngularFire, public http: Http,
    public alertCtrl: AlertController, public geolocation: Geolocation, public zone: NgZone) {
    this.item = this.navParams.get("item");
    this.diarys = JSON.parse(window.localStorage.getItem('diarys')) || [];

    if (this.item) {
      this.location = this.item.location;
      this.tag = this.item.tag;
      this.imagesForStorage = this.item.images || [];
      for (let i of this.diarys) {
        if (i.text_title == this.item.text_title && i.text_content == this.item.text_content &&
          (i.text_title != null || i.text_content != null)) {
          this.diarys.splice(this.diarys.indexOf(i), 1);
        }
      }
      this.date = new Date();
      this.date.setDate(Number(this.item.date.date));
      this.date.setFullYear(Number(this.item.date.year));
      this.date.setMonth(Number(this.switch_month_to_number(this.item.date.month)));
      this.date.setHours(Number(this.item.date.hours));
      this.date.setMinutes(Number(this.item.date.minutes));
    } else {
      this.date = new Date();
    }
    this.translateDate();
    this.translateTime();

    this.datePicker.onDateSelected.subscribe(
      (date) => {
        this.date = date;
        this.translateDate();
      });

    this.user_detail = JSON.parse(window.localStorage.getItem('firebase:authUser:AIzaSyDRnt4FM3wfjsIW3_oLQJSSsxN5oFF9Xeg:[DEFAULT]'));
    this.user_uid = this.user_detail.uid;

    this.locates = JSON.parse(window.localStorage.getItem('locates')) || [];
    this.tags = JSON.parse(window.localStorage.getItem('tags')) || [];
    if (this.tags.indexOf(this.tag) < 0) {
      this.tag = "";
    }
    if (this.locates.indexOf(this.location) < 0) {
      this.location = "";
    }

    // get geolocation
    this.getGeolocation();

    this.downloadimages();
  }

  ionViewDidLoad() {
    if (this.item) {
      let article_content = document.getElementById('content');
      article_content.innerText = this.item.text_content;
      this.text.title = this.item.text_title;
    }
  }

  chooseImage() {
    let actionSheet = this.actionCtrl.create({
      title: "choose images",
      buttons: [
        {
          text: '从相册选择',
          role: 'destructive',
          handler: () => {
            FileChooser.open().then((url) => {
              (<any>window).FilePath.resolveNativePath(url, (result) => {
                this.nativepath = result;
                this.uploadimages();
              });
            });
          }
        },
        {
          text: '拍照',
          role: 'archive',
          handler: () => {
            const cameraOptions: CameraOptions = {
              quality: 50,
              destinationType: Camera.DestinationType.FILE_URI,
              encodingType: Camera.EncodingType.JPEG,
              mediaType: Camera.MediaType.PICTURE,
              saveToPhotoAlbum: true
            };

            Camera.getPicture(cameraOptions).then((imageData) => {
              alert(imageData);
              this.nativepath = imageData;
              this.uploadimages();
            });
          }
        },
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });

    actionSheet.present();
  }

  downloadimages() {
    this.picturesToTransfer = [];
    for (let i of this.imagesForStorage) {
      this.firestore.ref().child('images/' + i).getDownloadURL().then((url) => {
        this.zone.run(() => {
          this.picturesToTransfer.push(url);

          // set image to lastImage
          this.lastImage = this.picturesToTransfer[this.picturesToTransfer.length - 1];
        });
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
          let imageStore = this.firestore.ref().child('images/' + lastOfArray);
          imageStore.put(imgBlob).then((res) => {
            this.imagesForStorage.push(lastOfArray);
            alert('照片上传成功');
            this.downloadimages();
          }).catch((err) => {
            alert('照片上传失败');
          });
        }
      });
    });
  }

  goToImages() {
    this.navCtrl.push(ImagesPage, {
      "images": this.picturesToTransfer
    });
  }

  showCalendar() {
    this.datePicker.showCalendar();
  }

  translateDate() {
    this.dateContain.date = this.date.getDate().toString();
    this.dateContain.day = this.weekDayNames[this.date.getDay()];
    this.dateContain.month = this.monthNames[this.date.getMonth()];
    this.dateContain.year = this.date.getFullYear().toString();
  }

  translateTime() {
    this.dateContain.hours = this.date.getHours().toString();
    this.dateContain.minutes = this.date.getMinutes().toString();
    if (this.date.getHours() < 10) {
      this.dateContain.hours = "0" + this.dateContain.hours;
    }
    if (this.date.getMinutes() < 10) {
      this.dateContain.minutes = "0" + this.dateContain.minutes;
    }
    this.event.timeStarts = this.dateContain.hours + ":" + this.dateContain.minutes;
  }

  switch_month_to_number(month: string) {
    for (let i of this.monthNames) {
      if (i == month) {
        return this.monthNames.indexOf(i);
      }
    }
    return 0;
  }

  getGeolocation() {
    if (!this.location) {
      let options = {
        enableHighAccuracy: true
      }
      // geolocation
      this.geolocation.getCurrentPosition(options).then((position: Geoposition) => {
        let url = "http://maps.google.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&language=zh-CN&sensor=false";
        this.http.get(url).subscribe(res => {
          let res_address_body = res.json().results[0].address_components;
          let length_address_array = res_address_body.length;
          let address = "";
          for (let i = length_address_array - 2; i >= 0; i -= 1) {
            address += res_address_body[i].long_name;
          }
          this.location = address;
          if (this.locates != null && this.locates.indexOf(address) > -1) {
          } else {
            this.locates.push(address);
            const database_locates = this.angfire.database.object('users/' + this.user_uid + '/locates');
            database_locates.set(this.locates);
          }
        }, (err) => {
          console.log('err: ', err);
        });
      }).catch((err) => {
        alert(err);
      });
    }



    // this.http.get('http://ipinfo.io/json').subscribe(response => {
    //   let url = "http://maps.google.com/maps/api/geocode/json?latlng=" + response.json().loc + "&language=zh-CN&sensor=false";
    //   this.http.get(url).subscribe(res => {
    //     let res_address_body = res.json().results[0].address_components;
    //     let length_address_array = res_address_body.length;
    //     let address = "";
    //     for (let i = length_address_array - 2; i >= 0; i -= 1) {
    //       address += res_address_body[i].long_name;
    //     }
    //     if (!this.location) {
    //       this.location = address;
    //     }
    //     if (this.locates != null && this.locates.indexOf(address) > -1) {
    //     } else {
    //       this.locates.push(address);
    //       const database_locates = this.angfire.database.object('users/' + this.user_uid + '/locates');
    //       database_locates.set(this.locates);
    //     }
    //   }, (err) => {
    //     console.log('err: ', err);
    //   });
    // });
  }

  setGeolocation() {
    let alert = this.alertCtrl.create();
    alert.setTitle('选择地址');
    for (let i of this.locates) {
      alert.addInput({
        type: 'radio',
        label: i,
        value: i
      });
    }
    alert.addButton('取消');
    alert.addButton({
      text: '确定',
      handler: data => {
        this.RadioLocationOpen = false;
        this.location = data;
      }
    });
    alert.present().then(() => {
      this.RadioLocationOpen = true;
    });
  }

  setTag() {
    let alert = this.alertCtrl.create();
    if (this.tags != null) {
      alert.setTitle('选择标签');
      for (let i of this.tags) {
        alert.addInput({
          type: 'radio',
          label: i,
          value: i
        });
      }
    } else {
      alert.setTitle('没有标签，请先添加');
    }
    alert.addButton('取消');
    alert.addButton({
      text: '确定',
      handler: data => {
        this.RadioTagOpen = false;
        this.tag = data;
      }
    });
    alert.present().then(() => {
      this.RadioTagOpen = true;
    });
  }

  ionViewWillLeave() {
    let array = this.event.timeStarts.split(':');
    this.dateContain.hours = array[0];
    this.dateContain.minutes = array[1];

    // get text content
    let article_content = document.getElementById('content');
    this.text.content = article_content.outerText;
  }

  ionViewDidLeave() {
  }

  ionViewWillUnload() {
    const database_diarys = this.angfire.database.object('users/' + this.user_uid + '/diarys');
    let temp_for_diary = {
      date: this.dateContain,
      text_title: this.text.title,
      text_content: this.text.content,
      location: this.location,
      tag: this.tag,
      images: this.imagesForStorage
    }
    this.diarys.push(temp_for_diary);
    database_diarys.set(this.diarys);
  }

  ionViewDidUnload() {
  }
}
