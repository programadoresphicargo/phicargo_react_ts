import { Select, SelectItem } from "@heroui/react";
import { useState } from "react";

interface Props {
  defaultYear?: string | number;
  onYearChange?: (year: string | number) => void;
}

export const YearSelect = ({ defaultYear, onYearChange }: Props) => {
  const [year, setYear] = useState<string | number>(
    defaultYear || new Date().getFullYear()
  );

  const handleChange = (value: string | number) => {
    setYear(value);
    onYearChange?.(value);
  };

  return (
    <Select
      className="w-[250px]"
      variant="bordered"
      label="Año"
      selectedKeys={[String(year)]}
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0]; // obtiene el valor elegido
        handleChange(selected);
      }}
    >
      {["2025", "2026", "2027", "2028", "2029"].map((y) => (
        <SelectItem key={String(y)}>
          {y}
        </SelectItem>
      ))}
    </Select>
  );
};
