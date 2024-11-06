import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../services/server.service';


@Component({
  selector: 'app-server-sidebar',
  templateUrl: './server-sidebar.component.html',
  styleUrls: ['./server-sidebar.component.scss']
})
export class ServerSidebarComponent implements OnInit {
  serverId: string;
  serverName: string;
  categories = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serverService: ServerService
  ) {}

  ngOnInit(): void {
    this.serverId = this.route.snapshot.paramMap.get('serverId');
    this.loadServerData();
  }

  loadServerData(): void {
    // Load the server's categories and channels
    this.serverService.getServerDetails(this.serverId).subscribe((server) => {
      this.serverName = server.name;
      this.categories = server.categories;
    });
  }

  goBackHome(): void {
    this.router.navigate(['/home']);
  }
}
