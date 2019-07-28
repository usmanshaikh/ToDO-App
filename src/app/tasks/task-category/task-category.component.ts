import { Component, OnInit, OnDestroy } from "@angular/core";
import { TaskService } from "../task-service/task.service";
import { Subscription } from "rxjs";

@Component({
  selector: "task-category",
  templateUrl: "./task-category.component.html",
  styleUrls: ["./task-category.component.scss"]
})

export class TaskCategoryComponent implements OnInit, OnDestroy {
  button1: boolean = false;
  button2: boolean = false;
  button3: boolean = false;
  subscription: Subscription = new Subscription();

  constructor(private taskService: TaskService) {
    this.subscription.add(
      this.taskService.activeButton.subscribe(() => {
        this.button1 = true;
        this.button2 = false;
        this.button3 = false;
      })
    );
  }

  onViewAllTask() {
    this.button1 = true;
    this.button2 = false;
    this.button3 = false;
    this.taskService.viewAllTask.next(true);
  }

  onActiveTask() {
    this.button1 = false;
    this.button2 = true;
    this.button3 = false;
    this.taskService.activeTask.next(true);
  }

  onCompletedTask() {
    this.button1 = false;
    this.button2 = false;
    this.button3 = true;
    this.taskService.completeTask.next(true);
  }

  ngOnInit() { this.button1 = true; }

  ngOnDestroy() { this.subscription.unsubscribe(); }
  
}
