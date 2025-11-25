import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import {
 Card,
 CardBody,
} from "@heroui/react";
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';

const HistorialCambioEquipo = forwardRef(({ id_pre_asignacion }, ref) => {

 const [formData, setFormData] = useState([]);
 const [isLoading, setLoading] = useState(false);

 const getData = async () => {
  if (!id_pre_asignacion) return;

  try {
   setLoading(true);

   const res = await odooApi.get(
    `/mail_message/model_res_group/?model=preasignaciones.equipo&res_id=${id_pre_asignacion}`
   );

   setFormData(res.data);
  } catch (error) {
   toast.error("Error: " + (error.response?.data?.message || error.message));
  } finally {
   setLoading(false);
  }
 };

 useImperativeHandle(ref, () => ({
  reload: () => getData()
 }));

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
     {formData.map((item) => (
      <Card key={item.message_id}>
       <CardBody>
        {/* Mensaje principal */}
        <p className="font-semibold">{item.body}</p>

        {/* Lista de cambios */}
        {item.cambios && item.cambios.length > 0 ? (
         <div className="mt-3 space-y-2">
          {item.cambios.map((chg, idx) => (
           <div key={idx} className="border-l-4 border-blue-500 pl-3">
            <p className="text-sm font-semibold">{chg.field_desc}</p>

            <p className="text-sm">
             <strong>Antes:</strong>{" "}
             <span className="text-red-600">{chg.old_value_char}</span>
            </p>

            <p className="text-sm">
             <strong>Ahora:</strong>{" "}
             <span className="text-green-600">{chg.new_value_char}</span>
            </p>
           </div>
          ))}
         </div>
        ) : (
         <p className="text-sm text-gray-500 mt-2">
         </p>
        )}

        {/* Fecha */}
        <p className="text-xs text-gray-500 mt-3">
         Fecha: {new Date(item.create_date).toLocaleString()}
        </p>
       </CardBody>
      </Card>
     ))}
    </div>
   )}
  </div>
 );
});

export default HistorialCambioEquipo;
