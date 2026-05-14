import { Dayjs } from "dayjs";

export type Descuento = {
 id_descuento: number | null;
 id_solicitante: number | null;
 id_empleado: number | null;
 periodicidad: string;
 motivo: string;
 importe: number | null;
 comentarios: string;
 monto: number | null;
 fecha: Dayjs | null;
 estado: string;
}