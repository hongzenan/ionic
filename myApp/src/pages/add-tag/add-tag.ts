import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the AddTag page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-tag',
  templateUrl: 'add-tag.html'
})
export class AddTagPage {

  addTag: string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddTagPage');
  }

  back() {
    this.navCtrl.pop({
      // "item": this.addTag
    });
  }
}
