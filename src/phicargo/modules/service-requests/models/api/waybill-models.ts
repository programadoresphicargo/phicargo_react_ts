export interface WaybillCategoryApi {
  id: number;
  name: string;
  description: string;
}

export interface WaybillTransportableProductApi {
  id: number;
  name: string;
  code: string | null;
  uom: string | null;
}

export interface RouteApi {
  id: number;
  name: string;
  distance: number | null;
  travel_time: number | null;
}

export interface WaybillItemApi {
  id: number;
  code: string;
  name: string;
}

export interface PartnerApi {
  id: number;
  name: string;
}

