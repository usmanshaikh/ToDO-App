import { Component, OnInit, OnDestroy } from "@angular/core";
import { TaskService } from "../task-service/task.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { AngularFireAuth } from "@angular/fire/auth";
import { TaskModel } from "../task-model.model";
import { Subscription } from "rxjs";

@Component({
  selector: "task-item",
  templateUrl: "./task-item.component.html",
  styleUrls: ["./task-item.component.scss"]
})
export class TaskItemComponent implements OnInit, OnDestroy {
  allTaskItemList: TaskModel[];
  filterTaskItemList: TaskModel[] = [];
  deleteItem: string;
  subscription: Subscription = new Subscription();
  viewAllBtnIsActive: boolean;
  ActiveBtnIsActive: boolean;
  completeBtnIsActive: boolean;
  currentUserId: string;
  updateItem: string;
  updateStatus: string;
  toDoEditForm: FormGroup = this.formBuilder.group({
    taskName: ""
  });

  constructor(
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    private angularFireAuth: AngularFireAuth
  ) {
    this.viewAllBtnIsActive = true;
    // onfirst run this should be active becoz when we delete item on first attempt the task list not getting refresh
    this.subscription.add(
      this.angularFireAuth.authState.subscribe(user => {
        if (user) {
          this.currentUserId = user.uid;
          this.loadTodosTasks();
        }
      })
    );
    this.subscription.add(
      this.taskService.viewAllTask.subscribe(() => {
        this.viewAllBtnIsActive = true;
        this.ActiveBtnIsActive = false;
        this.completeBtnIsActive = false;
        this.filterTaskItemList = this.allTaskItemList.reduce(
          (acc, arrValue) => {
            if (
              arrValue.status === "complete" ||
              arrValue.status === "active"
            ) {
              acc.push({
                taskMsg: arrValue.taskMsg,
                status: arrValue.status,
                id: arrValue.id
              });
            }
            return acc;
          },
          []
        );
      })
    );
    this.subscription.add(
      this.taskService.activeTask.subscribe(() => {
        this.viewAllBtnIsActive = false;
        this.ActiveBtnIsActive = true;
        this.completeBtnIsActive = false;
        this.filterTaskItemList = this.allTaskItemList.reduce(
          (acc, arrValue) => {
            if (arrValue.status === "active") {
              acc.push({
                taskMsg: arrValue.taskMsg,
                status: arrValue.status,
                id: arrValue.id
              });
            }
            return acc;
          },
          []
        );
      })
    );
    this.subscription.add(
      this.taskService.completeTask.subscribe(() => {
        this.viewAllBtnIsActive = false;
        this.ActiveBtnIsActive = false;
        this.completeBtnIsActive = true;
        this.filterTaskItemList = this.allTaskItemList.reduce(
          (acc, arrValue) => {
            if (arrValue.status === "complete") {
              acc.push({
                taskMsg: arrValue.taskMsg,
                status: arrValue.status,
                id: arrValue.id
              });
            }
            return acc;
          },
          []
        );
      })
    );
  }

  onCompleteTask(item: TaskModel) {
    if (item.status === "active") {
      this.allTaskItemList.map(value => {
        if (value.id === item.id) {
          const data = [this.currentUserId, item.id, item.taskMsg, "complete"];
          this.taskService.editTodoMessage(data);
        }
      });
      this.checkCurrentActiveCategory();
    } else if (item.status === "complete") {
      this.allTaskItemList.map(value => {
        if (value.id === item.id) {
          const data = [this.currentUserId, item.id, item.taskMsg, "active"];
          this.taskService.editTodoMessage(data);
        }
      });
      this.checkCurrentActiveCategory();
    }
  }

  checkCurrentActiveCategory() {
    if (this.viewAllBtnIsActive) {
      this.taskService.viewAllTask.next();
    } else if (this.ActiveBtnIsActive) {
      this.taskService.activeTask.next();
    } else if (this.completeBtnIsActive) {
      this.taskService.completeTask.next();
    }
  }

  onOpenDeleteModal(item: TaskModel) {
    this.deleteItem = item.id;
  }

  onDelete() {
    const data = [this.currentUserId, this.deleteItem];
    this.taskService.deleteTodo(data);
    document.getElementById("deleteTaskModal").click();
    this.checkCurrentActiveCategory();
  }

  onEditTaskModal(item: TaskModel) {
    this.updateItem = item.id;
    this.updateStatus = item.status;
    this.toDoEditForm = this.formBuilder.group({
      taskName: item.taskMsg
    });
  }

  onSubmit(form: FormGroup) {
    const data = [
      this.currentUserId,
      this.updateItem,
      form.value.taskName,
      this.updateStatus
    ];
    this.taskService.editTodoMessage(data);
    form.reset();
    document.getElementById("editTaskModal").click();
    this.checkCurrentActiveCategory();
  }

  onInputFocus() {
    this.taskService.inputFocus.next();
  }

  loadTodosTasks() {
    this.subscription.add(
      this.taskService.getTodo(this.currentUserId).subscribe(data => {
        this.allTaskItemList = data.map(e => {
          const data = e.payload.doc.data() as TaskModel;
          data.id = e.payload.doc.id;
          return data;
        });
        this.filterTaskItemList = [...this.allTaskItemList]; // create copy of original array
        this.checkCurrentActiveCategory();
      })
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
