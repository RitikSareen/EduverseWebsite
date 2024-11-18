import { Component, Input, OnInit } from '@angular/core';
import { GroupChatService } from '../../../services/groupChat.service';
import { TextChannelService } from '../../../services/textChannel.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './show-channel.component.html',
  styleUrls: ['./show-channel.component.scss'],
})
export class ShowChannelComponent implements OnInit {
  messages: any[] = [];
  channelId!: string;

  constructor(
    private route: ActivatedRoute,
    private textChannelService: TextChannelService
  ) {}

  ngOnInit(): void {
    this.channelId = this.route.snapshot.paramMap.get('channelId')!;
    this.loadMessages();
  }

  loadMessages(): void {
    this.textChannelService.getMessages(this.channelId).subscribe({
      next: (messages) => {
        this.messages = messages;
      },
      error: (err) => {
        console.error('Failed to load messages:', err);
      },
    });
  }
}
