import {
  Button,
  Checkbox,
} from "@heroui/react";
import { DatePickerInput, TextareaInput } from "@/components/inputs";
import { SubmitHandler, useForm } from 'react-hook-form';
import { HiQueueList } from 'react-icons/hi2';
import { QueueCreate } from '../models';
import dayjs from 'dayjs';
import { useShiftQueueQueries } from '../hooks/useShiftQueueQueries';
import { useState } from 'react';
import { Dialog } from "@mui/material";
import DialogContent from '@mui/material/DialogContent';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';

const initialState: QueueCreate = {
  enqueueDate: dayjs(),
  releaseDate: dayjs(),
  comments: '',
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  shiftId: number;
}

export const QueueDialog = ({ isOpen, onClose, shiftId }: Props) => {
  const [releaseNextDay, setReleaseNextDay] = useState(true);
  const { createQueue } = useShiftQueueQueries();

  const { control, handleSubmit } = useForm({
    defaultValues: initialState,
  });

  const onSubmit: SubmitHandler<QueueCreate> = async (data) => {
    if (!shiftId) return;
    if (releaseNextDay) {
      data.releaseDate = dayjs().add(1, 'day').hour(9).minute(0).second(0);
    } else {
      data.releaseDate = dayjs(data.releaseDate).hour(9).minute(0).second(0);
    }

    createQueue.mutate({
      shiftId: shiftId,
      queueData: data,
    }, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>

      <AppBar sx={{
        position: 'relative',
        background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
        color: 'white',
      }}
        elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Enviar a la cola
          </Typography>
          <Button autoFocus onPress={onClose} color="primary" radius="full">
            Cancelar
          </Button>
        </Toolbar>
      </AppBar>

      <DialogContent>
        <>

          <div className="space-y-4">
            <div className="space-y-2">
              <Checkbox
                isSelected={releaseNextDay}
                onValueChange={setReleaseNextDay}
              >
                Salida a las 9:00 AM
              </Checkbox>
              <p className="text-sm text-gray-500 italic">
                El operador reingresa a la lista de turnos a las 9:00 AM del
                día hábil siguiente.
              </p>
            </div>
            {!releaseNextDay && (
              <DatePickerInput
                control={control}
                name="releaseDate"
                label="Fecha de liberación"
              />
            )}
            <TextareaInput
              control={control}
              name="comments"
              label="Comentarios"
              placeholder="Escribe un comentario"
              isUpperCase
            />
          </div>
          <Button
            color="primary"
            onPress={() => handleSubmit(onSubmit)()}
            startContent={
              <HiQueueList style={{ transform: 'rotate(180deg)' }} />
            }
            isLoading={createQueue.isPending}
          >
            Enviar a cola
          </Button>

        </>
      </DialogContent>
    </Dialog>
  );
};

