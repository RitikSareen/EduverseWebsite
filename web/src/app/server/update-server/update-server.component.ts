import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerService } from '../../services/server.service';

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

  constructor(
    private serverService: ServerService,
    private route: ActivatedRoute,
    private router: Router
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
}
