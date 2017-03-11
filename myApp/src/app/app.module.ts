import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';

// pages
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { TestPage } from '../pages/test/test';

// services
import { AuthService } from '../providers/auth-service';

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
    TestPage
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
    TestPage
  ],
  providers: [
    AuthService,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    }
  ]
})
export class AppModule { }