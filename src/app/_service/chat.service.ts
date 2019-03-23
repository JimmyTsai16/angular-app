import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import { catchError, map} from 'rxjs/operators';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {UserService} from './user.service';
import {UserProfile} from './userProfile';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  addr = environment.addr;
  userProfile: UserProfile;

  httpOptions = {
    headers: new HttpHeaders({
      // 'Content-Type': 'application/json',
      'Content-Type': 'text/plain',
      'X-AccessToken': localStorage.getItem('access_token')
    })
  };

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) { }

  getChatRooms(): Observable<any> {
    const tokenString = localStorage.getItem('access_token');
    if (tokenString) {
      return this.http.get(this.addr + '/chat/getrooms',
        this.httpOptions).pipe(
        map(res => {
          console.log(res);
          return res;
        }),
        catchError(this.handleError('Auth Failed'))
      );
    }
    return of([]);
  }

  chat(RoomId: string): WebSocketSubject<any> {
    const token = localStorage.getItem('access_token');
    const subject = webSocket('ws://192.168.100.21:8080/proxy/chat/chatws/' + RoomId + '/' + token);
    // const a = {RoomId: RoomId, 'AccessToken': localStorage.getItem('access_token')};
    // const a = {'test': 'test' };
    // subject.next(a);

    return subject;
  }

  CreateRoom(roomName: string, users: string[]): Observable<any> {
    this.userService.userInit().subscribe(msg => {
      if (msg.UserName) {
        this.userProfile = msg;
      }
    });
    if (this.userProfile) {
      users.push(this.userProfile.UserName);
      console.log(users);
      return this.http
        .post(this.addr + '/chat/createroom', {
          RoomName: roomName, Users: users
        }, this.userService.httpOptions);
    }
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
