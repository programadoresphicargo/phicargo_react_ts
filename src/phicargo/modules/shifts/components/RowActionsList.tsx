import { ListItemIcon, MenuItem } from '@mui/material';
import {
  MdOutlineArchive,
  MdOutlineLock,
  MdOutlineLockOpen,
} from 'react-icons/md';

import { FaRegEdit } from 'react-icons/fa';
import { FiAlertCircle } from 'react-icons/fi';
import { HiQueueList } from 'react-icons/hi2';
import type { Shift } from '../models';

export const getRowActionMenuItems = (
  shift: Shift,
  closeMenu: () => void,
  onOpenDetails: (id: number) => void,
) => {
  return [
    <MenuItem
      key={0}
      sx={{ m: 0 }}
      onClick={() => {
        onOpenDetails(shift.id);
        closeMenu();
      }}
    >
      <ListItemIcon>
        <FaRegEdit className="text-blue-500" />
      </ListItemIcon>
      Editar
    </MenuItem>,
    <MenuItem key={1} sx={{ m: 0 }}>
      <ListItemIcon>
        {shift.locked ? (
          <MdOutlineLock className="text-amber-500" />
        ) : (
          <MdOutlineLockOpen className="text-amber-500" />
        )}
      </ListItemIcon>
      {shift.locked ? 'Desfijar' : 'Fijar'}
    </MenuItem>,
    <MenuItem key={2} sx={{ m: 0 }}>
      <ListItemIcon>
        <MdOutlineArchive className="text-emerald-500" />
      </ListItemIcon>
      Archivar
    </MenuItem>,
    <MenuItem key={3} sx={{ m: 0 }}>
      <ListItemIcon>
        <FiAlertCircle />
      </ListItemIcon>
      Registrar Incidencia
    </MenuItem>,
    <MenuItem key={4} sx={{ m: 0 }}>
      <ListItemIcon>
        <HiQueueList
          className="text-red-500"
          style={{ transform: 'rotate(180deg)' }}
        />
      </ListItemIcon>
      Enviar a la cola
    </MenuItem>,
  ];
};

