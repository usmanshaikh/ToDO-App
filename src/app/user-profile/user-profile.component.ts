import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { UserProfileService } from "./user-profile.service";
import { AngularFireStorage } from "@angular/fire/storage";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { finalize } from "rxjs/operators";
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: "user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"]
})

export class UserProfileComponent implements OnInit,OnDestroy {
  name: string;
  imgSrc: string;
  fileCount:string;
  currentUserId: string;
  registerForm: FormGroup;
  activeTaskCount: number;
  loading: boolean = false;
  selectedImage: any = null;
  completeTaskCount: number;
  submitted: boolean = false;
  subscription: Subscription = new Subscription();
  firebasePath = this.angularFirestore.collection("users");

  constructor(
    private formBuilder: FormBuilder,
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore,
    private userProfileService: UserProfileService,
    private angularFireStorage: AngularFireStorage,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.subscription.add(
      this.angularFireAuth.authState.subscribe(user => {
        if (user) {
        this.currentUserId = user.uid;
        this.loadUserProfile();
        this.firebasePath.doc(this.currentUserId).collection("task").valueChanges().subscribe(values => {
          this.activeTaskCount = values.filter( value => value.status === "active" ).length;
          this.completeTaskCount = values.filter( value => value.status === "complete" ).length;
          });
        }
    }));
  }

  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => (this.imgSrc = e.target.result);
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
      this.fileCount = "1 File Chosen"
    } else {
      this.imgSrc = "../../assets/placeholder.jpg";
      this.selectedImage = null;
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.valid) {
      this.loading = true;
      if (this.selectedImage === null) {
        const setImageUrl = {
          image: this.imgSrc,
          name: this.registerForm.controls[ "userName" ] = this.registerForm.controls["userName"].value
        };
        this.pushDataToService(setImageUrl);
      } else {
        var filePath = `${this.currentUserId}/${this.selectedImage.name.split(".").slice(0, -1).join(".")}`;
        const fileRef = this.angularFireStorage.ref(filePath);
        this.angularFireStorage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe(url => {
                const setImageUrl = {
                  image: this.registerForm.controls["imageUrl"] = url,
                  name: this.registerForm.controls[ "userName" ] = this.registerForm.controls["userName"].value
                };
                this.pushDataToService(setImageUrl);
              });
            })
          ).subscribe();
      }
    }
  }

  get f() { return this.registerForm.controls; }

  pushDataToService(setImageUrl){
    this.userProfileService.saveUserDetails( setImageUrl, this.currentUserId );
    this.resetForm();
    this.loadUserProfile;
  }

  resetForm() {
    this.registerForm = this.formBuilder.group({
      imageUrl: [""],
      userName: ["", Validators.required]
    });
    this.imgSrc = "../../assets/placeholder.jpg";
    this.selectedImage = null;
    this.submitted = false;
    this.loading = false;
    this.fileCount = ""
  }

  loadUserProfile() {
    this.subscription.add(
      this.userProfileService.getUserProfile(this.currentUserId).subscribe(response => {
        if (typeof response !== 'undefined' && response.length > 0) {
          response.map(val => { this.imgSrc = val.image; this.name = val.name; });
        }else{
          this.imgSrc = '../../../assets/avatar.png';
          this.name = 'Your Name';
        }
      })
    );
  }

  onClearTask(taskStatus: string) {
    this.firebasePath.doc(this.currentUserId)
      .collection("task", ref => ref.where("status", "==", taskStatus))
      .get()
      .forEach(querySnapshot => {
        const batch = this.angularFirestore.firestore.batch();
        querySnapshot.forEach(doc => { batch.delete(doc.ref); });
        return batch.commit();
      })
      .then(()=> {
        document.getElementById("ClearCompletedTodoModal").click();
        document.getElementById("ClearActiveTodoModal").click();
      });
  }

  onFocus(){ this.document.body.classList.add('keyboardOpen'); }

  onBlur(){ this.document.body.classList.remove('keyboardOpen'); }

  ngOnInit() { this.resetForm(); }

  ngOnDestroy(){ this.subscription.unsubscribe(); }

}
