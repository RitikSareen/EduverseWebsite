import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  signupForm: FormGroup;
  emailError: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.signupForm.get('email')?.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((email: string) => this.authService.emailExists(email))
      )
      .subscribe((isTaken: boolean) => {
        this.emailError = isTaken ? 'Email is already taken' : null;
      });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.authService.register(this.signupForm.value);
    }
  }
}