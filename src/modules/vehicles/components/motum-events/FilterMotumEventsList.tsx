import Box from '@mui/material/Box';
import type { MotumEvent } from '../../models';
import Stack from '@mui/material/Stack';
import { Select, SelectItem } from "@heroui/react";

interface Props {
  events: MotumEvent[] | undefined;
  children?: React.ReactNode;
  onSelectEventType?: (eventType: string) => void;
}

export const FilterMotumEventsList = ({ events, onSelectEventType }: Props) => {

  const tipoToName = new Map<string, string>();

  events?.forEach((e) => {
    if (!tipoToName.has(String(e.eventType))) {
      tipoToName.set(String(e.eventType), e.eventTypeName);
    }
  });

  const tiposUnicos = Array.from(tipoToName.keys());

  return (
    <Select
      key="primary"
      label="Eventos"
      placeholder="Selecciona uno..."
      color="primary"
      size='sm'
      radius="full"
      onChange={(e) => onSelectEventType?.(String(e.target.value))}>
      {tiposUnicos.map((tipo) => (
        <SelectItem key={tipo}>
          {tipoToName.get(tipo)}
        </SelectItem>
      ))}
    </Select>
  );
};
