import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerService } from '../../../services/server.service';
import { CategoryService } from '../../../services/category.service';
import { SidebarRefreshService } from '../../../services/sidebar-refresh.service';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.scss']
})
export class UpdateCategoryComponent implements OnInit {
  serverId: string | null = null;
  categoryId!: string; // The ID of the category being updated
  categoryData: any = {
    name: '',
    allowedRoles: [],
  }; // The data for the category
  roles: any[] = []; // All server roles

  constructor(
    private route: ActivatedRoute,
    private serverService: ServerService,
    private categoryService: CategoryService,
    private router: Router,
    private sidebarRefreshService: SidebarRefreshService
  ) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.params['categoryId']; // Retrieve categoryId from route
    this.serverId = this.route.parent?.snapshot.paramMap.get('serverId') ?? null;
    this.loadCategoryData();
  }

  // Load the category data from the server
  // loadCategoryData(): void {
  //   if (!this.serverId || !this.categoryId) {
  //     console.error('Server ID or Category ID is missing');
  //     return;
  //   }
  
  //   // Fetch category data
  //   this.categoryService.getCategoryById(this.categoryId, (categoryData: any) => {
  //     this.categoryData = categoryData;
  
  //     // Fetch server roles
  //     this.serverService.getServerById(this.serverId!, (serverData: any) => {
  //       const allRoles = serverData.members.map((member: any) => member.role);
  //       const uniqueRoles = [...new Set(allRoles)]; // Remove duplicates
  
  //       // Merge category roles with all server roles
  //       this.roles = uniqueRoles.map((role) => {
  //         const existingRole = this.categoryData.allowedRoles.find(
  //           (allowedRole: any) => allowedRole.role === role
  //         );
  
  //         // Ensure `read` and `write` are boolean values
  //         return existingRole
  //           ? {
  //               ...existingRole,
  //               read: !!existingRole.read, // Convert to boolean if not already
  //               write: !!existingRole.write,
  //             }
  //           : { role, read: false, write: false }; // Default values for new roles
  //       });
  
  //       // Update the category's allowedRoles to include any new roles
  //       this.categoryData.allowedRoles = this.roles;
  //     });
  //   });
  // }
  loadCategoryData(): void {
    if (!this.serverId || !this.categoryId) {
      console.error('Server ID or Category ID is missing');
      return;
    }
  
    // Fetch category data
    this.categoryService.getCategoryById(this.categoryId, (categoryData: any) => {
      // Populate category name
      this.categoryData.name = categoryData.name;
  
      // Fetch server roles
      this.serverService.getServerById(this.serverId!, (serverData: any) => {
        const allRoles = serverData.members.map((member: any) => member.role);
        const uniqueRoles = [...new Set(allRoles)]; // Remove duplicates
  
        // Set all roles to have `read` and `write` as false
        this.roles = uniqueRoles.map((role) => ({
          role,
          read: false,
          write: false,
        }));
  
        // Update allowedRoles to match the default roles
        this.categoryData.allowedRoles = this.roles;
      });
    });
  }
  
  

  // Submit the updated category data to the server
  onSubmit(): void {
    if (!this.categoryData.name) {
      alert('Category name is required.');
      return;
    }

    const updatedPayload = {
      name: this.categoryData.name,
      allowedRoles: this.categoryData.allowedRoles.map((role: any) => ({
        role: role.role,
        read: role.read,
        write: role.write,
      })),
    };

    this.categoryService.updateCategory(this.categoryId, updatedPayload, () => {
      alert('Category updated successfully!');
      
    });
    this.sidebarRefreshService.triggerSidebarRefresh();
    this.router.navigate(['/server', this.serverId]);
    // this.router.navigate(['/server', this.serverId,'categories']);
  }
}


