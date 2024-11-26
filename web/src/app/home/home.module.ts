import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeSidebarComponent } from './home-sidebar/home-sidebar.component';

import { ServerComponent } from './server/server.component';

import { RouterModule } from '@angular/router';
import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    HomeComponent,
    HomeSidebarComponent,
    ServerComponent,
    DashboardComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
})
export class HomeModule { }
