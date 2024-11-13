import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-create-category',
  templateUrl: './createCategory.component.html',
  styleUrls: ['./createCategory.component.scss']
})
export class CreateCategoryComponent {
  categoryName: string = '';
  serverId: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.serverId = this.route.snapshot.paramMap.get('serverId');
  }

  createCategory(): void {
    if (this.serverId && this.categoryName.trim()) {
      const categoryData = { name: this.categoryName.trim() };
      this.categoryService.createCategory(this.serverId, categoryData);
      // Navigate back to server detail after creation
    } else {
      alert('Please enter a valid category name.');
    }
  }
}
