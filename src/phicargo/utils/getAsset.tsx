import odooApi from "@/api/odoo-api";

export const getAsset = async (ruta: string): Promise<Blob> => {
 const rutaCodificada = ruta
  .split("/")
  .map((segmento) => encodeURIComponent(segmento))
  .join("%2F");

 const response = await odooApi.get(
  `/assets/${rutaCodificada}`,
  {
   responseType: "blob",
  }
 );

 return response.data;
};