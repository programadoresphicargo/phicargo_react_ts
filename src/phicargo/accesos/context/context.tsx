import {
 createContext,
 useContext
} from "react";

import {
 Empleado,
 Vehiculo,
 Visitante
} from "../types/types";

type AccesoContextType = {

 // =========================
 // UI
 // =========================

 disabledForm: boolean;

 setDisabledForm:
 React.Dispatch<
  React.SetStateAction<boolean>
 >;

 fileList: any[];

 setFileList:
 React.Dispatch<
  React.SetStateAction<any[]>
 >;

 // =========================
 // CATÁLOGOS
 // =========================

 visitantesDisponibles: Visitante[];

 setVisitantesDisponibles:
 React.Dispatch<
  React.SetStateAction<Visitante[]>
 >;

 empleadosDisponibles: Empleado[];

 setEmpleadosDisponibles:
 React.Dispatch<
  React.SetStateAction<Empleado[]>
 >;

 // =========================
 // VISITANTES
 // =========================

 visitantesOriginales: Visitante[];

 setVisitantesOriginales:
 React.Dispatch<
  React.SetStateAction<Visitante[]>
 >;

 visitantesActuales: Visitante[];

 setVisitantesActuales:
 React.Dispatch<
  React.SetStateAction<Visitante[]>
 >;

 AñadirVisitanteAcceso:
 (id_visitante: number) => void;

 EliminarVisitanteAcceso:
 (id_visitante: number) => void;

 // =========================
 // VEHÍCULOS
 // =========================

 vehiculosOriginales: Vehiculo[];

 setVehiculosOriginales:
 React.Dispatch<
  React.SetStateAction<Vehiculo[]>
 >;

 vehiculosActuales: Vehiculo[];

 setVehiculosActuales:
 React.Dispatch<
  React.SetStateAction<Vehiculo[]>
 >;

 AñadirVehiculo:
 (id_vehiculo: number) => Promise<void>;

 EliminarVehiculo:
 (id_vehiculo: number) => void;

 // =========================
 // EMPLEADOS
 // =========================

 empleadosOriginales: Empleado[];

 setEmpleadosOriginales:
 React.Dispatch<
  React.SetStateAction<Empleado[]>
 >;

 empleadosActuales: Empleado[];

 setEmpleadosActuales:
 React.Dispatch<
  React.SetStateAction<Empleado[]>
 >;

 AñadirEmpleadoAcceso:
 (id_empleado: number) => void;

 EliminarEmpleadoAcceso:
 (id_empleado: number) => void;
};

export const AccesoContext =
 createContext<AccesoContextType | null>(
  null
 );

export const useAcceso = () => {

 const context =
  useContext(AccesoContext);

 if (!context) {

  throw new Error(
   "useAcceso debe usarse dentro de AccesoProvider"
  );
 }

 return context;
};