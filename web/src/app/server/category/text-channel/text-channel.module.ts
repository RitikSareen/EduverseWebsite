import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TextChannelRoutingModule } from './text-channel-routing.module';
import { ListComponent } from './list/list.component';


@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    TextChannelRoutingModule
  ]
})
export class TextChannelModule { }
