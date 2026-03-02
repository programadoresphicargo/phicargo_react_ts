import { Button, Card, DatePicker, Select, SelectItem } from "@heroui/react";
import odooApi from "@/api/odoo-api";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { parseDate } from "@internationalized/date";
import dayjs, { Dayjs } from "dayjs";
import SelectCliente from "@/components/inputs/ClienteAutocomplete";

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
 concepto: string;
}

const initialFormState: OptionsSelection = {
 partner_id: 0,
 date_start: null,
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
     params: { date_start: data.date_start?.format("YYYY-MM-DD"), concepto: data.concepto, partner_id: data.partner_id },
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
   <Card className="p-5 shadow-md max-w-md mb-5">
    <h2 className="text-lg font-semibold mb-4">
     Reporte area comercial
    </h2>

    <div className="flex gap-4 items-end">
     <div className="flex flex-col gap-1">

      <Controller
       control={control}
       name="partner_id"
       rules={{ required: 'Cliente obligatorio' }}
       render={({ field }) => (
        <SelectCliente
         variant="bordered"
         key_name="partner_id"
         label="Cliente"
         value={field.value}
         setValue={setValue}
         placeholder={"Campo obligatorio"}
        />
       )}
      />

      <Controller
       control={control}
       name="date_start"
       rules={{ required: "Fecha de incidencia requerida" }}
       render={({ field, fieldState }) => {
        const calendarValue = field.value ? parseDate(field.value.format("YYYY-MM-DD")) : null;

        return (
         <DatePicker
          variant="bordered"
          showMonthAndYearPickers
          label="Fecha"
          value={calendarValue}
          onChange={(val) => {
           field.onChange(val ? dayjs(val.toString()) : null);
          }}
          isInvalid={!!fieldState.error}
          errorMessage={fieldState.error?.message}
         />
        );
       }}
      />

      <Controller
       control={control}
       name="concepto"
       rules={{ required: "Tipo de incidencia requerida" }}
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

     </div>

     <Button
      type="submit"
      color="success"
      radius="full"
      className="text-white"
      isLoading={loading}
     >
      Generar
     </Button>
    </div>
   </Card>
  </form>
 );
}

export default ReporteAreaComercial;
