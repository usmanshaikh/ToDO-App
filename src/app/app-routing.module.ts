import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { TaskComponent } from "./tasks/task/task.component";
import { SignInComponent } from "./auth/sign-in/sign-in.component";
import { SignUpComponent } from "./auth/sign-up/sign-up.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { AuthGuardService } from "./auth/auth-guard.service";
import { AuthGuardSecureService } from "./auth/auth-guard-secure.service";

const routes: Routes = [
  { path: "", component: TaskComponent, canActivate: [AuthGuardService] },
  {
    path: "user-profile",
    component: UserProfileComponent,
    pathMatch: "full",
    canActivate: [AuthGuardService]
  },
  {
    path: "sign-in",
    component: SignInComponent,
    pathMatch: "full",
    canActivate: [AuthGuardSecureService]
  },
  {
    path: "sign-up",
    component: SignUpComponent,
    pathMatch: "full",
    canActivate: [AuthGuardSecureService]
  },
  {
    path: "privacy-policy",
    component: PrivacyPolicyComponent,
    pathMatch: "full",
    canActivate: [AuthGuardService]
  },
  { path: "404", component: NotFoundComponent },
  { path: "**", redirectTo: "/404" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
