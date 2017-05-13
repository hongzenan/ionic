import { Injectable } from '@angular/core';
import { AuthProviders, AuthMethods, AngularFireAuth, FirebaseAuthState, AngularFire } from 'angularfire2';
import * as firebase from 'firebase';

/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthService {

  private authState: FirebaseAuthState;

  constructor(public auth$: AngularFireAuth, public angfire: AngularFire) {
    this.authState = auth$.getAuth();
    const a = auth$.subscribe((state: FirebaseAuthState) => {
      this.authState = state;
    });
    a.unsubscribe();
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  login(email: string, password: string): firebase.Promise<FirebaseAuthState> {
    return this.angfire.auth.login({
      email: email,
      password: password
    }, {
        provider: AuthProviders.Password,
        method: AuthMethods.Password
      }).then((response) => {
        let currentuser = {
          email: response.auth.email,
          picture: response.auth.photoURL
        };
        window.localStorage.setItem('currentuser', JSON.stringify(currentuser));
        return response;
      }).catch((error) => {
        alert(error);
      });
  }

  signup(email: string, password: string): firebase.Promise<FirebaseAuthState> {
    return this.angfire.auth.createUser({
      email, password
    })
      .then((user) => {
        return user;
      })
      .catch((error) => console.log('Create User Failure', error));
  }

  signOut(): firebase.Promise<void> {
    return this.angfire.auth.logout()
      .then((response) => {
        window.localStorage.removeItem('currentuser');
        window.localStorage.removeItem('tags');
        window.localStorage.removeItem('locates');
        window.localStorage.removeItem('diarys');
      })
      .catch((error) => console.log('Log Out Failure ', error))
  }

  resetPassword(email: string): firebase.Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }
}
