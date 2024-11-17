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
  categoryData = {
    name: '',
    allowedRoles: [] as { role: string; read: boolean; write: boolean }[]
  };
  roles: string[] = []; // List of roles in the server

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
    this.serverService.getServerById(this.serverId, (serverData: any) => {
      this.categoryData.allowedRoles = serverData.members.map((member: any) => ({
        role: member.role,
        read: false,
        write: false
      }));
  }

  onSubmit(): void {
    if (!this.categoryData.name) {
      alert('Category name is required');
      return;
    }

    if (this.categoryData.allowedRoles.length === 0) {
      alert('At least one role permission is required');
      return;
    }

    if (this.serverId === null) {
      console.error('Server ID is null');
      return;
    }

    // Call the service to create a category
    this.categoryService.createCategory(this.serverId, this.categoryData);
  }
}
