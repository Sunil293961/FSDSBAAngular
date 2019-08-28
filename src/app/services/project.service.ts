import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { CrossFieldErrorMatcher } from './project-manager.service';
import { CustomValidator } from '../customComponents/custom-validator';
import { Observable, of } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { Project } from '../customComponents/add-project/project';
const endpoint = 'http://localhost:8085/projectManagerService/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  responseType: 'text' as 'json'
};
@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  form: FormGroup;
  errorMatcher = new CrossFieldErrorMatcher();

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      projectId: new FormControl(null),
      projectName: new FormControl('', CustomValidator.required),
      startDate: new FormControl({ value: '', disabled: true }, CustomValidator.fromDateValidator),
      endDate: new FormControl({ value: '', disabled: true }, CustomValidator.toDateValidator),
      priority: new FormControl(0),
      userId: new FormControl(null),
      userName: new FormControl(null, CustomValidator.required),
      checkDates: new FormControl(false)
    }, { validator: CustomValidator.identityRevealedValidator });
  }
  initilizeFormGroup() {
    this.form.reset();
    this.form.setValue({
      projectId: 0,
      userId: 0,
      userName: '',
      projectName: '',
      startDate: '',
      endDate: '',
      priority: 0,
      checkDates: false,
    });
    this.form.controls.startDate.disable();
    this.form.controls.endDate.disable();
  }
  populateForm(project) {

    if (project.startDate && project.endDate) {
      this.form.controls.startDate.enable();
      this.form.controls.endDate.enable();
    }
    this.form.setValue({
      projectId: project.projectId,
      userId: project.user.userId,
      userName: project.user.firstName + ' ' + project.user.lastName,
      projectName: project.projectName,
      startDate: new Date(project.startDate),
      endDate: new Date(project.endDate),
      priority: project.priority,
      checkDates: (project.startDate && project.endDate) ? true : false,
    });
  }
  // tslint:disable-next-line: variable-name
  addProject(project: any, userId: string): Observable<Project> {
    console.log('adding New Project:' + JSON.stringify(project));
    return this.http.post<Project>(endpoint + 'addProject?userId=' + userId, JSON.stringify(project), httpOptions).pipe(
      tap(res => { console.log('Add Response' + res); }),
      retry(1),
      catchError(this.handleError<Project>('Add Project'))
    );
  }

  // tslint:disable-next-line: variable-name
  updateProject(project: Project, userId: string): Observable<Project> {
    return this.http.put<Project>(endpoint + 'updateProject?userId=' + userId, project, httpOptions).pipe(
      tap((user) => { console.log(`updated Project W/ id=${project.projectId}`); }),
      catchError(this.handleError<any>('update Project'))
    );
  }
  getProjects(): Observable<Project[]> {
    console.log('service calling getProjects');
    return this.http.get<Project[]>(endpoint + 'getProjects').pipe(
      tap(_ => console.log('searched Project results')),
      catchError(this.handleError<Project[]>('search Project', []))
    );
  }

  deleteProject(id: string): Observable<Project> {
    return this.http.delete(endpoint + 'projects/' + id).pipe(
      retry(1),
      catchError(this.handleError<any>('Delete Project'))
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

