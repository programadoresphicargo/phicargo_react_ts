
import { Button } from '@heroui/react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@mui/material';

interface DetencionDetailProps {
  open: boolean;
  onClose: () => void;
}

const DetencionDetail = ({ open, onClose }: DetencionDetailProps) => {

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Detención
        </DialogTitle>
        <Divider></Divider>
        <DialogContent>

        </DialogContent>
        <Divider></Divider>
        <DialogActions>
          <Button onPress={onClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DetencionDetail;
