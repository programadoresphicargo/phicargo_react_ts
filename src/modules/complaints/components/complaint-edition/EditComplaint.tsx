import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { Button, MuiCloseButton } from '@/components/ui';

import type { Complaint } from '../../models';
import { EditComplaintActions } from './EditComplaintActions';
import { EditComplaintForm } from './EditComplaintForm';
import { EditComplaintCausaRaiz } from '../causa_raiz/Edit';
import { Tab, Tabs } from '@heroui/react';

interface Props {
  onClose: () => void;
  complaint: Complaint | null;
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
          {complaint?.id && (
            `Editar No Conformidad #${complaint.id}`
          )}
        </Typography>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <MuiCloseButton onClick={onClose} />
        </Box>
      </DialogTitle>
      <DialogContent>
        <section className="flex w-full flex-col mt-5">
          <Tabs aria-label="Options" color='primary'>
            <Tab key="1" title="Información">
              <EditComplaintForm complaint={complaint} onClose={onClose} />
            </Tab>
            {complaint && (
              <>
                <Tab key="2" title="Causa raíz">
                  <EditComplaintCausaRaiz complaint={complaint} />
                </Tab>
                <Tab key="3" title="Plan de acción">
                  <EditComplaintActions complaint={complaint} />
                </Tab>
              </>
            )}
          </Tabs>
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

