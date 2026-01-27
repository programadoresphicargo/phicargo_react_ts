import odooApi from "@/api/odoo-api";
import CustomNavbar from "@/pages/CustomNavbar";
import { Button, Card, CardBody, CardHeader, Divider, Link, Textarea } from "@heroui/react";
import { useState, useEffect } from "react";
import { pages } from './pages';

const { VITE_ODOO_API_URL } = import.meta.env;

export function parseExpiration(expiresAt) {
 if (!expiresAt) return null;

 // expires_at viene en segundos → convertir a milisegundos
 const expiresDate = new Date(expiresAt * 1000);
 const now = new Date();
 const diffMs = expiresDate - now;

 const diffSeconds = Math.floor(diffMs / 1000);
 const diffMinutes = Math.floor(diffSeconds / 60);
 const diffHours = Math.floor(diffMinutes / 60);

 return {
  expiresDate,         // Fecha exacta
  diffMs,              // Diferencia en milisegundos
  diffSeconds,
  diffMinutes,
  diffHours,
 };
}

export default function OndriveConfiguracion() {

 const [data, setData] = useState({});
 const [isLoading, setLoading] = useState();

 const fetchData = async () => {
  try {
   setLoading(true);
   const response = await odooApi.get('/onedrive/json');
   setData(response.data);
   console.log(response.data);
   setLoading(false);
  } catch (error) {
   console.error('Error al obtener los datos:', error);
  }
 };

 useEffect(() => {
  fetchData();
 }, []);

 const exp = parseExpiration(data?.expires_at);

 return (
  <>
   <CustomNavbar pages={pages}></CustomNavbar>
   <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
    <Card>
     <CardHeader>
      Generar token Onedrive
     </CardHeader>
     <Divider></Divider>
     <CardBody>
      <Button
       radius="full"
       showAnchorIcon
       as={Link}
       isExternal={true}
       color="primary"
       href={VITE_ODOO_API_URL + '/onedrive/auth/login-onedrive'}
      >
       Generar Token
      </Button>
      <div>
       <p><strong>Servidor:</strong> {VITE_ODOO_API_URL}</p>

       <p><strong>Fecha de expiración:</strong> {exp?.expiresDate.toLocaleString()}</p>

       <p>
        <strong>Tiempo restante:</strong>{" "}
        {exp?.diffHours}h {exp?.diffMinutes % 60}m {exp?.diffSeconds % 60}s
       </p>
      </div>
      <Button
       radius="full"
       showAnchorIcon
       as={Link}
       isExternal={true}
       color="secondary"
       href={VITE_ODOO_API_URL + '/onedrive/refresh_token'}
      >
       Refrescar Token
      </Button>
      <Textarea value={data?.access_token}></Textarea>
     </CardBody>
    </Card>
   </div>
  </>
 );
}
