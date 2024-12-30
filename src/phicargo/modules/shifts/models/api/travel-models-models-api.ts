export interface TravelApi {
  id: number;
  branch: string;
  x_status_viaje: string;
  vehicle: string;
  driver: string;
  latitude: number | null;
  longitude: number | null;
  distance_to_branch: number;
  recorded_at: string;
}
