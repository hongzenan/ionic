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

    constructor(public navCtrl: NavController, public angfire: AngularFire, private authservice: AuthService,
        public toastCtrl: ToastController) {
        this.user = "";
        if (!this.isLoggedin()) {
            console.log("You are not logged in")
            this.navCtrl.push(LoginPage)
        }
        this.user = window.localStorage.getItem('currentuser');
        this.user_detail = JSON.parse(window.localStorage.getItem('firebase:authUser:AIzaSyDRnt4FM3wfjsIW3_oLQJSSsxN5oFF9Xeg:[DEFAULT]'));
        this.user_uid = this.user_detail.uid;
        // get diarys real time
        const database_diarys = this.angfire.database.object('users/' + this.user_uid + '/diarys');
        database_diarys.subscribe(response => {
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
            console.log('this.diarys_help: ', this.diarys_array);
        });
    }

    show() {
        this.user = window.localStorage.getItem('currentuser');
    }

    save() {
        this.user_detail = JSON.parse(window.localStorage.getItem('firebase:authUser:AIzaSyDRnt4FM3wfjsIW3_oLQJSSsxN5oFF9Xeg:[DEFAULT]'));
        let user_uid = this.user_detail.uid;
        const user_database_point = this.angfire.database.object('users/' + user_uid);
        console.log("a: ", user_database_point);
        user_database_point.subscribe(response => {
            console.log("resp: ", response);
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
        console.log("item: ", item);
        this.navCtrl.push(DetailPage, {
            "item": item
        });
    }
}