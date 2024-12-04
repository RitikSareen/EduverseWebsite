import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class DirectChatService {
  private socket: Socket;

  constructor() {
    this.connect();
  }

  connect(): void {
    const token = localStorage.getItem('token');
    this.socket = io('http://localhost:3500', {
      query: {
        token: token
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  joinConversation(conversationId: string): void {
    this.socket.emit('join conversation', conversationId);
  }

  leaveConversation(conversationId: string): void {
    this.socket.emit('leave conversation', conversationId);
  }

  sendDirectMessage(conversationId: string, content: string): void {
    this.socket.emit('direct message', {
      conversationId,
      content
    });
  }

  onDirectMessage(callback: (data: any) => void): void {
    this.socket.on('direct message', callback);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
