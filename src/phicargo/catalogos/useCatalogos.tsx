import { useEffect, useState } from "react";
import odooApi from "@/api/odoo-api";
import { DriverBaseApi } from "@/modules/drivers/models/api";
import { VehicleBaseApi } from "@/modules/vehicles/models/api";

export const useCatalogos = () => {

 type FlotaOption = {
  key: number,
  label: string;
  x_tipo_carga: string;
  x_modalidad: string;
 }

 type DriverOption = {
  key: number,
  label: string;
 }

 const [drivers, setDrivers] = useState<DriverOption[]>([]);
 const [tractores, setTractores] = useState<FlotaOption[]>([]);
 const [trailers, setTrailers] = useState<FlotaOption[]>([]);
 const [dollies, setDollies] = useState<FlotaOption[]>([]);
 const [motogeneradores, setMotogeneradores] = useState<FlotaOption[]>([]);
 const [isLoading, setLoading] = useState(false);

 const getFlotaByTipo = async (tipo: string) => {
  const response = await odooApi.get<VehicleBaseApi[]>(`/vehicles/fleet_type/${tipo}`);
  return response.data.map(item => ({
   key: item.id,
   label: item.name2,
   x_tipo_carga: item.x_tipo_carga ?? "",
   x_modalidad: item.x_modalidad ?? ""
  }));
 };

 const getDrivers = async () => {
  const response = await odooApi.get<DriverBaseApi[]>('/drivers/');
  return response.data.map(item => ({
   key: Number(item.id),
   label: item.name,
  }));
 };

 useEffect(() => {
  const cargarTodo = async () => {
   setLoading(true);

   try {
    const [
     tractoresData,
     trailersData,
     dolliesData,
     motogeneradoresData,
     driversData
    ] = await Promise.all([
     getFlotaByTipo("tractor"),
     getFlotaByTipo("trailer"),
     getFlotaByTipo("dolly"),
     getFlotaByTipo("other"),
     getDrivers()
    ]);

    setTractores(tractoresData);
    setTrailers(trailersData);
    setDollies(dolliesData);
    setMotogeneradores(motogeneradoresData);
    setDrivers(driversData);

   } catch (error) {
    console.error(error);
   } finally {
    setLoading(false);
   }
  };

  cargarTodo();
 }, []);

 return {
  drivers,
  tractores,
  trailers,
  dollies,
  motogeneradores,
  isLoading
 };
};