// server.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private baseUrl = 'http://localhost:3500/servers'; // Adjust the base URL as needed

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  // Create a new server
  createServer(serverData: any): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`${this.baseUrl}/create`, serverData, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('Server created successfully:', response);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Failed to create server:', error);
          alert('Server creation failed. Please try again.');
        }
      });
  }

  // Delete a server by ID
  deleteServer(serverId: string): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.delete(`${this.baseUrl}/delete/${serverId}`, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('Server deleted successfully:', response);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Failed to delete server:', error);
          alert('Server deletion failed. Please try again.');
        }
      });
  }

  // Join a server by ID
  joinServer(serverId: string, userId: string): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Corrected the headers to be outside the body
    this.http.post(`${this.baseUrl}/join`, { serverId, userId }, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('User joined server successfully:', response);
        },
        error: (error) => {
          console.error('Failed to join server:', error);
          alert('Failed to join the server. Please try again.');
        }
      });
  }

  // Get all servers with a callback
  getAllServers(callback: (data: any[]) => void): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`${this.baseUrl}/all`, { headers })
      .subscribe({
        next: (data: any[]) => {
          callback(data); // Pass the data to the provided callback function
        },
        error: (error) => {
          console.error('Failed to fetch servers:', error);
        }
      });
  }

  // Fetch server details by ID (including categories and channels)
  getServerById(serverId: string, callback: (data: any) => void): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(`${this.baseUrl}/${serverId}`, { headers })
      .subscribe({
        next: (data: any) => {
          callback(data); // Pass the data to the provided callback function
        },
        error: (error) => {
          console.error('Failed to fetch server details:', error);
        }
      });
  }
}
