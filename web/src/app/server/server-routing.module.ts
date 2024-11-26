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
import { UpdateServerComponent } from './update-server/update-server.component';
import { UpdateCategoryComponent } from './category/update-category/update-category.component';
import { CreateChannelComponent } from './channel/create-channel/create-channel.component';
import { UpdateChannelComponent } from './channel/update-channel/update-channel.component';
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
        path: 'categories/:categoryId/settings',
        component: UpdateCategoryComponent // Route for category settings
      },
      {
        path: 'categories/:categoryId/textChannels/:textChannelId/settings',
        component: UpdateChannelComponent // Route for channel settings
      },
      {
        path: 'updateServer',
        component: UpdateServerComponent // Route for updating server details
      },
      {
        path: 'categories/:categoryId/textChannels/create-channel',
        component: CreateChannelComponent
      },
      { path: 'categories/:categoryId/textChannels/:textChannelId', component: ShowChannelComponent },
      { path: '**', redirectTo: ''} // Default route
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServerRoutingModule {}
