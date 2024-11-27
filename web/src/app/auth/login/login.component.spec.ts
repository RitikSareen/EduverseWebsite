import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [ LoginComponent ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with empty fields', () => {
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should mark form as invalid when fields are empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should mark form as valid when all fields are filled', () => {
    component.loginForm.patchValue({
      username: 'testuser',
      password: 'password123'
    });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should show validation errors when submitting empty form', () => {
    component.onSubmit();
    expect(component.loginForm.get('username')?.hasError('required')).toBeTruthy();
    expect(component.loginForm.get('password')?.hasError('required')).toBeTruthy();
  });

  it('should call auth service and navigate on successful login', async () => {
    const navigateSpy = spyOn(router, 'navigate');
    authService.login.and.returnValue(Promise.resolve(true));

    component.loginForm.patchValue({
      username: 'testuser',
      password: 'password123'
    });

    await component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith('testuser', 'password123');
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should set error message on failed login', async () => {
    authService.login.and.returnValue(Promise.resolve(false));

    component.loginForm.patchValue({
      username: 'wronguser',
      password: 'wrongpassword'
    });

    await component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith('wronguser', 'wrongpassword');
    expect(component.errorMessage).toBe('Invalid credentials');
  });
});
