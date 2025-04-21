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
import { SubmitHandler, useForm } from 'react-hook-form';

import { COMPLAINT_TYPES } from '../utilities';
import type { ComplaintCreate } from '../models';
import { ContactsSearchInputMatch } from '@/modules/contacts/components/inputs/ContactsSearchInputMatch';
import { useCreateComplaintMutation } from '../hooks/mutations';

const initialFormState: ComplaintCreate = {
  customerId: '' as unknown as number,
  phicargoCompany: 'TRANSPORTES BELCHEZ',
  responsible: '',
  area: '',
  complaintType: '',
  complaintDescription: '',
  complaintSuggestion: '',
  priority: 'medium',
  response: null,
  responseDate: null,
};

interface Props {
  onClose: () => void;
}

export const CreateComplaintForm = ({ onClose }: Props) => {
  const { control, handleSubmit } = useForm<ComplaintCreate>({
    defaultValues: initialFormState,
  });

  const {
    createComplaintMutation: { mutate, isPending },
  } = useCreateComplaintMutation();

  const onSubmit: SubmitHandler<ComplaintCreate> = (data) => {
    console.log(data);

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
          Crear
        </Typography>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <MuiCloseButton onClick={onClose} />
        </Box>
      </DialogTitle>
      <DialogContent>
        <form className="flex flex-col gap-4 mt-6">
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

          <ContactsSearchInputMatch
            control={control}
            name="customerId"
            label="Cliente"
            required
            rules={{ required: 'Cliente Requerido' }}
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

