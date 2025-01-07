import type { Shift, ShiftReorder } from '../models';
import { useEffect, useState } from 'react';

import type { MRT_Row } from 'material-react-table';
import ShiftServiceApi from '../services/shifts-service';
import toast from 'react-hot-toast';

export const useReorderShifts = (initialShifts: Shift[]) => {
  const [data, setData] = useState<Shift[]>(initialShifts);
  const [previousState, setPreviousState] = useState<Shift[]>(initialShifts);

  const buildReorderPayload = (): ShiftReorder[] =>
    data.map((s) => ({ shiftId: s.id, shift: s.shift }));

  const save = async () => {
    try {
      await ShiftServiceApi.reorderShifts(buildReorderPayload());
      setPreviousState([...data]);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
      toast.error('Error al guardar los cambios de reordenamiento');
      setData([...previousState]);
    }
  };

  const handleRowOrderChange = (
    draggingRow: MRT_Row<Shift> | null,
    hoveredRow: Partial<MRT_Row<Shift>> | null,
  ) => {
    if (draggingRow && hoveredRow) {
      if(hoveredRow.original?.locked) {
        toast.error('No puedes reordenar un turno fijado');
        return;
      }

      if(draggingRow.original?.locked) {
        toast.error('No puedes reordenar un turno fijado');
        return;
      }

      if(draggingRow.index === hoveredRow.index) {
        return;
      }

      const updatedData = [...data];
      const draggedItem = updatedData.splice(draggingRow.index, 1)[0];
      updatedData.splice((hoveredRow as MRT_Row<Shift>).index, 0, draggedItem);

      updatedData.forEach((item, index) => {
        item.shift = index + 1;
      });

      setData(updatedData);
    }
  };

  const saveChanges = async () => {
    await save();
  };

  useEffect(() => {
    setData(initialShifts);
    setPreviousState(initialShifts);
  }, [initialShifts]);

  return {
    data,
    handleRowOrderChange,
    saveChanges,
  };
};

