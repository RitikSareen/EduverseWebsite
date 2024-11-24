import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupChatService } from '../../../services/groupChat.service';
import { TextChannelService } from '../../../services/textChannel.service';

@Component({
  selector: 'app-show-channel',
  templateUrl: './show-channel.component.html',
  styleUrls: ['./show-channel.component.scss'],
})
export class ShowChannelComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  newMessage: string = '';
  textChannelId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private groupChatService: GroupChatService,
    private textChannelService: TextChannelService
  ) {}

  ngOnInit(): void {
    // Step 1: Connect to WebSocket
    this.groupChatService.connectToSocket();
  
    // Step 2: Subscribe to route parameters
    this.route.paramMap.subscribe((params) => {
      this.textChannelId = params.get('textChannelId');
      if (this.textChannelId) {
        // Step 3: Load messages from the server
        this.loadMessages();
  
        // Step 4: Join the text channel
        this.groupChatService.joinChannel(this.textChannelId);
  
        // Step 5: Listen for real-time messages
        this.groupChatService.onNewMessage().subscribe((message) => {
          // Validate and process the incoming message
          if (message.senderName && message.createdAt && message.content) {
            this.messages.push({
              senderName: message.senderName,
              content: message.content,
              createdAt: new Date(message.createdAt), // Parse timestamp if needed
            });
          } else {
            console.warn('Received incomplete message:', message);
          }
        });
      }
    });
  }
  
  // ngOnInit(): void {
  //   this.groupChatService.connectToSocket();

  //   this.route.paramMap.subscribe((params) => {
  //     this.textChannelId = params.get('textChannelId');
  //     if (this.textChannelId) {
  //       this.loadMessages();
  //       this.groupChatService.joinChannel(this.textChannelId);

  //       this.groupChatService.onNewMessage().subscribe((message) => {
  //         this.messages.push(message);
  //       });
  //     }
  //   });
  // }

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
  
 

  ngOnDestroy(): void {
    if (this.textChannelId) {
      this.groupChatService.leaveChannel(this.textChannelId);
    }
    this.groupChatService.disconnectSocket();
  }
}



