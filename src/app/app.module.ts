import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { TaskComponent } from './tasks/task/task.component';
import { TaskFormComponent } from './tasks/task-form/task-form.component';
import { TaskItemComponent } from './tasks/task-item/task-item.component';
import { HeaderComponent } from './common-component/header/header.component';
import { FooterComponent } from './common-component/footer/footer.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TaskCategoryComponent } from './tasks/task-category/task-category.component';
import { TaskService } from './tasks/task-service/task.service';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { AuthService } from './auth/auth.service';
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { UserProfileService } from './user-profile/user-profile.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    TaskFormComponent,
    TaskItemComponent,
    HeaderComponent,
    FooterComponent,
    NotFoundComponent,
    UserProfileComponent,
    TaskCategoryComponent,
    SignInComponent,
    SignUpComponent,
    PrivacyPolicyComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatButtonModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule
  ],
  providers: [TaskService,AuthService,UserProfileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
