import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Project } from './project';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogConfig } from '@angular/material';
import { ProjectService } from 'src/app/services/project.service';
import { ProjectManagerService } from 'src/app/services/project-manager.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { NotificationService } from 'src/app/services/notification.service';
import * as _ from 'lodash';
export interface UserData {
  userId: number;
  firstName: string;
}

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  @ViewChild(FormGroupDirective, { static: true }) myForm;
  listData: MatTableDataSource<Project>;
  // tslint:disable-next-line: max-line-length
  displayedColumns: string[] = ['projectId', 'projectName', 'startDate', 'endDate', 'priority', 'user', 'tasksCount', 'completedTasks', 'actions'];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  searchKey: string;
  userList: UserData[];
  userName: string;
  uId: string;
  // tslint:disable-next-line: max-line-length
  constructor(private cdr: ChangeDetectorRef, public service: ProjectService, public notificationService: NotificationService, private diolog: MatDialog, public userService: ProjectManagerService) {
    this.loadUsers();
  }

  ngOnInit() {
    this.service.initilizeFormGroup();
    this.loadListData();
  }
  onClear() {
    this.service.form.reset();
    this.service.initilizeFormGroup();
  }
  onSubmit(formdata) {
    formdata = _.omit(formdata, ['userId', 'userName', 'checkDates']);
    if (this.service.form.valid) {
      // tslint:disable-next-line: variable-name
      const userId: string = this.service.form.get('userId').value;
      if (!this.service.form.get('projectId').value) {
        this.service.addProject(formdata, userId).subscribe(res => {
          console.log('Add Project Response:' + res);
          this.refreshPage();
          this.notificationService.success(':: Submitted successfully');
        });
      } else {
        this.service.updateProject(formdata, userId).subscribe(res => {
          this.refreshPage();
          this.notificationService.success(':: Updated successfully');
        });
      }
    }
  }
  refreshPage() {
    this.service.form.reset();
    this.restFormErros();
    this.service.initilizeFormGroup();
    this.loadListData();
  }
  onEdit(row) {
    this.service.populateForm(row);
  }
  onDelete($key) {
    if (confirm('Are you sure to delete this record ?')) {
      this.service.deleteProject($key).subscribe(res => {
        console.log('User got deleted');
        this.loadListData();
      });
      this.notificationService.warn('! Deleted successfully');
    }
  }
  loadListData() {
    this.service.getProjects().subscribe(projects => {
      console.log('getProjects:' + projects);
      this.listData = new MatTableDataSource<Project>(projects);
      this.cdr.detectChanges();
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      // the below code is needed to exclude the colum from the filter but show how not working if added usereId
      // this.listData.filterPredicate = (data, filter) => {
      //   return this.displayedColumns.some(ele => {
      //     return ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
      //   });
      // };
    });
  }
  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }
  enableDates(value) {
    console.log('logevent');
    console.log(this.service.form.controls.checkDates.value);
    if (!this.service.form.controls.checkDates.value) {
      this.service.form.controls.startDate.setValue('');
      this.service.form.controls.endDate.setValue('');
      this.service.form.controls.startDate.disable();
      this.service.form.controls.endDate.disable();
    } else {
      const maxToDate = new Date();
      maxToDate.setDate(new Date().getDate() + 1);
      this.service.form.controls.startDate.enable();
      this.service.form.controls.endDate.enable();
      this.service.form.controls.startDate.setValue(new Date());
      this.service.form.controls.endDate.setValue(maxToDate);

    }
    console.log('logevent END');
  }
  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      console.log('getUSer:' + users);
      const array: UserData[] = users.map(user => {
        return {
          userId: user.userId,
          firstName: user.firstName + ' ' + user.lastName,
        };
      });
      this.userList = array;
    });
  }
  empSearch() {
    console.log('loading dialog' + JSON.stringify(this.userList));
    const diologConfig: MatDialogConfig = new MatDialogConfig();
    diologConfig.disableClose = false;
    diologConfig.autoFocus = true;
    diologConfig.width = '40%';
    diologConfig.data = { data: this.userList, title: 'Project' };
    const dialogRef = this.diolog.open(UserDialogComponent, diologConfig);
    dialogRef.afterClosed().subscribe(user => {
      if (user) {
        this.service.form.controls.userId.setValue(user.userId);
        console.log('user id passed is:' + user.userId);
        console.log('user id passed is:' + this.service.form.controls.userId);
        this.service.form.controls.userName.setValue(user.firstName);
      }
    });
  }
  restFormErros() {
    if (this.myForm) {
      this.myForm.resetForm();
    }
  }
}
