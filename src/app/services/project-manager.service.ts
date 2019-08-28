import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, retry } from 'rxjs/operators';
import { FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { User } from '../customComponents/add-user/user';

export /** Error when the parent is invalid */
  class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    // return control.dirty && form.invalid;
    return control.touched && form.hasError('invalidDates');
  }
}

const endpoint = 'http://localhost:8085/projectManagerService/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    responseType: 'text' as 'json',
  })
};
@Injectable({
  providedIn: 'root'
})
export class ProjectManagerService {
  constructor(private http: HttpClient) { }

  form: FormGroup = new FormGroup({
    userId: new FormControl(null),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    employeeId: new FormControl('', [Validators.required, Validators.pattern('^[A-Z0-9]*$')]),

  });

  initilizeFormGroup() {
    this.form.setValue({
      userId: 0,
      firstName: '',
      lastName: '',
      employeeId: '',
    });
  }
  populateForm(user) {
    this.form.setValue(user);
  }
  addUser(user): Observable<User> {
    console.log('adding New User:' + user.userId + user.firstName + user.lastName + user.employeeId);
    return this.http.post<User>(endpoint + 'addUser', JSON.stringify(user), httpOptions).pipe(
      tap(res => { console.log('Add Response' + res); }),
      catchError(this.handleError<User>('Add User'))
    );
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(endpoint + 'updateUser', user, httpOptions).pipe(
      // tslint:disable-next-line: no-shadowed-variable
      tap((user) => { console.log(`updated User W/ id=${user.userId}`); }),
      catchError(this.handleError<any>('update User'))
    );
  }
  getUsers(): Observable<User[]> {
    console.log('service calling getusers');
    return this.http.get<User[]>(endpoint + 'getUsers').pipe(
      tap(res => console.log('searched User results')),
      catchError(this.handleError<User[]>('search Users', []))
    );
  }

  deleteUser(id): Observable<User> {
    return this.http.delete(endpoint + 'deleteUser/' + id).pipe(
    catchError(this.handleError<any>('Delete User'))
    );
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

