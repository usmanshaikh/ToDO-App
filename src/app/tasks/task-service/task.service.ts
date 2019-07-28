import { AngularFirestore } from "@angular/fire/firestore";
import { Injectable } from "@angular/core";
import * as firebase from "firebase/app";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})

export class TaskService {
  viewAllTask = new Subject<any>();
  activeTask = new Subject<any>();
  completeTask = new Subject<any>();
  activeButton = new Subject<any>();
  inputFocus = new Subject<any>();
  firebasePath = this.angularFirestore.collection("users");

  constructor(private angularFirestore: AngularFirestore) {}

  getTodo(currentUserId: string) {
    return this.firebasePath
      .doc(currentUserId)
      .collection("task", ref => ref.orderBy("created"))
      .snapshotChanges();
  }

  saveTodo(data: Array<any>) {
    let dateCreated = firebase.firestore.FieldValue.serverTimestamp();
    const itemData = { taskMsg: data[0], status: data[1], id: data[2], created: dateCreated };
    this.firebasePath
      .doc(data[3])
      .collection("task")
      .add(itemData);
  }

  editTodoMessage(data: Array<any>) {
    this.firebasePath
      .doc(data[0])
      .collection("task")
      .doc(data[1])
      .update({ taskMsg: data[2], status: data[3] });
  }

  deleteTodo(data: Array<any>) {
    this.firebasePath
      .doc(data[0])
      .collection("task")
      .doc(data[1])
      .delete();
  }
}
