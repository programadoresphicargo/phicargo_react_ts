import { useEffect, useState } from "react";
import { getAsset } from "./getAsset";

export const useAsset = (ruta: string) => {
 const [src, setSrc] = useState<string>();

 useEffect(() => {
  let cancelado = false;
  let objectUrl: string | undefined;

  const cargar = async () => {
   setSrc(undefined);

   try {
    const blob = await getAsset(ruta);

    if (cancelado) return;

    objectUrl = URL.createObjectURL(blob);
    setSrc(objectUrl);
   } catch (error) {
    console.error("Error al cargar imagen:", error);
   }
  };

  cargar();

  return () => {
   cancelado = true;

   if (objectUrl) {
    URL.revokeObjectURL(objectUrl);
   }
  };
 }, [ruta]);

 return src;
};