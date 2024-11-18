import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerService } from '../../../services/server.service';
import { GroupChatService } from '../../../services/groupChat.service';
import { TextChannelService } from '../../../services/textChannel.service';

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.scss']
})
export class CreateChannelComponent implements OnInit {
  channelData: any = {
    name: '',
    allowedRoles: [] // Holds role-based permissions
  };
  serverId: string | null = null;
  categoryId: string | null = null;
  roles: any[] = []; // List of roles available in the server

  constructor(
    private serverService: ServerService,
    private route: ActivatedRoute,
    private router: Router,
    private textChannelService: TextChannelService
  ) {}

  ngOnInit(): void {
    const sId = this.route.parent?.snapshot.paramMap.get('serverId');
    const cId = this.route.snapshot.paramMap.get('categoryId'); // Use current route here
  
    console.log('Server ID:', sId);
    console.log('Category ID:', cId);
  
    this.serverId = sId ? sId : null;
    this.categoryId = cId ? cId : null;
  
    if (this.serverId) {
      this.loadRoles();
    }
  }

  // Load roles from the server
  loadRoles(): void {
    this.serverService.getServerById(this.serverId!, (serverData: any) => {
      const allRoles = serverData.members.map((member: any) => member.role);
      const uniqueRoles = [...new Set(allRoles)]; // Remove duplicates
      this.roles = uniqueRoles.map((role) => ({ role: role as string }));

      this.channelData.allowedRoles = this.roles.map((role) => ({
        role: role.role,
        read: false,
        write: false
      }));
    });
  }

  // Handle form submission
  onSubmit(): void {
    if (!this.channelData.name) {
      alert('Channel name is required.');
      return;
    }

    if (this.serverId && this.categoryId) {
      this.textChannelService.createChannel(this.serverId, this.categoryId, this.channelData, (response: any) => {
        alert('Text channel created successfully!');
        this.router.navigate([`/server/${this.serverId}`]);
      }, (error: any) => {
        console.error('Error creating channel:', error);
        alert('Failed to create text channel. Please try again.');
      });
    }
  }
}
