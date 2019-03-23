import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminComponent} from '../admin.component';
import {AboutComponent} from '../about/about.component';
import {ServerInfoComponent} from '../server-info/server-info.component';

const routes: Routes = [
  { path: '', component: AdminComponent, children: [
      { path: 'about', component: AboutComponent },
      { path: 'serverInfo', component: ServerInfoComponent },
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
