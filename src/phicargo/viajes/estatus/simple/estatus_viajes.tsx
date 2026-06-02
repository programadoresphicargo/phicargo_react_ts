import odooApi from "@/api/odoo-api";
import { tiempoTranscurrido } from "@/phicargo/funciones/tiempo";
import { Accordion, AccordionItem, Avatar, Card, CardBody, Progress } from "@heroui/react";
import { useEffect, useState } from "react";
import DetalleEstatusViaje from "./detalle_viaje";
const { VITE_ODOO_API_URL } = import.meta.env;

type Step = {
 id_estatus: number;
 nombre_estatus: string;
 fecha_envio: string | null;
 imagen: string;
};

export default function SeguimientoSimpleViaje({
 id_viaje,
}: {
 id_viaje: number;
}) {

 const [data, setData] = useState<Step[]>([]);
 const [isLoading, setLoading] = useState<boolean>(false);
 const [id_estatus, setIDEstatus] = useState<number>(0);

 const fetchData = async () => {
  try {
   setLoading(true);
   const response = await odooApi.get(
    '/tms_travel/reportes_estatus_viajes/seguimiento_simple/' + id_viaje
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

 const [open, setOpen] = useState(false);

 const handleClose = () => {
  setOpen(false);
 };

 const handleClickOpen = (id_estatus: number) => {
  setOpen(true);
  setIDEstatus(id_estatus);
 };

 return (
  <div>
   <DetalleEstatusViaje open={open} handleClose={handleClose} id_viaje={id_viaje} id_estatus={id_estatus}></DetalleEstatusViaje>

   <Accordion variant="splitted">
    <AccordionItem key="1" aria-label="Accordion 1" title={`Viaje`}>

     {isLoading && (
      <Progress isIndeterminate size="sm" color="primary"></Progress>
     )}

     {data.map((step) => {
      return (
       <>
        <div className="mt-3">
         <Card isDisabled={step.fecha_envio ? false : true} isPressable fullWidth onPress={() => handleClickOpen(step.id_estatus)}>
          <CardBody>
           <div className="flex gap-5">
            <Avatar
             color={step.fecha_envio ? "success" : "default"}
             isBordered
             radius="full"
             size="md"
             src={VITE_ODOO_API_URL + `/assets/trafico/estatus_operativos/${step.imagen}`}
            />
            <div className="flex flex-col gap-1 items-start justify-center">
             <h4 className="text-small font-semibold leading-none text-default-600">{step.nombre_estatus}</h4>
             <h5 className="text-small tracking-tight text-default-400">
              {step.fecha_envio && (
               tiempoTranscurrido(step.fecha_envio)
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