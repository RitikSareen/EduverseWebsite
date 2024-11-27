import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private baseURL = 'http://localhost:3500/user';
  private baseURL = 'http://192.41.170.157:3500/user';
  private userSubject = new BehaviorSubject<any>(this.getSafeUser()); // Initialize with safe check for user

  constructor(private http: HttpClient, private router: Router) {}

  // Check if localStorage is available
  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '_test_';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  // Safely get the user from localStorage
  private getSafeUser(): any {
    if (this.isLocalStorageAvailable()) {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null; // Return null if localStorage is not available
  }

  // Observable to track user updates
  getUserUpdates(): Observable<any> {
    return this.userSubject.asObservable();
  }

  // Get the current user
  getUser(): any {
    return this.getSafeUser(); // Use the safe method to fetch the user
  }

  // Check if the user is signed in
  get isSignedIn(): boolean {
    return !!this.getUser(); // Returns true if a user exists, false otherwise
  }

  // Update the user in localStorage and notify subscribers
  setUser(user: any): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('user', JSON.stringify(user));
      this.userSubject.next(user); // Notify all subscribers of the updated user
    }
  }

  getToken(): string | null {
    if (this.isLocalStorageAvailable()) {
      const token = localStorage.getItem('token');
      return token ? JSON.parse(token) : null;
    }
    return null;
  }

  // Register Method with SweetAlert2
  register(userData: any): void {
    this.http.post(`${this.baseURL}/register`, userData).subscribe({
      next: (response: any) => {
        if (this.isLocalStorageAvailable()) {
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('token', JSON.stringify(response.token));
        }
        this.userSubject.next(response.user); // Notify subscribers of the new user

        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'Welcome to Eduverse!',
          background: '#3e3e3e',
          color: '#ffffff',
          confirmButtonColor: '#007BFF',
        });

        this.router.navigate(['/home']);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: 'Please try again later.',
          background: '#3e3e3e',
          color: '#ffffff',
          confirmButtonColor: '#ff4d4d',
        });
      },
    });
  }

  // Login Method with SweetAlert2
  signIn(userData: any): void {
    this.http.post(`${this.baseURL}/login`, userData)
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('user', JSON.stringify(response.user)); // Store full user data
          localStorage.setItem('token', JSON.stringify(response.token));
  
          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'You are now logged in to Eduverse!',
            background: '#3e3e3e',
            color: '#ffffff',
            confirmButtonColor: '#007BFF',
          });
  
          this.router.navigate(['/home']);
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid email or password. Please try again.',
            background: '#3e3e3e',
            color: '#ffffff',
            confirmButtonColor: '#ff4d4d',
          });
        },
      });
  }
  

  // Logout Method with SweetAlert2
  logout(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    this.userSubject.next(null); // Notify subscribers that the user has logged out

    Swal.fire({
      icon: 'info',
      title: 'Logged Out',
      text: 'You have been successfully logged out.',
      background: '#3e3e3e',
      color: '#ffffff',
      confirmButtonColor: '#007BFF',
    }).then(() => {
      this.router.navigate(['/auth/show/signIn']);
    });
  }

  changePassword(passwordData: { currentPassword: string; newPassword: string }): Observable<any> {
    return this.http.put(`${this.baseURL}/change-password`, passwordData, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Send token for authentication
      },
    });
  }
  getCurrentUser(): any {
    const user = localStorage.getItem('user');
  if (!user) {
    console.error('No user found in localStorage. Please log in again.');
    return null; // Ensure it gracefully returns null
  }
  
  try {
    const parsedUser = JSON.parse(user);
    console.log('AuthService.getUser() output:', parsedUser);
    return parsedUser;
  } catch (error) {
    console.error('Failed to parse user from localStorage:', error);
    return null;
  }

  }
  

  // Check if an email exists
  emailExists(email: string): Observable<boolean> {
    const url = `${this.baseURL}/check-email?email=${email}`;
    return this.http.get<{ exists: boolean }>(url).pipe(
      map((response: { exists: boolean }) => response.exists)
    );
  }

  // Update Profile Method
  updateProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.baseURL}/profile`, profileData, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    }).pipe(
      map((updatedUser: any) => {
        this.setUser(updatedUser); // Update local storage and notify subscribers
        return updatedUser;
      })
    );
  }
  
}


