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
  createCategory(
    serverId: string, 
    categoryData: any, 
    callback: (response: any) => void, 
    errorCallback: (error: any) => void
  ): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    const payload = {
      name: categoryData.name,
      allowedRoles: categoryData.allowedRoles.map((role: any) => ({
        role: role.role,
        visible: role.visible ?? false,
        read: role.read ?? false,
        write: role.write ?? false
      }))
    };

    this.http.post(`${this.baseUrl}/create/${serverId}`, payload, { headers })
      .subscribe({
        next: (response: any) => callback(response),
        error: (error) => errorCallback(error)
      });
  }


  // Get all categories for a specific server with a callback function
  getCategoriesByServerId(serverId: string, callback: (data: any[]) => void, errorCallback: (error: any) => void): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`${this.baseUrl}/server/${serverId}`, { headers })
      .subscribe({
        next: (data: any[]) => {
          console.log('Fetched categories:', data);
          callback(data);
        },
        error: (error) => {
          console.error('Failed to fetch categories:', error);
          errorCallback(error);
        }
      });
  }
}
