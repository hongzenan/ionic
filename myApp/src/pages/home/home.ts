import { Component } from '@angular/core'
import { NavController, ToastController, Events } from 'ionic-angular';
import { AngularFire } from 'angularfire2';

// pages
import { LoginPage } from '../login/login';
import { DetailPage } from '../detail/detail';

// services
import { AuthService } from '../../providers/auth-service';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    user_detail: any;
    user_uid: any;
    user: any;
    total_items = 0;
    selected_items = 0;
    myColor: string = "primary";
    // for items
    diarys_array: any[] = [];
    diarys_array_item: any = {
        month: "",
        diarys: []
    }
    diarys_help: any = {};
    diarys: any[] = [];
    monthNames = [
        "一月", "二月", "三月",
        "四月", "五月", "六月", "七月",
        "八月", "九月", "十月",
        "十一月", "十二月"
    ];
    itemTagSelected: boolean = false;
    itemLocationSelected: boolean = false;
    itemDateSelected: boolean = false;
    itemTag: string = "";
    typeTag: string = "";
    itemLocation: string = "";
    typeLocation: string = "";
    itemYear: string = "";
    itemMonth: string = "";
    itemDay: string = "";
    typeDate: string = "";
    itemQuery: string = "";
    database_diarys: any;
    observableDiarys: any;

    constructor(public navCtrl: NavController, public angfire: AngularFire, private authservice: AuthService,
        public toastCtrl: ToastController, public events: Events) {
        // events事件大军
        this.listenTag();
        this.listenLocation();
        this.listenDate();
        this.listenQuery();
        this.listenLogin();
        this.listenSignout();

        this.getRealData();
    }

    getRealData() {
        this.user = "";
        if (!this.isLoggedin()) {
            this.navCtrl.push(LoginPage)
        } else {
            this.user = window.localStorage.getItem('currentuser');
            this.user_detail = JSON.parse(window.localStorage.getItem('firebase:authUser:AIzaSyDRnt4FM3wfjsIW3_oLQJSSsxN5oFF9Xeg:[DEFAULT]'));
            this.user_uid = this.user_detail.uid;
            // get diarys real time
            this.database_diarys = this.angfire.database.object('users/' + this.user_uid + '/diarys');
            this.observableDiarys = this.database_diarys.subscribe(resp => {
                this.total_items = resp.length;
                let response = resp;
                if (this.itemQuery) {
                    const filtered = resp.filter((item) => {
                        if (item.text_content.indexOf(this.itemQuery) > -1) {
                            return item;
                        }
                    });
                    response = filtered;
                }
                // normal set diary_arrays
                if (response.length > 1) {
                    this.order_diarys(response);
                }
                this.diarys = [];
                this.diarys_array = [];
                this.diarys_help = {};
                // 判断是否选中，进行filter
                if (!this.itemTagSelected && !this.itemLocationSelected && !this.itemDateSelected) {
                    for (let i of response) {
                        this.diarys.push(i);
                    }
                } else {
                    for (let i of response) {
                        if (this.typeTag == "tag" && this.typeLocation == "location" && this.typeDate == "date") {
                            if (i.tag == this.itemTag && i.location == this.itemLocation &&
                                (i.date.year == this.itemYear && i.date.month == this.itemMonth && i.date.date == this.itemDay)) {
                                this.diarys.push(i);
                            }
                        } else if (this.typeTag == "tag" && this.typeLocation == "location") {
                            if (i.tag == this.itemTag && i.location == this.itemLocation) {
                                this.diarys.push(i);
                            }
                        } else if (this.typeTag == "tag" && this.typeDate == "date") {
                            if (i.tag == this.itemTag &&
                                (i.date.year == this.itemYear && i.date.month == this.itemMonth && i.date.date == this.itemDay)) {
                                this.diarys.push(i);
                            }
                        } else if (this.typeLocation == "location" && this.typeDate == "date") {
                            if (i.location == this.itemLocation &&
                                (i.date.year == this.itemYear && i.date.month == this.itemMonth && i.date.date == this.itemDay)) {
                                this.diarys.push(i);
                            }
                        } else if (this.typeTag == "tag") {
                            if (i.tag == this.itemTag) {
                                this.diarys.push(i);
                            }
                        } else if (this.typeLocation == "location") {
                            if (i.location == this.itemLocation) {
                                this.diarys.push(i);
                            }
                        } else if (this.typeDate == "date") {
                            if (i.date.year == this.itemYear && i.date.month == this.itemMonth && i.date.date == this.itemDay) {
                                this.diarys.push(i);
                            }
                        }
                    }
                }
                this.selected_items = this.diarys.length;
                this.events.publish('total:items', this.total_items, this.selected_items);
                // 对diarys进行按日期分类处理
                for (let i of this.diarys) {
                    if (this.diarys_help[i.date.year + i.date.month] == undefined) {
                        this.diarys_help[i.date.year + i.date.month] = [];
                    }
                    this.diarys_help[i.date.year + i.date.month].push(i);
                }
                let key_list = Object.keys(this.diarys_help);
                for (let i of key_list) {
                    this.diarys_array_item = {
                        month: i,
                        diarys: this.diarys_help[i]
                    }
                    this.diarys_array.push(this.diarys_array_item);
                }
            });
        }
    }

    show() {
        this.user = window.localStorage.getItem('currentuser');
    }

    save() {
        // this.user_detail = JSON.parse(window.localStorage.getItem('firebase:authUser:AIzaSyDRnt4FM3wfjsIW3_oLQJSSsxN5oFF9Xeg:[DEFAULT]'));
        // let user_uid = this.user_detail.uid;
        // const user_database_point = this.angfire.database.object('users/' + user_uid);
        // user_database_point.subscribe(response => {
        // })
        // user_database_point.set({ name1: "kane1" });
    }

    isLoggedin() {
        if (window.localStorage.getItem('currentuser')) {
            return true
        }
    }

    signout() {
        ;
        this.events.publish('signout');
        this.authservice.signOut().then(() => {
            this.navCtrl.push(LoginPage);
        });
    }

    addTopic() {
        this.navCtrl.push(DetailPage);
    }

    goToDetail(item) {
        this.navCtrl.push(DetailPage, {
            "item": item
        });
    }

    delete(item) {
        const database_diarys = this.angfire.database.object('users/' + this.user_uid + '/diarys');
        for (let i of this.diarys) {
            if (i.text_title == item.text_title && i.text_content == item.text_content &&
                (i.text_title != null || i.text_content != null)) {
                this.diarys.splice(this.diarys.indexOf(i), 1);
            }
        }
        database_diarys.set(this.diarys);
    }

    // sort by date
    order_diarys(response) {
        response.sort((a, b) => {
            return this.order_help(b.date.year, b.date.month, b.date.date, b.date.hours, b.date.minutes) -
                this.order_help(a.date.year, a.date.month, a.date.date, a.date.hours, a.date.minutes);
        });
        return response;
    }

    order_help(year: string, month: string, date: string, hours: string, minutes: string) {
        if (date.length == 1) {
            date = '0' + date;
        }
        month = this.switch_month_to_number(month).toString();
        if (month.length == 1) {
            month = '0' + month;
        }
        if (hours.length == 1) {
            hours = '0' + hours;
        }
        if (minutes.length == 1) {
            minutes = '0' + minutes;
        }
        let result = year + month + date + hours + minutes;
        return Number(result);
    }

    switch_month_to_number(month: string) {
        for (let i of this.monthNames) {
            if (i == month) {
                return this.monthNames.indexOf(i);
            }
        }
        return 0;
    }

    listenTag() {
        this.events.subscribe('tag:select', (item, type) => {
            this.itemTagSelected = true;
            this.itemTag = item;
            this.typeTag = type;
            this.getRealData();
        });
        this.events.subscribe('tag:unselect', (type) => {
            this.itemTagSelected = false;
            this.itemTag = "";
            this.typeTag = "";
            this.getRealData();
        });
    }

    listenLocation() {
        this.events.subscribe('location:select', (item, type) => {
            this.itemLocationSelected = true;
            this.itemLocation = item;
            this.typeLocation = type;
            this.getRealData();
        });
        this.events.subscribe('location:unselect', (type) => {
            this.itemLocationSelected = false;
            this.itemLocation = "";
            this.typeLocation = "";
            this.getRealData();
        });
    }

    listenDate() {
        this.events.subscribe('calc:select', (year, month, day, type) => {
            this.itemDateSelected = true;
            this.itemYear = year;
            this.itemMonth = month;
            this.itemDay = day;
            this.typeDate = type;
            this.getRealData();
        });
        this.events.subscribe('calc:unselect', (type) => {
            this.itemDateSelected = false;
            this.itemYear = "";
            this.itemMonth = "";
            this.itemDay = "";
            this.typeDate = "";
            this.getRealData();
        });
    }

    listenQuery() {
        this.events.subscribe('query:select', (value) => {
            this.itemQuery = value;
            this.getRealData();
        });
        this.events.subscribe('query:unselect', () => {
            this.itemQuery = "";
            this.getRealData();
        });
    }

    listenLogin() {
        this.events.subscribe('login', () => {
            this.getRealData();
        });
    }

    listenSignout() {
        this.events.subscribe('signout', () => {
            this.diarys_array = [];
            this.observableDiarys.unsubscribe();
        });
    }
}