import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyOptionsComponent } from './privacy-options.component';

describe('PrivacyOptionsComponent', () => {
  let component: PrivacyOptionsComponent;
  let fixture: ComponentFixture<PrivacyOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivacyOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
