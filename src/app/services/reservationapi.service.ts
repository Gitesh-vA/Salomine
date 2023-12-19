import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../models/reservation-model/settings';
import { AvailableDate } from '../models/reservation-model/available-date';
import { AvailableTime } from '../models/reservation-model/available-time';
import { CustomField } from '../models/reservation-model/custom-field';

@Injectable({
    providedIn: 'root'
})

export class ReservationApiService {

    baseUrl = "https://reservationappangular8.azurewebsites.net/";

    constructor(private http: HttpClient) {
    }

    getSettings() {
        return this.http.get<Settings>(this.baseUrl + 'setting');
    }

    getFields() {
        return this.http.get<CustomField>(this.baseUrl + 'customField');
    }

    getAvailableDates(guests, from, to) {
        return this.http.get<AvailableDate>(this.baseUrl + 'date',
            {
                params: {
                    guests,
                    from,
                    to
                }
            });
    }

    getAvailableTimes(guests, from, to) {
        return this.http.get<AvailableTime>(this.baseUrl + 'time',
            {
                params: {
                    guests,
                    from,
                    to
                }
            });
    }
}
