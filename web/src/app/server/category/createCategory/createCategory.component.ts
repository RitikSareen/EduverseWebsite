import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { ServerService } from '../../../services/server.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './createCategory.component.html',
  styleUrls: ['./createCategory.component.scss']
})
export class CreateCategoryComponent implements OnInit {
  serverId: string | null = null;
  categoryName: string = '';
  roles: string[] = [];
  allowedRoles: any[] = [
    { role: 'Admin', visible: true, read: true, write: true } // Default for Admin
  ];

  constructor(
    private categoryService: CategoryService,
    private serverService: ServerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.parent?.snapshot.paramMap.get('serverId');
    this.serverId = id ? id : null; // Explicitly set it to null if undefined
    if (this.serverId) {
      this.loadRoles();
    } else {
      console.error('No Server ID found');
    }
  }

  // Load roles associated with the server
  loadRoles(): void {
    this.serverService.getServerById(this.serverId!, (serverData: any) => {
      const existingRoles = serverData.members.map((member: any) => member.role);
      this.roles = Array.from(new Set(existingRoles)); // Unique roles
    });
  }

  // Toggle permission values for a specific role
  togglePermission(roleIndex: number, permissionType: string): void {
    this.allowedRoles[roleIndex][permissionType] = !this.allowedRoles[roleIndex][permissionType];
  }

  // Add a new role with permissions
  addRolePermission(role: string) {
    if (!this.allowedRoles.find(r => r.role === role)) {
      this.allowedRoles.push({ role, visible: false, read: false, write: false });
    }
  }

  // Submit the category creation request
  createCategory(): void {
    if (!this.serverId) {
      console.error('Server ID is not set.');
      return;
    }

    const categoryData = {
      name: this.categoryName,
      allowedRoles: this.allowedRoles
    };

    this.categoryService.createCategory(
      this.serverId,
      categoryData,
      (response) => {
        console.log('Category created successfully:', response);
        this.router.navigate([`/servers/${this.serverId}/categories`]); // Redirect to categories or another page
      },
      (error) => {
        console.error('Error creating category:', error);
      }
    );
  }

  
}
