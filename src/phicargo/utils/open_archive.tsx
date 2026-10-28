
import axios from "axios";
import toast from "react-hot-toast";
import odooApi from "@/api/odoo-api";

export const OpenArchive = async (url: string) => {
 try {
  toast.loading("Generando archivo, espere...", { id: "open-archive" });

  const response = await odooApi.get(url, {
   responseType: "blob",
  });

  const pdfUrl = URL.createObjectURL(
   new Blob([response.data], { type: "application/pdf" })
  );

  window.open(pdfUrl, "_blank", "noopener,noreferrer");
  setTimeout(() => URL.revokeObjectURL(pdfUrl), 60_000);

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
