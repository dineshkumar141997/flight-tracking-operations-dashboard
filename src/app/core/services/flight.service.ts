import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { MOCK_FLIGHTS } from '../data/mock-flights';
import { Flight } from '../models/flight.model';

@Injectable({ providedIn: 'root' })
export class FlightService {
  getFlights(): Observable<Flight[]> {
    return of(MOCK_FLIGHTS).pipe(delay(200));
  }
}
