import {
  Box,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { MuiCloseButton } from '@/components/ui';

import { CreateIncidentForm } from './CreateIncidentForm';

interface Props {
  onClose: () => void;
  inspection_id?: number;
}

export const CreateIncidentModal = ({ onClose, inspection_id }: Props) => {
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
          sx={{
            color: 'white',
            fontSize: '1.25rem',
            textTransform: 'uppercase',
          }}
        >
          Crear Nueva Incidencia
        </Typography>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <MuiCloseButton onClick={onClose} />
        </Box>
      </DialogTitle>
      <DialogContent>
        <CreateIncidentForm onCancel={onClose} onSuccess={onClose} inspection_id2={inspection_id} />
      </DialogContent>
    </>
  );
};

