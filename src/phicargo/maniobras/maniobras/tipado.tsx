export type OptionFlota = {
 key: number;
 label: string;
 x_tipo_carga: string;
 x_modalidad: string;
 x_tipo_vehiculo?: string;
};

export type Flota = {
 id: number;
 name: string;
 x_modalidad: string;
 x_tipo_carga: string;
};