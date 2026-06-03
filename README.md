# Flight Tracking & Operations Dashboard

A responsive aviation operations dashboard built with Angular and Leaflet for monitoring flights, routes, and operational KPIs.

## Tech Stack

- Angular 16+ (project currently uses Angular 21)
- TypeScript
- Reactive Forms
- Angular Routing
- Services + RxJS
- Leaflet Maps

## Features Implemented

### 1) Interactive Flight Map
- Leaflet map with OpenStreetMap tiles
- 20 mocked flight markers
- Marker popup includes:
  - Flight Number
  - Callsign
  - Origin
  - Destination
  - Status

### 2) Flight Route Visualization
- Select a flight from marker or side list
- Draws route polyline between origin and destination
- Centers map on selected flight
- Fits map bounds to selected route

### 3) Flight Details Panel
- Flight Number
- Callsign
- Aircraft Type
- Origin
- Destination
- Current Status
- Estimated Departure Time
- Estimated Arrival Time

### 4) Operations Dashboard KPIs
- Total Flights
- Active Flights
- Delayed Flights
- Arrived Flights

### 5) Search & Filters
- Search by callsign (also supports flight number)
- Filter by status
- Filter by origin airport
- Filter by destination airport

## Project Structure

- `src/app/features/dashboard/` - Main operations dashboard component
- `src/app/core/models/flight.model.ts` - Flight domain model
- `src/app/core/data/mock-flights.ts` - Mock flight dataset
- `src/app/core/services/flight.service.ts` - Flight data service (RxJS based)

## Setup Instructions

```bash
npm install
npm start
```

Open: `http://localhost:4200`

## Build

```bash
npm run build
```

## Test

```bash
npm test
```

## Design Notes (Brief)

- The map is the visual priority and occupies the largest area in desktop view.
- Filters, flight list, and details are grouped in a professional right-side operations panel.
- KPI cards provide quick situational awareness at the top.
- Color coding improves status scanning:
  - Green: Active
  - Amber: Delayed
  - Gray: Arrived
- Responsive behavior supports desktop and tablet:
  - Desktop: map + side panel
  - Tablet: stacked map and panel sections
- Accessibility-conscious form labels and clear information hierarchy are used.
