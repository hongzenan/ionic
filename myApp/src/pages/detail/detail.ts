import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { ImagesPage } from '../images/images';
import { ImageDetailPage } from '../image-detail/image-detail';
import { DatePicker } from 'ionic2-date-picker/ionic2-date-picker';

import { AngularFire } from 'angularfire2';

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
  item: string;
  date: Date;
  dateContain = {
    date: "",
    day: "",
    year: "",
    month: "",
    hours: "",
    minutes: "",
    seconds: ""
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
  public event = {
    timeStarts: ''
  }
  text = {
    title: '',
    content: 'aa'
  }
  diarys: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public actionCtrl: ActionSheetController, public datePicker: DatePicker,
    public angfire: AngularFire) {
    this.item = this.navParams.get("item");
    console.log("detail page: ", this.item);
    // TODO: initalize date for diary item
    if (this.item) {
      this.date = new Date();
      this.date.setDate(2);
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

    this.diarys = JSON.parse(window.localStorage.getItem('diarys'));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
    // TODO: diary item update, including title and content
    if (this.item) {
      let article_content = document.getElementById('content');
      article_content.innerText = this.text.content;
      this.text.title = 'abc';
    }
  }

  chooseImage() {
    let actionSheet = this.actionCtrl.create({
      title: "choose images",
      buttons: [
        {
          text: 'Destructive',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: 'Archive',
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  goToImages() {
    this.navCtrl.push(ImagesPage);
  }

  imageDetail() {
    this.navCtrl.push(ImageDetailPage);
  }

  showCalendar() {
    this.datePicker.showCalendar();
  }

  translateDate() {
    this.dateContain.date = this.date.getDate().toString();
    this.dateContain.day = this.weekDayNames[this.date.getDay()];
    this.dateContain.month = this.monthNames[this.date.getMonth()];
    this.dateContain.year = this.date.getFullYear().toString();
    console.log('date: ', this.date);
    console.log('full year: ', this.date.getFullYear());
    console.log('month: ', this.date.getMonth());
    console.log('weekDays: ', this.weekDayNames[this.date.getDay()]);
    console.log('monthNames: ', this.monthNames[this.date.getMonth()]);
  }

  translateTime() {
    this.dateContain.hours = this.date.getHours().toString();
    this.dateContain.minutes = this.date.getMinutes().toString();
    if (this.date.getMinutes() < 10) {
      this.dateContain.minutes = "0" + this.dateContain.minutes;
    }
    this.event.timeStarts = this.dateContain.hours + ":" + this.dateContain.minutes;
    console.log('hour: ', this.date.getHours());
    console.log('minute: ', this.date.getMinutes());
    console.log('second: ', this.date.getSeconds());
    console.log('time: ', this.date.getTime());
  }

  ionViewWillLeave() {
    let array = this.event.timeStarts.split(':');
    this.dateContain.hours = array[0];
    this.dateContain.minutes = array[1];
    console.log('view will leave: ', this.dateContain);
    console.log('view will leave: ', this.event.timeStarts.split(':')[1]);

    // get text content
    let article_content = document.getElementById('content');
    this.text.content = article_content.outerText;
    console.log('text: ', this.text.content);
  }

  ionViewDidLeave() {
    console.log('view did leave: ', this.event.timeStarts);
    // TODO: for diary item
    if (this.item) {

    } else {
      const database_diarys = this.angfire.database.object('users/' + this.user_uid + '/diarys');
      let temp_for_diary = {
        date: this.dateContain,
        text_title: this.text.title,
        text_content: this.text.content
      }
      this.diarys.push(temp_for_diary);
      database_diarys.set(this.diarys)
    }
  }

  ionViewWillUnload() {
    console.log('view will unload: ', this.event.timeStarts);
  }

  ionViewDidUnload() {
    console.log('view did unload: ', this.event.timeStarts);
  }
}
