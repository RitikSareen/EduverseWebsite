import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { TextChannelService } from '../../services/textChannel.service';
import { AuthService } from '../../services/auth.service';
import { SidebarRefreshService } from '../../services/sidebar-refresh.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-server-sidebar',
  templateUrl: './server-sidebar.component.html',
  styleUrls: ['./server-sidebar.component.scss'],
})
export class ServerSidebarComponent implements OnInit {
  serverName: string = '';
  categories: any[] = [];
  filteredCategories: any[] = []; // Filtered categories and channels based on roles
  members: any[] = [];
  showDropdown: boolean = false;
  server: any = null; // Holds server details
  serverId: string | null = null;

  currentUser: any = null; // Current logged-in user details
  currentUserRole: string | null = null; // Role of the current user in the server
  hasAdminPrivileges: boolean = false; // Flag for admin privileges
  private refreshSubscription: Subscription | null = null;

  constructor(
    private serverService: ServerService,
    private categoryService: CategoryService,
    private textChannelService: TextChannelService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private sidebarRefreshService: SidebarRefreshService
  ) {}

  ngOnInit(): void {
    // Get the server ID from the route
    this.route.paramMap.subscribe((params) => {
      this.serverId = params.get('serverId');
      if (this.serverId) {
        this.loadCurrentUserRole(); // Ensure the current role is loaded first
      } else {
        console.error('No Server ID found in the route');
      }
    });
    this.refreshSubscription = this.sidebarRefreshService.refreshSidebar$.subscribe(() => {
      this.loadServerDetails(); // Reload sidebar details
    });
  }
  

  loadCurrentUserRole(): void {
    const currentUserID = this.authService.getCurrentUser().id;
    console.log('Current userID:', currentUserID);
  
    this.serverService.getServerById(this.serverId!, (serverData: any) => {
      console.log('Server data:', serverData);
  
      const currentUser = serverData.members.find((member: any) => {
        const memberUserId = member.userId?._id || member.userId;
        return memberUserId === currentUserID;
      });
  
      if (!currentUser) {
        console.error('Current user is not a member of this server.');
        alert('You do not have access to this server.');
        this.router.navigate(['/home']);
        return;
      }
  
      this.currentUserRole = currentUser.role;
      this.hasAdminPrivileges =
        this.currentUserRole === 'Admin' ||
        this.currentUserRole === 'Teacher' ||
        this.currentUserRole === 'TA';
  
      console.log('Current user role:', this.currentUserRole);
      console.log('Has Admin Privileges:', this.hasAdminPrivileges);
  
      this.loadServerDetails(); // Load server details after determining user role
    });
  }
  
  loadServerDetails(): void {
    if (this.serverId) {
      this.serverService.getServerById(this.serverId, (data: any) => {
        this.server = data;
        this.serverName = data.name;
        this.categories = data.categories;
  
        console.log('Server details:', this.server);
        console.log('Loaded categories:', this.categories);
  
        this.filterCategoriesAndChannels();
      });
    }
  }

  filterCategoriesAndChannels(): void {
    console.log('Filtering categories and channels...');
    console.log('Current user role:', this.currentUserRole);
  
    if (!this.currentUserRole) {
      this.filteredCategories = [];
      return;
    }
  
    // Filter categories and their channels based on allowedRoles
    this.filteredCategories = this.categories.map((category: any) => {
      // Filter channels within each category
      const filteredChannels = category.channels?.filter((channel: any) =>
        channel.allowedRoles.some(
          (role: any) =>
            role.role === this.currentUserRole &&
            role.read.includes(true) // Ensure read permissions exist
        )
      );
  
      // Include the category even if it has no visible channels
      return {
        ...category,
        channels: filteredChannels || [], // If no channels, default to empty array
      };
    });
  
    console.log('Filtered categories:', this.filteredCategories);
  }


  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  createCategory(): void {
    if (this.hasAdminPrivileges) {
      this.router.navigate(['/server', this.serverId, 'categories', 'create']);
    }
  }

  openServerSettings(): void {
    if (this.hasAdminPrivileges) {
      this.router.navigate(['/server', this.serverId, 'updateServer']);
    }
  }

  leaveServer(): void {
    console.log('Leave Server clicked.');
    // Logic for leaving the server
  }

  navigateToCreateChannel(category: any): void {
    if (category && category._id) {
      this.router.navigate([
        `/server/${this.serverId}/categories/${category._id}/textChannels/create-channel`,
      ]);
    }
  }

  selectChannel(categoryId: string, textChannelId: string): void {
    if (categoryId && textChannelId) {
      this.router.navigate([
        `server/${this.serverId}/categories/${categoryId}/textChannels/${textChannelId}`,
      ]);
    }
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
    if (this.hasAdminPrivileges) {
      this.router.navigate([
        `/server/${this.serverId}/categories/${category._id}/settings`,
      ]);
    }
  }

  deleteCategory(category: any): void {
    if (this.hasAdminPrivileges && confirm(`Delete category "${category.name}"?`)) {
      this.categoryService.deleteCategory(category._id, () => {
        this.loadServerDetails(); // Refresh categories
      });
      category.showSettingsDropdown = false;
    }
  }

  toggleChannelDropdown(channel: any): void {
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
    if (this.hasAdminPrivileges) {
      channel.showSettingsDropdown = false;
      this.router.navigate([
        `/server/${this.serverId}/categories/${categoryId}/textChannels/${textChannelId}/settings`,
      ]);
    }
  }

  deleteChannel(channel: any): void {
    if (
      this.hasAdminPrivileges &&
      confirm(`Are you sure you want to delete the channel "${channel.channelName}"?`)
    ) {
      this.textChannelService.deleteChannel(channel._id, () => {
        this.loadServerDetails();
      });
      channel.showSettingsDropdown = false;
    }
  }
  ngOnDestroy(): void {
    // Clean up subscription to avoid memory leaks
    this.refreshSubscription?.unsubscribe();
  }

  navigateHome(): void {
    this.router.navigate(['/home']);
  }
}
