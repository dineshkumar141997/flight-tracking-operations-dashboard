import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FlightStatus } from '../../core/models/flight.model';

@Component({
  selector: 'app-dashboard-search-and-filters',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard-search-and-filters.component.html',
  styleUrl: './dashboard-search-and-filters.component.scss'
})
export class DashboardSearchAndFiltersComponent {
  readonly filterForm = input.required<FormGroup>();
  readonly statusOptions = input<FlightStatus[]>([]);
  readonly originOptions = input<string[]>([]);
  readonly destinationOptions = input<string[]>([]);
}
