import { useState, useEffect } from "react";
import { Select, SelectItem } from "@heroui/react";

interface Props {
  defaultMonth?: string | number;
  inspectionType?: string;
  onMonthChange?: (month: string | number) => void;
}

export const MonthSelect = ({ defaultMonth, inspectionType, onMonthChange }: Props) => {
  const [month, setMonth] = useState<string | number>(
    defaultMonth || new Date().getMonth() + 1
  );

  const [options, setOptions] = useState<{ value: number; label: string }[]>([]);

  useEffect(() => {
    if (inspectionType === "legal") {
      // Trimestres
      setOptions([
        { value: 1, label: "Enero, Febrero, Marzo" },
        { value: 2, label: "Abril, Mayo, Junio" },
        { value: 3, label: "Julio, Agosto, Septiembre" },
        { value: 4, label: "Octubre, Noviembre, Diciembre" },
      ]);
    } else {
      // Meses normales
      setOptions([
        { value: 1, label: "Enero" },
        { value: 2, label: "Febrero" },
        { value: 3, label: "Marzo" },
        { value: 4, label: "Abril" },
        { value: 5, label: "Mayo" },
        { value: 6, label: "Junio" },
        { value: 7, label: "Julio" },
        { value: 8, label: "Agosto" },
        { value: 9, label: "Septiembre" },
        { value: 10, label: "Octubre" },
        { value: 11, label: "Noviembre" },
        { value: 12, label: "Diciembre" },
      ]);
    }
  }, [inspectionType]);

  const handleChange = (value: string | number) => {
    setMonth(value);
    onMonthChange?.(value);
  };

  return (
    <Select
      variant="bordered"
      label="Mes"
      selectedKeys={[String(month)]}
      className="w-[250px]"
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0];
        handleChange(selected as string | number);
      }}
    >
      {options.map((opt) => (
        <SelectItem key={opt.value}>
          {opt.label}
        </SelectItem>
      ))}
    </Select>
  );
};
