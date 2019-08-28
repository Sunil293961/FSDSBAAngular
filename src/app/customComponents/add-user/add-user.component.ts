import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { FormGroupDirective } from '@angular/forms';
import { ProjectManagerService } from 'src/app/services/project-manager.service';
import { User } from './user';

@Component({
  selector: 'app-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  @ViewChild(FormGroupDirective, { static: true }) myForm;
  listData: MatTableDataSource<User>;
  displayedColumns: string[] = ['userId', 'firstName', 'lastName', 'employeeId', 'actions'];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  searchKey: string;

  constructor(public restService: ProjectManagerService) {
  }

  ngOnInit() {
    this.restService.initilizeFormGroup();
    this.loadListData();
  }

  loadListData() {
    this.restService.getUsers().subscribe(users => {
      console.log('getUser:' + users);
      this.listData = new MatTableDataSource<User>(users);
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

  // getUsers(){
  //   console.log("calling users %%%%%%%%%%%%5")
  //   this.restService.getUsers().subscribe(users => {
  //   this.users = users;
  // })
  // }
  onClear() {
    this.restService.form.reset();
    this.restFormErros();
    this.restService.initilizeFormGroup();
    // this.notificationService.success(':: Submitted successfully');
  }
  onSubmit(formdata) {
    let user: User;
    user = formdata;
    if (this.restService.form.valid) {
      if (!this.restService.form.get('userId').value) {
        this.restService.addUser(user).subscribe(res => {
          console.log('Add User Response:' + res);
          this.refreshPage();
        });
      } else {
        this.restService.updateUser(this.restService.form.value).subscribe(res => {
          this.refreshPage();
        });
      }

      // this.notificationService.success(':: Submitted successfully');

    }
  }
  refreshPage() {
    this.restService.form.reset();
    this.restFormErros();
    this.restService.initilizeFormGroup();
    this.loadListData();
  }
  onEdit(row: User) {
    console.log('the object is' + row);
    this.restService.populateForm(row);
  }
  onDelete($key) {
    if (confirm('Are you sure to delete this record ?')) {
      this.restService.deleteUser($key).subscribe(res => {
        console.log('User got deleted');
        this.loadListData();
      });
      // this.notificationService.warn('! Deleted successfully');
    }
  }
  restFormErros() {
    if (this.myForm) {
      this.myForm.resetForm();
    }
  }
}
