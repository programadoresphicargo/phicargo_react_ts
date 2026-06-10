import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Button, Progress } from '@heroui/react';
import { EditComplaintActions } from './EditComplaintActions';
import { EditComplaintForm } from './EditComplaintForm';
import { EditComplaintCausaRaiz } from '../causa_raiz/Edit';
import { Tab, Tabs } from '@heroui/react';
import { useGetComplaintQuery } from '../../hooks/queries/useGetComplaintQuery';

interface Props {
  id: number | null;
  onClose: () => void;
}

export const EditComplaint = ({ onClose, id }: Props) => {

  const {
    getComplaintQuery: { data: complaint, isLoading },
  } = useGetComplaintQuery(id);

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
          <Button onPress={() => onClose()} radius='full' size='sm' color='primary'>Cerrar</Button>
        </Box>
      </DialogTitle>
      <DialogContent>

        {isLoading && (
          <Progress isIndeterminate size='sm' color='success'></Progress>
        )}

        <section className="flex w-full flex-col mt-5">
          <Tabs aria-label="Options" color='primary' radius='full' size="lg">
            <Tab key="1" title="Información">
              <EditComplaintForm complaint={complaint ?? null} onClose={onClose} />
            </Tab>
            {complaint && (
              <>
                <Tab key="2" title="Causa raíz">
                  <EditComplaintCausaRaiz complaint={complaint} />
                </Tab>
                <Tab key="3" title="Acciones inmediatas">
                  <EditComplaintActions complaint={complaint} type="accion inmediata" />
                </Tab>
                <Tab key="4" title="Plan de acción">
                  <EditComplaintActions complaint={complaint} type="plan de accion" />
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

