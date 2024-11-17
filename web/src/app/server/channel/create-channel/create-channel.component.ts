import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerService } from '../../../services/server.service';

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.scss']
})
export class CreateChannelComponent implements OnInit {
  categoryId!: string;
  channelData = {
    name: '',
    type: 'text'
  };

  constructor(
    private serverService: ServerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const categoryId = this.route.snapshot.paramMap.get('categoryId');
    if (categoryId) {
      this.categoryId = categoryId;
    } else {
      console.error('No category ID found');
    }
  }

  onSubmit(): void {
    if (!this.channelData.name) {
      alert('Channel name is required!');
      return;
    }

    // this.serverService.createChannel(this.categoryId, this.channelData, () => {
    //   alert('Channel created successfully!');
    //   this.router.navigate(['/server', this.categoryId]); // Navigate back to the server
    // }, (error: any) => {
    //   console.error('Failed to create channel:', error);
    //   alert('Failed to create channel. Please try again.');
    // });
  }
}
