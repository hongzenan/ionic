import { Component } from '@angular/core'
import { NavController, ToastController } from 'ionic-angular';
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
    ]

    constructor(public navCtrl: NavController, public angfire: AngularFire, private authservice: AuthService,
        public toastCtrl: ToastController) {
        this.user = "";
        if (!this.isLoggedin()) {
            this.navCtrl.push(LoginPage)
        } else {
            this.user = window.localStorage.getItem('currentuser');
            this.user_detail = JSON.parse(window.localStorage.getItem('firebase:authUser:AIzaSyDRnt4FM3wfjsIW3_oLQJSSsxN5oFF9Xeg:[DEFAULT]'));
            this.user_uid = this.user_detail.uid;
            // get diarys real time
            const database_diarys = this.angfire.database.object('users/' + this.user_uid + '/diarys');
            database_diarys.subscribe(response => {
                if (response.length > 1) {
                    this.order_diarys(response);
                }
                this.diarys = [];
                this.diarys_array = [];
                this.diarys_help = {};
                for (let i of response) {
                    this.diarys.push(i);
                }
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
        this.user_detail = JSON.parse(window.localStorage.getItem('firebase:authUser:AIzaSyDRnt4FM3wfjsIW3_oLQJSSsxN5oFF9Xeg:[DEFAULT]'));
        let user_uid = this.user_detail.uid;
        const user_database_point = this.angfire.database.object('users/' + user_uid);
        user_database_point.subscribe(response => {
        })
        user_database_point.set({ name1: "kane1" });
    }

    isLoggedin() {
        if (window.localStorage.getItem('currentuser')) {
            return true
        }
    }

    signout() {
        this.authservice.signOut();
        this.navCtrl.push(LoginPage);
    }

    addTopic() {
        this.navCtrl.push(DetailPage);
    }

    goToDetail(item) {
        this.navCtrl.push(DetailPage, {
            "item": item
        });
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
}