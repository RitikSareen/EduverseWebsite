import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerService } from '../../../services/server.service';
import { TextChannelService } from '../../../services/textChannel.service';

@Component({
  selector: 'app-update-channel',
  templateUrl: './update-channel.component.html',
  styleUrls: ['./update-channel.component.scss']
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
    private router: Router
  ) {}

  ngOnInit(): void {
    // Retrieve IDs from the route
    this.serverId = this.route.parent?.snapshot.paramMap.get('serverId') ?? null;
    this.categoryId = this.route.snapshot.paramMap.get('categoryId')!;
    this.channelId = this.route.snapshot.paramMap.get('textChannelId')!;

    // Load data for the channel and server roles
    this.loadChannelData();
  }

  // Load the channel data from the server
  loadChannelData(): void {
    this.textChannelService.getChannelById(this.channelId, (channelData: any) => {
      this.channelData.name = channelData.channelName; // Load the channel name

      if (this.serverId) {
        this.serverService.getServerById(this.serverId, (serverData: any) => {
          const allRoles = serverData.members.map((member: any) => member.role);
          const uniqueRoles = [...new Set(allRoles)];

          // Populate roles with all server roles, but untick all checkboxes by default
          this.channelData.allowedRoles = uniqueRoles.map((role) => ({
            role,
            read: false, // Default to unticked
            write: false // Default to unticked
          }));
        });
      }
    });
  }

  // Submit the updated channel data to the server
  onSubmit(): void {
    if (!this.channelData.name.trim()) {
      alert('Channel name is required.');
      return;
    }

    this.textChannelService.updateChannel(this.channelId, this.channelData, () => {
      alert('Text Channel updated successfully!');
      this.router.navigate([`/server/${this.serverId}`]); // Navigate back to the server view
    });
  }
}



// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ServerService } from '../../../services/server.service';
// import { TextChannelService } from '../../../services/textChannel.service';

// @Component({
//   selector: 'app-update-channel',
//   templateUrl: './update-channel.component.html',
//   styleUrls: ['./update-channel.component.scss']
// })
// export class UpdateChannelComponent implements OnInit {
//   serverId: string | null = null;
//   categoryId!: string; // ID of the category containing the channel
//   channelId!: string; // ID of the channel being updated
//   channelData: any = {}; // Holds the channel data
//   roles: any[] = []; // List of roles in the server

//   constructor(
//     private route: ActivatedRoute,
//     private serverService: ServerService,
//     private textChannelService: TextChannelService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     // Retrieve IDs from the route
//     this.serverId = this.route.parent?.snapshot.paramMap.get('serverId') ?? null;
//     this.categoryId = this.route.snapshot.paramMap.get('categoryId')!;
//     this.channelId = this.route.snapshot.paramMap.get('textChannelId')!;

//     // Load data for the channel and server roles
//     this.loadChannelData();
//   }

//   // Load the channel data from the server
//   loadChannelData(): void {
//     this.textChannelService.getChannelById(this.channelId, (channelData: any) => {
//       this.channelData = channelData;

//       if (this.serverId) {
//         this.serverService.getServerById(this.serverId, (serverData: any) => {
//           const allRoles = serverData.members.map((member: any) => member.role);
//           const uniqueRoles = [...new Set(allRoles)];

//           // Merge channel roles with all server roles
//           this.roles = uniqueRoles.map((role) => {
//             const existingRole = this.channelData.allowedRoles.find(
//               (allowedRole: any) => allowedRole.role === role
//             );

//             return existingRole || { role, read: false, write: false };
//           });

//           // Update the channel's allowedRoles to include any new roles
//           this.channelData.allowedRoles = this.roles;
//         });
//       }
//     });
//   }

//   // Submit the updated channel data to the server
//   onSubmit(): void {
//     if (!this.channelData.name) {
//       alert('Channel name is required.');
//       return;
//     }

//     this.textChannelService.updateChannel(this.channelId, this.channelData, () => {
//       alert('Text Channel updated successfully!');
//       this.router.navigate([`/server/${this.serverId}`]); // Navigate back to the server view
//     });
//   }
// }
