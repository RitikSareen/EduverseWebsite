import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerSidebarComponent } from './server-sidebar.component';

describe('ServerSidebarComponent', () => {
  let component: ServerSidebarComponent;
  let fixture: ComponentFixture<ServerSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServerSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServerSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
