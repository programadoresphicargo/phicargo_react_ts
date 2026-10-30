
export type EstadoElemento = 1 | 0 | null;

export interface Vehiculo {
 id: number;
 name2: string;
 fleet_type: "tractor" | "trailer" | "dolly" | "other";
}

export interface ElementoChecklist {
 id_elemento: number;
 nombre_elemento: string;
 tipo_equipo: string;
}

export interface ChecklistRespuesta {
 id_elemento: number;
 estado: EstadoElemento;
 observaciones: string;
}

export type ResultadoChecklist =
 | "correcto"
 | "danoMenor"
 | "danoMayor";

export interface ChecklistPatioData {
 vehicle_id?: number;
 mileage?: string | number;
 user_pin?: string;
 comments?: string;
 resultado?: ResultadoChecklist;
 checklist?: ChecklistRespuesta[];
}

export interface ChecklistPayload {
 id_equipo: number;
 vehicle_name: string;
 mileage: string | null;
 user_pin: string;
 tipo_checklist: "diario";
 inspection_date: string;
 resultado: ResultadoChecklist;
 comments: string;
 checklist: ChecklistRespuesta[];
}
