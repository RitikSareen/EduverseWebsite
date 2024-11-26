import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { ServerService } from '../../../services/server.service';
import { SidebarRefreshService } from '../../../services/sidebar-refresh.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './createCategory.component.html',
  styleUrls: ['./createCategory.component.scss']
})
export class CreateCategoryComponent implements OnInit {
  serverId: string | null = null; // Server ID from route
  roles: { role: string }[] = [];
  categoryData: any = {
    name: '',
    allowedRoles: []
  };
   // List of roles in the server

  constructor(
    private categoryService: CategoryService,
    private serverService: ServerService,
    private route: ActivatedRoute,
    private router: Router,
    private sidebarRefreshService: SidebarRefreshService
  ) {}
  // const id = this.route.parent?.snapshot.paramMap.get('serverId');
  //   this.serverId = id ? id : null;

  ngOnInit(): void {
    const id = this.route.parent?.snapshot.paramMap.get('serverId');
    this.serverId = id ? id : null;
    if (this.serverId) {
      this.loadRoles();
    } else {
      console.error('No Server ID found');
    }
  }
  loadRoles(): void {
    if (this.serverId) {
      this.serverService.getServerById(this.serverId, (serverData: any) => {
        const allRoles = serverData.members.map((member: { role: string }) => member.role);
        const uniqueRoles = [...new Set(allRoles)];
        this.roles = uniqueRoles.map((role) => ({ role: role as string }));
  
        // Initialize permissions
        this.categoryData.allowedRoles = this.roles.map((role) => ({
          role: role.role,
          read: false,
          write: false,
        }));
      });    }
  }
  
  onSubmit(): void {
    if (!this.categoryData.name) {
      alert('Category name is required');
      return;
    }
  
    if (!this.serverId) {
      console.error('Server ID is missing');
      return;
    }
  
    // Construct the allowedRoles payload
    const payload = {
      name: this.categoryData.name,
      allowedRoles: this.categoryData.allowedRoles.map((role: { role: string; read?: boolean; write?: boolean }) => ({
        role: role.role,
        read: role.read === true,  // Explicitly set true or false
        write: role.write === true, // Explicitly set true or false
      })),
    };
  
    // Call the service to create the category
    this.categoryService.createCategory(this.serverId, payload);
    this.sidebarRefreshService.triggerSidebarRefresh();
    this.router.navigate(['/server', this.serverId, 'categories']);
  }
  
  
  
}
