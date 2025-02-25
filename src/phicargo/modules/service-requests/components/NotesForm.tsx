import { Card, CardContent } from '@mui/material';

import { TextareaAutosizeElement } from 'react-hook-form-mui';
import { useServiceRequestFormContext } from '../hooks/useServiceRequestFormContext';

export const NotesForm = () => {
  const { form } = useServiceRequestFormContext();
  const { control } = form;

  return (
    <Card elevation={4} sx={{ borderRadius: 2 }}>
      <CardContent>
        <form className="grid gap-4">
          <TextareaAutosizeElement
            control={control}
            name="notes.specialEquipment"
            label="Equipo de protección especial"
            rows={3}
          />

          <TextareaAutosizeElement
            control={control}
            name="notes.notes"
            label="Notas (Indicaciones especiales requeridas)"
            rows={3}
          />
        </form>
      </CardContent>
    </Card>
  );
};

