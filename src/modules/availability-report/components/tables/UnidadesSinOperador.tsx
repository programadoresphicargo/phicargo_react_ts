import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { memo } from "react";

interface Unidad {
  name: string;
  postura: boolean;
}

interface Props {
  data: string | null;
}

export const UnidadesSinOperador = memo(({ data }: Props) => {
  let unidades: Unidad[] = [];

  try {
    unidades = data ? JSON.parse(data) : [];
  } catch (error) {
    unidades = [];
  }

  return (
    <Popover placement="top" showArrow color="default">
      <PopoverTrigger>
        <button className="text-gray-500 hover:text-gray-700">
          <i className="bi bi-truck"></i>
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <ul>
          {unidades.map((unidad, index) => (
            <>
              {unidad.postura ? (
                <li><strong className="text-primary">{unidad.name}</strong></li>
              ) : (
                <li key={index} className="fw-bold">{unidad.name}</li>
              )}
            </>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
});