import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalonPanelComponent } from './salon-panel.component';

describe('SalonPanelComponent', () => {
  let component: SalonPanelComponent;
  let fixture: ComponentFixture<SalonPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalonPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalonPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
