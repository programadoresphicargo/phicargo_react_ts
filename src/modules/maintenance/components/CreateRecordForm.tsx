import {
  AutocompleteElement,
  SelectElement,
  TextFieldElement,
} from 'react-hook-form-mui';
import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Typography,
} from '@mui/material';
import { Button, MuiCloseButton, MuiSaveButton } from '@/components/ui';
import { SubmitHandler, useForm } from 'react-hook-form';
import dayjs, { Dayjs } from 'dayjs';
import { useMaintenanceRecord, useVehicles, useWorkshop } from '../hooks';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddWorkshop from './AddWorkshop';
import { DatePickerElement } from 'react-hook-form-mui/date-pickers';
import type { MaintenanceRecordCreate } from '../models';
import { useState } from 'react';

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

const initialFormState: MaintenanceRecordCreate = {
  workshopId: '' as unknown as number,
  failType: 'MC',
  checkIn: dayjs(),
  status: 'pending',
  deliveryDate: null as unknown as Dayjs,
  supervisor: '',
  comments: '',
  order: '',
  vehicleId: '' as unknown as number,
};

interface Props {
  onClose: () => void;
}

export const CreateRecordForm = ({ onClose }: Props) => {
  const { vehicleQuery } = useVehicles();

  const [addWorkshop, setAddWorkshop] = useState(false);

  const {
    workshopQuery: { data: workshops, isFetching: loadingWorkshops },
  } = useWorkshop();

  const {
    addRecordMutation: { mutate: addRegister, isPending },
  } = useMaintenanceRecord();

  const { control, handleSubmit, setValue } = useForm<MaintenanceRecordCreate>({
    defaultValues: initialFormState,
  });

  const onSubmit: SubmitHandler<MaintenanceRecordCreate> = (data) => {
    addRegister(data, {
      onSuccess: () => {
        onClose();
      },
    });
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
          Crear Nuevo Registro
        </Typography>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <MuiCloseButton onClick={onClose} />
        </Box>
      </DialogTitle>
      <DialogContent>
        <form className="flex flex-col gap-4 mt-6">
          <AutocompleteElement
            control={control}
            name="vehicleId"
            label="Unidad"
            required
            rules={{ required: 'Unidad Requerida' }}
            options={
              vehicleQuery.data?.map((v) => ({ label: v.name, id: v.id })) || []
            }
            loading={vehicleQuery.isLoading}
            autocompleteProps={{
              getOptionKey: (option) => option.id,
              onChange: (_, value) => {
                setValue('vehicleId', value?.id || 0);
              },
              size: 'small',
            }}
          />

          <SelectElement
            control={control}
            name="failType"
            label="Tipo de falla"
            size="small"
            required
            rules={{ required: 'Tipo de falla requerido' }}
            options={[
              { label: 'MC', id: 'MC' },
              { label: 'EL', id: 'EL' },
            ]}
          />

          <SelectElement
            control={control}
            name="supervisor"
            label="Supervisor"
            size="small"
            required
            rules={{ required: 'Supervisor requerido' }}
            options={SUPERVISORS}
          />

          <DatePickerElement
            control={control}
            name="checkIn"
            label="Fecha de Ingreso"
            required
            rules={{ required: 'Fecha de Ingreso Requerida' }}
            inputProps={{
              size: 'small',
            }}
          />
          <DatePickerElement
            control={control}
            name="deliveryDate"
            label="Fecha de Entrega Estimada"
            required
            rules={{ required: 'Fecha de entraga requerida' }}
            inputProps={{
              size: 'small',
            }}
          />

          <div className="flex flex-row">
            <SelectElement
              control={control}
              name="workshopId"
              label="Taller"
              size="small"
              fullWidth
              required
              rules={{ required: 'Taller requerido' }}
              disabled={loadingWorkshops}
              options={
                workshops?.map((w) => ({ label: w.name, id: w.id })) || []
              }
            />
            <Tooltip title="Agregar Taller" placement="top-start">
              <button
                type="button"
                onClick={() => setAddWorkshop(true)}
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                <AddCircleOutlineIcon />
              </button>
            </Tooltip>
          </div>

          <TextFieldElement
            control={control}
            name="order"
            label="Order de Servicio"
            size="small"
            required
            rules={{ required: 'Orden de Servicio requerida' }}
          />

          <TextFieldElement
            control={control}
            name="comments"
            label="Motivo de Ingreso"
            multiline
            rows={4}
            size="small"
            required
            rules={{ required: 'Motivo de Ingreso requerido' }}
          />
        </form>
        <AddWorkshop open={addWorkshop} onClose={() => setAddWorkshop(false)} />
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
          loading={isPending}
          loadingPosition="end"
          onClick={handleSubmit(onSubmit)}
        />
      </DialogActions>
    </>
  );
};

