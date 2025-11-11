import React, { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import odooApi from "@/api/odoo-api";

type FilterRule = {
  field: string;
  operator:
  | "=="
  | "!="
  | ">"
  | "<"
  | ">="
  | "<="
  | "includes"
  | "contains";
  value: number | string;
};

interface SelectEmpleadoProps {
  key_name: string;
  label: string;
  setSolicitante: (key: string, value: any) => void;
  value?: string | number | null;
  isEditing?: boolean;
  variant?: string;
  placeholder?: string;
  filters?: FilterRule[];
}

export default function SelectEmpleado({
  key_name,
  label,
  setSolicitante,
  value,
  isEditing = true,
  variant = "flat",
  placeholder,
  filters = [],
}: SelectEmpleadoProps) {
  const [data, setData] = useState < any[] > ([]);
  const [isLoading, setLoading] = useState(false);

  const applyFilters = (items: any[], filters: FilterRule[]) => {
    if (!filters.length) return items;

    return items.filter((item) => {
      return filters.every((f) => {
        const fieldValue = item[f.field];

        switch (f.operator) {
          case "==":
            return fieldValue === f.value;
          case "!=":
            return fieldValue !== f.value;
          case ">":
            return fieldValue > f.value;
          case "<":
            return fieldValue < f.value;
          case ">=":
            return fieldValue >= f.value;
          case "<=":
            return fieldValue <= f.value;
          case "includes":
            return Array.isArray(fieldValue) && fieldValue.includes(f.value);
          case "contains":
            return String(fieldValue)
              .toLowerCase()
              .includes(String(f.value).toLowerCase());
          default:
            return true;
        }
      });
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get("/drivers/employees/");
      const filtered = applyFilters(response.data, filters);
      setData(filtered);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error al obtener los datos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Autocomplete
      fullWidth
      variant={variant}
      placeholder={placeholder}
      label={label}
      defaultItems={data}
      selectedKey={String(value) || null}
      isDisabled={!isEditing}
      isInvalid={!value}
      errorMessage="Campo obligatorio"
      onSelectionChange={(key) => setSolicitante(key_name, key)}
    >
      {(user) => (
        <AutocompleteItem key={user.id_empleado}>
          {user.empleado}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
