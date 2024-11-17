import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.scss']
})
export class ServerComponent implements OnInit {
  servers: any[] = [];
  isJoinModalOpen = false; // Track if the join modal is open
  selectedServerId!: string; // Store the server ID for joining
  joinCode = ''; // Bind join code input to this variable

  constructor(private serverService: ServerService, private router: Router) {}

  ngOnInit(): void {
    this.getServers();
  }

  getServers(): void {
    this.serverService.getAllServers((data: any[]) => {
      this.servers = data; // Directly set the servers data
    });
  }

  navigateToCreateServer(): void {
    this.router.navigate(['/server/create']); // Adjust route as needed
  }

  navigateToServer(serverId: string): void {
    const server = this.servers.find(s => s._id === serverId);
    if (server?.isMember) {
      this.router.navigate(['/server', serverId]);
    } else {
      alert('You must join this server to access it.');
    }
  }

  openJoinModal(serverId: string): void {
    this.selectedServerId = serverId;
    this.isJoinModalOpen = true;
  }

  closeJoinModal(): void {
    this.isJoinModalOpen = false;
    this.joinCode = ''; // Clear join code
  }

  joinServer(): void {
    if (!this.joinCode) {
      alert('Please enter a join code');
      return;
    }

    this.serverService.joinServer(
      this.selectedServerId,
      this.joinCode,
      (response: any) => {
        alert('Successfully joined the server as a student!');
        this.getServers(); // Refresh server data
        this.closeJoinModal();
      },
      (error: any) => {
        alert('Failed to join the server. Check the join code and try again.');
        console.error(error);
      }
    );
  }
}
