import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as L from 'leaflet';
import { startWith } from 'rxjs';

import { Flight, FlightStatus } from '../../core/models/flight.model';
import { FlightService } from '../../core/services/flight.service';
import { DashboardCardComponent } from '../dashboard-card/dashboard-card.component';
import { DashboardFlightDetailsComponent } from '../dashboard-flight-details/dashboard-flight-details.component';
import { DashboardFlightListsComponent } from '../dashboard-flight-lists/dashboard-flight-lists.component';
import { DashboardSearchAndFiltersComponent } from '../dashboard-search-and-filters/dashboard-search-and-filters.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardCardComponent,
    DashboardFlightDetailsComponent,
    DashboardFlightListsComponent,
    DashboardSearchAndFiltersComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly flightService = inject(FlightService);
  private readonly destroyRef = inject(DestroyRef);

  readonly flights = signal<Flight[]>([]);
  readonly filteredFlights = signal<Flight[]>([]);
  readonly selectedFlight = signal<Flight | null>(null);

  readonly totalFlights = computed(() => this.flights().length);
  readonly activeFlights = computed(
    () => this.flights().filter((f) => f.status === 'Active').length
  );
  readonly delayedFlights = computed(
    () => this.flights().filter((f) => f.status === 'Delayed').length
  );
  readonly arrivedFlights = computed(
    () => this.flights().filter((f) => f.status === 'Arrived').length
  );

  readonly statusOptions: FlightStatus[] = ['Active', 'Delayed', 'Arrived'];
  readonly originOptions = signal<string[]>([]);
  readonly destinationOptions = signal<string[]>([]);

  readonly filterForm = this.fb.nonNullable.group({
    search: [''],
    status: ['all'],
    origin: ['all'],
    destination: ['all']
  });

  private map: L.Map | null = null;
  private mapReady = false;
  private markersLayer = L.layerGroup();
  private routeLayer: L.Polyline | null = null;
  private markerByFlightId = new Map<string, L.CircleMarker>();

  ngOnInit(): void {
    this.flightService
      .getFlights()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((flights) => {
        this.flights.set(flights);
        this.buildFilterOptions();
        this.applyFilters();
      });

    this.filterForm.valueChanges
      .pipe(
        startWith(this.filterForm.getRawValue()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.applyFilters();
      });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  onSelectFlight(flight: Flight): void {
    this.selectedFlight.set(flight);
    this.drawSelectedRoute();

    const marker = this.markerByFlightId.get(flight.id);
    marker?.openPopup();

    this.map?.setView(flight.currentPosition, 5, { animate: true });
  }

  formatTime(isoDate: string): string {
    return new Date(isoDate).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private initMap(): void {
    this.map = L.map('flight-map', {
      zoomControl: true,
      scrollWheelZoom: true
    }).setView([22.5, 80.9], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.markersLayer.addTo(this.map);
    this.mapReady = true;
    this.renderMarkers();
  }

  private buildFilterOptions(): void {
    this.originOptions.set(
      [...new Set(this.flights().map((f) => f.origin.code))].sort()
    );
    this.destinationOptions.set(
      [...new Set(this.flights().map((f) => f.destination.code))].sort()
    );
  }

  private applyFilters(): void {
    const allFlights = this.flights();
    if (allFlights.length === 0) {
      return;
    }

    const { search, status, origin, destination } = this.filterForm.getRawValue();
    const query = search.trim().toLowerCase();

    const filtered = allFlights.filter((flight) => {
      const matchesSearch =
        !query ||
        flight.callsign.toLowerCase().includes(query) ||
        flight.flightNumber.toLowerCase().includes(query);
      const matchesStatus = status === 'all' || flight.status === status;
      const matchesOrigin = origin === 'all' || flight.origin.code === origin;
      const matchesDestination =
        destination === 'all' || flight.destination.code === destination;

      return matchesSearch && matchesStatus && matchesOrigin && matchesDestination;
    });

    this.filteredFlights.set(filtered);

    const selected = this.selectedFlight();
    if (selected && !filtered.some((flight) => flight.id === selected.id)) {
      this.selectedFlight.set(null);
      this.clearRoute();
    }

    this.renderMarkers();
  }

  private renderMarkers(): void {
    if (!this.mapReady || !this.map) {
      return;
    }

    this.markersLayer.clearLayers();
    this.markerByFlightId.clear();

    this.filteredFlights().forEach((flight) => {
      const marker = L.circleMarker(flight.currentPosition, {
        radius: 7,
        color: this.statusColor(flight.status),
        weight: 2,
        fillColor: this.statusColor(flight.status),
        fillOpacity: 0.8
      });

      marker
        .bindPopup(
          `
          <strong>${flight.flightNumber}</strong><br/>
          Callsign: ${flight.callsign}<br/>
          ${flight.origin.code} -> ${flight.destination.code}<br/>
          Status: ${flight.status}
          `
        )
        .on('click', () => this.onSelectFlight(flight));

      marker.addTo(this.markersLayer);
      this.markerByFlightId.set(flight.id, marker);
    });
  }

  private drawSelectedRoute(): void {
    this.clearRoute();
    const selected = this.selectedFlight();
    if (!selected || !this.map) {
      return;
    }

    this.routeLayer = L.polyline(
      [
        [selected.origin.lat, selected.origin.lng],
        [selected.destination.lat, selected.destination.lng]
      ],
      {
        color: '#38bdf8',
        weight: 4,
        opacity: 0.9,
        dashArray: '8, 8'
      }
    ).addTo(this.map);

    this.map.fitBounds(this.routeLayer.getBounds(), { padding: [48, 48], maxZoom: 6 });
  }

  private clearRoute(): void {
    if (this.routeLayer && this.map) {
      this.map.removeLayer(this.routeLayer);
      this.routeLayer = null;
    }
  }

  private statusColor(status: FlightStatus): string {
    if (status === 'Active') return '#22c55e';
    if (status === 'Delayed') return '#f59e0b';
    return '#94a3b8';
  }

}
