import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalonDeleteComponent } from './salon-delete.component';

describe('SalonDeleteComponent', () => {
  let component: SalonDeleteComponent;
  let fixture: ComponentFixture<SalonDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalonDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalonDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
