import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "./user";
import * as firebase from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestoreDocument, AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root"
})

export class AuthService {
  userData: any;
  isLoggedin: boolean = false;
  currentUserId: string;
  socialLoginErrorMsg: string = "Account already exists with the same email address but different sign-in credentials.";

  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private router: Router
  ) {
    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        this.currentUserId = user.uid;
        localStorage.setItem("user", JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem("user"));
      } else {
        localStorage.setItem("user", null);
        JSON.parse(localStorage.getItem("user"));
      }
    });
  }

  async signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.angularFireAuth.auth.signInWithPopup(provider);
    return this.setUserData(credential.user);
  }

  async signInWithFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();
    const credential = await this.angularFireAuth.auth.signInWithPopup(provider);
    return this.setUserData(credential.user);
  }

  loginWithEmailAddress(email: string, password: string) {
    return this.angularFireAuth.auth.signInWithEmailAndPassword(email, password)
      .then(value => { this.setUserData(value.user); });
  }

  registerWithEmailAddress(email: string, password: string) {
    return this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(value => { this.setUserData(value.user); });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem("user"));
    return user !== null ? true : false;
  }

  isAuthenticated() {
    if (JSON.parse(localStorage.getItem("user")) == null) {
      this.isLoggedin = false;
      return this.isLoggedin;
    } else {
      return true;
    }
  }

  logout() {
    return this.angularFireAuth.auth.signOut()
    .then(() => { 
      localStorage.removeItem("user");
      localStorage.removeItem("spinner");
      this.router.navigate(["/sign-in"]);
    });
  }

  setUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc( `users/${user.uid}` );
    const userData: User = {
      uid: user.uid,
      email: user.email
    };
    return userRef.set(userData, { merge: true });
  }
}
