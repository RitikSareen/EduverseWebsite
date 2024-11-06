// server.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private baseUrl = 'http://localhost:3500/servers'; // Adjust the base URL as needed

  constructor(private http: HttpClient, private router: Router) {}

  // Create a new server
  createServer(serverData: any): void {
    this.http.post(`${this.baseUrl}/create`, serverData)
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
    this.http.delete(`${this.baseUrl}/delete/${serverId}`)
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
    this.http.post(`${this.baseUrl}/join`, { serverId, userId })
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

  // Show all servers (updated to return Observable)
  getAllServers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  // Show a server by ID
  getServerById(serverId: string): void {
    this.http.get(`${this.baseUrl}/${serverId}`)
      .subscribe({
        next: (server) => {
          console.log('Fetched server details:', server);
        },
        error: (error) => {
          console.error('Failed to fetch server details:', error);
        }
      });
  }
}
