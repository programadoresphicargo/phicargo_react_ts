import {
  AutocompleteElement,
  RadioButtonGroup,
  SelectElement,
  TextFieldElement,
} from 'react-hook-form-mui';
import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
  Typography,
} from '@mui/material';
import { Button, MuiCloseButton, MuiSaveButton } from '@/components/ui';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

import { COMPLAINT_TYPES } from '../utilities';
import type { ComplaintCreate } from '../models';
import { ContactsSearchInputMatch } from '@/modules/contacts/components/inputs/ContactsSearchInputMatch';
import { CreateActionsForm } from './CreateActionsForm';
import { DatePickerElement } from 'react-hook-form-mui/date-pickers';
import dayjs from 'dayjs';
import { useCreateComplaintMutation } from '../hooks/mutations';

const initialFormState: ComplaintCreate = {
  customerId: null as unknown as number,
  phicargoCompany: 'TRANSPORTES BELCHEZ',
  responsible: '',
  area: '',
  complaintType: '',
  complaintDescription: '',
  complaintSuggestion: '',
  priority: 'medium',
  response: null,
  responseDate: null,
  complaintDate: dayjs(),
  origin: 'QUEJA DE CLIENTE',
  actions: [],
};

interface Props {
  onClose: () => void;
}

export const CreateComplaintForm = ({ onClose }: Props) => {
  const { control, handleSubmit } = useForm<ComplaintCreate>({
    defaultValues: initialFormState,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'actions',
  });

  const {
    createComplaintMutation: { mutate, isPending },
  } = useCreateComplaintMutation();

  const onSubmit: SubmitHandler<ComplaintCreate> = (data) => {
    mutate(data, {
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
          Crear No Conformidad
        </Typography>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <MuiCloseButton onClick={onClose} />
        </Box>
      </DialogTitle>
      <DialogContent>
        <form className="flex flex-row gap-4 mt-6" noValidate>
          <section className="flex flex-col gap-4 border p-4 rounded-md w-1/2 overflow-y-auto h-[calc(100vh-250px)]">
            <DatePickerElement
              control={control}
              name="complaintDate"
              label="Fecha de Queja"
              inputProps={{
                size: 'small',
              }}
              required
              rules={{ required: 'Fecha de Queja Requerido' }}
            />

            <SelectElement
              control={control}
              name="phicargoCompany"
              label="Compañía"
              size="small"
              required
              options={[
                { id: 'TRANSPORTES BELCHEZ', label: 'TRANSPORTES BELCHEZ' },
                { id: 'TANKCONTAINER', label: 'TANKCONTAINER' },
                { id: 'SERVICONTAINER', label: 'SERVICONTAINER' },
              ]}
            />

            <SelectElement
              control={control}
              name="origin"
              label="Origen"
              size="small"
              required
              options={[
                { id: 'QUEJA DE CLIENTE', label: 'QUEJA DE CLIENTE' },
                { id: 'AUDITORÍA INTERNA', label: 'AUDITORÍA INTERNA' },
                { id: 'AUDITORÍA EXTERNA', label: 'AUDITORÍA EXTERNA' },
                {
                  id: 'INCUMPLIMIENTO DE PROCESO',
                  label: 'INCUMPLIMIENTO DE PROCESO',
                },
                { id: 'INDICADOR', label: 'INDICADOR' },
              ]}
            />

            <ContactsSearchInputMatch
              control={control}
              name="customerId"
              label="Cliente"
              placeholder="Buscar cliente..."
            />

            <TextFieldElement
              control={control}
              name="responsible"
              label="Responsable"
              size="small"
              required
              rules={{ required: 'Responsable Requerido' }}
            />

            <TextFieldElement
              control={control}
              name="area"
              label="Área"
              size="small"
              required
              rules={{ required: 'Área Requerido' }}
            />

            <AutocompleteElement
              control={control}
              name="complaintType"
              label="Tipo de Queja"
              required
              matchId
              options={COMPLAINT_TYPES}
              autocompleteProps={{
                size: 'small',
                getOptionKey: (option) => option.id,
                renderOption: (props, option) => {
                  const { key, ...optionProps } = props;
                  return (
                    <li key={key} {...optionProps}>
                      <Grid2 container sx={{ alignItems: 'center' }}>
                        <Grid2
                          sx={{
                            width: 'calc(100% - 44px)',
                            wordWrap: 'break-word',
                          }}
                        >
                          <Box component="span">{option.label}</Box>
                          <Typography
                            variant="body1"
                            sx={{ color: 'text.secondary' }}
                          >
                            {option.description}
                          </Typography>
                        </Grid2>
                      </Grid2>
                    </li>
                  );
                },
              }}
            />

            <TextFieldElement
              control={control}
              name="complaintDescription"
              label="Descripción de Queja"
              size="small"
              required
              rules={{ required: 'Descripción de Queja Requerido' }}
              multiline
              minRows={3}
            />
            <TextFieldElement
              control={control}
              name="complaintSuggestion"
              label="Sugerencia"
              size="small"
              required
              rules={{ required: 'Sugerencia requerida' }}
              multiline
              minRows={3}
            />

            <RadioButtonGroup
              control={control}
              row
              name="priority"
              label="Prioridad"
              options={[
                {
                  id: 'low',
                  label: 'Baja',
                },
                {
                  id: 'medium',
                  label: 'Media',
                },
                {
                  id: 'high',
                  label: 'Alta',
                },
              ]}
            />
          </section>
          <section className="flex flex-col gap-2 w-1/2 overflow-y-auto h-[calc(100vh-250px)]">
            <Typography sx={{ textAlign: 'center' }} variant="h6">
              Plan de Acción
            </Typography>

            <CreateActionsForm
              fields={fields}
              control={control}
              remove={remove}
              append={append}
            />
          </section>
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
          loading={isPending}
          loadingPosition="end"
          onClick={handleSubmit(onSubmit)}
        />
      </DialogActions>
    </>
  );
};

