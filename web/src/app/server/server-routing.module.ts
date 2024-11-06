import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateComponent } from './create/create.component';

const routes: Routes = [
   // Default route for listing servers
  { path: 'create', component: CreateComponent }  // Route for creating a new server
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServerRoutingModule {}
