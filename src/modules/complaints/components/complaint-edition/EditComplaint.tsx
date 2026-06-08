import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Button } from '@heroui/react';
import type { Complaint } from '../../models';
import { EditComplaintActions } from './EditComplaintActions';
import { EditComplaintForm } from './EditComplaintForm';
import { EditComplaintCausaRaiz } from '../causa_raiz/Edit';
import { Tab, Tabs } from '@heroui/react';

interface Props {
  complaint: Complaint | null;
  onClose: () => void;
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
        {complaint?.id && (
          `Editar No Conformidad #${complaint.id}`
        )}
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Button onPress={() => onClose()}>Cerrar</Button>
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
        <Button color="danger" size="sm" onPress={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </>
  );
};

