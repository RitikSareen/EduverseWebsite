
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing = false; // To toggle between view and edit mode

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getUser(); // Get user data from local storage

    this.profileForm = this.fb.group({
      firstName: [user.firstName || '', [Validators.required, Validators.minLength(2)]],
      lastName: [user.lastName || '', [Validators.required, Validators.minLength(2)]],
      username: [user.username || '', [Validators.required, Validators.minLength(2)]],
      email: [user.email || '', [Validators.required, Validators.email]],
      currentPassword: ['', Validators.minLength(6)], // Optional field for password update
      newPassword: ['', Validators.minLength(6)], // New password
      confirmPassword: ['', Validators.minLength(6)], // Confirm new password
    });

    this.profileForm.disable(); // Disable fields initially
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.enable(); // Enable fields for editing
    } else {
      this.profileForm.disable(); // Disable fields after toggling off
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const { currentPassword, newPassword, confirmPassword, ...profileData } =
        this.profileForm.value;

      // Validate password change inputs
      if (newPassword && newPassword !== confirmPassword) {
        Swal.fire('Error', 'Passwords do not match. Please try again.', 'error');
        return;
      }

      this.authService.updateProfile(profileData).subscribe({
        next: (updatedUser) => {
          if (newPassword) {
            this.authService.changePassword({
              currentPassword,
              newPassword,
            }).subscribe({
              next: () => {
                Swal.fire('Success', 'Profile and password updated successfully!', 'success');
                this.authService.setUser(updatedUser); // Update local user data
                this.toggleEdit(); // Toggle back to view mode
              },
              error: () => {
                Swal.fire('Error', 'Failed to update password. Please try again.', 'error');
              },
            });
          } else {
            Swal.fire('Success', 'Profile updated successfully!', 'success');
            this.authService.setUser(updatedUser); // Update local user data
            this.toggleEdit(); // Toggle back to view mode
          }
        },
        error: () => {
          Swal.fire('Error', 'Failed to update profile. Please try again.', 'error');
        },
      });
    }
  }
}