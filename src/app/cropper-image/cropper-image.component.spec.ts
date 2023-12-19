import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CropperImageComponent } from './cropper-image.component';

describe('CropperImageComponent', () => {
  let component: CropperImageComponent;
  let fixture: ComponentFixture<CropperImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropperImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropperImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
