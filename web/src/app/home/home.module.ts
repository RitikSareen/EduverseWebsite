import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeSidebarComponent } from './home-sidebar/home-sidebar.component';
import { MessageComponent } from './message/message.component';
import { ServerComponent } from './server/server.component';
import { ListComponent } from './message/list/list.component';
import { ShowComponent } from './message/show/show.component';
import { RouterModule } from '@angular/router';
import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    HomeComponent,
    HomeSidebarComponent,
    MessageComponent,
    ServerComponent,
    ListComponent,
    ShowComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    HomeRoutingModule
  ],
})
export class HomeModule { }
