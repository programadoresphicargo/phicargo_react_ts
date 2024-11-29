export interface TravelSimple {
  id: number;
  name: string;
  status: string;
}

export interface TravelSimpleApi {
  id: number;
  name: string;
  x_status_viaje: string | null;
}
