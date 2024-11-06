import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServerRoutingModule } from './server-routing.module';
import { ServerSidebarComponent } from './server-sidebar/server-sidebar.component';
import { CreateComponent } from './create/create.component';
import { ShowComponent } from './show/show.component';


@NgModule({
  declarations: [
    ServerSidebarComponent,
    CreateComponent,
    ShowComponent
  ],
  imports: [
    CommonModule,
    ServerRoutingModule
  ]
})
export class ServerModule { }
