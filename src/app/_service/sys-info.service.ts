import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SysInfoService {

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

  GetCpuInfo(): Observable<any> {
    // const payload = 'start=' + Date.now().toString() + '&end=' + Date.now().toString();
    const payload = Date.now().toString() + '/' + Date.now().toString();
    return this.http
      .get(environment.addr + '/cpuinfo/' + payload,
        this.httpOptions);
  }

}
