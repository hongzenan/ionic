import { Component } from '@angular/core';
import { NavController, NavParams, Events, AlertController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

import { RegisterPage } from '../register/register';
import { ResetPasswordPage } from "../reset-password/reset-password";
/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  email: any
  password: any

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authservice: AuthService, public events: Events, public alertCtrl: AlertController) { }

  ionViewDidLoad() {
  }

  login() {
    this.authservice.login(this.email, this.password)
      .then((response) => {
        if (response) {
          this.navCtrl.pop();
          this.events.publish('login');
        }
      })
      .catch((error) => console.log("Cann't login success ", error));
  }

  signup() {
    this.authservice.signup(this.email, this.password)
      .then((response) => {
        if (response) {
          let alert = this.alertCtrl.create({
            subTitle: "注册成功",
            buttons: ['OK']
          });
          alert.present();
        } else {
          let alert = this.alertCtrl.create({
            subTitle: "注册失败",
            buttons: ['OK']
          });
          alert.present();
        }
      });
  }

  clearText() {
    this.email = "";
    this.password = "";
  }

  toResetPassword() {
    this.navCtrl.push(ResetPasswordPage);
  }
}
