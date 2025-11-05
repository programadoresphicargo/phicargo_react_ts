import { Divider, IconButton, Stack, Typography } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form-mui';
import { Controller } from "react-hook-form";
import { Textarea } from "@heroui/react"
import Box from '@mui/material/Box';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import type { MotumEvent } from '../../models';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import RoomIcon from '@mui/icons-material/Room';
import SaveIcon from '@mui/icons-material/Save';
import { useMotumEventsQueries } from '../../hooks/queries';
import { useState } from 'react';
import { Button, Card, CardBody } from '@heroui/react';

interface Props {
  event: MotumEvent;
}

export const MotumEventItem = ({ event }: Props) => {
  const [commentInput, setCommentInput] = useState<boolean>(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      comment: '',
    },
  });

  const { attendMotumEventMutation } = useMotumEventsQueries({});

  const onAttend: SubmitHandler<{ comment: string }> = (data) => {
    attendMotumEventMutation.mutate({
      id: event.id,
      updatedItem: data,
    });
    setCommentInput(false);
  };

  return (
    <Card>
      <CardBody>
        <Stack direction="row" spacing={2} alignItems="center">
          <ReportGmailerrorredIcon color="error" />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {event.id}     {event.eventTypeName}
            </Typography>
            {event.eventDescription && (
              <Typography variant="body2" color="text.secondary">
                {event.eventDescription}
              </Typography>
            )}
            <Typography
              variant="caption"
              color="primary"
              sx={{ fontStyle: 'italic' }}
            >
              Estado: {event.status} | Unidad: {event.vehicleName}  | Fecha : {event.createdAt.format('YYYY-MM-DD HH:mm')}
            </Typography>
          </Box>
          <IconButton
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              window.open(
                `https://www.google.com/maps?q=${event.latitude},${event.longitude}`,
                '_blank',
              );
            }}
          >
            <RoomIcon />
          </IconButton>
        </Stack>
        <Divider sx={{ mt: 1, mb: 2 }} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          {commentInput && (
            <>
              <Controller
                name="comment"
                control={control}
                rules={{
                  required: "Este campo es requerido",
                  minLength: {
                    value: 5,
                    message: "El comentario debe tener al menos 5 caracteres",
                  },
                  maxLength: {
                    value: 200,
                    message: "El comentario no puede tener más de 200 caracteres",
                  },
                }}
                render={({ field, fieldState }) => (
                  <Textarea
                    label="Comentarios"
                    variant="bordered"
                    minRows={4}
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                    fullWidth
                  />
                )}
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 3,
                  width: '100%',
                }}
              >
                <Button
                  size="sm"
                  radius='full'
                  startContent={<CloseIcon />}
                  color={'danger'}
                  onPress={() => {
                    setCommentInput(false);
                  }}
                  isDisabled={attendMotumEventMutation.isPending}
                >
                  {'Cancelar'}
                </Button>
                <Button
                  size="sm"
                  radius='full'
                  startContent={<SaveIcon />}
                  color={'primary'}
                  onPress={() => {
                    handleSubmit(onAttend)();
                  }}
                  isLoading={attendMotumEventMutation.isPending}
                  isDisabled={attendMotumEventMutation.isPending}
                >
                  {'Guardar'}
                </Button>
              </Box>
            </>
          )}
          {!commentInput && (
            <Button
              size="sm"
              radius='full'
              fullWidth
              startContent={<CheckCircleOutlineIcon />}
              color={'primary'}
              onPress={() => {
                setCommentInput(!commentInput);
              }}
              isDisabled={attendMotumEventMutation.isPending}
            >
              {'Atender'}
            </Button>
          )}
        </Box>
      </CardBody>
    </Card >
  );
};

