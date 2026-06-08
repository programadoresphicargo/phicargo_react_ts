import type { Complaint, ComplaintForm } from '../../models';
import { SubmitHandler, useForm } from 'react-hook-form';
import { DatePickerElement } from 'react-hook-form-mui/date-pickers';
import { AutocompleteElement, RadioButtonGroup } from 'react-hook-form-mui';
import { useCreateComplaintMutation, useUpdateComplaintMutation } from '../../hooks/mutations';
import { Button, Link } from '@heroui/react';
import { AutocompleteInput, TextInput, TextareaInput } from '@/components/inputs';
import Grid2 from '@mui/material/Grid2';
import { Box, Typography } from '@mui/material';
import { COMPLAINT_TYPES } from '../../utilities';
import dayjs from 'dayjs';
import { ContactsSearchInputMatch } from '@/modules/contacts/components/inputs/ContactsSearchInputMatch';
const apiUrl = import.meta.env.VITE_ODOO_API_URL;

interface Props {
  complaint: Complaint | null;
  onClose: () => void;
}

export const EditComplaintForm = ({ complaint, onClose }: Props) => {

  const { control, handleSubmit } = useForm<ComplaintForm>({
    defaultValues: complaint
      ? transformComplaintToComplaintUpdate(complaint)
      : initialFormState,
  });

  const {
    createComplaintMutation: {
      mutate: createComplaint,
      isPending: isCreating,
    },
  } = useCreateComplaintMutation();

  const {
    updateComplaintMutation: {
      mutate: updateComplaint,
      isPending: isUpdating,
    },
  } = useUpdateComplaintMutation();

  const onSubmitUpdate: SubmitHandler<ComplaintForm> = (data) => {
    if (isUpdating) return;
    if (!complaint) return;

    updateComplaint({
      id: complaint.id,
      updatedItem: data,
    });
  };

  const onSubmitCreate: SubmitHandler<ComplaintForm> = (data) => {
    createComplaint(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <section className="flex flex-col border p-4 rounded-md">

      <div className="mb-3 flex gap-3">
        <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <span className="bg-blue-100 p-1 rounded-full">📋</span>
          {complaint && (
            `No Conformidad #${complaint.id}`
          )}
        </h2>
        {!complaint && (
          <Button
            color="success"
            isLoading={isCreating}
            onPress={() => handleSubmit(onSubmitCreate)()}
            radius="full"
            className="text-white"
          >Registrar
          </Button>
        )}
        {complaint && (
          <Button
            color="primary"
            isLoading={isUpdating}
            onPress={() => handleSubmit(onSubmitUpdate)()}
            radius="full"
          >Guardar
          </Button>
        )}
        {complaint && (
          <Button
            className='text-white'
            showAnchorIcon
            as={Link}
            isExternal={true}
            color="success"
            href={`${apiUrl}/complaints/format/${complaint.id}`}
            variant="solid"
            radius="full"
          >
            Exportar
          </Button>
        )}
      </div>

      <form className="grid grid-cols-3 gap-4 mt-6">

        <DatePickerElement
          control={control}
          name="complaintDate"
          label="Fecha"
          inputProps={{
            size: 'small',
          }}
        />

        <AutocompleteInput
          control={control}
          name="phicargoCompany"
          label="Compañía"
          size="sm"
          variant="faded"
          rules={{ required: "Obligatorio" }}
          items={[
            { key: 'TRANSPORTES BELCHEZ', value: 'TRANSPORTES BELCHEZ' },
            { key: 'TANKCONTAINER', value: 'TANKCONTAINER' },
            { key: 'SERVICONTAINER', value: 'SERVICONTAINER' },
          ]}
        />

        <AutocompleteInput
          control={control}
          name="origin"
          label="Origen"
          variant='faded'
          size="sm"
          rules={{ required: "Obligatorio" }}
          items={[
            { key: 'QUEJA DE CLIENTE', value: 'QUEJA DE CLIENTE' },
            { key: 'AUDITORÍA INTERNA', value: 'AUDITORÍA INTERNA' },
            { key: 'AUDITORÍA EXTERNA', value: 'AUDITORÍA EXTERNA' },
            {
              key: 'INCUMPLIMIENTO DE PROCESO',
              value: 'INCUMPLIMIENTO DE PROCESO',
            },
            { key: 'INDICADOR', value: 'INDICADOR' },
          ]}
        />

        <ContactsSearchInputMatch
          control={control}
          name="customerId"
          label="Cliente"
          placeholder="Buscar cliente..."
          initialInputValue={complaint?.customer?.name}
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

        <TextareaInput
          control={control}
          name="complaintDescription"
          label="Descripción"
          size="sm"
          rules={{ required: "Obligatorio" }}
          variant="faded"
        />

        <TextareaInput
          control={control}
          name="complaintSuggestion"
          label="Sugerencia"
          size="sm"
          rules={{ required: "Obligatorio" }}
          variant="faded"
        />

        <TextInput
          control={control}
          name="responsible"
          label="Responsable"
          size="sm"
          rules={{ required: "Obligatorio" }}
        />

        <TextInput
          control={control}
          name="area"
          label="Área"
          size="sm"
          rules={{ required: "Obligatorio" }}
        />

        <TextareaInput
          control={control}
          name="response"
          label="Respuesta"
          size="sm"
          variant="faded"
        />

        <DatePickerElement
          control={control}
          name="responseDate"
          label="Fecha de Respuesta"
          disablePast
          inputProps={{
            size: 'small',
          }}
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
    </section>
  );
};

const transformComplaintToComplaintUpdate = (
  complaint: Complaint,
): ComplaintForm => ({
  responsible: complaint.responsible,
  area: complaint.area,
  response: complaint.response,
  responseDate: complaint.responseDate || null,
  complaintDescription: complaint.complaintDescription,
  complaintSuggestion: complaint.complaintSuggestion,
  complaintDate: complaint.complaintDate,
  priority: complaint.priority,
  origin: complaint.origin,
  phicargoCompany: complaint.phicargoCompany,
  complaintType: complaint.complaintType,
  customerId: complaint?.customer?.id ?? null
});

const initialFormState: ComplaintForm = {
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
  customerId: null,
};
