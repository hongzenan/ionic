import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';

// pages
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { DetailPage } from '../pages/detail/detail';
import { ImagesPage } from '../pages/images/images';
import { ImageDetailPage } from '../pages/image-detail/image-detail';
import { IonCalendar } from '../components/ion-calendar/ion-calendar';

// services
import { AuthService } from '../providers/auth-service';

import { DatePicker } from 'ionic2-date-picker/ionic2-date-picker';
import { Geolocation } from '@ionic-native/geolocation';


// Initialize Firebase
const config = {
  apiKey: "AIzaSyDRnt4FM3wfjsIW3_oLQJSSsxN5oFF9Xeg",
  authDomain: "diary-36ca9.firebaseapp.com",
  databaseURL: "https://diary-36ca9.firebaseio.com",
  storageBucket: "diary-36ca9.appspot.com",
  messagingSenderId: "965263778566"
};


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    DetailPage,
    ImagesPage,
    ImageDetailPage,
    IonCalendar,
    DatePicker
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    DetailPage,
    ImagesPage,
    ImageDetailPage,
    IonCalendar,
    DatePicker
  ],
  providers: [
    AuthService,
    // {
    //   provide: ErrorHandler,
    //   useClass: IonicErrorHandler
    // },
    Geolocation,
    HttpModule
  ]
})
export class AppModule { }