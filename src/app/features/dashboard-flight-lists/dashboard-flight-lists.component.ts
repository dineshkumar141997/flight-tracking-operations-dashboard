import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { Flight } from '../../core/models/flight.model';

@Component({
  selector: 'app-dashboard-flight-lists',
  imports: [CommonModule],
  templateUrl: './dashboard-flight-lists.component.html',
  styleUrl: './dashboard-flight-lists.component.scss'
})
export class DashboardFlightListsComponent {
  readonly flights = input<Flight[]>([]);
  readonly selectedFlightId = input<string | null>(null);
  readonly selectFlight = output<Flight>();

  onSelect(flight: Flight): void {
    this.selectFlight.emit(flight);
  }
}
