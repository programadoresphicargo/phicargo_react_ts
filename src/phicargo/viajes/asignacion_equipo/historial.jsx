import React, { useEffect, useState } from 'react';
import {
 Modal,
 ModalContent,
 ModalHeader,
 ModalBody,
 ModalFooter,
 Button,
 Card,
 CardBody,
} from "@heroui/react";
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import SelectFlota from '@/phicargo/maniobras/maniobras/selects_flota';

const HistorialCambioEquipo = ({ id_pre_asignacion }) => {

 const [formData, setFormData] = useState([]);
 const [isLoading, setLoading] = useState(false);

 const getData = async () => {
  if (!id_pre_asignacion) return;

  try {
   setLoading(true);

   const res = await odooApi.get(
    `/mail_message/model_res/?model=preasignaciones.equipo&res_id=${id_pre_asignacion}`
   );

   setFormData(res.data); // Debe ser un array
  } catch (error) {
   toast.error("Error: " + (error.response?.data?.message || error.message));
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  getData();
 }, [id_pre_asignacion]);

 return (
  <div className="p-4">
   <h2 className="text-xl font-bold mb-4">Historial de cambios de equipo</h2>

   {isLoading && <p>Cargando historial...</p>}

   {!isLoading && formData.length === 0 && (
    <p>No hay historial registrado.</p>
   )}

   {!isLoading && formData.length > 0 && (
    <div className="space-y-4">
     {formData.map((item, index) => (
      <Card>
       <CardBody>
        <p className="font-semibold">{item.body}</p>

        <p className="text-sm mt-2">
         <strong>{item.field_desc}</strong>
        </p>

        <p className="text-sm">
         Antes: <span className="text-red-600">{item.old_value_char}</span>
        </p>

        <p className="text-sm">
         Ahora: <span className="text-green-600">{item.new_value_char}</span>
        </p>

        <p className="text-xs text-gray-500 mt-2">
         Fecha: {new Date(item.create_date).toLocaleString()}
        </p>
       </CardBody>
      </Card>
     ))}
    </div>
   )}
  </div>
 );
};

export default HistorialCambioEquipo;
