import { Dayjs } from "dayjs";

export type MovInterno = {
 id: number | null;
 driver_id: number | null;
 vehicle_id: number | null;
 comentarios: string;
 date: Dayjs | null;
 type: string;
 trailer1_id: number | null;
 trailer2_id: number | null;
 dolly_id: number | null;
}