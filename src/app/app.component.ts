import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Project Manament';
   _links: any[];
  activeLinkIndex = -1;
  constructor(private routes: Router) {
    this._links = [
      {
        label: 'Add Project',
        link: '/add-project',
        index: 0
      }, {
        label: 'Add Task',
        link: '/add-task',
        index: 1
      }, {
        label: 'Add User',
        link: '/add-user',
        index: 2
      }, {
        label: 'View Task',
        link: '/view-task',
        index: 3
      },
    ];
  }
  ngOnInit(): void {
    this.routes.events.subscribe((res) => {
      this.activeLinkIndex = this._links.indexOf(this._links.find(tab => tab.link === '.' + this.routes.url));
    });
  }
}