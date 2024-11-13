import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ServerRoutingModule } from './server-routing.module';
import { ShowComponent } from './show/show.component';
import { ServerSidebarComponent } from './server-sidebar/server-sidebar.component';
import { CreateComponent } from './create/create.component';
// import { ServerSettingsComponent } from './server-settings/server-settings.component';
// import { TextChannelComponent } from './text-channel/text-channel.component';
import { CreateCategoryComponent } from './category/createCategory/createCategory.component';
// import { DefaultViewComponent } from './default-view/default-view.component';

// Imported from CategoryModule

import { ListCategoryComponent } from './category/list-category/list-category.component';
import { UpdateCategoryComponent } from './category/update-category/update-category.component';
import { CreateChannelComponent } from './channel/create-channel/create-channel.component';
import { ListChannelComponent } from './channel/list-channel/list-channel.component';
import { ShowChannelComponent } from './channel/show-channel/show-channel.component';
import { UpdateChannelComponent } from './channel/update-channel/update-channel.component';

@NgModule({
  declarations: [
    ShowComponent,
    ServerSidebarComponent,
    CreateComponent,
    CreateCategoryComponent,
    // DefaultViewComponent,
     // Category component
    ListCategoryComponent, 
    UpdateCategoryComponent, 
    CreateChannelComponent, 
    ListChannelComponent, 
    ShowChannelComponent, 
    UpdateChannelComponent, // Category component
  ],
  imports: [
    CommonModule,
    ServerRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule // Ensure this for routing inside the module
  ]
})
export class ServerModule {}
