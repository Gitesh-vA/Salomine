import { TestBed } from '@angular/core/testing';

import { ReservationApiService } from './reservationapi.service';

describe('ReservationapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReservationApiService = TestBed.get(ReservationApiService);
    expect(service).toBeTruthy();
  });
});
