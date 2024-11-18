import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { TextChannelService } from '../../services/textChannel.service';


@Component({
  selector: 'app-server-sidebar',
  templateUrl: './server-sidebar.component.html',
  styleUrls: ['./server-sidebar.component.scss']
})
export class ServerSidebarComponent implements OnInit {
  serverName: string = '';
  categories: any[] = [];
  members: any[] = [];
  channels: any[] = [];
  showDropdown: boolean = false;
  server: any;
  serverId: string | null = null;
  selectedChannelId: string | null = null;


  constructor(
    private serverService: ServerService, 
    private categoryService: CategoryService,
    private textChannelService: TextChannelService,
    private route: ActivatedRoute, 
    private router: Router,
   
  ) {}

  ngOnInit(): void {
    // Subscribing to `paramMap` to respond to dynamic changes in route parameters
    this.route.paramMap.subscribe(params => {
      this.serverId = params.get('serverId');
      if (this.serverId) {
        console.log('Server ID:', this.serverId);
        this.loadServerDetails();
      } else {
        console.log('No Server ID found in the route');
      }
    });
  }

  loadServerDetails(): void {
    if (this.serverId) {
      this.serverService.getServerById(this.serverId, (data: any) => {
        this.server = data;
        this.serverName = data.name;
        this.categories = data.categories;
  
        // Ensure each category has channels initialized
        this.categories.forEach((category: any) => {
          if (!category.channels) {
            category.channels = [];
          }
        });
  
        this.members = data.members;
      });
    }
  }
  

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  createCategory(): void {
    if (this.serverId) {
      this.router.navigate(['/server', this.serverId, 'categories', 'create']);
    } else {
      console.error('Server ID not found');
    }
  }

  openServerSettings(): void {
    if (this.serverId) {
      this.router.navigate(['/server', this.serverId, 'updateServer']);
    } else {
      console.error('Server ID not found');
    }
  }

  leaveServer(): void {
    console.log('Leave Server clicked');
    // Logic for leaving the server
  }

  addChannel(category: any): void {
    console.log(`Add Channel to Category: ${category.name}`);
    // Logic for adding a new channel to the specified category
  }
  toggleCategoryDropdown(category: any): void {
    // Toggle the specific category's dropdown
    category.showSettingsDropdown = !category.showSettingsDropdown;

    // Hide all other dropdowns
    this.categories.forEach(cat => {
      if (cat !== category) {
        cat.showSettingsDropdown = false;
      }
    });
  }

  openCategorySettings(category: any): void {
    console.log(`Open settings for Category: ${category.name}`);
    this.router.navigate(['/server', this.serverId, 'categories', 'create']);
    this.router.navigate(['/server',this.serverId,'categories',category._id,'settings']);
    // Logic for opening settings/details for the specified category
  }
  deleteCategory(category: any): void {
    if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      this.categoryService.deleteCategory(category._id, () => {
        this.loadServerDetails(); // Refresh the categories list
      });
    }
  }

  navigateToCreateChannel(category: any): void {
    if (!category || !category._id) {
      console.error('Category ID is missing or undefined');
      return;
    }
  
    this.router.navigate([`/server/${this.serverId}/categories/${category._id}/textChannels/create-channel`]);
  }

  selectChannel(categoryId: string,channelId: string): void {
    this.router.navigate([`/server/${this.serverId}/categories/${categoryId}/textChannels/${channelId}`]);
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
