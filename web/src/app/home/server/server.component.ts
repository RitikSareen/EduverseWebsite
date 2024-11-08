import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.scss']
})
export class ServerComponent implements OnInit {
  servers: any[] = [];

  constructor(private serverService: ServerService, private router: Router) {}

  ngOnInit(): void {
    this.getServers();
  }

  getServers(): void {
    this.serverService.getAllServers((data: any[]) => {
      this.servers = data; // Directly set the servers data
    });
  }

  navigateToCreateServer(): void {
    this.router.navigate(['/server/create']); // Adjust route as needed
  }

}
