export type Empresa = {
 id_empresa: number;
 empresa: string;
}

export type Vehiculo = {
 id_vehiculo?: number;
 marca: string;
 modelo: string;
 placas: string;
 tipo_vehiculo: string;
 color: string;
 contenedor1: string;
 contenedor2: string;
 utilitario: boolean;
}

export type Visitante =
 {
  id_visitante: number,
  nombre_visitante: string;
 }

export type Empleado =
 {
  id_empleado: number,
  empleado: string
  jefe: string;
  puesto: string;
 }