import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Button, Progress } from '@heroui/react';
import odooApi from '@/api/odoo-api';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Box } from '@mui/material';

type Props = {
 id: number;
 open: boolean;
 handleClose: () => void;
};

export type Note = {
 id: number;
 operador: string;
 viaje: string;
 fecha_creacion: string;
 vehiculo: string;
 usuario_creacion: string;
 note: string;
};

const TravelNoteDetail: React.FC<Props> = ({
 id,
 open,
 handleClose
}) => {

 const [isLoading, setLoading] = useState(false);
 const [data, setData] = useState<Note | null>(null);

 const fetchData = async () => {
  setLoading(true);
  try {
   const response = await odooApi.get(`/tms_travel/notes/${id}`);
   setData(response.data);
  } catch (error) {
   toast.error('Error al obtener los datos:' + error);
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  fetchData();
 }, [id, open]);

 return (<>
  <React.Fragment>
   <Dialog
    onClose={handleClose}
    open={open}
    maxWidth="md"
    fullWidth
   >
    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
     Nota: {id}
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
    {isLoading && (
     <Progress isIndeterminate size='sm'></Progress>
    )}
    <DialogContent dividers>
     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

      <Box>
       <Typography variant="caption" color="text.secondary">
        Viaje
       </Typography>
       <Typography variant="body1" fontWeight={600}>
        {data?.viaje || '—'}
       </Typography>
      </Box>

      <Box>
       <Typography variant="caption" color="text.secondary">
        Operador
       </Typography>
       <Typography variant="body1" fontWeight={600}>
        {data?.operador || '—'}
       </Typography>
      </Box>

      <Box>
       <Typography variant="caption" color="text.secondary">
        Vehiculo
       </Typography>
       <Typography variant="body1" fontWeight={600}>
        {data?.vehiculo || '—'}
       </Typography>
      </Box>

      <Box>
       <Typography variant="caption" color="text.secondary">
        Creado por
       </Typography>
       <Typography variant="body1" fontWeight={600}>
        {data?.usuario_creacion || '—'}
       </Typography>
      </Box>

      <Box>
       <Typography variant="caption" color="text.secondary">
        Fecha creacion
       </Typography>
       <Typography variant="body1" fontWeight={600}>
        {data?.fecha_creacion || '—'}
       </Typography>
      </Box>

      <Box>
       <Typography variant="caption" color="text.secondary">
        Nota
       </Typography>
       <Typography variant="body1" fontWeight={600}>
        {data?.note || '—'}
       </Typography>
      </Box>

     </Box>
    </DialogContent>
    <DialogActions>
     <Button autoFocus onPress={handleClose}>
      Cerrar
     </Button>
    </DialogActions>
   </Dialog>
  </React.Fragment>

 </>
 );
}

export default TravelNoteDetail;