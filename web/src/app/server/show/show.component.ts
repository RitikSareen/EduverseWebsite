import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../../services/server.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrl: './show.component.scss'
})
export class ShowComponent {
  server: any;

  constructor(
    private route: ActivatedRoute,
    private serverService: ServerService
  ) {}

  ngOnInit(): void {
    const serverId = this.route.snapshot.paramMap.get('serverId');
    if (serverId) {
      this.serverService.getServerById(serverId, (data: any) => {
        this.server = data;
      });
    }
  }
}
