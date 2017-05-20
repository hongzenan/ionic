import { Component } from '@angular/core';
import { NavController, NavParams, Events, AlertController, MenuController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

import { HomePage } from "../home/home";
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
    public authservice: AuthService, public events: Events, public alertCtrl: AlertController,
    public menu: MenuController) { 
      menu.enable(false);
    }

  ionViewDidLoad() {
  }

  login() {
    this.authservice.login(this.email, this.password)
      .then((response) => {
        if (response) {
          this.events.publish('login');
          this.navCtrl.setRoot(HomePage);
        }
      })
      .catch((error) => console.log("Cann't login success ", error));
  }

  signup() {
    this.authservice.signup(this.email, this.password)
      .then((response) => {
        if (response) {
          let alert = this.alertCtrl.create({
            subTitle: "注册" + this.email + "成功",
            buttons: ['OK']
          });
          this.clearText();
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
    this.clearText();
    this.navCtrl.push(ResetPasswordPage);
  }
}
