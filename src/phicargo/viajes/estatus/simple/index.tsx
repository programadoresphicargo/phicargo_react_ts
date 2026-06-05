import odooApi from "@/api/odoo-api";
import { tiempoTranscurrido } from "@/phicargo/funciones/tiempo";
import { Accordion, AccordionItem, Avatar, Card, CardBody, Progress, Button } from "@heroui/react";
import { useEffect, useState } from "react";
import DetalleEstatusViaje from "./detalle_viaje";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import EstatusHistorialAgrupado from "../estatus_agrupados";
const { VITE_ODOO_API_URL } = import.meta.env;

type Step = {
 id_estatus: number;
 nombre_estatus: string;
 fecha_envio: string | null;
 imagen: string;
 estatus_intermedios: number[];
};

export default function SeguimientoSimpleViaje({
 id_viaje,
}: {
 id_viaje: number;
}) {

 const [data, setData] = useState<Step[]>([]);
 const [isLoading, setLoading] = useState<boolean>(false);
 const [id_estatus, setIDEstatus] = useState<number>(0);
 const [estatusSeleccionados, setEstatusSeleccionados] = useState<number[]>([]);

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
 const [openEstatus, setOpenEstatus] = useState(false);

 const handleClose = () => {
  setOpen(false);
  fetchData();
 };

 const handleClickOpen = (id_estatus: number) => {
  setOpen(true);
  setIDEstatus(id_estatus);
 };

 return (
  <div>
   <DetalleEstatusViaje open={open} handleClose={handleClose} id_viaje={id_viaje} id_estatus={id_estatus}></DetalleEstatusViaje>

   <Accordion variant="splitted">
    <AccordionItem
     key="1"
     aria-label="Accordion 1"
     title={<strong>VIAJE</strong>}
     startContent={
      <Avatar
       color={"danger"}
       isBordered
       radius="full"
       size="md"
       src={"https://static.vecteezy.com/system/resources/previews/017/398/595/original/blue-cargo-container-png.png"}
      />
     }>

     {isLoading && (
      <Progress isIndeterminate size="sm" color="primary"></Progress>
     )}

     <Button onPress={() => fetchData()} size="sm" color="success" radius="full" className="text-white">Recargar</Button>

     {data.map((step) => {
      return (
       <>

        {step.estatus_intermedios?.length > 0 && (
         <div className="mt-2">
          <Button
           radius="full"
           size="sm"
           variant="light"
           color="primary"
           onPress={() => {
            setEstatusSeleccionados(step.estatus_intermedios);
            setOpenEstatus(true);
           }}
          >
           +{step.estatus_intermedios.length} estatus
          </Button>
         </div>
        )}

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

   <Dialog
    open={openEstatus}
    onClose={() => setOpenEstatus(false)}
    fullWidth
    maxWidth="md"
   >
    <DialogTitle
     sx={{
      background: "linear-gradient(90deg, #002887 0%, #0059b3 100%)",
      color: "white",
      fontFamily: "Inter",
     }}
    >
     Estatus intermedios
    </DialogTitle>
    <DialogContent>
     <EstatusHistorialAgrupado id_reportes_agrupados={estatusSeleccionados} />
    </DialogContent>
   </Dialog>
  </div>
 );
}