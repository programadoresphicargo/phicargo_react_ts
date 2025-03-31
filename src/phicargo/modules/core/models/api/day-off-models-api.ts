export interface DayOffBaseApi {
  date_off: string;
  type: string;
  description: string;
}

export interface DayOffApi extends DayOffBaseApi {
  id: string;
}

export type DayOffCreateApi = DayOffBaseApi & {
  store_id: number | null;
};

