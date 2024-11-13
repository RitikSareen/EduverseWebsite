import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-server-sidebar',
  templateUrl: './server-sidebar.component.html',
  styleUrls: ['./server-sidebar.component.scss']
})
export class ServerSidebarComponent implements OnInit {
  serverName: string = '';
  categories: any[] = [];
  showDropdown: boolean = false;
  server: any;
  serverId: string | null = null;

  constructor(private serverService: ServerService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const serverId = this.route.snapshot.paramMap.get('serverId');
    if (serverId) {
      this.serverService.getServerById(serverId, (data: any) => {
        this.server = data;
        this.serverName = data.name;
        this.categories = data.categories;
      });
    }
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  createCategory(): void {
    console.log('Create New Category clicked');
    if (this.serverId) {
      this.router.navigate([`server/${this.serverId}/categories/create`]);
    }
    // Add logic for creating a new category
  }

  openServerSettings(): void {
    console.log('Server Settings clicked');
    // Add logic for opening server settings
  }

  leaveServer(): void {
    console.log('Leave Server clicked');
    // Add logic for leaving the server
  }

  addChannel(category: any): void {
    console.log(`Add Channel to Category: ${category.name}`);
    // Logic for adding a new channel to the specified category
  }

  openCategorySettings(category: any): void {
    console.log(`Open settings for Category: ${category.name}`);
    // Logic for opening settings/details for the specified category
  }

  addChannelToCategory(category: any): void {
    console.log(`Adding a new channel to Category: ${category.name}`);
    // Logic for adding a channel within the category
  }

  openChannelSettings(channel: any): void {
    console.log(`Open settings for Channel: ${channel.name}`);
    // Logic for opening settings/details for the specified channel
  }

  navigateHome(): void {
    console.log('Navigating to Home');
    // Logic for navigating back to the home page or dashboard
  }
}
