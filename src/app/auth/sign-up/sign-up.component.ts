import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { NgForm } from "@angular/forms";
import { DOCUMENT } from '@angular/common';

@Component({
  selector: "sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"]
})

export class SignUpComponent implements OnInit {
  model: any = {};
  loginErrorMsg:string;

  constructor(private authService: AuthService, private router: Router,@Inject(DOCUMENT) private document: Document) {}

  signInWithFacebook() {
    this.authService.signInWithFacebook()
    .then(() => this.router.navigate(["/"]))
    .catch(() => this.loginErrorMsg = this.authService.socialLoginErrorMsg);
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle()
    .then(() => this.router.navigate(["/"]))
    .catch(() => this.loginErrorMsg = this.authService.socialLoginErrorMsg);
  }

  onSubmit(form: NgForm) {
    const email = this.model.email;
    const password = this.model.password;
    this.authService.registerWithEmailAddress(email, password)
    .then(() => this.router.navigate(["/"]))
    .catch((error) => this.loginErrorMsg = error.message);
  }
  
  onFocus(){ this.document.body.classList.add('keyboardOpen'); }

  onBlur(){ this.document.body.classList.remove('keyboardOpen'); }

  ngOnInit() {}
  
}
