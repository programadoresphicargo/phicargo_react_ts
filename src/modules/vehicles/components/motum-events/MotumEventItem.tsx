import { Divider, IconButton, Paper, Stack, Typography } from '@mui/material';
import { SubmitHandler, TextFieldElement, useForm } from 'react-hook-form-mui';

import Box from '@mui/material/Box';
import { Button } from '@/components/ui';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import type { MotumEvent } from '../../models';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import RoomIcon from '@mui/icons-material/Room';
import SaveIcon from '@mui/icons-material/Save';
import { useMotumEventsQueries } from '../../hooks/queries';
import { useState } from 'react';

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

  const { attendMotumEventMutation } = useMotumEventsQueries();

  const onAttend: SubmitHandler<{ comment: string }> = (data) => {
    attendMotumEventMutation.mutate({
      id: event.id,
      updatedItem: data,
    });
    setCommentInput(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <ReportGmailerrorredIcon color="error" />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {event.eventTypeName}
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
            Estado: {event.status}
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
            <TextFieldElement
              control={control}
              name="comment"
              id="comment-event-input"
              label="Comentarios"
              multiline
              rows={4}
              fullWidth
              required
              rules={{
                required: 'Este campo es requerido',
                minLength: {
                  value: 5,
                  message: 'El comentario debe tener al menos 5 caracteres',
                },
                maxLength: {
                  value: 200,
                  message: 'El comentario no puede tener más de 200 caracteres',
                },
              }}
              onClick={(e) => e.stopPropagation()}
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
                variant="text"
                size="small"
                startIcon={<CloseIcon />}
                color={'warning'}
                onClick={(e) => {
                  e.stopPropagation();
                  setCommentInput(false);
                }}
                disabled={attendMotumEventMutation.isPending}
              >
                {'Cancelar'}
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<SaveIcon />}
                color={'primary'}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmit(onAttend)();
                }}
                disabled={attendMotumEventMutation.isPending}
              >
                {'Guardar'}
              </Button>
            </Box>
          </>
        )}
        {!commentInput && (
          <Button
            variant="outlined"
            size="small"
            fullWidth
            startIcon={<CheckCircleOutlineIcon />}
            color={'primary'}
            onClick={(e) => {
              e.stopPropagation();
              setCommentInput(!commentInput);
            }}
            disabled={attendMotumEventMutation.isPending}
          >
            {'Atender'}
          </Button>
        )}
      </Box>
    </Paper>
  );
};

