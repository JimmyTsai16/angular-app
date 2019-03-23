import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

export class Element {
  path: string;
  title: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public elements: Element[] = [
    {path: './about', title: 'About'},
    { path: './serverInfo', title: 'ServerInfo' },
  ];

  test = [
    1, 1, 1, 1, 1,1, 1, 1, 1, 1,1, 1, 1, 1, 1,1, 1, 1, 1, 1,
    1, 1, 1, 1, 1,1, 1, 1, 1, 1,1, 1, 1, 1, 1,1, 1, 1, 1, 1,
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // this.parentUrl = this.router.url;
    // console.log(this.router.url);
  }

}
