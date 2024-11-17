import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../../../services/server.service';
import { CategoryService } from '../../../services/category.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrl: './update-category.component.scss'
})
export class UpdateCategoryComponent implements OnInit {
  serverId: string | null = null;
  categoryId!: string; // The ID of the category being updated
  categoryData: any = {}; // The data for the category
  roles: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private serverService: ServerService,
    private categoryService: CategoryService,
    private  router: Router
  ) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.params['categoryId']; // Retrieve categoryId from route
    this.serverId = this.route.parent?.snapshot.paramMap.get('serverId') ?? null;
    this.loadCategoryData();
  }

  // Load the category data from the server
  loadCategoryData(): void {
    this.categoryService.getCategoryById(this.categoryId, (categoryData: any) => {
      this.categoryData = categoryData;

      // Fetch all roles in the server
      if (this.serverId !== null) {
        this.serverService.getServerById(this.serverId, (serverData: any) => {
          const allRoles = serverData.members.map((member: any) => member.role);
          const uniqueRoles = [...new Set(allRoles)]; // Remove duplicates

          // Merge category roles with all server roles
          this.roles = uniqueRoles.map((role) => {
            const existingRole = this.categoryData.allowedRoles.find(
              (allowedRole: any) => allowedRole.role === role
            );

            return existingRole || { role, read: false, write: false }; // Add new roles with default permissions
          });

          // Update the category's allowedRoles to include any new roles
          this.categoryData.allowedRoles = this.roles;
        });
      }
    });  }
  // loadCategoryData(): void {
    
  //   this.categoryService.getCategoryById(this.categoryId, (data: any) => {
  //     this.categoryData = data; // Populate category data
  //   });
  // }

  // Submit the updated category data to the server
  onSubmit(): void {
    if (!this.categoryData.name) {
      alert('Category name is required.');
      return;
    }

    this.categoryService.updateCategory(this.categoryId, this.categoryData, () => {
      alert('Category updated successfully!');
    });
    // window.location.reload();
    this.router.navigate(['/server', this.serverId]);
  }
}