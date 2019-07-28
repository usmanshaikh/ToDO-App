import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: "sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"]
})

export class SignUpComponent implements OnInit {
  model: any = {};
  socialLoginErrorMsg:string;

  constructor(private authService: AuthService, private router: Router) {}

  signInWithFacebook() {
    this.authService.signInWithFacebook()
    .then(() => { this.router.navigate(["/"]); })
    .catch(() => { this.socialLoginErrorMsg = this.authService.socialLoginErrorMsg });
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle()
    .then(() => { this.router.navigate(["/"]); })
    .catch(() => { this.socialLoginErrorMsg = this.authService.socialLoginErrorMsg });
  }

  onSubmit(form: NgForm) {
    const email = this.model.email;
    const password = this.model.password;
    this.authService.registerWithEmailAddress(email, password)
    .then(() => { this.router.navigate(["/"]); });
  }

  ngOnInit() {}
  
}
