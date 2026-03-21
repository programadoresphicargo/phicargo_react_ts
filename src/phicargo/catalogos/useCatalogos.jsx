import { useEffect, useState } from "react";
import odooApi from "@/api/odoo-api";

export const useCatalogos = () => {

 const [drivers, setDrivers] = useState([]);
 const [tractores, setTractores] = useState([]);
 const [trailers, setTrailers] = useState([]);
 const [dollies, setDollies] = useState([]);
 const [motogeneradores, setMotogeneradores] = useState([]);
 const [isLoading, setLoading] = useState(false);

 const getFlotaByTipo = async (tipo) => {
  const response = await odooApi.get(`/vehicles/fleet_type/${tipo}`);
  return response.data.map(item => ({
   key: item.id,
   label: item.name,
   x_tipo_carga: item.x_tipo_carga,
   x_modalidad: item.x_modalidad
  }));
 };

 const getDrivers = async () => {
  const response = await odooApi.get('/drivers/');
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