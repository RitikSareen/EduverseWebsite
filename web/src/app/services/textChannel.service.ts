import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TextChannelService {
  private baseUrl = 'http://localhost:3500/textChannels'; // Base URL for server-related API calls

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Create a new text channel under a specific category
  createChannel(
    serverId: string,
    categoryId: string,
    channelData: any,
    successCallback: (response: any) => void,
    errorCallback: (error: any) => void
  ): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    

    this.http
      .post(`${this.baseUrl}/create/${categoryId}`, channelData, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('Text channel created successfully:', response);
          successCallback(response);
        },
        error: (error: any) => {
          console.error('Failed to create text channel:', error);
          errorCallback(error);
        },
      });
  }
  getMessages(channelId: string) {
    const token = localStorage.getItem('token')?.replace(/^"|"$/g, '');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.baseUrl}/${channelId}/messages`, { headers });
  }

  // Additional methods for managing text channels (if needed)
  // Example: Fetch channels, delete channel, update channel, etc.
}
