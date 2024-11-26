import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerService } from '../../../services/server.service';
import { TextChannelService } from '../../../services/textChannel.service';
import { SidebarRefreshService } from '../../../services/sidebar-refresh.service';

@Component({
  selector: 'app-update-channel',
  templateUrl: './update-channel.component.html',
  styleUrls: ['./update-channel.component.scss'],
})
export class UpdateChannelComponent implements OnInit {
  serverId: string | null = null;
  categoryId!: string; // ID of the category containing the channel
  channelId!: string; // ID of the channel being updated
  channelData: any = { allowedRoles: [] }; // Holds the channel data
  roles: any[] = []; // List of roles in the server

  constructor(
    private route: ActivatedRoute,
    private serverService: ServerService,
    private textChannelService: TextChannelService,
    private router: Router,
    private sidebarRefreshService: SidebarRefreshService
  ) {}

  ngOnInit(): void {
    this.serverId = this.route.parent?.snapshot.paramMap.get('serverId') ?? null;
    this.categoryId = this.route.snapshot.paramMap.get('categoryId')!;
    this.channelId = this.route.snapshot.paramMap.get('textChannelId')!;

    this.loadChannelData();
  }

  // Load the channel data
  loadChannelData(): void {
    this.textChannelService.getChannelById(this.channelId, (channelData: any) => {
      console.log('Channel Data from Backend:', channelData); // Debug response
    this.channelData.name = channelData.channelName; 

      if (this.serverId) {
        this.serverService.getServerById(this.serverId, (serverData: any) => {
          const allRoles = serverData.members.map((member: any) => member.role);
          const uniqueRoles = [...new Set(allRoles)];

          // Populate roles with default false values (unticked boxes)
          this.channelData.allowedRoles = uniqueRoles.map((role) => ({
            role,
            read: false,
            write: false,
          }));
        });
      }
    });
  }

  // Submit the updated channel data
  onSubmit(): void {
    if (!this.channelData.name?.trim()) {
      alert('Channel name is required.');
      return;
    }

    const updatedData = {
      channelName: this.channelData.name,
      allowedRoles: this.channelData.allowedRoles.map((role: any) => ({
        role: role.role,
        read: role.read === true, // Explicitly true/false
        write: role.write === true,
      })),
    };

    this.textChannelService.updateChannel(this.channelId, updatedData, () => {
      alert('Text Channel updated successfully!');
      this.sidebarRefreshService.triggerSidebarRefresh();
      this.router.navigate(['/server', this.serverId, 'categories']);
    });
  }
}
