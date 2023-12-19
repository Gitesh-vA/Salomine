import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessDynamicModalComponent } from './success-dynamic-modal.component';

describe('SuccessDynamicModalComponent', () => {
  let component: SuccessDynamicModalComponent;
  let fixture: ComponentFixture<SuccessDynamicModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SuccessDynamicModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessDynamicModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
