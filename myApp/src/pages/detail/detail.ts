import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { ImagesPage } from '../images/images';
import { ImageDetailPage } from '../image-detail/image-detail';

/*
  Generated class for the Detail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html'
})
export class DetailPage {
  item: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.item = this.navParams.get("item");
    console.log("detail page: ", this.item);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

  chooseImage() {
    let alert = this.alertCtrl.create({
      title: "choose images",
      inputs: [
        {
          name: 'username',
          placeholder: "Username",
          type: 'button'
        },
        {
          name: 'password',
          placeholder: "Password",
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Calcel clicked');
          }
        },
        {
          text: 'Login',
          handler: data => {
            console.log('Login');
          }
        }
      ]
    });

    alert.present();
  }

  goToImages() {
    this.navCtrl.push(ImagesPage);
  }

  imageDetail() {
    this.navCtrl.push(ImageDetailPage);
  }
}
