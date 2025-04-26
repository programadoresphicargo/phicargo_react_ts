import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { Button, MuiCloseButton } from '@/components/ui';

import type { Complaint } from '../models';
import { EditComplaintActions } from './EditComplaintActions';
import { EditComplaintForm } from './EditComplaintForm';

interface Props {
  onClose: () => void;
  complaint: Complaint;
}

export const EditComplaint = ({ onClose, complaint }: Props) => {
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
          variant="h2"
          sx={{
            color: 'white',
            fontSize: '1.25rem',
            textTransform: 'uppercase',
          }}
        >
          Editar {complaint.phicargoCompany}
        </Typography>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <MuiCloseButton onClick={onClose} />
        </Box>
      </DialogTitle>
      <DialogContent>
        <section className="flex flex-row gap-4 mt-6">
          <EditComplaintForm complaint={complaint} />
          <EditComplaintActions complaint={complaint} />
        </section>
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: 3,
          pt: '0',
        }}
      >
        <Button variant="outlined" color="error" size="small" onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </>
  );
};

