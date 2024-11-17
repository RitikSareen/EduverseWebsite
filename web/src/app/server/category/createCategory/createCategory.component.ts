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
    private router: Router
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
        const allRoles = serverData.members.map((member: { role: string }) => member.role); // Explicitly type `role` as string
        const uniqueRoles = [...new Set(allRoles)]; // Remove duplicates
        this.roles = uniqueRoles.map((role) => ({ role: role as string })); // Cast `role` to string
        this.categoryData.allowedRoles = this.roles.map((role) => ({
          role: role.role,
          read: false,
          write: false,
        }));
      });
    }
  }

  // loadRoles(): void {
  //   if (this.serverId) {
  //     this.serverService.getServerById(this.serverId, (serverData: any) => {
  //       this.categoryData.allowedRoles = serverData.members.map((member: any) => ({
  //         role: member.role,
  //         read: false,
  //         write: false
  //       }));
  //     });
  //   }
  // }

  onSubmit(): void {
    if (!this.categoryData.name) {
      alert('Category name is required');
      return;
    }

    if (this.serverId === null) {
      console.error('Server ID is null');
      return;
    }

    // Send data to backend
    this.categoryService.createCategory(this.serverId, {
      name: this.categoryData.name,
      allowedRoles: this.categoryData.allowedRoles
    });
    this.router.navigate(['/server', this.serverId, 'categories']);
  }
}
