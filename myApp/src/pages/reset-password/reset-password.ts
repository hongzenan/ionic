import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";

/*
  Generated class for the ResetPassword page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html'
})
export class ResetPasswordPage {
  email: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authservice: AuthService, public alertCtrl: AlertController) { }

  ionViewDidLoad() {
  }

  resetPassword() {
    this.authservice.resetPassword(this.email).then((response) => {
      let alert = this.alertCtrl.create({
        subTitle: "重置邮件已发送，请进入邮箱确认",
        buttons: ['OK']
      });
      alert.present();
      this.navCtrl.pop();
    }).catch((err) => {
      let alert = this.alertCtrl.create({
        subTitle: "请输入正确的邮箱",
        buttons: ['OK']
      });
      alert.present();
    });
  }
}
