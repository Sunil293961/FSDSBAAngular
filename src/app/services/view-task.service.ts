import { Injectable } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, FormGroup, FormBuilder } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Task } from '../customComponents/add-task/task';
import { tap, retry, catchError } from 'rxjs/operators';
import { ParentTask } from '../customComponents/add-task/parent-task';
import { CustomValidator } from '../customComponents/custom-validator';
export /** Error when the parent is invalid */
  class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    // return control.dirty && form.invalid;
    return control.touched && form.hasError('invalidDates');
  }
}
const url = 'http://localhost:8085/projectManagerService/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  responseType: 'text' as 'json'
};

@Injectable({
  providedIn: 'root'
})
export class ViewTaskService {
  form: FormGroup;
  errorMatcher = new CrossFieldErrorMatcher();
  endDate: Date;

  constructor(private fb: FormBuilder, private http: HttpClient, private datePipe: DatePipe) {
    this.endDate = new Date();
    this.endDate.setDate(new Date().getDate() + 1);
    this.form = this.fb.group({
      taskId: new FormControl(null),
      parentId: new FormControl(null),
      projectId: new FormControl(null),
      userId: new FormControl(null),
      projectName: new FormControl('', CustomValidator.required),
      taskName: new FormControl('', CustomValidator.required),
      chkPTask: new FormControl(false),
      startDate: new FormControl(new Date(), CustomValidator.fromDateValidator),
      endDate: new FormControl(this.endDate, CustomValidator.toDateValidator),
      priority: new FormControl(0),
      parentTaskName: new FormControl('', CustomValidator.required),
      userName: new FormControl(null, CustomValidator.required)
    }, { validator: CustomValidator.identityRevealedValidator });
  }

  initilizeFormGroup() {
    this.form.setValue({
      taskId: 0,
      parentId: 0,
      projectId: 0,
      userId: 0,
      projectName: '',
      taskName: '',
      chkPTask: false,
      startDate: new Date(),
      endDate: this.endDate,
      priority: 0,
      parentTaskName: '',
      userName: '',
    });
  }
  populateForm(task: Task) {
    console.log('papulating form:' + JSON.stringify(task));
    this.form.setValue({
      taskId: task.taskId,
      parentId: task.parentTask.parentId,
      projectId: task.project.projectId,
      userId: task.user.userId,
      projectName: task.project.projectName,
      taskName: task.taskName,
      chkPTask: false,
      startDate: new Date(task.startDate),
      endDate: new Date(task.endDate),
      priority: task.priority,
      parentTaskName: task.parentTask.parentTaskName,
      userName: task.user.firstName + ' ' + task.user.lastName,
    });
    this.form.controls.chkPTask.disable();
  }
  addTask(task: Task, parentId: string, projectId: string, userId: string): Observable<Task> {
    console.log('adding New Task:' + JSON.stringify(task));
    // tslint:disable-next-line: max-line-length
    return this.http.post<Task>(url + 'createTask?parentId=' + parentId + '&projectId=' + projectId + '&userId=' + userId, JSON.stringify(task), httpOptions).pipe(
      tap(res => { console.log('Add Response' + res); }),
      retry(1),
      catchError(this.handleError<Task>('Add Task'))
    );
  }
  updateTask(task: Task, parentId: string, projectId: string, userId: string): Observable<Task> {
    // tslint:disable-next-line: max-line-length
    return this.http.put<Task>(url + 'updateTask?parentId=' + parentId + '&projectId=' + projectId + '&userId=' + userId, task, httpOptions).pipe(
      tap((user) => { console.log(`updated Task W/ id=${task.taskId}`); }),
      catchError(this.handleError<any>('update Task'))
    );
  }
  getTask(taskId): Observable<Task> {
    console.log('service calling getTask');
    return this.http.get<Task>(url + 'getTask?taskId=' + taskId).pipe(
      tap(res => console.log('searched Tasks result')),
      catchError(this.handleError<Task>('get Task'))
    );
  }
  getTasks(): Observable<Task[]> {
    console.log('service calling getTasks');
    return this.http.get<Task[]>(url + 'getTasks').pipe(
      tap(_ => console.log('searched Tasks results')),
      catchError(this.handleError<Task[]>('search Task', []))
    );
  }
  getTasksByProjectId(projectId: string): Observable<Task[]> {
    console.log('service calling getTasks');
    return this.http.get<Task[]>(url + 'getTasksByPorjectId?projectId=' + projectId).pipe(
      tap(_ => console.log('searched Tasks results')),
      catchError(this.handleError<Task[]>('search Task', []))
    );
  }
  addParentTask(ptask: ParentTask): Observable<ParentTask> {
    return this.http.post<ParentTask>(url + 'createParentTask', ptask, httpOptions).pipe(
      tap((user) => { console.log(`updated Task W/ id=${ptask.parentId}`); }),
      catchError(this.handleError<ParentTask>('create ParentTask'))
    );
  }
  updateParentTask(ptask: ParentTask): Observable<ParentTask> {
    return this.http.put<ParentTask>(url + 'updateParentTask', ptask, httpOptions).pipe(
      tap((user) => { console.log(`updated Task W/ id=${ptask.parentId}`); }),
      catchError(this.handleError<any>('update ParentTask'))
    );
  }
  getParentTasks(): Observable<ParentTask[]> {
    console.log('service calling getParentTasks');
    return this.http.get<ParentTask[]>(url + 'getParentTasks').pipe(
      tap(_ => console.log('searched Parent Task results')),
      catchError(this.handleError<ParentTask[]>('search Parent Tasks', []))
    );
  }

  deleteTask(id): Observable<Task> {
    return this.http.delete(url + 'deleteTask/' + id).pipe(
      retry(1),
      catchError(this.handleError<any>('Delete Task'))
    );
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
