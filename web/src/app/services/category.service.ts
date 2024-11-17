// category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})


export class CategoryService {
  private baseUrl = 'http://localhost:3500/categories'; // Adjust the base URL as needed

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private router: Router
  ) {}

  // Create a new category under a specific server
 

  createCategory(serverId: string, categoryData: any): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`${this.baseUrl}/create/${serverId}`, categoryData, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('Category created successfully:', response);
          this.router.navigate([`/server/${serverId}`]);
        },
        error: (error) => {
          console.error('Failed to create category:', error);
          alert('Category creation failed. Please try again.');
        }
      });
  }

  // Get all categories for a specific server
  getCategoriesByServerId(serverId: string, callback: (data: any[]) => void): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`${this.baseUrl}/server/${serverId}`, { headers })
      .subscribe({
        next: (data: any[]) => {
          callback(data); // Pass the data to the provided callback function
        },
        error: (error) => {
          console.error('Failed to fetch categories:', error);
        }
      });
  }

  // Delete a category by ID
  deleteCategory(categoryId: string): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.delete(`${this.baseUrl}/delete/${categoryId}`, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('Category deleted successfully:', response);
        },
        error: (error) => {
          console.error('Failed to delete category:', error);
          alert('Category deletion failed. Please try again.');
        }
      });
  }

  // Update a category by ID
  updateCategory(categoryId: string, updatedData: any): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.put(`${this.baseUrl}/update/${categoryId}`, updatedData, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('Category updated successfully:', response);
        },
        error: (error) => {
          console.error('Failed to update category:', error);
          alert('Category update failed. Please try again.');
        }
      });
  }
}