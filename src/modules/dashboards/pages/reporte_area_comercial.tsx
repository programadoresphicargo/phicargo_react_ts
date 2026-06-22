import { Button, Card } from "@heroui/react";
import odooApi from "@/api/odoo-api";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { Dayjs } from "dayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ContactsSearchInputMatch } from "@/modules/contacts/components/inputs/ContactsSearchInputMatch";
import { SelectInput } from "@/components/inputs";

export const conceptos = [
 { key: "Contenedor", value: "Contenedor" },
 { key: "Viaje", value: "Viaje" },
 { key: "Facturacion", value: "Facturación" },
 { key: "Sucursal", value: "Sucursal" },
 { key: "Ejecutivo", value: "Ejecutivo" },
 { key: "Ruta", value: "Ruta" },
 { key: "TipoServicio", value: "Tipo de servicio" },
 { key: "Circuito", value: "Circuito" },
 { key: "Armado", value: "Tipo de armado" },
];

interface OptionsSelection {
 partner_id: number;
 date_start: Dayjs | null;
 date_end: Dayjs | null;
 concepto: string;
}

const initialFormState: OptionsSelection = {
 partner_id: 0,
 date_start: null,
 date_end: null,
 concepto: '',
};

function ReporteAreaComercial() {
 const [loading, setLoading] = useState(false);

 const { control, handleSubmit } = useForm<OptionsSelection>({
  defaultValues: initialFormState,
 });

 const generarReporte = async (data: OptionsSelection) => {

  try {
   setLoading(true);

   const response = await odooApi.get(
    "/tms_waybill/reporte_area_comercial/",
    {
     params: { date_start: data.date_start?.format("YYYY-MM-DD"), date_end: data.date_end?.format("YYYY-MM-DD"), concepto: data.concepto, partner_id: data.partner_id },
     responseType: "blob",
    }
   );

   const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
   });

   const url = window.URL.createObjectURL(blob);
   const a = document.createElement("a");
   a.href = url;
   a.download = `Reporte_${data.concepto}_${data.date_start?.format("YYYY-MM-DD")}.xlsx`;
   document.body.appendChild(a);
   a.click();
   document.body.removeChild(a);
   window.URL.revokeObjectURL(url);

  } catch (error) {
   alert("Error al generar el reporte");
   console.error(error);
  } finally {
   setLoading(false);
  }
 };

 return (
  <form onSubmit={handleSubmit(generarReporte)}>
   <Card className="p-6 shadow-lg max-w-3xl mb-8 mx-auto">

    {/* Header */}
    <div className="mb-6">
     <h2 className="text-xl font-semibold">
      Reporte Área Comercial
     </h2>
     <p className="text-sm text-gray-500">
      Selecciona los filtros para generar el reporte
     </p>
    </div>

    {/* Filtros */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

     {/* Cliente */}
     <ContactsSearchInputMatch
      control={control}
      name="partner_id"
      label="Cliente"
      placeholder="Selecciona un cliente"
      rules={{ required: "Mes final requerido" }}
     />

     <SelectInput control={control} name="concepto" items={conceptos} label="Concepto" variant="bordered"></SelectInput>

     {/* Mes Inicial */}
     <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
       control={control}
       name="date_start"
       rules={{ required: "Mes inicial requerido" }}
       render={({ field, fieldState }) => (
        <DatePicker
         views={["year", "month"]}
         label="Mes inicial"
         value={field.value}
         onChange={(newValue) => {
          field.onChange(
           newValue ? newValue.startOf("month") : null
          );
         }}
         slotProps={{
          textField: {
           fullWidth: true,
           variant: "outlined",
           size: "small",
           error: !!fieldState.error,
           helperText: fieldState.error?.message,
          },
         }}
        />
       )}
      />
     </LocalizationProvider>

     {/* Mes Final */}
     <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
       control={control}
       name="date_end"
       rules={{ required: "Mes final requerido" }}
       render={({ field, fieldState }) => (
        <DatePicker
         views={["year", "month"]}
         label="Mes final"
         value={field.value}
         onChange={(newValue) => {
          field.onChange(
           newValue ? newValue.endOf("month") : null
          );
         }}
         slotProps={{
          textField: {
           fullWidth: true,
           variant: "outlined",
           size: "small",
           error: !!fieldState.error,
           helperText: fieldState.error?.message,
          },
         }}
        />
       )}
      />
     </LocalizationProvider>
    </div>

    {/* Botón */}
    <div className="flex justify-end mt-8">
     <Button
      type="submit"
      color="success"
      radius="full"
      className="text-white"
      isLoading={loading}
     >
      Generar Reporte
     </Button>
    </div>

   </Card>
  </form>
 );
}

export default ReporteAreaComercial;
