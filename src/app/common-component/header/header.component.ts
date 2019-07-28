import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import { UserProfileService } from "src/app/user-profile/user-profile.service";
import { AngularFireAuth } from "@angular/fire/auth";
import { Subscription } from "rxjs";

@Component({
  selector: "header-component",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})

export class HeaderComponent implements OnInit, OnDestroy {
  userImage: string;
  userName: string;
  currentUserId: string;
  subscription: Subscription = new Subscription();

  constructor(
    public authService: AuthService,
    private userProfileService: UserProfileService,
    private angularFireAuth: AngularFireAuth
  ) {
    this.angularFireAuth.authState.subscribe(user => {
      if (user) { this.currentUserId = user.uid; this.loadUserProfile(); }
    });
  }

  onLogout() { this.authService.logout(); }

  loadUserProfile() {
    this.subscription.add(
      this.userProfileService.getUserProfile(this.currentUserId).subscribe(response => {
        if (typeof response !== 'undefined' && response.length > 0) {
          response.map(val => { this.userImage = val.image; this.userName = val.name; });
        }else{
          this.userImage = '../../../assets/avatar.png';
          this.userName = 'Your Name';
        }
      })
    );
  }

  ngOnInit() {}

  ngOnDestroy() { this.subscription.unsubscribe(); }

}
