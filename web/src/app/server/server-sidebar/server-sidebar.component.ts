// import { Component, OnInit } from '@angular/core';
// import { ServerService } from '../../services/server.service';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CategoryService } from '../../services/category.service';
// import { TextChannelService } from '../../services/textChannel.service';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-server-sidebar',
//   templateUrl: './server-sidebar.component.html',
//   styleUrls: ['./server-sidebar.component.scss'],
// })
// export class ServerSidebarComponent implements OnInit {
//   serverName: string = '';
//   categories: any[] = [];
//   filteredCategories: any[] = []; // Filtered categories based on roles
//   members: any[] = [];
//   showDropdown: boolean = false;
//   server: any;
//   serverId: string | null = null;
//   currentUserRole: string | null = null; // Current user's role
//   hasAdminPrivileges: boolean = false; // Flag to check if the user has Admin, Teacher, or TA role

//   constructor(
//     private serverService: ServerService,
//     private categoryService: CategoryService,
//     private textChannelService: TextChannelService,
//     private route: ActivatedRoute,
//     private router: Router,
//     private authService: AuthService
//   ) {}

//   ngOnInit(): void {
//     // Get the server ID from the route
//     this.route.paramMap.subscribe((params) => {
//       this.serverId = params.get('serverId');
//       if (this.serverId) {
//         this.loadCurrentUserRole(); // Ensure the current role is loaded first
//       } else {
//         console.error('No Server ID found in the route');
//       }
//     });
//   }

//   loadCurrentUserRole(): void {
//     const user = this.authService.getUser();
//     if (!user || !user._id) {
//       console.error('User information is missing or invalid.');
//       return; // Stop execution if no user
//     }

//     const userId = user._id;

//     // Fetch server data to get the current user's role
//     this.serverService.getServerById(this.serverId!, (serverData: any) => {
//       const currentUser = serverData.members.find(
//         (member: any) => member.userId === userId
//       );

//       this.currentUserRole = currentUser ? currentUser.role : null;
//       this.hasAdminPrivileges =
//         this.currentUserRole === 'Admin' ||
//         this.currentUserRole === 'Teacher' ||
//         this.currentUserRole === 'TA';

//       this.loadServerDetails(); // Load server details after determining the user's role
//     });
//   }

//   loadServerDetails(): void {
//     if (!this.serverId) {
//       console.error('Server ID is missing.');
//       return;
//     }

//     this.serverService.getServerById(this.serverId, (data: any) => {
//       this.server = data;
//       this.serverName = data.name;
//       this.categories = data.categories;

//       this.filterCategoriesAndChannels();
//     });
//   }

//   filterCategoriesAndChannels(): void {
//     console.log('Filtering categories and channels for role:', this.currentUserRole);

//     if (!this.currentUserRole) {
//       this.filteredCategories = [];
//       return;
//     }

//     this.filteredCategories = this.categories
//       .map((category: any) => {
//         // Filter channels with `read: true` in the array for the current user's role
//         const filteredChannels = category.channels.filter((channel: any) =>
//           channel.allowedRoles.some(
//             (role: any) =>
//               role.role === this.currentUserRole && role.read.includes(true) // Check if `true` exists in the `read` array
//           )
//         );

//         // Include category only if it has visible channels
//         return filteredChannels.length > 0
//           ? { ...category, channels: filteredChannels }
//           : null;
//       })
//       .filter((category: any) => category !== null); // Remove null categories
//   }

//   toggleDropdown(): void {
//     this.showDropdown = !this.showDropdown;
//   }

//   createCategory(): void {
//     this.showDropdown = false;
//     if (this.serverId) {
//       this.router.navigate(['/server', this.serverId, 'categories', 'create']);
//     }
//   }

//   openServerSettings(): void {
//     this.showDropdown = false;
//     if (this.serverId) {
//       this.router.navigate(['/server', this.serverId, 'updateServer']);
//     }
//   }

//   leaveServer(): void {
//     console.log('Leave Server clicked');
//   }

//   navigateToCreateChannel(category: any): void {
//     if (category && category._id) {
//       this.router.navigate([
//         `/server/${this.serverId}/categories/${category._id}/textChannels/create-channel`,
//       ]);
//     }
//   }

