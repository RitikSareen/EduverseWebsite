import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { SignUpComponent } from './sign-up.component';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignUpComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [ FormBuilder ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form fields', () => {
    expect(component.signupForm.get('username')?.value).toBe('');
    expect(component.signupForm.get('email')?.value).toBe('');
    expect(component.signupForm.get('password')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.signupForm.valid).toBeFalsy();
  });

  it('should validate username field as required', () => {
    const usernameControl = component.signupForm.get('username');
    usernameControl?.setValue('');
    expect(usernameControl?.valid).toBeFalsy();
    expect(usernameControl?.errors?.['required']).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.signupForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should validate password minimum length', () => {
    const passwordControl = component.signupForm.get('password');
    passwordControl?.setValue('12345');
    expect(passwordControl?.valid).toBeFalsy();
    passwordControl?.setValue('123456');
    expect(passwordControl?.valid).toBeTruthy();
  });

  it('should mark form as valid when all fields are properly filled', () => {
    component.signupForm.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: '123456'
    });
    expect(component.signupForm.valid).toBeTruthy();
  });

  it('should display error messages when fields are touched and invalid', () => {
    const usernameControl = component.signupForm.get('username');
    usernameControl?.setValue('');
    usernameControl?.markAsTouched();
    fixture.detectChanges();
    
    const errorElement = fixture.nativeElement.querySelector('.error-message');
    expect(errorElement.textContent).toContain('User name is required');
  });
describe('SignUpComponent Component Decorator', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignUpComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [ FormBuilder ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have the correct selector', () => {
    const annotations = (Reflect as any).getMetadata('annotations', SignUpComponent);
    const componentDecorator = annotations[0];
    expect(componentDecorator.selector).toBe('app-sign-up');
  });

  it('should have the correct template URL', () => {
    const annotations = (Reflect as any).getMetadata('annotations', SignUpComponent);
    const componentDecorator = annotations[0];
    expect(componentDecorator.templateUrl).toBe('./sign-up.component.html');
  });

  it('should have the correct styleUrls', () => {
    const annotations = (Reflect as any).getMetadata('annotations', SignUpComponent);
    const componentDecorator = annotations[0];
    expect(componentDecorator.styleUrls).toEqual(['./sign-up.component.scss']);
  });

  it('should render the component selector in DOM', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.tagName.toLowerCase()).toBe('app-sign-up');
  });

  it('should have template file accessible', () => {
    const template = fixture.debugElement.nativeElement;
    expect(template).toBeTruthy();
  });
});
})