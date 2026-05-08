import {
 useEffect,
 useState,
 forwardRef,
 useImperativeHandle
} from 'react';

import {
 Card,
 CardBody,
 CircularProgress
} from "@heroui/react";

import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';

type Cambio = {
 field_desc: string;
 old_value_char: string;
 new_value_char: string;
};

type HistorialItem = {
 message_id: number;
 body: string;
 create_date: string;
 cambios: Cambio[];
};

type Props = {
 id_pre_asignacion?: number;
};

export type HistorialCambioEquipoRef = {
 reload: () => void;
};

const HistorialCambioEquipo = forwardRef<
 HistorialCambioEquipoRef,
 Props
>(({ id_pre_asignacion }, ref) => {

 const [formData, setFormData] = useState<HistorialItem[]>([]);
 const [isLoading, setLoading] = useState(false);

 const getData = async () => {
  if (!id_pre_asignacion) return;

  try {
   setLoading(true);

   const res = await odooApi.get<HistorialItem[]>(
    `/mail_message/model_res_group/?model=preasignaciones.equipo&res_id=${id_pre_asignacion}`
   );

   setFormData(res.data);

  } catch (error: any) {

   toast.error(
    "Error: " +
    (error.response?.data?.message || error.message)
   );

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

   <h2 className="text-xl font-bold mb-4">
    Historial de cambios de equipo
   </h2>

   {isLoading && (
    <CircularProgress aria-label="Loading..." />
   )}

   {!isLoading && formData.length === 0 && (
    <p>No hay historial registrado.</p>
   )}

   {!isLoading && formData.length > 0 && (
    <div className="space-y-4">

     {formData.map((item) => (

      <Card key={item.message_id}>
       <CardBody>

        <p className="font-semibold">
         {item.body}
        </p>

        {item.cambios?.length > 0 ? (

         <div className="mt-3 space-y-2">

          {item.cambios.map((chg, idx) => (

           <div
            key={idx}
            className="border-l-4 border-blue-500 pl-3"
           >

            <p className="text-sm font-semibold">
             {chg.field_desc}
            </p>

            <p className="text-sm">
             <strong>Antes:</strong>{" "}
             <span className="text-red-600">
              {chg.old_value_char}
             </span>
            </p>

            <p className="text-sm">
             <strong>Ahora:</strong>{" "}
             <span className="text-green-600">
              {chg.new_value_char}
             </span>
            </p>

           </div>

          ))}

         </div>

        ) : null}

        <p className="text-xs text-gray-500 mt-3">
         Fecha:{" "}
         {new Date(item.create_date).toLocaleString()}
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