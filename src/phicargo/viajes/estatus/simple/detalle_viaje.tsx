import odooApi from "@/api/odoo-api";
import { Accordion, AccordionItem, Avatar, Chip, Progress } from "@heroui/react";
import { Dialog, DialogContent } from "@mui/material";
import { useEffect, useState } from "react";
import EstatusDetalle, { Step } from "./estado";
import { tiempoTranscurrido } from "@/phicargo/funciones/tiempo";
import { getBadgeClass } from "../badgeClass";
const { VITE_ODOO_API_URL } = import.meta.env;

export default function DetalleEstatusViaje({
 id_viaje,
 id_estatus,
 open,
 handleClose
}: {
 id_viaje: number;
 id_estatus: number;
 open: boolean,
 handleClose: () => void
}) {

 const [data, setData] = useState<Step[]>([]);
 const [isLoading, setLoading] = useState<boolean>(false);

 const fetchData = async () => {
  try {
   setLoading(true);
   const response = await odooApi.get(
    '/tms_travel/reportes_estatus_viajes/id_estatus/',
    {
     params: {
      id_viaje: id_viaje,
      id_estatus: id_estatus,
     },
    }
   );

   setData(response.data);
   setLoading(false);
  } catch (error) {
   console.error(error);
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  fetchData();
 }, [open]);

 return (
  <Dialog
   open={open}
   keepMounted
   onClose={handleClose}
   aria-describedby="alert-dialog-slide-description"
   role="alertdialog"
   fullWidth
   maxWidth="lg"
  >
   <DialogContent>

    {isLoading && (
     <Progress isIndeterminate size="sm" color="primary"></Progress>
    )}

    <Accordion>
     {data.map((step, index) => {
      return (
       <AccordionItem
        variant="splitted"
        key={step.id_reporte ?? index}
        aria-label={`Paso ${index + 1}`}
        title={
         <>
          <div className="d-flex">
           <div>{step.nombre_estatus}</div>
           {step.id_reenvio !== null && (
            <div className="ml-auto">
             <Chip className="text-white" color='success'><i className="bi bi-check2"></i> Reenviado R-{step.id_reenvio}</Chip>
            </div>
           )}
          </div>
         </>
        }
        startContent={
         <Avatar
          isBordered
          color={`${getBadgeClass(step.tipo_registrante)}`}
          src={VITE_ODOO_API_URL + `/assets/trafico/estatus_operativos/${step.imagen}`}
         />
        }
        subtitle={step.fecha_envio ? tiempoTranscurrido(step.fecha_envio) : "Pendiente"}
       >
        <EstatusDetalle step={step}></EstatusDetalle>
       </AccordionItem>
      );
     })}
    </Accordion>

   </DialogContent >
  </Dialog >
 );
}