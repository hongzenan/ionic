import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

/*
  Generated class for the Register page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  email: any;
  password: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  register() {
    this.authservice.signup(this.email, this.password)
      .then((response) => {
        this.navCtrl.pop();
      })
  }

}
