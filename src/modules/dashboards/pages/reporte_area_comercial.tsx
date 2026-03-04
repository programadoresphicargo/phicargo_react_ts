import { Button, Card, Select, SelectItem } from "@heroui/react";
import odooApi from "@/api/odoo-api";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { Dayjs } from "dayjs";
import SelectCliente from "@/components/inputs/ClienteAutocomplete";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export const conceptos = [
 { id: "Contenedor", label: "Contenedor" },
 { id: "Viaje", label: "Viaje" },
 { id: "Facturacion", label: "Facturación" },
 { id: "Sucursal", label: "Sucursal" },
 { id: "Ejecutivo", label: "Ejecutivo" },
 { id: "Ruta", label: "Ruta" },
 { id: "TipoServicio", label: "Tipo de servicio" },
 { id: "Circuito", label: "Circuito" },
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

 const { control, handleSubmit, setValue } = useForm<OptionsSelection>({
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
     <Controller
      control={control}
      name="partner_id"
      rules={{ required: "Cliente obligatorio" }}
      render={({ field }) => (
       <SelectCliente
        variant="bordered"
        key_name="partner_id"
        label="Cliente"
        value={field.value}
        setValue={setValue}
        placeholder="Selecciona un cliente"
       />
      )}
     />

     {/* Concepto */}
     <Controller
      control={control}
      name="concepto"
      rules={{ required: "Concepto requerido" }}
      render={({ field, fieldState }) => (
       <Select
        label="Concepto"
        variant="bordered"
        selectedKeys={field.value ? [field.value] : []}
        onSelectionChange={(keys) => {
         const value = Array.from(keys)[0];
         field.onChange(value);
        }}
        isInvalid={!!fieldState.error}
        errorMessage={fieldState.error?.message}
       >
        {conceptos.map((option) => (
         <SelectItem key={option.id}>
          {option.label}
         </SelectItem>
        ))}
       </Select>
      )}
     />

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
