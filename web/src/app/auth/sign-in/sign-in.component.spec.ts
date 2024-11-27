import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SignInComponent } from './sign-in.component';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignInComponent ],
      imports: [ FormsModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the form with empty credentials', () => {
    expect(component.credentials).toBeDefined();
    expect(component.credentials.email).toBe('');
    expect(component.credentials.password).toBe('');
  });

  it('should update email field when user types', () => {
    const input = fixture.debugElement.nativeElement.querySelector('#email');
    input.value = 'test@example.com';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.credentials.email).toBe('test@example.com');
  });

  it('should update password field when user types', () => {
    const input = fixture.debugElement.nativeElement.querySelector('#password');
    input.value = 'testpassword';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.credentials.password).toBe('testpassword');
  });

  it('should call onLogin when form is submitted', () => {
    spyOn(component, 'onLogin');
    const form = fixture.debugElement.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    expect(component.onLogin).toHaveBeenCalled();
  });

  it('should have required attributes on input fields', () => {
    const emailInput = fixture.debugElement.nativeElement.querySelector('#email');
    const passwordInput = fixture.debugElement.nativeElement.querySelector('#password');
    expect(emailInput.hasAttribute('required')).toBeTruthy();
    expect(passwordInput.hasAttribute('required')).toBeTruthy();
  });

  it('should have correct input types', () => {
    const emailInput = fixture.debugElement.nativeElement.querySelector('#email');
    const passwordInput = fixture.debugElement.nativeElement.querySelector('#password');
    expect(emailInput.type).toBe('email');
    expect(passwordInput.type).toBe('password');
  });
});
