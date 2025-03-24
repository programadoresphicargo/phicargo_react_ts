import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { Button, MuiCloseButton, MuiSaveButton } from '@/components/ui';
import type { MaintenanceRecord, MaintenanceRecordUpdate } from '../models';
import { SelectElement, TextFieldElement } from 'react-hook-form-mui';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMaintenanceRecord, useWorkshop } from '../hooks';

import { DatePickerElement } from 'react-hook-form-mui/date-pickers';

const SUPERVISORS = [
  {
    label: 'CONTRERAS HERNANDEZ ANDRES',
    id: 'CONTRERAS HERNANDEZ ANDRES',
  },
  {
    label: 'DE LA PARRA TRUJILLO SERGIO',
    id: 'DE LA PARRA TRUJILLO SERGIO',
  },
  {
    label: 'ORTIZ DIAZ CARLOS EDUARDO',
    id: 'ORTIZ DIAZ CARLOS EDUARDO',
  },
];

interface Props {
  onClose: () => void;
  record: MaintenanceRecord;
}

export const EditRecordForm = ({ onClose, record }: Props) => {
  const { handleSubmit, control, watch } = useForm<MaintenanceRecordUpdate>({
    defaultValues: transformRecordToRecordEdit(record),
  });

  const {
    workshopQuery: { data: workshops },
  } = useWorkshop();

  const { editRecordMutation } = useMaintenanceRecord();

  const deliveryDate = watch('deliveryDate');

  const onSubmit: SubmitHandler<MaintenanceRecordUpdate> = (data) => {
    editRecordMutation.mutate(
      {
        id: record.id,
        updatedItem: data,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 15px',
          color: 'white',
          background: 'linear-gradient(90deg, #0b2149, #002887)',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: 'white',
            fontSize: '1.25rem',
            textTransform: 'uppercase',
          }}
        >
          Editar Registro:{' '}
          <Typography
            component="span"
            sx={{
              color: 'white',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              textDecoration: 'underline',
            }}
          >
            {record.vehicle.name}
          </Typography>
        </Typography>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <MuiCloseButton onClick={onClose} />
        </Box>
      </DialogTitle>
      <DialogContent>
        <form
          className="flex flex-col gap-4 mt-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <SelectElement
            control={control}
            name="workshopId"
            label="Taller"
            size="small"
            required
            options={workshops?.map((w) => ({ label: w.name, id: w.id })) || []}
          />
          <SelectElement
            control={control}
            name="supervisor"
            label="Supervisor"
            size="small"
            required
            options={SUPERVISORS}
          />
          <SelectElement
            control={control}
            name="failType"
            label="Tipo de falla"
            size="small"
            required
            options={[
              { label: 'MC', id: 'MC' },
              { label: 'EL', id: 'EL' },
            ]}
          />

          <DatePickerElement
            control={control}
            name="deliveryDate"
            label="Fecha de entrega"
            inputProps={{
              size: 'small',
            }}
          />

          {!deliveryDate?.isSame(record.deliveryDate, 'day') && (
            <TextFieldElement
              control={control}
              name="updateComments"
              label="Comentarios"
              multiline
              rows={4}
              size="small"
              required
              rules={{ required: 'Requerido si cambias la fecha de entrega' }}
            />
          )}
        </form>
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: 3,
          pt: '0',
        }}
      >
        <Button variant="outlined" color="error" size="small" onClick={onClose}>
          Cancelar
        </Button>
        <MuiSaveButton 
          variant="contained" 
          loading={editRecordMutation.isPending}
          loadingPosition='end'
          onClick={handleSubmit(onSubmit)} />
      </DialogActions>
    </>
  );
};

const transformRecordToRecordEdit = (
  data: MaintenanceRecord,
): MaintenanceRecordUpdate => {
  return {
    deliveryDate: data.deliveryDate,
    failType: data.failType,
    supervisor: data.supervisor,
    workshopId: data.workshop.id,
  };
};

