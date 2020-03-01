import { AngularFirestore } from "@angular/fire/firestore";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class UserProfileService {
  firebasePath = this.angularFirestore.collection("users");

  constructor(private angularFirestore: AngularFirestore) {}

  saveUserDetails(usersDetails, currentUserId: string) {
    this.firebasePath
      .doc(currentUserId)
      .collection("profile")
      .doc("usersDetails")
      .set(usersDetails);
    document.getElementById("EditProfileModal").click();
  }

  getUserProfile(currentUserId: string) {
    return this.firebasePath
      .doc(currentUserId)
      .collection("profile")
      .valueChanges();
  }
}
