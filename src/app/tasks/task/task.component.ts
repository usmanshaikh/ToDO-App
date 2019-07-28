import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { timer } from "rxjs";

@Component({
  selector: 'task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})

export class TaskComponent implements OnInit, OnDestroy {
  timer: Observable<any>;
  showloader: boolean = false;
  subscription: Subscription = new Subscription();
  
  constructor() { 
    window.onbeforeunload = function(e) {
      localStorage.removeItem('spinner');
    };
  }

  setTimer() {
    this.showloader = true;
    this.timer = timer(4500);
    this.subscription.add( this.timer.subscribe(() => { this.showloader = false; }) );
    localStorage.setItem("spinner", 'true');
  }

  ngOnInit() { if (localStorage.getItem("spinner") === null) { this.setTimer(); } }

  ngOnDestroy() { this.subscription.unsubscribe(); }

}
