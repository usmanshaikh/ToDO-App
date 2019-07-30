import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subscription } from 'rxjs';
import { timer } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})

export class AppComponent implements OnInit, OnDestroy {
  title = "ToDo App";
  timer: Observable<any>;
  showloader: boolean = false;
  subscription: Subscription = new Subscription();
  
  constructor() { }

  setTimer() {
    this.showloader = true;
    this.timer = timer(2000);
    this.subscription.add( this.timer.subscribe(() => { this.showloader = false; }) );
  }

  ngOnInit() { this.setTimer(); }

  ngOnDestroy() { this.subscription.unsubscribe(); }

}
