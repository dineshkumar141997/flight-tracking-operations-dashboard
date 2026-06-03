export type FlightStatus = 'Active' | 'Delayed' | 'Arrived';

export interface AirportRef {
  code: string;
  name: string;
  lat: number;
  lng: number;
}

export interface Flight {
  id: string;
  flightNumber: string;
  callsign: string;
  aircraftType: string;
  origin: AirportRef;
  destination: AirportRef;
  status: FlightStatus;
  estimatedDeparture: string;
  estimatedArrival: string;
  currentPosition: [number, number];
}
