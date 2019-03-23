import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {UserService} from '../_service/user.service';
import {Router} from '@angular/router';
import {withIdentifier} from 'codelyzer/util/astQuery';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    console.log(window.document.body.offsetHeight);
  }

  onLogin() {
    if (this.user.valid) {
      let u: {
        username: '',
        password: ''
      };
      u = this.user.value;
      this.userService.Login(u.username, u.password).subscribe(
        res => {
          if (res === true) {
            this.router.navigate(['/admin']);
          }
        }
      );
    }
  }

}
