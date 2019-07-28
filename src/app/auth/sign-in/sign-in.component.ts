import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: "sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.scss"]
})

export class SignInComponent implements OnInit {
  model: any = {};
  socialLoginErrorMsg:string;

  constructor(private authService: AuthService, private router: Router) {}

  signInWithFacebook() {
    this.authService.signInWithFacebook()
    .then(() => { this.router.navigate(["/"]); })
    .catch(() => { this.socialLoginErrorMsg = this.authService.socialLoginErrorMsg; });
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle()
    .then(() => { this.router.navigate(["/"]); })
    .catch(() => { this.socialLoginErrorMsg = this.authService.socialLoginErrorMsg; });
  }

  onSubmit(form: NgForm) {
    const email = this.model.email;
    const password = this.model.password;
    this.authService.loginWithEmailAddress(email, password)
    .then(() => { this.router.navigate(["/"]); });
  }

  ngOnInit() {}
}
