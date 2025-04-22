import {
  Alert,
  Button,
  LoadingSpinner,
  MuiCloseButton,
  MuiSaveButton,
} from '@/components/ui';
import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import type { Complaint, ComplaintCreate, ComplaintUpdate } from '../models';
import { SubmitHandler, useForm } from 'react-hook-form';

import { ComplaintActionCard } from './ComplaintActionCard';
import { DatePickerElement } from 'react-hook-form-mui/date-pickers';
import { TextFieldElement } from 'react-hook-form-mui';
import dayjs from 'dayjs';
import { useGetComplaintActionsQuery } from '../hooks/queries';

interface Props {
  onClose: () => void;
  complaint: Complaint;
}

export const EditComplaintForm = ({ onClose, complaint }: Props) => {
  const { control, handleSubmit } = useForm<ComplaintCreate>({
    defaultValues: transformComplaintToComplaintUpdate(complaint),
  });

  const {
    getComplaintActionsQuery: { data: actions, isLoading },
  } = useGetComplaintActionsQuery(complaint.id);

  const onSubmit: SubmitHandler<ComplaintCreate> = (data) => {
    console.log(data);
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
          Editar { complaint.phicargoCompany }
        </Typography>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <MuiCloseButton onClick={onClose} />
        </Box>
      </DialogTitle>
      <DialogContent>
        <section className="flex flex-row gap-4 mt-6">
          <section className="flex flex-col gap-4 border p-4 rounded-md w-1/2 overflow-y-auto h-[calc(100vh-250px)]">
            <form className="flex flex-col gap-4 mt-6">
              <TextFieldElement
                control={control}
                name="response"
                label="Respuesta"
                size="small"
                multiline
                minRows={3}
              />

              <DatePickerElement
                control={control}
                name="responseDate"
                label="Fecha de Respuesta"
              />
            </form>
          </section>
          <section className="flex flex-col gap-2 w-1/2 overflow-y-auto h-[calc(100vh-250px)]">
            <Typography sx={{ textAlign: 'center' }} variant="h6">
              Plan de Acción
            </Typography>
            {isLoading && <LoadingSpinner />}
            {actions?.length === 0 && (
              <Alert
                title="No hay acciones de queja"
                description="No se encontraron acciones de queja para esta queja."
                color="secondary"
              />
            )}
            {actions?.map((action) => (
              <ComplaintActionCard key={action.id} action={action} />
            ))}
          </section>
        </section>
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
          // loading={isPending}
          loadingPosition="end"
          onClick={handleSubmit(onSubmit)}
        />
      </DialogActions>
    </>
  );
};

const transformComplaintToComplaintUpdate = (
  complaint: Complaint,
): ComplaintUpdate => ({
  response: complaint.response,
  responseDate: complaint.responseDate || dayjs(),
});

