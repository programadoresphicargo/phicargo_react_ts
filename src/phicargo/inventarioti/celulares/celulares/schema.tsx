import { Dayjs } from "dayjs";

export type Celular = {
 id_celular: number,
 activo: true,
 estado: string;
 id_empresa: number | null,
 marca: string,
 modelo: string,
 imei: number,
 correo: string,
 passwoord: string,
 fecha_compra: Dayjs,
 comentarios: string,
}

export type BajaCelularData = {
 tipo: string;
 motivo_baja: string;
 comentarios_baja: string;
 empleado_baja: number | null;
}