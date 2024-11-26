import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerService } from '../../services/server.service';
import { SidebarRefreshService } from '../../services/sidebar-refresh.service';

@Component({
  selector: 'app-update-server',
  templateUrl: './update-server.component.html',
  styleUrls: ['./update-server.component.scss']
})
export class UpdateServerComponent implements OnInit {
  server: any = {
    name: '',
    description: '',
    joinCode: '',
    members: []
  };
  serverId: string | null = null;
  uniqueRoles: string[] = [];
  predefinedRoles = ['Admin', 'Teacher', 'TA', 'Student']; // List of predefined roles
  isRoleModalOpen = false; // Track if the role change modal is open
  selectedMember: any = null; // Currently selected member for role change
  selectedRole = ''; // Selected role in the dropdown
  customRole = ''; // Custom role input value

  constructor(
    private serverService: ServerService,
    private route: ActivatedRoute,
    private router: Router,
    private sidebarRefreshService: SidebarRefreshService
  ) {}

  ngOnInit(): void {
    const id = this.route.parent?.snapshot.paramMap.get('serverId');
    this.serverId = id ? id : null; // Explicitly set it to null if undefined
    if (this.serverId) {
      this.loadServerDetails(this.serverId);
    } else {
      console.error('No Server ID found in Update Component');
    }
  }
  
  loadServerDetails(serverId: string): void {
    this.serverService.getServerById(serverId, (data: any) => {
      if (data) {
        this.server = {
          name: data.name,
          description: data.description,
          joinCode: data.joinCode,
          members: data.members || []
        };
        this.uniqueRoles = Array.from(new Set(this.server.members.map((member: any) => member.role)));
      } else {
        console.error('Failed to load server details.');
      }
    });
  }

  // Update server details
  updateServer(): void {
    if (this.serverId) {
      this.serverService.updateServer(this.serverId, {
        name: this.server.name,
        description: this.server.description,
        joinCode: this.server.joinCode
      });
      console.log('Server updated successfully');
      this.loadServerDetails(this.serverId);
      // window.location.reload();
      this.sidebarRefreshService.triggerSidebarRefresh();
      this.router.navigate(['/server', this.serverId]);
      // this.router.navigate(['/server', this.serverId]);
    }
  }

  // Kick a member from the server
  kickMember(userId: string): void {
    if (this.serverId) {
      this.serverService.kickMember(this.serverId, userId, () => {
        this.server.members = this.server.members.filter((member: any) => member.userId._id !== userId);
        console.log(`Member ${userId} kicked from the server`);
      });
    }
  }

  removeRole(role: string): void {
    this.server.members = this.server.members.map((member: any) => {
      if (member.role === role) {
        member.role = ''; // Clear role or apply your logic to handle role removal
      }
      return member;
    });
    console.log(`Role ${role} removed`);
  }

  // Open the Change Role Modal
  openChangeRoleModal(member: any): void {
    this.selectedMember = member;
    this.selectedRole = member.role; // Pre-select the current role
    this.isRoleModalOpen = true;
  }

  // Close the Change Role Modal
  closeRoleModal(): void {
    this.isRoleModalOpen = false;
    this.selectedMember = null;
    this.selectedRole = '';
    this.customRole = '';
  }

  // Handle role dropdown change
  onRoleChange(): void {
    if (this.selectedRole !== 'Other') {
      this.customRole = ''; // Clear custom role if a predefined role is selected
    }
  }

  // Change role of the selected member
  changeRole(): void {
    const newRole = this.selectedRole === 'Other' ? this.customRole : this.selectedRole;

    if (!newRole) {
      alert('Please provide a valid role.');
      return;
    }

    if (this.serverId && this.selectedMember) {
      this.serverService.updateMemberRole(this.serverId, this.selectedMember.userId._id, newRole, () => {
        this.selectedMember.role = newRole; // Update the member's role locally
        this.uniqueRoles = Array.from(new Set(this.server.members.map((member: any) => member.role)));
        this.closeRoleModal(); // Close the modal
        console.log('Role updated successfully');
      });
    }
  }
}
