import { Button, Card } from "@heroui/react";
import React, { useState } from "react";
import { DatePicker } from "rsuite";
import odooApi from "@/api/odoo-api";

function ReporteIngresosClientes() {
 const [fecha, setFecha] = useState(null);
 const [loading, setLoading] = useState(false);

 const generarReporte = async () => {
  if (!fecha) {
   alert("Selecciona una fecha");
   return;
  }

  try {
   setLoading(true);

   const fechaFormateada = fecha.toISOString().split("T")[0];

   const response = await odooApi.get(
    "/tms_waybill/ingresos_clientes",
    {
     params: { fecha: fechaFormateada },
     responseType: "blob",
    }
   );

   const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
   });

   const url = window.URL.createObjectURL(blob);
   window.open(url, "_blank");
  } catch (error) {
   alert("Error al generar el reporte");
   console.error(error);
  } finally {
   setLoading(false);
  }
 };

 return (
  <Card className="p-5 shadow-md max-w-md mb-5">
   <h2 className="text-lg font-semibold mb-4">
    Reporte de ingresos por cliente
   </h2>

   <div className="flex gap-4 items-end">
    <div className="flex flex-col gap-1">
     <span className="text-sm text-gray-500">Fecha</span>
     <DatePicker
      oneTap
      w={180}
      value={fecha}
      onChange={setFecha}
      placeholder="Selecciona fecha"
     />
    </div>

    <Button
     color="success"
     radius="full"
     className="text-white"
     isLoading={loading}
     onPress={generarReporte}
    >
     Generar
    </Button>
   </div>
  </Card>
 );
}

export default ReporteIngresosClientes;
