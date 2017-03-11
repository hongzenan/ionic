import { Component } from '@angular/core'
import { NavController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

// pages
import { LoginPage } from '../login/login';

// services
import { AuthService } from '../../providers/auth-service';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    user_detail: any;
    user: any;
    items: FirebaseListObservable<any>;

    constructor(public navCtrl: NavController, public angfire: AngularFire, private authservice: AuthService) {
        this.user = "";
        if (!this.isLoggedin()) {
            console.log("You are not logged in")
            this.navCtrl.push(LoginPage)
        }
        this.user = window.localStorage.getItem('currentuser');
    }

    show() {
        this.user = window.localStorage.getItem('currentuser');
    }

    save() {
        this.user_detail = window.localStorage.getItem('firebase:authUser:AIzaSyDRnt4FM3wfjsIW3_oLQJSSsxN5oFF9Xeg:[DEFAULT]');
        let user_uid = JSON.parse(this.user_detail).uid;
        const user_database_point = this.angfire.database.object('users/' + user_uid);
        user_database_point.set({ name: "kane" });
    }

    isLoggedin() {
        if (window.localStorage.getItem('currentuser')) {
            return true
        }
    }

    signout() {
        this.authservice.signOut();
        let user = window.localStorage.getItem('currentuser');
        this.navCtrl.push(LoginPage);
    }

    newItem() {
        console.log("new item success")
    }

}