import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Eduverse';

  ngOnInit(): void {
    // Check login status and redirect accordingly
    if (this.authService.isSignedIn) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/auth/show']);
    }
  }
  constructor(private authService: AuthService, private router: Router) {}
  activeTab: 'signIn' | 'signUp' = 'signIn';
  // Check if the user is logged in
  get isLoggedIn(): boolean {
    return this.authService.isSignedIn;
  }

  // Determine if the user is in a server by checking the URL
  isInServer(): boolean {
    return this.router.url.startsWith('/servers/');
  }

  // Logout functionality
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
