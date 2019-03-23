import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
  // { path: '', component: HomeComponent },
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
  { path: 'home', loadChildren: './home/home.module#HomeModule' },
  { path: 'login', component: LoginComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule { }

