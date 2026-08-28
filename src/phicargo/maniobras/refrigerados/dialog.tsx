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
import FormularioCostoExtra from '@/phicargo/costos/maniobras/form_costos_extras';
import { CostosExtrasProvider } from '@/phicargo/costos/context/context';

type Props = {
 id: number;
 open: boolean;
 handleClose: () => void;
};

export type Contenedor = {
 id: number;
 id_cp: number;
 arrival_date_formatted: string;
 stay_cutoff_date_formatted: string;
 status: string;
 x_reference: string;
 carta_porte: string;
 cliente: string;
 id_folio: number;
 diferencia: string;
 dias: number;
 horas: number;
};

const ReeferYardForm: React.FC<Props> = ({
 id,
 open,
 handleClose
}) => {

 const [isLoading, setLoading] = useState(false);
 const [data, setData] = useState<Contenedor | null>(null);
 const [FolioId, setFolio] = useState<number | null>(null);

 const fetchData = async () => {
  setLoading(true);
  try {
   const response = await odooApi.get(`/reefer_yard_stays/${id}`);
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

 const [modalShow, setModalShow] = useState(false);

 const handleShow = () => {
  setModalShow(true);
 };

 const handleCloseModal = () => {
  setModalShow(false);
 };

 return (<>
  <CostosExtrasProvider>
   <FormularioCostoExtra
    show={modalShow}
    handleClose={handleCloseModal}
    id_folio={FolioId}
   />
  </CostosExtrasProvider>

  <React.Fragment>
   <Dialog
    onClose={handleClose}
    open={open}
    maxWidth="md"
    fullWidth
   >
    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
     ID: {id}
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
        Carta porte
       </Typography>
       <Typography variant="body1" fontWeight={600}>
        {data?.carta_porte || '—'}
       </Typography>
      </Box>

      <Box>
       <Typography variant="caption" color="text.secondary">
        Contenedor
       </Typography>
       <Typography variant="body1" fontWeight={600}>
        {data?.x_reference || '—'}
       </Typography>
      </Box>

      <Box>
       <Typography variant="caption" color="text.secondary">
        Llegada a patio
       </Typography>
       <Typography variant="body1" fontWeight={600}>
        {data?.arrival_date_formatted || '—'}
       </Typography>
      </Box>

      <Box>
       <Typography variant="caption" color="text.secondary">
        Salida de patio
       </Typography>
       <Typography variant="body1" fontWeight={600}>
        {data?.stay_cutoff_date_formatted || '—'}
       </Typography>
      </Box>

      <Box>
       <Typography variant="caption" color="text.secondary">
        Días
       </Typography>
       <Typography variant="body1" fontWeight={600}>
        {data?.dias || '—'}
       </Typography>
      </Box>

      <Box>
       <Typography variant="caption" color="text.secondary">
        Horas
       </Typography>
       <Typography variant="body1" fontWeight={600}>
        {data?.horas || '—'}
       </Typography>
      </Box>

      <Box>
       <Typography variant="caption" color="text.secondary">
        Estado
       </Typography>
       <Typography variant="body1" fontWeight={600}>
        {data?.status || '—'}
       </Typography>
      </Box>

      <Box>
       <Typography variant="caption" color="text.secondary">
        ID Costo Extra
       </Typography>
       <Button
        onPress={() => {
         setFolio(data?.id_folio ?? null);
         handleShow();
        }}
        size="sm"
        color="primary"
       >
        <Typography variant="body1" fontWeight={600}>
         {data?.id_folio || '—'}
        </Typography>
       </Button>
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

export default ReeferYardForm;