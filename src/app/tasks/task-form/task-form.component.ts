import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Inject
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TaskService } from "../task-service/task.service";
import { AngularFireAuth } from "@angular/fire/auth";
import { Subscription } from "rxjs";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "task-form",
  templateUrl: "./task-form.component.html",
  styleUrls: ["./task-form.component.scss"]
})
export class TaskFormComponent implements OnInit, OnDestroy {
  currentUserId: string;
  subscription: Subscription = new Subscription();
  @ViewChild("formTaskInput", { static: false }) formTaskInput: ElementRef;

  toDoForm: FormGroup = this.formBuilder.group({
    taskName: ["", [Validators.required, Validators.minLength(1)]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private angularFireAuth: AngularFireAuth,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.subscription.add(
      this.angularFireAuth.authState.subscribe(user => {
        if (user) {
          this.currentUserId = user.uid;
        }
      })
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

  ngOnInit() {
    this.taskService.inputFocus.subscribe(() =>
      this.formTaskInput.nativeElement.focus()
    );
  }

  onFocus() {
    this.document.body.classList.add("keyboardOpen");
  }

  onBlur() {
    this.document.body.classList.remove("keyboardOpen");
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
