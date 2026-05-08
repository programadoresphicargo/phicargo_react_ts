import odooApi from "@/api/odoo-api";

type Maniobra = {}
type CorreosLigados = {}
type CpsLigados = {}

type ManiobraCreate = {
  data: Maniobra,
  correos_ligados: CorreosLigados[],
  cps_ligadas: CpsLigados[]
}

export const reactivarManiobra = async (id_maniobra: number) => {
  const response = await odooApi.post('/maniobras/reactivar/' + id_maniobra)
  return response.data;
};

export const registrarManiobra = async (data: ManiobraCreate) => {
  const response = await odooApi.post('/maniobras/create_maniobra/', data)
  return response.data;
};

export const actualizarManiobra = async (id_maniobra: number, data: ManiobraCreate) => {
  const response = await odooApi.patch('/maniobras/' + id_maniobra, data)
  return response.data;
};