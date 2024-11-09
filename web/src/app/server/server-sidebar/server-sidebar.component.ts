import { Component, OnInit, Input } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-server-sidebar',
  templateUrl: './server-sidebar.component.html',
  styleUrls: ['./server-sidebar.component.scss']
})
export class ServerSidebarComponent implements OnInit {
  serverName: string = '';
  categories: any[] = [];

  constructor(private serverService: ServerService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const serverId = this.route.snapshot.paramMap.get('serverId');
    if (serverId) {
      this.getServerDetails(serverId);
    }
  }

  getServerDetails(serverId: string): void {
    this.serverService.getServerById(serverId, (server: any) => {
      this.serverName = server.serverName;
      this.categories = server.categories; // Assuming categories includes channels
    });
  }
}
