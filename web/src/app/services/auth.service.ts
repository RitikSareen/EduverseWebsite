import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3500/user'; // Update this URL as needed

  constructor(private http: HttpClient, private router: Router) {}

  // Check if the user is logged in
  get isSignedIn(): boolean {
    return !!this.getToken();
  }

  // Method to get the current user data from local storage
  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Method to get the token from local storage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Method to register a new user
  register(userData: any): void {
    this.http.post(`${this.baseUrl}/register`, userData)
      .subscribe({
        next: (response: any) => {
          // Store user and token information in local storage
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);

          // Navigate to the chats page after successful registration
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Failed registration:', error);
          alert('Registration failed. Please try again.');
        }
      });
  }

  // Method to log in a user
  signIn(credentials: { email: string, password: string }): void {
    this.http.post(`${this.baseUrl}/login`, credentials)
    .subscribe({
        next: (response: any) => {
           localStorage.setItem("user", JSON.stringify(response.user))
           localStorage.setItem("token", JSON.stringify(response.token))
           
           this.router.navigate(['/home'])
        },
        error: () => {
            console.log('Invalid credentials');
        }
    });
  }

  // Method to log out a user
  logout(): void {
    // Remove user and token from local storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Redirect to the login page after logout
    this.router.navigate(['/auth/login']);
  }
}
