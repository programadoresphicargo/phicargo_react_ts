import odooApi from "@/api/odoo-api";
import { Accordion, Progress } from "@heroui/react";
import { Dialog, DialogContent } from "@mui/material";
import { useEffect, useState } from "react";
import EstatusDetalle, { Step } from "./estado";

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

    {data.map((step) => {
     return (
      <>
       <Accordion variant="splitted">
        <EstatusDetalle step={step}></EstatusDetalle>
       </Accordion>
      </>
     );
    })}

   </DialogContent >
  </Dialog >
 );
}