import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

import { RegisterPage } from '../register/register';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    this.authservice.login(this.email, this.password)
      .then((response) => {
        if (response)
          this.navCtrl.pop();
      })
      .catch((error) => console.log("Cann't login success ", error));
  }

  gotoRegister() {
    this.navCtrl.push(RegisterPage);
  }

}
