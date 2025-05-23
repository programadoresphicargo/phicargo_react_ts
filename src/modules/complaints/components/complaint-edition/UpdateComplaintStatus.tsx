import { MuiAlertDialog, MuiSimpleModal } from '@/components';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Complaint, ComplaintStatus } from '../../models';
import { useState } from 'react';
import { useUpdateComplaintMutation } from '../../hooks/mutations';
import { Button } from '@/components/ui';

interface Props {
  complaint?: Complaint | null;
  onClose: () => void;
}

export const UpdateComplaintStatus = ({ complaint, onClose }: Props) => {
  const [newStatus, setNewStatus] = useState<ComplaintStatus | null>(
    'in_process',
  );

  const [openAlert, setOpenAlert] = useState(false);

  const { updateComplaintMutation } = useUpdateComplaintMutation();

  const onOpenAlert = () => {
    if (!complaint) return;
    if (complaint.status === newStatus) return;

    setOpenAlert(true);
  };

  const onUpdateStatus = (status: ComplaintStatus) => {
    if (!complaint) return;
    if (complaint.status === status) return;

    updateComplaintMutation.mutate(
      {
        id: complaint.id,
        updatedItem: { status },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <MuiSimpleModal
      open={!!complaint}
      onClose={onClose}
      header={`Actualizar Estatus`}
      customFooter={
        <>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={onOpenAlert}
          >
            Actualizar
          </Button>
        </>
      }
    >
      <div className="p-4">
        <FormControl fullWidth>
          <InputLabel id="select-new-status">Nuevo Estatus</InputLabel>
          <Select
            labelId="select-new-status"
            id="select-new-status"
            value={newStatus}
            label="Nuevo Estatus"
            onChange={(event) =>
              setNewStatus(event.target.value as ComplaintStatus)
            }
          >
            <MenuItem value="in_process">En Proceso</MenuItem>
            <MenuItem value="resolved">Resuelto</MenuItem>
            <MenuItem value="rejected">Rechazado</MenuItem>
          </Select>
        </FormControl>
      </div>
      <MuiAlertDialog
        title={`Actualizar Estatus de la acción a`}
        message="¿Está seguro de que desea actualizar el estatus de la acción?"
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        severity="warning"
        onConfirm={() => {
          if (complaint && newStatus) {
            onUpdateStatus(newStatus);
            setOpenAlert(false);
          }
        }}
      />
    </MuiSimpleModal>
  );
};

