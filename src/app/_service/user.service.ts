import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {UserProfile} from './userProfile';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  addr = environment.addr;

  httpOptions = {
    headers: new HttpHeaders({
      // 'Content-Type': 'application/json',
      'Content-Type': 'text/plain',
      'X-AccessToken': localStorage.getItem('access_token')
    })
  };

  constructor(
    private http: HttpClient,
  ) { }

  Login(username: string, password: string): Observable<any> {
    console.log(username, password);
    return this.http.post<{token: string}>(
      this.addr + '/login',
      {
        Username: username,
        Password: password
      }, this.httpOptions)
      .pipe(
        map( (res) => {
          localStorage.setItem('access_token', res.token);
          console.log(res.token);
          return true;
        }),
        catchError(this.handleError('Login Failed.'))
      );
  }

  userInit(): Observable<any> {
    const tokenString = localStorage.getItem('access_token');
    // this.httpOptions.headers = this.httpOptions.headers.set('X-AccessToken', tokenString);
    if (tokenString) {
      return this.http
        .get<UserProfile>(this.addr + '/user', this.httpOptions);
    }
  }

  Register(up: UserProfile): Observable<any> {
    return this.http
      .post(this.addr + '/user', up, this.httpOptions);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  public handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      console.log(operation);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
