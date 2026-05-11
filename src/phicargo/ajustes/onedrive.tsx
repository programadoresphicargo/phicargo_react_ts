import odooApi from "@/api/odoo-api";
import CustomNavbar from "@/pages/CustomNavbar";
import {
 Button,
 Card,
 CardBody,
 CardHeader,
 Divider,
 Link,
 Progress,
 Textarea,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { pages } from "./pages";

const { VITE_ODOO_API_URL } = import.meta.env;

type OneDriveData = {
 expires_at?: number;
 access_token?: string;
};

type ExpirationData = {
 expiresDate: Date;
 diffMs: number;
 diffSeconds: number;
 diffMinutes: number;
 diffHours: number;
} | null;

export function parseExpiration(
 expiresAt?: number
): ExpirationData {
 if (!expiresAt) return null;

 // expires_at viene en segundos → convertir a milisegundos
 const expiresDate = new Date(expiresAt * 1000);
 const now = new Date();
 const diffMs = expiresDate.getTime() - now.getTime();

 const diffSeconds = Math.floor(diffMs / 1000);
 const diffMinutes = Math.floor(diffSeconds / 60);
 const diffHours = Math.floor(diffMinutes / 60);

 return {
  expiresDate,
  diffMs,
  diffSeconds,
  diffMinutes,
  diffHours,
 };
}

export default function OndriveConfiguracion() {
 const [data, setData] = useState<OneDriveData>({});
 const [isLoading, setLoading] = useState<boolean>(false);

 const fetchData = async (): Promise<void> => {
  try {
   setLoading(true);

   const response = await odooApi.get<OneDriveData>(
    "/onedrive/provider/onedrive"
   );

   setData(response.data);
  } catch (error) {
   console.error("Error al obtener los datos:", error);
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  fetchData();
 }, []);

 const exp = parseExpiration(data?.expires_at);

 return (
  <>
   <CustomNavbar pages={pages} />

   <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
    {isLoading ? (
     <Progress isIndeterminate size="sm" />
    ) : (
     <Card>
      <CardHeader>
       Generar token Onedrive
      </CardHeader>

      <Divider />

      <CardBody className="gap-4">
       <Button
        radius="full"
        showAnchorIcon
        as={Link}
        isExternal
        color="primary"
        href={
         VITE_ODOO_API_URL +
         "/onedrive/auth/login-onedrive"
        }
       >
        Generar Token
       </Button>

       <div>
        <p>
         <strong>Servidor:</strong>{" "}
         {VITE_ODOO_API_URL}
        </p>

        <p>
         <strong>Fecha de expiración:</strong>{" "}
         {exp?.expiresDate?.toLocaleString() ?? "Sin fecha"}
        </p>

        <p>
         <strong>Tiempo restante:</strong>{" "}
         {exp
          ? `${exp.diffHours}h ${exp.diffMinutes % 60
          }m ${exp.diffSeconds % 60}s`
          : "Sin información"}
        </p>
       </div>

       <Button
        radius="full"
        showAnchorIcon
        as={Link}
        isExternal
        color="secondary"
        href={
         VITE_ODOO_API_URL +
         "/onedrive/refresh_token"
        }
       >
        Refrescar Token
       </Button>

       <Textarea
        value={data?.access_token ?? ""}
       />
      </CardBody>
     </Card>
    )}
   </div>
  </>
 );
}