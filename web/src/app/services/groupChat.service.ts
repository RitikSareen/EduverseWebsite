import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class GroupChatService {
  private socket: Socket | null = null;

  constructor(private authService: AuthService) {}

  connectToSocket(): void {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Token not found. User must be logged in.');
      return;
    }

    this.socket = io('http://localhost:3500', {
      extraHeaders: { Authorization: `Bearer ${token}` },
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('WebSocket disconnected:', reason);
    });
  }

  joinChannel(channelId: string): void {
        if (!this.socket) {
          console.error('Socket is not connected. Cannot join channel.');
          return;
        }
    
        this.socket.emit('join channel', channelId, (ack: { success: boolean; message: string }) => {
          if (ack.success) {
            console.log(`Joined channel ${channelId}`);
          } else {
            console.error(`Failed to join channel ${channelId}:`, ack.message);
          }
        });
      }


      sendGroupMessage(channelId: string, message: string, categoryId: string): void {
        if (!this.socket || !this.socket.connected) {
          console.error('Socket is not connected. Cannot send message.');
          return;
        }
      
        const payload = {
          categoryId,
          textChannelId: channelId,
          content: message,
        };
      
        this.socket.emit('chat message', payload, (ack?: { success: boolean; message?: string }) => {
          if (ack && !ack.success) {
            console.error('Failed to send message:', ack.message || 'Unknown error');
          } else {
            console.log('Message sent successfully');
          }
        });
      }
      


  onNewMessage(): Observable<any> {
    return new Observable((observer) => {
      if (this.socket) {
        this.socket.on('chat message', (message) => {
          observer.next(message);
        });
      }

      return () => {
        if (this.socket) {
          this.socket.off('chat message');
        }
      };
    });
  }
  leaveChannel(channelId: string): void {
        if (!this.socket) {
          console.error('Socket is not connected. Cannot leave channel.');
          return;
        }
    
        this.socket.emit('leave channel', channelId, (ack: { success: boolean; message: string }) => {
          if (ack.success) {
            console.log(`Left channel ${channelId}`);
          } else {
            console.error(`Failed to leave channel ${channelId}:`, ack.message);
          }
        });
      }

  disconnectSocket(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}


