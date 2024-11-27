import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowComponent } from './show.component';

describe('ShowComponent', () => {
  let component: ShowComponent;
  let fixture: ComponentFixture<ShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render main element', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('main')).toBeTruthy();
  });

  it('should have correct main element structure', () => {
    const compiled = fixture.nativeElement;
    const mainElement = compiled.querySelector('main');
    expect(mainElement.children.length).toBe(0);
  });
});
