import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionCtrl: ActionSheetController) {
    this.item = this.navParams.get("item");
    console.log("detail page: ", this.item);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

  chooseImage() {
    let actionSheet = this.actionCtrl.create({
      title: "choose images",
      buttons: [
        {
          text: 'Destructive',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: 'Archive',
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  goToImages() {
    this.navCtrl.push(ImagesPage);
  }

  imageDetail() {
    this.navCtrl.push(ImageDetailPage);
  }
}
