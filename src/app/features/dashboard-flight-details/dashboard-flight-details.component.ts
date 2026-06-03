import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { Flight } from '../../core/models/flight.model';

@Component({
  selector: 'app-dashboard-flight-details',
  imports: [CommonModule],
  templateUrl: './dashboard-flight-details.component.html',
  styleUrl: './dashboard-flight-details.component.scss'
})
export class DashboardFlightDetailsComponent {
  readonly flight = input<Flight | null>(null);
  readonly formatTime = input.required<(isoDate: string) => string>();
}
