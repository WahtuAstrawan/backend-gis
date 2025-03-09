export class TripResponse {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
}

export class CreateTripRequest {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
}

export class UpdateTripRequest {
  id: number;
  title: string;
  description?: string;
  latitude?: number;
  longitude?: number;
}
