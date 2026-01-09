import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, Chip, Input } from '@heroui/react';
import SelectFlota from '../maniobras/selects_flota';

const FormularioContenedor = ({ open, handleClose, data }) => {

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Información</DialogTitle>
        <DialogContent>

          <div className="flex flex-col gap-4">

            <Chip color='success' className='text-white'>{data?.x_reference}</Chip>
            <h1>Cliente: {data?.cliente}</h1>

            <Input label="Sellos" variant="bordered"></Input>

            <SelectFlota
              label={'Remolque'}
              tipo={'trailer'}>
            </SelectFlota>

            <SelectFlota
              label={'Dolly'}
              tipo={'dolly'}>
            </SelectFlota>
          </div>

        </DialogContent>
        <DialogActions>
          <Button onPress={handleClose} radius='full'>Cancelar</Button>
          <Button type="submit" form="subscription-form" color='primary' radius='full'>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div >
  );
};

export default FormularioContenedor;
