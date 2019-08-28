import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DatePipe } from '@angular/common';
import { UserData } from '../add-project/add-project.component';
import { Task } from './task';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import * as _ from 'lodash';
import { ViewTaskService } from 'src/app/services/view-task.service';
import { ProjectService } from 'src/app/services/project.service';
import { ProjectManagerService } from 'src/app/services/project-manager.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

  @ViewChild(FormGroupDirective, { static: true }) myForm;
  taskId = this.route.snapshot.paramMap.get('id');
  constructor(public route: ActivatedRoute, public router: Router,
              public service: ViewTaskService, public projectService: ProjectService,
              public userService: ProjectManagerService, public notificationService: NotificationService,
              public dialog: MatDialog, private datePipe: DatePipe) { }
  userList: UserData[];
  projectList: UserData[];
  parentTaskList: UserData[];
  task: Task;

  ngOnInit() {
    if (this.taskId) {
      console.log('taskId #####' + this.taskId);
      this.service.getTask(this.taskId).subscribe(data => {
        console.log('response :' + data);
        this.task = data;
        this.service.populateForm(this.task);
      });
    }
    this.loadProjects();
    this.loadParentTasks();
    this.loadUsers();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe(projects => {
      console.log('load Projects:' + projects);
      const array: UserData[] = projects.map(project => {
        return {
          userId: project.projectId,
          firstName: project.projectName,
        };
      });
      this.projectList = array;
    });
  }
  loadParentTasks() {
    this.service.getParentTasks().subscribe(ptasks => {
      console.log('fetch parent tasks:' + ptasks);
      const array: UserData[] = ptasks.map(ptask => {
        return {
          userId: ptask.parentId,
          firstName: ptask.parentTaskName,
        };
      });
      this.parentTaskList = array;
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      console.log('get users:' + users);
      const array: UserData[] = users.map(user => {
        return {
          userId: user.userId,
          firstName: user.firstName + ' ' + user.lastName,
        };
      });
      this.userList = array;
    });
  }

  openDialog(data: UserData[], title: string) {
    console.log('loading dialog' + JSON.stringify(data));
    const diologConfig: MatDialogConfig = new MatDialogConfig();
    diologConfig.disableClose = false;
    diologConfig.autoFocus = true;
    diologConfig.width = '40%';
    diologConfig.data = { data, title };
    return this.dialog.open(UserDialogComponent, diologConfig);
  }
  searchProject() {
    const dialogRef = this.openDialog(this.projectList, 'Project');
    dialogRef.afterClosed().subscribe(project => {
      console.log('project');
      this.service.form.controls.projectId.setValue(project.userId);
      this.service.form.controls.projectName.setValue(project.firstName);
    });
  }
  searchParent() {
    const dialogRef = this.openDialog(this.parentTaskList, 'Parent Task');
    dialogRef.afterClosed().subscribe(parentT => {
      console.log('parentT');
      this.service.form.controls.parentId.setValue(parentT.userId);
      this.service.form.controls.parentTaskName.setValue(parentT.firstName);
    });
  }
  searchUser() {
    const dialogRef = this.openDialog(this.userList, 'User');
    dialogRef.afterClosed().subscribe(user => {
      console.log('user');
      this.service.form.controls.userId.setValue(user.userId);
      this.service.form.controls.userName.setValue(user.firstName);
    });
  }

  onSubmit(formdata) {

    if (this.service.form.valid) {
      const userId: string = this.service.form.get('userId').value;
      const parentId: string = this.service.form.get('parentId').value;
      const projectId: string = this.service.form.get('projectId').value;
      const chkPTask: string = this.service.form.get('chkPTask').value;
      if (chkPTask) {
        formdata = _.pick(formdata, ['taskName', 'parentId']);
        let str = JSON.stringify(formdata);
        str = str.replace(/taskName/g, 'parentTaskName');
        console.log(str);
        formdata = JSON.parse(str);
        console.log(JSON.stringify(formdata));
        this.service.addParentTask(formdata).subscribe(res => {
          console.log('Add Task Response:' + res);
          this.refreshPage();
          this.loadParentTasks();
          this.notificationService.success(':: Submitted successfully');
        });
      } else {
        formdata = _.omit(formdata, ['parentId', 'parentTaskName', 'projectId',
         'projectName', 'userId', 'userName', 'chkPTask']);
        formdata = _.extend(formdata, { status: 'ACT' });
        if (!this.service.form.get('taskId').value) {
          this.service.addTask(formdata, parentId, projectId, userId).subscribe(res => {
            console.log('Add Task Response:' + res);
            this.refreshPage();
            this.notificationService.success(':: Submitted successfully');
          });
        } else {
          this.service.updateTask(formdata, parentId, projectId, userId).subscribe(res => {
            this.refreshPage();
            this.notificationService.success(':: Updated successfully');
          });
        }
      }
    }
  }
  refreshPage() {
    this.service.form.reset();
    this.restFormErros();
    this.service.initilizeFormGroup();
  }
  enableParent() {
    console.log('check box' + this.service.form.get('chkPTask').value);
    if (this.service.form.get('chkPTask').value) {
      this.service.form.get('projectName').disable();
      this.service.form.get('startDate').disable();
      this.service.form.get('endDate').disable();
      this.service.form.get('priority').disable();
      this.service.form.get('parentTaskName').disable();
      this.service.form.get('userName').disable();
    } else {
      const endDate = new Date();
      endDate.setDate(new Date().getDate() + 1);
      this.service.form.get('projectName').enable();
      this.service.form.get('startDate').enable();
      this.service.form.get('endDate').enable();
      this.service.form.get('priority').enable();
      this.service.form.get('parentTaskName').enable();
      this.service.form.get('userName').enable();
      this.service.form.get('startDate').setValue(new Date());
      this.service.form.get('endDate').setValue(endDate);
    }
  }
  restFormErros() {
    if (this.myForm) {
      this.myForm.resetForm();
    }
  }
}
