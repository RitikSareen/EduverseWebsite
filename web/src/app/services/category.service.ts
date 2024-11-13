// category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = 'http://localhost:3500/categories'; // Adjust the base URL as needed

  constructor(
    private http: HttpClient, 
    private authService: AuthService
  ) {}

  // Create a new category under a specific server
  createCategory(serverId: string, categoryData: any): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`${this.baseUrl}/create/${serverId}`, categoryData, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('Category created successfully:', response);
          // Further actions can be added, such as notifying the sidebar to update
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
          callback(data);
        },
        error: (error) => {
          console.error('Failed to fetch categories:', error);
        }
      });
  }
}
