import {
  Button,
} from "@heroui/react";
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { ArchiveDialog } from '../components/ArchiveDialog';
import { DriverManeuver } from "../../drivers/components/maneuvers/DriverManeuvers";
import { EditShiftForm } from '../components/EditShiftForm';
import { FaEdit } from 'react-icons/fa';
import { HiQueueList } from 'react-icons/hi2';
import { MdOutlineArchive } from 'react-icons/md';
import { MdOutlineLock } from 'react-icons/md';
import { MdOutlineLockOpen } from 'react-icons/md';
import { QueueDialog } from '../components/QueueDialog';
import { useShiftQueries } from '../hooks/useShiftQueries';
import ResponsiveDialog from "./AsignarViaje.jsx";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import * as React from 'react';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ShiftDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formEnabled, setFormEnabled] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [queueDialogOpen, setQueueDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const { shiftQuery, editShift } = useShiftQueries();

  const shift = useMemo(
    () => (shiftQuery.data || []).find((s) => s.id === Number(id)),
    [id, shiftQuery.data],
  );

  const onLockedChange = () => {
    if (!shift) {
      return;
    }
    editShift.mutate({
      id: shift.id,
      updatedItem: { locked: !shift.locked },
    });
  };

  const onArchive = () => {
    if (!shift) {
      return;
    }
    setArchiveDialogOpen(true);
  };

  const onClose = () => {
    navigate('/turnos');
  };

  if (!id) {
    return <Navigate to="/menu" />;
  }

  return (
    <>
      <Dialog open={true} onClose={onClose} fullWidth maxWidth="md"
        slots={{
          transition: Transition,
        }}>
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
              Detalles del turno
            </Typography>
            <Button autoFocus onPress={onClose} color="primary" radius="full">
              Cancelar
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>

          <div className="flex flex-row gap-4 p-2 border-2 rounded-lg">
            <Button
              size="sm"
              radius="full"
              color={formEnabled ? 'danger' : 'primary'}
              startContent={<FaEdit />}
              onPress={() => setFormEnabled(!formEnabled)}
            >
              {formEnabled ? 'Cancelar' : 'Editar'}
            </Button>
            <Button
              size="sm"
              color="default"
              radius="full"
              startContent={
                shift?.locked ? <MdOutlineLock /> : <MdOutlineLockOpen />
              }
              onPress={onLockedChange}
              isLoading={editShift.isPending}
            >
              {shift?.locked ? 'Desfijar' : 'Fijar'}
            </Button>
            <Button
              radius="full"
              size="sm"
              color="secondary"
              startContent={<MdOutlineArchive />}
              onPress={onArchive}
            >
              Archivar
            </Button>
            {/* <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    startContent={<FiAlertCircle />}
                    onPress={() => navigate(`/turnos/incidencias/crear/${id}`)}
                  >
                    Registrar Incidencia
                  </Button> */}
            <Button
              size="sm"
              variant="solid"
              color="primary"
              className="text-white"
              radius="full"
              startContent={
                <HiQueueList style={{ transform: 'rotate(180deg)' }} />
              }
              onPress={() => setQueueDialogOpen(true)}
            >
              Enviar a la cola
            </Button>

            <Button
              radius="full"
              size="sm"
              color="danger"
              startContent={<MdOutlineArchive />}
              onPress={() => setOpen(true)}
            >
              Asignar viaje
            </Button>
          </div>
          <div className="flex flex-col md:flex-row p-1 gap-4">
            <div className="w-5/12 flex flex-col gap-4 border-2 rounded-lg p-3">
              <EditShiftForm shift={shift} enabled={formEnabled} />
            </div>

            <div className="w-7/12 border-2 rounded-lg p-3 max-h-[445px] overflow-y-auto">
              {shift && <DriverManeuver driverId={shift.driver!.id} />}
            </div>
          </div>

        </DialogContent>
      </Dialog >
      {shift && (
        <ArchiveDialog
          isOpen={archiveDialogOpen}
          onClose={() => {
            setArchiveDialogOpen(false);
            onClose();
          }}
          shiftId={shift.id}
        />
      )
      }
      {
        shift && (
          <QueueDialog
            isOpen={queueDialogOpen}
            onClose={() => setQueueDialogOpen(false)}
            shiftId={shift.id}
          />
        )
      }
      <ResponsiveDialog open={open} setOpen={setOpen} shift={shift}></ResponsiveDialog>
    </>
  );
};

export default ShiftDetail;

