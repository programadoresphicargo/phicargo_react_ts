
import axios from "axios";
import toast from "react-hot-toast";
import odooApi from "@/api/odoo-api";

export const OpenArchive = async (url: string) => {
 try {
  toast.loading("Generando archivo, espere...", { id: "open-archive" });

  const response = await odooApi.get(url, {
   responseType: "blob",
  });

  const blob = new Blob([response.data], {
   type: response.headers["content-type"] || "application/octet-stream",
  });

  const fileUrl = URL.createObjectURL(blob);
  window.open(fileUrl, "_blank", "noopener,noreferrer");

  setTimeout(() => URL.revokeObjectURL(fileUrl), 60_000);

  toast.dismiss("open-archive");
 } catch (error) {
  toast.dismiss("open-archive");

  if (axios.isAxiosError(error)) {
   const data = error.response?.data;
   let detail = error.message;

   if (data instanceof Blob) {
    try {
     detail = JSON.parse(await data.text()).detail ?? detail;
    } catch { }
   }

   toast.error(
    typeof detail === "string" ? detail : "Error al abrir el archivo"
   );
  } else {
   toast.error("Error al abrir el archivo");
  }
 }
};

export const getAsset = async (ruta: string): Promise<Blob> => {
 const response = await odooApi.get(
  `/assets/${ruta}`,
  {
   responseType: "blob",
  }
 );

 return response.data;
};