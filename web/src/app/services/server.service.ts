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

  
  getAllServers(callback: (data: any[]) => void): void {
    this.http.get<any[]>(`${this.baseUrl}/all`)
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
    this.http.get(`${this.baseUrl}/${serverId}`)
      .subscribe({
        next: (data: any) => {
          callback(data); // Pass the data to the provided callback function
        },
        error: (error) => {
          console.error('Failed to fetch server details:', error);
        }
      });
  }
  getServerDetails(serverId: string, callback: (server: any) => void): void {
    this.http.get(`${this.baseUrl}/${serverId}`)
      .subscribe({
        next: (server: any) => {
          callback(server); // Pass server data to the callback
        },
        error: (error) => {
          console.error('Failed to fetch server details:', error);
        }
      });
  }
}
