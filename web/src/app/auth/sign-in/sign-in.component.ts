import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})


export class SignInComponent {
  credentials = {
    email: '',
    password: ''
  }
  

  constructor(public authService: AuthService) {}

  onLogin(): void {
    this.authService.signIn(this.credentials)
  }
}
