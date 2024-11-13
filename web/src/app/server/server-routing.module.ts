import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateComponent } from './create/create.component';
import { ShowComponent } from './show/show.component';
import { ServerSidebarComponent } from './server-sidebar/server-sidebar.component';
// import { ServerSettingsComponent } from './server-settings/server-settings.component';
import { ShowChannelComponent } from './channel/show-channel/show-channel.component';
import { CreateCategoryComponent } from './category/createCategory/createCategory.component';
import { ListCategoryComponent } from './category/list-category/list-category.component';
import { ListChannelComponent } from './channel/list-channel/list-channel.component';
// import { DefaultViewComponent } from './default-view/default-view.component';

const routes: Routes = [
  // Route for creating a new server
  { path: 'create', component: CreateComponent },
  {
    path: ':serverId',
    component: ShowComponent, // Loads ShowComponent as the main container for server
    children: [
      { path: '', component: ServerSidebarComponent, outlet: 'server-sidebar' },
      { path: '', component: ListCategoryComponent, outlet: 'server-categories' },
      { path: '', component: ListChannelComponent, outlet: 'server-channels'},
      {
        path: 'categories/create',
        component: CreateCategoryComponent // Route for creating a new category
      },
      {
        path: 'text-channel/:channelId',
        component: ShowChannelComponent // Route for a specific text channel
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServerRoutingModule {}
