import { Button, Card, DatePicker } from "@heroui/react";
import odooApi from "@/api/odoo-api";
import { useDebounce } from "@/hooks";
import { Controller, useForm } from "react-hook-form";
import { useContacts } from "@/modules/cashflow-report/hooks";
import { AutocompleteInput } from "@/components/inputs";
import { SelectElement } from "react-hook-form-mui";
import { useState } from "react";
import { parseDate } from "@internationalized/date";
import dayjs, { Dayjs } from "dayjs";

export const animals = [
 { id: "Contenedor", label: "Contenedor" },
 { id: "Ejecutivo", label: "Ejecutivo" },
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

 const [searchTerm, setSearchTerm] = useState('');
 const debouncedSearchTerm = useDebounce(searchTerm, 300);

 const { control, handleSubmit } = useForm<OptionsSelection>({
  defaultValues: initialFormState,
 });

 const {
  searchContactByNameQuery: { isFetching },
  ContactsSelection,
 } = useContacts({ name: debouncedSearchTerm });

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
   window.open(url, "_blank");
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
      <AutocompleteInput
       control={control}
       name="partner_id"
       label="Cliente"
       items={ContactsSelection || []}
       variant="bordered"
       isLoading={isFetching}
       searchInput={searchTerm}
       setSearchInput={setSearchTerm}
       rules={{ required: 'Cliente obligatorio' }}
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
          label="Fecha de Incidencia"
          value={calendarValue} // ✅ CalendarDate compatible con HeroUI
          onChange={(val) => {
           // Convertimos CalendarDate de vuelta a Dayjs
           field.onChange(val ? dayjs(val.toString()) : null);
          }}
          isInvalid={!!fieldState.error}
          errorMessage={fieldState.error?.message}
         />
        );
       }}
      />

      <SelectElement
       control={control}
       name="concepto"
       label="Concepto"
       required
       rules={{ required: 'Concepto obligatorio' }}
       options={animals}
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
