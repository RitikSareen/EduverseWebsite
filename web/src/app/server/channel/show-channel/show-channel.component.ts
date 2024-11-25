import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupChatService } from '../../../services/groupChat.service';
import { TextChannelService } from '../../../services/textChannel.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-show-channel',
  templateUrl: './show-channel.component.html',
  styleUrls: ['./show-channel.component.scss'],
})
export class ShowChannelComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  newMessage: string = '';
  textChannelId: string | null = null;
  activeDropdownIndex: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private groupChatService: GroupChatService,
    private textChannelService: TextChannelService,
    private authService: AuthService
  ) {}


  ngOnInit(): void {
    this.groupChatService.connectToSocket();
  
    this.route.paramMap.subscribe((params) => {
      this.textChannelId = params.get('textChannelId');
      if (this.textChannelId) {
        this.loadMessages();
        this.groupChatService.joinChannel(this.textChannelId);
  
        this.groupChatService.onNewMessage().subscribe((message) => {
          // Handle real-time messages
          this.messages.push({
            senderName: message.senderName || 'Fetching...',
            content: message.content,
            createdAt: new Date(message.createdAt), // Ensure timestamp is parsed
          });
        });
      }
    });
  }

  
  loadMessages(): void {
    const categoryId = this.route.snapshot.paramMap.get('categoryId');
    const textChannelId = this.textChannelId;

    if (categoryId && textChannelId) {
      this.textChannelService.getMessages(categoryId, textChannelId).subscribe(
        (messages) => (this.messages = messages),
        (error) => console.error('Error loading messages:', error)
      );
    }
  }

  sendMessage(): void {
    const categoryId = this.route.snapshot.paramMap.get('categoryId');
    const textChannelId = this.textChannelId;
  
    if (!this.newMessage.trim() || !categoryId || !textChannelId) {
      console.error('Missing message content, categoryId, or textChannelId');
      return;
    }
  
    // Send the message via WebSocket
    this.groupChatService.sendGroupMessage(textChannelId, this.newMessage, categoryId);
  
    // Clear the input immediately after sending
    this.newMessage = '';
  }
  toggleDropdown(index: number): void {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }

  closeDropdown(): void {
    this.activeDropdownIndex = null;
  }

  deleteMessage(messageId: string): void {
    const textChannelId = this.textChannelId;
  
    if (!textChannelId || !messageId) {
      console.error('Missing textChannelId or messageId');
      return;
    }
  
    this.textChannelService.deleteMessage(textChannelId, messageId).subscribe(
      () => {
        console.log('Message deleted successfully');
        this.messages = this.messages.filter((message) => message._id !== messageId);
      },
      (error) => {
        console.error('Error deleting message:', error);
      }
    );
  }
  
  


  ngOnDestroy(): void {
    if (this.textChannelId) {
      this.groupChatService.leaveChannel(this.textChannelId);
    }
    this.groupChatService.disconnectSocket();
  }

  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.message-options') && this.activeDropdownIndex !== null) {
      this.closeDropdown();
    }
  }
}



