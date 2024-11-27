// server.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private baseUrl = 'http://192.41.170.157:3500/servers'; // Adjust the base URL as needed
  // private baseUrl = 'http://localhost:3500/servers';
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
          this.router.navigate(['/home/servers']);
        },
        error: (error) => {
          console.error('Failed to create server:', error);
          alert('Server creation failed. Please try again.');
        }
      });
  }
  deleteServer(serverId: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.baseUrl}/servers/${serverId}`, { headers });
  }

  // Delete a server by ID
  // deleteServer(serverId: string): void {
  //   const token = this.authService.getToken();
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  //   this.http.delete(`${this.baseUrl}/delete/${serverId}`, { headers })
  //     .subscribe({
  //       next: (response: any) => {
  //         console.log('Server deleted successfully:', response);
  //         this.router.navigate(['/home']);
  //       },
  //       error: (error) => {
  //         console.error('Failed to delete server:', error);
  //         alert('Server deletion failed. Please try again.');
  //       }
  //     });
  // }

  // Join a server by ID
  joinServer(serverId: string, joinCode: string, successCallback: (response: any) => void, errorCallback: (error: any) => void): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    this.http.post(`${this.baseUrl}/${serverId}/join`, { joinCode }, { headers })
      .subscribe({
        next: (response: any) => {
          successCallback(response); // Execute success callback on success
        },
        error: (error) => {
          errorCallback(error); // Execute error callback on failure
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
  leaveServer(serverId: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.baseUrl}/servers/${serverId}/leave`, { headers });
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
  updateServer(serverId: string, updatedData: any): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.put(`${this.baseUrl}/${serverId}`, updatedData, { headers }).subscribe(
      response => console.log('Server updated successfully'),
      error => console.error('Failed to update server:', error)
    );
  }
  updateMemberRole(serverId: string, memberId: string, role: string, callback: () => void): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.http.put(`http://192.41.170.157:3500/servers/${serverId}/members/${memberId}/role`, { role }, { headers })
      .subscribe({
        next: () => {
          console.log('Member role updated successfully');
          callback();
        },
        error: (error) => {
          console.error('Failed to update member role:', error);
          alert('Failed to update member role. Please try again.');
        }
      });
  }
  
  
  kickMember(serverId: string, userId: string, callback: () => void): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.delete(`${this.baseUrl}/${serverId}/remove-user/${userId}`, { headers }).subscribe(
      () => callback(),
      error => console.error('Failed to kick member:', error)
    );
  }
}
