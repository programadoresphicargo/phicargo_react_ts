import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Controller, useForm } from 'react-hook-form';
import { NumberInput } from '@heroui/react';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import HistorialCambios, { Mail } from '@/phicargo/almacen/solicitud/cambios/epps';


interface ConfigForm {
 id: number;
 value: number;
 mails: Mail[]
}

type Props = {
 open: boolean;
 handleClose: () => void;
};

const EnganchesDialog: React.FC<Props> = ({
 open,
 handleClose
}) => {

 const {
  control,
  handleSubmit,
  reset,
  getValues
 } = useForm<ConfigForm>({
  defaultValues: {
   value: 0,
  }
 });


 const obtenerConfiguracion = async () => {

  const response_one = await odooApi.get(
   "/ir_config_parameter/key/meta_margin_veracruz"
  );

  const response = await odooApi.get(
   `/ir_config_parameter/${response_one.data.id}`
  );

  reset(response.data);
 };

 useEffect(() => {
  obtenerConfiguracion();
 }, [reset, open]);

 const onSubmit = async (data: ConfigForm) => {
  try {
   const response = await odooApi.patch(
    `/ir_config_parameter/${data.id}`,
    {
     value: data.value
    }
   );

   if (response.data.status === "success") {
    toast.success(response.data.message);
    obtenerConfiguracion();
   }

  } catch (error: any) {
   console.log(error.response?.data?.detail);
   toast.error(
    error.response?.data?.detail ?? "Ocurrió un error"
   );
  }
 };

 const mails = getValues("mails");

 return (
  <React.Fragment>
   <Dialog
    onClose={handleClose}
    open={open}
    maxWidth="sm"
    fullWidth
   >
    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
     Número de Enganches
    </DialogTitle>
    <IconButton
     aria-label="close"
     onClick={handleClose}
     sx={(theme) => ({
      position: 'absolute',
      right: 8,
      top: 8,
      color: theme.palette.grey[500],
     })}
    >
     <CloseIcon />
    </IconButton>
    <DialogContent dividers>
     <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
       name="value"
       control={control}
       render={({ field }) => (
        <NumberInput
         size="sm"
         label="Número enganches"
         value={field.value}
         onValueChange={(value) => {
          field.onChange(value);
          handleSubmit(onSubmit)();
         }}
        />
       )}
      />
     </form>
     <div className='mt-4'>
      <HistorialCambios data={mails ?? []}></HistorialCambios>
     </div>
    </DialogContent>
    <DialogActions>
     <Button autoFocus onClick={handleClose}>
      Cerrar
     </Button>
    </DialogActions>
   </Dialog>
  </React.Fragment>
 );
}

export default EnganchesDialog;