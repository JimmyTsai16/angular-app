import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './modules/home-routing.module';
import {HomeComponent} from './home.component';
import {SharedMaterialModule} from './modules/shared-material.module';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedMaterialModule
  ]
})
export class HomeModule { }
