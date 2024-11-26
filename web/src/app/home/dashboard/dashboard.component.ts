import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router for navigation
import { ServerService } from '../../services/server.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  servers: any[] = []; // Store servers the user is part of

  constructor(private serverService: ServerService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUserServers();
  }

  /**
   * Fetch servers the user is a member of
   */
  fetchUserServers(): void {
    this.serverService.getAllServers((servers: any[]) => {
      this.servers = servers.filter((server) => server.isMember); // Only show servers the user is a member of
    });
  }

  /**
   * Navigate to the selected server's page
   * @param serverId The ID of the server
   */
  goToServer(serverId: string): void {
    console.log(`Navigating to server: ${serverId}`);
    this.router.navigate(['/server', serverId]); // Update this path to match your routing
  }

  /**
   * Navigate to the Join New Server page
   */
  goToJoinServer(): void {
    this.router.navigate(['/home/servers']); // Adjust this path to match your join server page
  }
}