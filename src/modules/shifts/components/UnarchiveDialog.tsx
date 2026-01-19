import { Button } from "@heroui/react";
import { SubmitHandler, useForm } from 'react-hook-form';
import { MdOutlineArchive } from 'react-icons/md';
import { SelectInput } from "@/components/inputs";
import type { ShiftArchive } from '../models';
import { useShiftQueries } from '../hooks/useShiftQueries';
import { Dialog, DialogContent } from "@mui/material";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  shiftId: number;
}

const initialState: ShiftArchive = {
  reason: '',
};

export const UnarchiveDialog = ({ isOpen, onClose, shiftId }: Props) => {
  const { unarchiveShift } = useShiftQueries();

  const { control, handleSubmit } = useForm({
    defaultValues: initialState,
  });

  const onSubmit: SubmitHandler<ShiftArchive> = (data) => {
    if (!shiftId) {
      return;
    }
    unarchiveShift.mutate(
      {
        id: shiftId,
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
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">

      <AppBar
        sx={{
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
            Desarchivar turno {shiftId}
          </Typography>
          <Button autoFocus onPress={onClose} color="primary" radius="full">
            Cancelar
          </Button>
        </Toolbar>
      </AppBar>

      <DialogContent className="p-2">
        <>

          <div>
            <SelectInput
              control={control}
              label="Razón de desarchivo"
              name="reason"
              items={[
                { key: 'CAMBIO DE OPERADOR', value: 'CAMBIO DE OPERADOR' },
                { key: 'ERROR DE ASIGNACION', value: 'ERROR DE ASIGNACION' },
              ]}
              rules={{ required: 'Este campo es requerido' }}
            />
          </div>
          <Button
            radius="full"
            color="primary"
            onPress={() => handleSubmit(onSubmit)()}
            startContent={<MdOutlineArchive />}
            isLoading={unarchiveShift.isPending}
          >
            Desarchivar
          </Button>

        </>
      </DialogContent>
    </Dialog>
  );
};

