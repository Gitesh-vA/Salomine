import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoDynamicModalComponent } from './info-dynamic-modal.component';

describe('InfoDynamicModalComponent', () => {
  let component: InfoDynamicModalComponent;
  let fixture: ComponentFixture<InfoDynamicModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoDynamicModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoDynamicModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
