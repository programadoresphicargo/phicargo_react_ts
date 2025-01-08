
export interface ShiftTravelInfoApi {
  id: number;
  name: string;
  date: string;
  end_date: string | null;
  route_name: string;
}

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
