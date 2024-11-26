// import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { GroupChatService } from '../../../services/groupChat.service';
// import { TextChannelService } from '../../../services/textChannel.service';
// import { AuthService } from '../../../services/auth.service';

// @Component({
//   selector: 'app-show-channel',
//   templateUrl: './show-channel.component.html',
//   styleUrls: ['./show-channel.component.scss'],
// })
// export class ShowChannelComponent implements OnInit, OnDestroy {
//   messages: any[] = [];
//   newMessage: string = '';
//   textChannelId: string | null = null;
//   activeDropdownIndex: number | null = null;

//   constructor(
//     private route: ActivatedRoute,
//     private groupChatService: GroupChatService,
//     private textChannelService: TextChannelService,
//     private authService: AuthService
//   ) {}


//   ngOnInit(): void {
//     this.groupChatService.connectToSocket();
  
//     this.route.paramMap.subscribe((params) => {
//       this.textChannelId = params.get('textChannelId');
//       if (this.textChannelId) {
//         this.loadMessages();
//         this.groupChatService.joinChannel(this.textChannelId);
  
//         this.groupChatService.onNewMessage().subscribe((message) => {
//           // Handle real-time messages
//           this.messages.push({
//             senderName: message.senderName || 'Fetching...',
//             content: message.content,
//             createdAt: new Date(message.createdAt), // Ensure timestamp is parsed
//           });
//         });
//       }
//     });
//   }

  
//   loadMessages(): void {
//     const categoryId = this.route.snapshot.paramMap.get('categoryId');
//     const textChannelId = this.textChannelId;

//     if (categoryId && textChannelId) {
//       this.textChannelService.getMessages(categoryId, textChannelId).subscribe(
//         (messages) => (this.messages = messages),
//         (error) => console.error('Error loading messages:', error)
//       );
//     }
//   }

//   sendMessage(): void {
//     const categoryId = this.route.snapshot.paramMap.get('categoryId');
//     const textChannelId = this.textChannelId;
  
//     if (!this.newMessage.trim() || !categoryId || !textChannelId) {
//       console.error('Missing message content, categoryId, or textChannelId');
//       return;
//     }
  
//     // Send the message via WebSocket
//     this.groupChatService.sendGroupMessage(textChannelId, this.newMessage, categoryId);
  
//     // Clear the input immediately after sending
//     this.newMessage = '';
//   }
//   toggleDropdown(index: number): void {
//     this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
//   }

//   closeDropdown(): void {
//     this.activeDropdownIndex = null;
//   }

//   deleteMessage(messageId: string): void {
//     const textChannelId = this.textChannelId;
  
//     if (!textChannelId || !messageId) {
//       console.error('Missing textChannelId or messageId');
//       return;
//     }
  
//     this.textChannelService.deleteMessage(textChannelId, messageId).subscribe(
//       () => {
//         console.log('Message deleted successfully');
//         this.messages = this.messages.filter((message) => message._id !== messageId);
//       },
//       (error) => {
//         console.error('Error deleting message:', error);
//       }
//     );
//   }
  
//   onEnter(event: KeyboardEvent): void {
//     event.preventDefault(); // Prevent default Enter key behavior (adding a new line)
//     this.sendMessage();
//   }
  
  


//   ngOnDestroy(): void {
//     if (this.textChannelId) {
//       this.groupChatService.leaveChannel(this.textChannelId);
//     }
//     this.groupChatService.disconnectSocket();
//   }

