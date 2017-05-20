import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';

/*
  Generated class for the Images page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-images',
  templateUrl: 'images.html'
})
export class ImagesPage {

  pictures: string[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController) {
    menu.enable(false);
    this.pictures = this.navParams.get('images');
  }

  ionViewDidLoad() {
  }

}
