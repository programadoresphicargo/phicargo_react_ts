export interface DriverBonusMonthApi {
  month: number;
  year: number;
}

interface DriverBonusBaseApi {
  calificacion: number | null;
  excelencia: number | null;
  productividad: number | null;
  operacion: number | null;
  seguridad_vial: number | null;
  cuidado_unidad: number | null;
  rendimiento: number | null;
}

export interface DriverBonusApi extends DriverBonusBaseApi {
  id_bono: number;
  driver: string;
  mes: number;
  anio: number;
  km_recorridos: number;
  fecha_creacion: string | null;
}

export type DriverBonusUpdateApi = DriverBonusBaseApi & {
  id_bono: number;
};

