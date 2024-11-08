import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServerRoutingModule } from './server-routing.module';
import { ServerSidebarComponent } from './server-sidebar/server-sidebar.component';
import { CreateComponent } from './create/create.component';
import { ShowComponent } from './show/show.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ServerSidebarComponent,
    CreateComponent,
    ShowComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ServerRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ServerModule { }
