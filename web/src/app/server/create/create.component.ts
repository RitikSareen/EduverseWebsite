import { Component } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-server',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent {
  serverData = {
    name: '',
    description: '',
    role: 'Admin' // Creator's role is set to Admin by default
  };

  constructor(
    private serverService: ServerService,
    private authService: AuthService, // AuthService to get the current user
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.serverData.name) {
      alert('Server name is required');
      return;
    }

    // Retrieve the logged-in user's ID from AuthService
    const userId = this.authService.getUser().id;

    // Pass the server data, including userId, to the service to create the server
    this.serverService.createServer({
      name: this.serverData.name,
      description: this.serverData.description,
      userId: userId, // Pass userId to backend to set as Admin and update membership
    });
  }
}
