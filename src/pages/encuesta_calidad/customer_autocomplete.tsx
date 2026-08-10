import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { Control, Controller, FieldValues, Path, RegisterOptions } from "react-hook-form";
import { useEffect, useState } from "react";
import odooApi from "@/api/odoo-api";

const apiUrl = import.meta.env.VITE_ODOO_API_URL;

type Customer = {
 id: number;
 name: string;
 code?: string;
};

type Props<T extends FieldValues> = {
 control: Control<T>;
 name: Path<T>;
 label?: string;
 placeholder?: string;
 isReadOnly?: boolean;
 rules?: RegisterOptions<T, Path<T>>;
};

export const CustomerAutocomplete = <T extends FieldValues>({
 control,
 name,
 label = "Cliente",
 placeholder = "Buscar cliente...",
 isReadOnly = false,
 rules,
}: Props<T>) => {
 const [customers, setCustomers] = useState<Customer[]>([]);
 const [search, setSearch] = useState("");
 const [isLoading, setIsLoading] = useState(false);

 const searchCustomers = async (value: string) => {
  if (!value.trim()) {
   setCustomers([]);
   return;
  }

  try {
   setIsLoading(true);

   const response = await odooApi.get(
    `${apiUrl}/contacts/search-by-name/${value}`
   );

   setCustomers(response.data);
  } catch (error) {
   console.error("Error al buscar clientes:", error);
   setCustomers([]);
  } finally {
   setIsLoading(false);
  }
 };

 useEffect(() => {
  if (isReadOnly) {
   return;
  }

  const timeout = setTimeout(() => {
   searchCustomers(search);
  }, 300);

  return () => {
   clearTimeout(timeout);
  };
 }, [search, isReadOnly]);

 return (
  <Controller
   name={name}
   control={control}
   rules={rules}
   render={({ field, fieldState }) => (
    <Autocomplete
     label={label}
     placeholder={placeholder}
     items={customers}
     selectedKey={
      field.value !== null && field.value !== undefined
       ? String(field.value)
       : null
     }
     isLoading={isLoading}
     isInvalid={!!fieldState.error}
     errorMessage={fieldState.error?.message}
     onInputChange={(value) => {
      setSearch(value);
     }}
     onSelectionChange={(key) => {
      field.onChange(
       key ? Number(key) : null
      );
     }}
    >
     {(customer) => (
      <AutocompleteItem key={customer.id}>
       {customer.name}
      </AutocompleteItem>
     )}
    </Autocomplete>
   )}
  />
 );
};