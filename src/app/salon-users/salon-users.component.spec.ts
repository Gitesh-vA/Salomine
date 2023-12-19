import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalonUsersComponent } from './salon-users.component';

describe('SalonUsersComponent', () => {
  let component: SalonUsersComponent;
  let fixture: ComponentFixture<SalonUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalonUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalonUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
