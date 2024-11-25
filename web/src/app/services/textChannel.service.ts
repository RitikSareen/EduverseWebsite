import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

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
  deleteChannel(channelId: string, callback: () => void): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    this.http.delete(`${this.baseUrl}/channel/${channelId}`, { headers })
      .subscribe({
        next: () => {
          console.log('Channel deleted successfully');
          callback();
        },
        error: (error) => {
          console.error('Failed to delete channel:', error);
          alert('Failed to delete channel. Please try again.');
        }
      });
  }
  

  getMessages(categoryId: string, textChannelId: string): Observable<any[]> {
    const token = localStorage.getItem('token')?.replace(/^"|"$/g, ''); // Clean token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/${categoryId}/${textChannelId}/messages`;

    return this.http.get<any[]>(url, { headers });
  }

  createMessage(categoryId: string, channelId: string, messageData: any): Observable<any> {
    const token = localStorage.getItem('token')?.replace(/^"|"$/g, ''); // Clean the token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/${categoryId}/${channelId}/messages`; // Correct URL

    return this.http.post<any>(url, messageData, { headers });
  }

  deleteMessage( textChannelId: string, messageId: string): Observable<any> {
    const token = localStorage.getItem('token')?.replace(/^"|"$/g, ''); // Clean the token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:3500/textChannels/${textChannelId}/messages/${messageId}`;
    return this.http.delete(url, { headers });
  }

  getChannelById(channelId: string, callback: (data: any) => void): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    this.http.get<any>(`http://localhost:3500/textChannels/details/${channelId}`, { headers })
      .subscribe({
        next: (data) => callback(data),
        error: (error) => {
          console.error('Failed to fetch text channel details:', error);
          alert('Failed to fetch text channel details. Please try again.');
        }
      });
  }
  
  updateChannel(channelId: string, channelData: any, callback: () => void): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    this.http.put(`http://localhost:3500/textChannels/${channelId}`, channelData, { headers })
      .subscribe({
        next: () => callback(),
        error: (error) => {
          console.error('Failed to update text channel:', error);
          alert('Failed to update text channel. Please try again.');
        }
      });
  }
  

}
