import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminRoutingModule} from './modules/admin-routing.module';
import {SharedMaterialModule} from './modules/shared-material.module';
import {NavbarComponent} from '../navbar/navbar.component';
import {AdminComponent} from './admin.component';
import { AboutComponent } from './about/about.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HttpClientModule} from '@angular/common/http';
import { ServerInfoComponent } from './server-info/server-info.component';

@NgModule({
  declarations: [
    AdminComponent,
    NavbarComponent,
    AboutComponent,
    ServerInfoComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedMaterialModule,
    FlexLayoutModule,
    HttpClientModule,
  ]
})
export class AdminModule { }
