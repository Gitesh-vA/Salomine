import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDropDownComponent } from './employee-drop-down.component';

describe('EmployeeDropDownComponent', () => {
  let component: EmployeeDropDownComponent;
  let fixture: ComponentFixture<EmployeeDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
