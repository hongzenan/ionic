import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native'

import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage
  myInput: string = "";
  toggleDate: boolean = false;
  toggleItem1: boolean = false;
  toggleItem2: boolean = false;
  items1: string[] = ['item1 child1', 'item1 child2'];
  items2: string[] = ['item2 child1', 'item2 child2'];

  constructor(platform: Platform) {
    platform.ready().then(() => {
      StatusBar.styleDefault()
      Splashscreen.hide()

    });
  }

  onInput($event) {
    console.log("onInput: ", $event);
  }

  onCancel($event) {
    console.log("onCancel: ", $event);
  }

  toggleForItem1() {
    this.toggleItem1 = !this.toggleItem1;
  }

  toggleForItem2() {
    this.toggleItem2 = !this.toggleItem2;
    console.log("item2", this.toggleItem2);
  }

  toggleForDate() {
    this.toggleDate = !this.toggleDate;
  }
}