import odooApi from "@/api/odoo-api";
import { tiempoTranscurrido } from "@/phicargo/funciones/tiempo";
import EstatusHistorialAgrupado from "@/phicargo/maniobras/reportes_estatus/estatus_agrupados";
import { Accordion, AccordionItem, Avatar, Card, CardBody, Progress } from "@heroui/react";
import { useEffect, useState } from "react";
import React from "react";
const { VITE_ODOO_API_URL } = import.meta.env;

type Step = {
 id_reporte: number;
 id_estatus: number;
 nombre_estatus: string;
 fecha_hora: string | null;
 imagen: string;
 comentarios_estatus: string;
};

export default function SeguimientoSimpleManiobra({
 id_viaje,
 tipo_maniobra,
}: {
 id_viaje: number;
 tipo_maniobra: string;
}) {

 const [data, setData] = useState<Step[]>([]);
 const [isLoading, setLoading] = useState<boolean>(false);
 const [id_reporte, setReporte] = useState<number | null>(null);

 const fetchData = async () => {
  try {
   setLoading(true);
   const response = await odooApi.get(
    `/maniobras/reportes_estatus_maniobras/seguimiento_simple/${id_viaje}?tipo_maniobra=${tipo_maniobra}`
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
 }, []);

 const [open, setOpen] = React.useState(false);

 const handleClickOpen = (id_registro: number) => {
  setOpen(true);
  setReporte(id_registro);
 };

 const handleClose = () => {
  setOpen(false);
 };

 return (
  <div>

   {id_reporte && (
    <EstatusHistorialAgrupado id_reporte={id_reporte} open={open} handleClose={handleClose}></EstatusHistorialAgrupado>
   )}

   <Accordion variant="splitted">
    <AccordionItem key="1" aria-label="Accordion 1" title={`Maniobra de ${tipo_maniobra}`}>

     {isLoading && (
      <Progress isIndeterminate size="sm" color="primary"></Progress>
     )}

     {data.map((step) => {
      return (
       <>
        <div className="mt-3">
         <Card isDisabled={step.fecha_hora ? false : true} isPressable fullWidth onPress={() => handleClickOpen(step.id_reporte)}>
          <CardBody>
           <div className="flex gap-5">
            <Avatar
             color={step.fecha_hora ? "success" : "default"}
             isBordered
             radius="full"
             size="md"
             src={VITE_ODOO_API_URL + `/assets/trafico/estatus_operativos/${step.imagen}`}
            />
            <div className="flex flex-col gap-1 items-start justify-center">
             <h4 className="text-small font-semibold leading-none text-default-600">{step.nombre_estatus} {step.comentarios_estatus}</h4>
             <h5 className="text-small tracking-tight text-default-400">
              {step.fecha_hora && (
               tiempoTranscurrido(step.fecha_hora)
              )}
             </h5>
            </div>
           </div>
          </CardBody>
         </Card>
        </div>
       </>
      );
     })}

    </AccordionItem>
   </Accordion>
  </div>
 );
}