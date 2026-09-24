import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Button } from "@heroui/react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { NumberInput } from '@/components/inputs';
import { useForm } from 'react-hook-form';
import odooApi from '@/api/odoo-api';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Odometer } from './odometers';

export default function OdometerForm({ open, setOpen, vehicle_id }: {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  vehicle_id: number,
}) {

  const initialForm: Odometer = {
    vehicle_id: vehicle_id,
    value: 0
  }

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<Odometer>({
    defaultValues: initialForm,
  });

  const [isLoading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: Odometer) => {
    try {
      setLoading(true);
      let res = await odooApi.post(`/maintenances/odometer/`, data);
      if (res.data.status === "success") {
        toast.success(res.data.message);
        reset(initialForm);
        setOpen(false);
      }
    } catch (error: any) {
      const detail =
        error.response?.data?.detail || error.message;
      toast.error("Error: " + detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">

      <AppBar sx={{ position: 'relative' }} elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setOpen(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1, fontFamily: 'Inter' }} variant="h6" component="div">
            Nuevo odometro
          </Typography>
          <Button autoFocus onPress={() => setOpen(false)} radius='full' size='sm'>
            Cerrar
          </Button>
          <Button autoFocus onPress={() => handleSubmit(onSubmit)()} color='success' radius='full' className='text-white' isLoading={isLoading} size='sm'>
            Registrar
          </Button>
        </Toolbar>
      </AppBar>

      <DialogContent className="max-w-4xl space-y-4">

        <NumberInput
          label="Kilometraje"
          control={control}
          name='value'
          rules={{ required: "Campo obligatorio" }} />

      </DialogContent>
    </Dialog>
  );
}
