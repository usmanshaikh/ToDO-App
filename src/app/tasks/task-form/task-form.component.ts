import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TaskService } from "../task-service/task.service";
import { AngularFireAuth } from "@angular/fire/auth";
import { Subscription } from "rxjs";

@Component({
  selector: "task-form",
  templateUrl: "./task-form.component.html",
  styleUrls: ["./task-form.component.scss"]
})

export class TaskFormComponent implements OnInit, OnDestroy {
  currentUserId: string;
  subscription: Subscription = new Subscription();
  toDoForm: FormGroup = this.formBuilder.group({
    taskName: ["", [Validators.required, Validators.minLength(1)]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private angularFireAuth: AngularFireAuth
    ) {
      this.subscription.add(
        this.angularFireAuth.authState.subscribe(user => { if (user) { this.currentUserId = user.uid; } })
      );
  }

  onSubmit(form: FormGroup) {
    const uniqueId = Math.floor(Math.random() * 10000) + 1;
    const taskMsg = form.value.taskName;
    const data = [taskMsg, "active", uniqueId, this.currentUserId];
    this.taskService.saveTodo(data);
    form.reset();
    this.taskService.viewAllTask.next();
    this.taskService.activeButton.next(true);
  }

  ngOnInit() {}

  ngOnDestroy() { this.subscription.unsubscribe(); }

}
