export interface DriverBonusMonthApi {
  id_periodo: number;
  month: number;
  year: number;
  fecha_creacion: string;
  estado: string;
  fecha_cierre: string;
  nombre_usuario_creacion: string,
  nombre_usuario_cierre: string
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

