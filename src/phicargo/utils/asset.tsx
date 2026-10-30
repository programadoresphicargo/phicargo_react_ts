
import { useEffect, useState } from "react";
import { CircularProgress } from "@heroui/react";
import { getAsset } from "./getAsset";

interface AssetImageProps {
 ruta: string;
 alt?: string;
 className?: string;
 fallback?: React.ReactNode;
}

export const AssetImage = ({
 ruta,
 alt = "",
 className,
 fallback,
}: AssetImageProps) => {
 const [src, setSrc] = useState<string | null>(null);
 const [cargando, setCargando] = useState(true);
 const [error, setError] = useState(false);

 useEffect(() => {
  let cancelado = false;
  let objectUrl: string | null = null;

  const cargarImagen = async () => {
   setSrc(null);
   setCargando(true);
   setError(false);

   try {
    const blob = await getAsset(ruta);

    if (!blob.type.startsWith("image/")) {
     throw new Error("El archivo recibido no es una imagen");
    }

    if (cancelado) return;

    objectUrl = URL.createObjectURL(blob);
    setSrc(objectUrl);
   } catch (e) {
    console.error("Error al cargar imagen:", e);

    if (!cancelado) {
     setError(true);
    }
   } finally {
    if (!cancelado) {
     setCargando(false);
    }
   }
  };

  cargarImagen();

  return () => {
   cancelado = true;

   if (objectUrl) {
    URL.revokeObjectURL(objectUrl);
   }
  };
 }, [ruta]);

 if (cargando) {
  return <CircularProgress size="sm" aria-label="Cargando imagen" />;
 }

 if (error || !src) {
  return fallback ?? (
   <div className="text-sm text-gray-400">
    No se pudo cargar la imagen
   </div>
  );
 }

 return (
  <img
   src={src}
   alt={alt}
   className={className}
   onError={() => setError(true)}
  />
 );
};