//   selectChannel(categoryId: string, textChannelId: string): void {
//     if (categoryId && textChannelId) {
//       this.router.navigate([
//         `server/${this.serverId}/categories/${categoryId}/textChannels/${textChannelId}`,
//       ]);
//     }
//   }

//   toggleCategoryDropdown(category: any): void {
//     category.showSettingsDropdown = !category.showSettingsDropdown;

//     // Hide all other dropdowns
//     this.categories.forEach((cat) => {
//       if (cat !== category) {
//         cat.showSettingsDropdown = false;
//       }
//     });
//   }

//   openCategorySettings(category: any): void {
//     this.router.navigate([
//       `/server/${this.serverId}/categories/${category._id}/settings`,
//     ]);
//   }

//   deleteCategory(category: any): void {
//     if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
//       this.categoryService.deleteCategory(category._id, () => {
//         this.loadServerDetails(); // Refresh categories
//       });
//       category.showSettingsDropdown = false;
//     }
//   }

//   toggleChannelDropdown(channel: any): void {
//     // Close other channel dropdowns
//     this.categories.forEach((category) => {
//       category.channels.forEach((ch: any) => {
//         if (ch !== channel) {
//           ch.showSettingsDropdown = false;
//         }
//       });
//     });

//     channel.showSettingsDropdown = !channel.showSettingsDropdown;
//   }

//   openChannelSettings(channel: any, categoryId: string, textChannelId: string): void {
//     channel.showSettingsDropdown = false;
//     this.router.navigate([
//       `/server/${this.serverId}/categories/${categoryId}/textChannels/${textChannelId}/settings`,
//     ]);
//   }

//   deleteChannel(channel: any): void {
//     if (confirm(`Are you sure you want to delete the channel "${channel.channelName}"?`)) {
//       this.textChannelService.deleteChannel(channel._id, () => {
//         this.loadServerDetails();
//       });
//       channel.showSettingsDropdown = false;
//     }
//   }

//   navigateHome(): void {
//     this.router.navigate(['/home']);
//   }
// }





