
import { useCallback, useEffect, useMemo, useState } from "react";
import {
 Button,
 Card,
 CardBody,
 CardHeader,
 Divider,
 Progress,
} from "@heroui/react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";
import "yet-another-react-lightbox/styles.css";
import "react-photo-album/styles.css";
import "yet-another-react-lightbox/styles.css";
import odooApi from "@/api/odoo-api";
import { toast } from "react-toastify";

type Images = {
 id_onedrive: string;
 url_download: string;
};

type Props = {
 id_viaje: number;
 tipo_checklist: string;
};

function EvidenciasChecklistViaje({
 id_viaje,
 tipo_checklist,
}: Props) {
 const [isLoading, setLoading] = useState(false);
 const [images, setImages] = useState<Images[]>([]);
 const [lightboxIndex, setLightboxIndex] = useState(-1);

 const fetchData = useCallback(async () => {
  try {
   setLoading(true);

   const response = await odooApi.get(
    `/checklist/evidencias/?id_viaje=${id_viaje}&tipo_checklist=${encodeURIComponent(tipo_checklist)}`
   );

   setImages(response.data ?? []);
  } catch (error) {
   console.error("Error al obtener las evidencias:", error);
   toast.error("No se pudieron cargar las evidencias.");
  } finally {
   setLoading(false);
  }
 }, [id_viaje, tipo_checklist]);

 useEffect(() => {
  void fetchData();
 }, [fetchData]);

 const photos = useMemo(
  () =>
   images.map((item) => ({
    src: item.url_download,
    key: item.id_onedrive,
    alt: `Evidencia ${item.id_onedrive}`,
    // Dimensiones de referencia para organizar la galería.
    width: 4,
    height: 3,
   })),
  [images]
 );

 const slides = useMemo(
  () =>
   images.map((item) => ({
    src: item.url_download,
    alt: `Evidencia ${item.id_onedrive}`,
   })),
  [images]
 );

 if (isLoading && images.length === 0) {
  return (
   <Progress
    size="sm"
    isIndeterminate
    aria-label="Cargando evidencias..."
    className="mt-2"
   />
  );
 }

 if (!isLoading && images.length === 0) {
  return null;
 }

 return (
  <>
   <Card className="mt-5 border border-default-200 shadow-sm">
    <CardHeader className="flex items-center justify-between gap-3 px-4 py-3">
     <div className="min-w-0">
      <h3 className="font-semibold text-foreground">
       Evidencias del checklist
      </h3>

      <p className="text-sm text-default-500">
       {tipo_checklist} · {images.length}{" "}
       {images.length === 1 ? "fotografía" : "fotografías"}
      </p>
     </div>

     <Button
      onPress={() => void fetchData()}
      isLoading={isLoading}
      isDisabled={isLoading}
      color="success"
      size="sm"
      radius="md"
      className="shrink-0 text-white"
     >
      Refrescar
     </Button>
    </CardHeader>

    <Divider />

    <CardBody className="p-3 sm:p-4">
     <PhotoAlbum
      layout="rows"
      photos={photos}
      targetRowHeight={170}
      spacing={12}
      onClick={({ index }) => setLightboxIndex(index)}
      componentsProps={{
       image: {
        loading: "lazy",
        style: {
         borderRadius: "10px",
         objectFit: "contain",
         backgroundColor: "#f4f4f5",
         cursor: "zoom-in",
        },
       },
      }}
     />

     {isLoading && (
      <Progress
       size="sm"
       isIndeterminate
       aria-label="Actualizando evidencias..."
       className="mt-3"
      />
     )}
    </CardBody>
   </Card>

   <Lightbox
    open={lightboxIndex >= 0}
    close={() => setLightboxIndex(-1)}
    index={lightboxIndex}
    slides={slides}
    plugins={[Download]}
    carousel={{
     imageFit: "cover",
     preload: 2,
    }}
    controller={{
     closeOnBackdropClick: true,
     closeOnEscape: true,
    }}
    styles={{
     container: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
     },
    }}
   />
  </>
 );
}

export default EvidenciasChecklistViaje;
