export interface WaybillCategory {
  id: number;
  name: string;
  description: string;
}

export interface WaybillTransportableProduct {
  id: number;
  name: string;
  code: string | null;
  uom: string | null;
}

export interface WaybillServiceCreate {
  productId: number;
  weightEstimation: number;
  notes: string;
}

export interface Route {
  id: number;
  name: string;
  distance: number | null;
  travelTime: number | null;
}

export interface WaybillItem {
  id: number;
  code: string;
  name: string;
}

export interface Partner {
  id: number;
  name: string;
}