import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { TextChannelService } from '../../services/textChannel.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-server-sidebar',
  templateUrl: './server-sidebar.component.html',
  styleUrls: ['./server-sidebar.component.scss'],
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

  currentUserRole: string | null = null; // Current user's role
  hasAdminPrivileges: boolean = false; // Flag to check if the user has Admin, Teacher, or TA role

  constructor(
    private serverService: ServerService,
    private categoryService: CategoryService,
    private textChannelService: TextChannelService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService // Inject AuthService to get user info
  ) {}

  ngOnInit(): void {
    // Subscribing to `paramMap` to respond to dynamic changes in route parameters
    this.route.paramMap.subscribe((params) => {
      this.serverId = params.get('serverId');
      if (this.serverId) {
        console.log('Server ID:', this.serverId);
        this.loadServerDetails();
        this.loadCurrentUserRole();
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

  loadCurrentUserRole(): void {
    const user= this.authService.getUser(); // Get current user ID from auth service
    const userId = user._id; // Get user ID from user object
    this.serverService.getServerById(this.serverId!, (serverData: any) => {
      const currentUser = serverData.members.find(
        (member: any) => member.userId === userId
      );

      this.currentUserRole = currentUser ? currentUser.role : null;
      this.hasAdminPrivileges =
        this.currentUserRole === 'Admin' ||
        this.currentUserRole === 'Teacher' ||
        this.currentUserRole === 'TA';
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  createCategory(): void {
    this.showDropdown = false;
    if (this.serverId) {
      this.router.navigate(['/server', this.serverId, 'categories', 'create']);
    } else {
      console.error('Server ID not found');
    }
  }

  openServerSettings(): void {
    this.showDropdown = false;
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
    category.showSettingsDropdown = !category.showSettingsDropdown;

    // Hide all other dropdowns
    this.categories.forEach((cat) => {
      if (cat !== category) {
        cat.showSettingsDropdown = false;
      }
    });
  }

  openCategorySettings(category: any): void {
    console.log(`Open settings for Category: ${category.name}`);
    this.router.navigate(['/server', this.serverId, 'categories', category._id, 'settings']);
  }

  deleteCategory(category: any): void {
    if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      this.categoryService.deleteCategory(category._id, () => {
        this.loadServerDetails(); // Refresh the categories list
      });
      category.showSettingsDropdown = false;
    }
  }

  navigateToCreateChannel(category: any): void {
    if (!category || !category._id) {
      console.error('Category ID is missing or undefined');
      return;
    }

    this.router.navigate([`/server/${this.serverId}/categories/${category._id}/textChannels/create-channel`]);
  }

  selectChannel(categoryId: string, textChannelId: string): void {
    if (!categoryId || !textChannelId) {
      console.error('Invalid parameters:', { categoryId, textChannelId });
      return;
    }

    this.router.navigate([`server/${this.serverId}/categories/${categoryId}/textChannels/${textChannelId}`]);
  }

  navigateHome(): void {
    this.router.navigate(['/home']);
  }

  toggleChannelDropdown(channel: any): void {
    // Close other channel dropdowns
    this.categories.forEach((category) => {
      category.channels.forEach((ch: any) => {
        if (ch !== channel) {
          ch.showSettingsDropdown = false;
        }
      });
    });

    channel.showSettingsDropdown = !channel.showSettingsDropdown;
  }

  openChannelSettings(channel: any, categoryId: string, textChannelId: string): void {
    channel.showSettingsDropdown = false;
    this.router.navigate([
      `/server/${this.serverId}/categories/${categoryId}/textChannels/${textChannelId}/settings`,
    ]);
  }

  deleteChannel(channel: any): void {
    if (confirm(`Are you sure you want to delete the channel "${channel.channelName}"?`)) {
      this.textChannelService.deleteChannel(channel._id, () => {
        this.loadServerDetails();
      });
      channel.showSettingsDropdown = false;
    }
  }
}





//---------------------------------------------------------------------------------------------------
/*<div class="server-sidebar">
  <!-- Server Name and Settings Icon at the Top -->
  <div class="server-header">
    <div class="server-name">{{ serverName }}</div>
    <div class="settings-container">
      <span class="settings-icon" (click)="toggleDropdown()">⚙️</span>
      <div class="dropdown-menu" *ngIf="showDropdown">
        <!-- Show only if the user has required roles -->
        <div class="dropdown-item" *ngIf="hasAdminPrivileges" (click)="createCategory()">Create New Category</div>
        <div class="dropdown-item" *ngIf="hasAdminPrivileges" (click)="openServerSettings()">Server Settings</div>
        <div class="dropdown-item leave" (click)="leaveServer()">Leave Server</div>
      </div>
    </div>
  </div>

  <!-- List of Categories and Channels -->
  <div *ngFor="let category of categories" class="category">
    <!-- Category Header -->
    <div class="category-header">
      <span class="category-name">{{ category.name }}</span>
      <span class="add-icon" *ngIf="hasAdminPrivileges" (click)="navigateToCreateChannel(category)">+</span>
      <div class="category-settings-container">
        <span
          class="category-settings-icon"
          *ngIf="hasAdminPrivileges"
          (click)="toggleCategoryDropdown(category)"
          >⚙️</span
        >
        <div class="dropdown-menu" *ngIf="category.showSettingsDropdown">
          <div class="dropdown-item" (click)="openCategorySettings(category)">Category Settings</div>
          <div class="dropdown-item delete" (click)="deleteCategory(category)">Delete Category</div>
        </div>
      </div>
    </div>

    <!-- List of Channels under Category -->
    <div *ngFor="let channel of category.channels" class="channel-item">
      <div (click)="selectChannel(category._id, channel._id)" class="channel-item">
        #{{ channel.channelName }}
      </div>
      <div class="channel-settings-container">
        <span
          class="channel-settings-icon"
          *ngIf="hasAdminPrivileges"
          (click)="toggleChannelDropdown(channel)"
          >⚙️</span
        >
        <div class="dropdown-menu" *ngIf="channel.showSettingsDropdown">
          <div class="dropdown-item" (click)="openChannelSettings(channel, category._id, channel._id)">Update Channel</div>
          <div class="dropdown-item delete" (click)="deleteChannel(channel)">Delete Channel</div>
        </div>
      </div>
    </div>
  </div>
</div>

<div>
  <button class="home-button" (click)="navigateHome()">Home</button>
</div>
*/
