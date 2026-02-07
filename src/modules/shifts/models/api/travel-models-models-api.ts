
export interface ShiftTravelInfoApi {
  id: number;
  name: string;
  date: string;
  end_date: string | null;
  route_name: string;
}

export interface TravelApi {
  id: number;
  name: string;
  x_status_viaje: string;
  operative_status: string | null;
  branch: string;
  driver_id: number;
  driver: string;
  vehicle_id: number;
  vehicle: string;
  latitude: number | null;
  longitude: number | null;
  recorded_at: string | null;
  distance_to_branch: number | null;
}
