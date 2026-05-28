import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from "@mui/material";
import AsignacionViajeModal from './AsignarViaje';

const AsignacionViajesGeneral = () => {

  const navigate = useNavigate();

  const onClose = () => {
    navigate('/turnos');
  };

  return (
    <>
      <Dialog open={true} onClose={onClose} fullScreen>
        <DialogContent>
          <AsignacionViajeModal open={true} setOpen={onClose} shift={null}></AsignacionViajeModal>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AsignacionViajesGeneral;
