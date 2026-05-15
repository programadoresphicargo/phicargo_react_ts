import { Dayjs } from "dayjs";

export type Celular = {
 id_celular: number,
 activo: true,
 estado: string;
 id_empresa: number,
 marca: string,
 modelo: string,
 imei: number,
 correo: string,
 passwoord: string,
 fecha_compra: Dayjs,
 comentarios: string,
}