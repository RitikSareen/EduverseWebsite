import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class GroupChatService {
  private socket: Socket;

  constructor() {
    this.connect();
  }

  private connect(): void {
    const token = localStorage.getItem('token');
    this.socket = io('http://localhost:3500', {
      query: { token: token }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  joinChannel(channelId: string): void {
    this.socket.emit('join channel', channelId);
  }

  sendGroupMessage(channelId: string, content: string): void {
    this.socket.emit('chat message', { channelId, content });
  }

  onGroupMessage(callback: (data: any) => void): void {
    this.socket.on('chat message', callback);
  }

  leaveChannel(channelId: string): void {
    this.socket.emit('leave channel', channelId);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