//   onClickOutside(event: MouseEvent): void {
//     const target = event.target as HTMLElement;
//     if (!target.closest('.message-options') && this.activeDropdownIndex !== null) {
//       this.closeDropdown();
//     }
//   }
// }

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupChatService } from '../../../services/groupChat.service';
import { TextChannelService } from '../../../services/textChannel.service';
import { AuthService } from '../../../services/auth.service';
import { ServerService } from '../../../services/server.service';

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

  currentUserRole: string | null = null; // Role of the current user in the server
  hasWritePermission: boolean = false; // Write access flag
  hasAdminPrivileges: boolean = false; // Admin privileges flag

  constructor(
    private route: ActivatedRoute,
    private groupChatService: GroupChatService,
    private textChannelService: TextChannelService,
    private authService: AuthService,
    private serverService: ServerService
  ) {}


  ngOnInit(): void {
    this.groupChatService.connectToSocket();
  
    this.route.paramMap.subscribe((params) => {
      this.textChannelId = params.get('textChannelId');
      if (this.textChannelId) {
        this.loadChannelPermissions(); 
        this.loadMessages();
        this.groupChatService.joinChannel(this.textChannelId);
  
        // Listen for real-time messages
        this.groupChatService.onNewMessage().subscribe((message) => {
          // Prevent duplicate messages
          if (!this.messages.some((msg) => msg._id === message._id)) {
            this.messages.push({
              _id: message._id, // Ensure unique message IDs are handled
              senderName: message.senderName || 'Fetching...',
              content: message.content,
              createdAt: new Date(message.createdAt), // Parse timestamp
            });
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
  //       this.loadChannelPermissions(); // Load permissions first
  //       this.loadMessages();

  //       this.groupChatService.joinChannel(this.textChannelId);

  //       this.groupChatService.onNewMessage().subscribe((message) => {
  //         this.messages.push({
  //           senderName: message.senderName || 'Fetching...',
  //           content: message.content,
  //           createdAt: new Date(message.createdAt), // Ensure timestamp is parsed
  //         });
  //       });
  //     }
  //   });
  // }

  loadChannelPermissions(): void {
    const currentUserID = this.authService.getCurrentUser().id;
    console.log('Current userID:', currentUserID);
  
    this.textChannelService.getChannelById(this.textChannelId!, (channelData: any) => {
      console.log('Text channel data:', channelData);
  
      const serverId= this.route.parent?.snapshot.paramMap.get('serverId');
      // const serverId = this.route.snapshot.paramMap.get('serverId');
      if (!serverId) {
        console.error('Server ID is missing from the route.');
        return;
      }
  
      this.serverService.getServerById(serverId, (serverData: any) => {
        console.log('Server data:', serverData);
  
        // Find the user's role in the server members
        const currentUser = serverData.members.find((member: any) => {
          const memberUserId = member.userId?._id || member.userId;
          return memberUserId === currentUserID;
        });
  
        if (!currentUser) {
          console.error('Current user is not a member of this server.');
          alert('You do not have access to this channel.');
          return;
        }
  
        this.currentUserRole = currentUser.role;
        this.hasAdminPrivileges =
          this.currentUserRole === 'Admin' ||
          this.currentUserRole === 'Teacher' ||
          this.currentUserRole === 'TA';
  
        // Check if the user has write permission in the channel
        const allowedRole = channelData.allowedRoles.find(
          (role: any) => role.role === this.currentUserRole
        );
  
        this.hasWritePermission = Array.isArray(allowedRole?.write)
          ? allowedRole.write.includes(true)
          : false;
  
        // Admins always have write permissions
        if (this.hasAdminPrivileges) {
          this.hasWritePermission = true;
        }
  
        console.log('Current user role:', this.currentUserRole);
        console.log('Write permission:', this.hasWritePermission);
        console.log('Admin privileges:', this.hasAdminPrivileges);
      });
    });
  }

  loadMessages(): void {
    const categoryId = this.route.snapshot.paramMap.get('categoryId');
    if (categoryId && this.textChannelId) {
      this.textChannelService.getMessages(categoryId, this.textChannelId).subscribe(
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
  
    // Clear the input field
    this.newMessage = '';
  }
  // sendMessage(): void {
  //   if (!this.hasWritePermission) {
  //     alert('You do not have permission to send messages.');
  //     return;
  //   }

  //   const categoryId = this.route.snapshot.paramMap.get('categoryId');
  //   if (!this.newMessage.trim() || !categoryId || !this.textChannelId) {
  //     console.error('Missing message content, categoryId, or textChannelId');
  //     return;
  //   }

  //   this.groupChatService.sendGroupMessage(this.textChannelId, this.newMessage, categoryId);
  //   this.newMessage = ''; // Clear input after sending
  // }

  toggleDropdown(index: number): void {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }

  closeDropdown(): void {
    this.activeDropdownIndex = null;
  }

  deleteMessage(messageId: string): void {
    if (!this.hasWritePermission) {
      alert('You do not have permission to delete messages.');
      return;
    }

    if (!this.textChannelId || !messageId) {
      console.error('Missing textChannelId or messageId');
      return;
    }

    this.textChannelService.deleteMessage(this.textChannelId, messageId).subscribe(
      () => {
        console.log('Message deleted successfully');
        this.messages = this.messages.filter((message) => message._id !== messageId);
      },
      (error) => {
        console.error('Error deleting message:', error);
      }
    );
  }

  onEnter(event: KeyboardEvent): void {
    event.preventDefault();
    this.sendMessage();
  }

  ngOnDestroy(): void {
    if (this.textChannelId) {
      this.groupChatService.leaveChannel(this.textChannelId);
    }
    this.groupChatService.disconnectSocket();
  }
}


