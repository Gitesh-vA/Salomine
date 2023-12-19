import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenSalonComponent } from './open-salon.component';

describe('OpenSalonComponent', () => {
  let component: OpenSalonComponent;
  let fixture: ComponentFixture<OpenSalonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenSalonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenSalonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
