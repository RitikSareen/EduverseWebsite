import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCategoryComponent } from './createCategory.component';

describe('CreateComponent', () => {
  let component: CreateCategoryComponent;
  let fixture: ComponentFixture<CreateCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
