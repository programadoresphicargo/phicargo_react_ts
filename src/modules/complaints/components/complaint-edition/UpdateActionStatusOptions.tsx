import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';

import AutoModeIcon from '@mui/icons-material/AutoMode';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ComplaintActionStatus } from '../../models';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useUpdateComplaintActionMutation } from '../../hooks/mutations';
import { useState } from 'react';
import { MuiAlertDialog } from '@/components';
import { complaintActionStatus } from '../../utilities';

interface Props {
  actionId: number;
}

export const UpdateActionStatusOptions = ({ actionId }: Props) => {
  const {
    updateComplaintActionMutation: { mutate, isPending },
  } = useUpdateComplaintActionMutation();

  const [statusToChange, setStatusToChange] =
    useState<ComplaintActionStatus | null>(null);

  const onUpdateStatus = (status: ComplaintActionStatus) => {
    mutate({
      id: actionId,
      updatedItem: { status },
    });
  };

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly aria-label="Like" variant="light" size="sm">
            <MoreVertIcon />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="complaint action status options"
          variant="solid"
          disabledKeys={
            isPending ? ['in_progress', 'completed', 'canceled'] : []
          }
        >
          <DropdownItem
            key="in_progress"
            description="Actualizar status de la acción"
            startContent={<AutoModeIcon color="warning" />}
            onPress={() => setStatusToChange('in_progress')}
          >
            En Progreso
          </DropdownItem>
          <DropdownItem
            key="completed"
            description="Completar acción"
            startContent={<CheckCircleIcon color="success" />}
            onPress={() => setStatusToChange('completed')}
          >
            Completada
          </DropdownItem>
          <DropdownItem
            key="canceled"
            description="Cancelar plan de acción"
            startContent={<CancelIcon color="error" />}
            onPress={() => setStatusToChange('canceled')}
          >
            Cancelar
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <MuiAlertDialog
        title={`Actualizar Estatus de la acción a ${complaintActionStatus.getLabel(
          statusToChange || 'in_progress',
        )}`}
        message="¿Está seguro de que desea actualizar el estatus de la acción?"
        open={!!statusToChange}
        onClose={() => setStatusToChange(null)}
        severity="warning"
        onConfirm={() => {
          if (statusToChange) {
            onUpdateStatus(statusToChange);
            setStatusToChange(null);
          }
        }}
      />
    </>
  );
};

