import { useEffect, useState } from "react";
import {
 Button,
 Card,
 CardBody,
 CardHeader,
 Divider,
 Image,
} from "@heroui/react";
import { Progress } from "@heroui/react";
import odooApi from "@/api/odoo-api";

type Images = {
 id_onedrive: string;
 url_download: string;
};

function EvidenciasChecklistViaje({ id_viaje, tipo_checklist }: { id_viaje: number, tipo_checklist: string }) {
 const [isLoading, setLoading] = useState(false);
 const [images, setData] = useState<Images[]>([]);

 useEffect(() => {
  fetchData();
 }, [id_viaje]);

 const fetchData = async () => {
  try {
   setLoading(true);

   const response = await odooApi.get(
    `/tms_travel/checklist/evidencias/?id_viaje=${id_viaje}&tipo_checklist=${tipo_checklist}`
   );

   setData(response.data);
  } catch (error) {
   console.error("Error al obtener los datos:", error);
  } finally {
   setLoading(false);
  }
 };

 if (isLoading) {
  return (
   <Progress
    size="sm"
    isIndeterminate
    aria-label="Cargando evidencias..."
    className="mt-2"
   />
  );
 }

 if (images.length === 0) {
  return null;
 }

 return (
  <Card className="mt-5">
   <CardHeader className="flex items-center justify-between">
    <span className="font-semibold">Evidencias checklist {tipo_checklist}</span>

    <Button
     onPress={fetchData}
     color="success"
     size="sm"
     radius="md"
     className="text-white"
    >
     Refrescar
    </Button>
   </CardHeader>

   <Divider />

   <CardBody>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
     {images.map((item) => (
      <a
       key={item.id_onedrive}
       href={item.url_download}
       target="_blank"
       rel="noopener noreferrer"
       className="group block"
      >
       <div className="flex justify-center">
        <div className="w-fit overflow-hidden rounded-lg border bg-gray-50">
         <Image
          src={item.url_download}
          alt={`Evidencia ${item.id_onedrive}`}
          className="h-40 w-auto object-contain"
          radius="none"
         />
        </div>
       </div>
      </a>
     ))}
    </div>
   </CardBody>
  </Card>
 );
}

export default EvidenciasChecklistViaje;