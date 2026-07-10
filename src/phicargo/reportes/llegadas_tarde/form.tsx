
import odooApi from '@/api/odoo-api';
import ArchivosAdjuntos from '@/phicargo/viajes/estatus/archivos_adjuntos';
import { Button, Chip } from '@heroui/react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface DetencionDetailProps {
  open: boolean;
  onClose: () => void;
  id_detencion: number;
}

const DetencionDetail = ({ open, onClose, id_detencion }: DetencionDetailProps) => {

  const [data, setData] = useState<any>({});
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [open, id_detencion]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get(`/tms_travel/reportes_estatus_viajes/travel_detentions/${id_detencion}`);
      setData(response.data);
    } catch (error: any) {
      const errorMessage = error.response
        ? `Error: ${error.response.status} - ${error.response.data.message}`
        : error.message;
      toast.error('Error al enviar los datos: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const Approved = async (Approved: boolean) => {
    try {
      setLoading(true);
      const response = await odooApi.patch(
        `/tms_travel/reportes_estatus_viajes/travel_detentions/approved/${id_detencion}`,
        {},
        {
          params: {
            approved: Approved,
          },
        }
      );
      if (response.data.status == "success") {
        toast.success(response.data.message);
        fetchData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      const errorMessage = error.response
        ? `Error: ${error.response.status} - ${error.response.data.message}`
        : error.message;
      toast.error('Error al enviar los datos: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Detención ID:{id_detencion}
          <Chip color={data.approved === null ? "default" : data?.approved ? "success" : "danger"} className='text-white'>
            {data.approved === null
              ? "Pendiente"
              : data.approved
                ? "Aprobado"
                : "Rechazado"}
          </Chip>
        </DialogTitle>
        <Divider></Divider>
        <DialogContent>

          <DialogContent dividers>
            {isLoading ? (
              <Typography>Cargando...</Typography>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Información de la detención
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">
                      Viaje
                    </Typography>
                    <Typography>{data.viaje}</Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">
                      Usuario que registró
                    </Typography>
                    <Typography>{data.usuario_creacion}</Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">
                      Inicio de detención
                    </Typography>
                    <Typography>{data.start_date}</Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">
                      Fin de detención
                    </Typography>
                    <Typography>
                      {data.end_date ?? "Detención abierta"}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      Comentarios
                    </Typography>
                    <Typography>{data.comentarios}</Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Información del reporte
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">
                      Estatus
                    </Typography>
                    <Typography>{data.reporte?.nombre_estatus}</Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">
                      Fecha de envío
                    </Typography>
                    <Typography>{data.reporte?.fecha_envio}</Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">
                      Tipo
                    </Typography>
                    <Typography>{data.reporte?.tipo}</Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">
                      Tipo de registrante
                    </Typography>
                    <Typography>{data.reporte?.tipo_registrante}</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      Comentarios del reporte
                    </Typography>
                    <Typography>
                      {data.reporte?.comentarios_estatus ?? "Sin comentarios"}
                    </Typography>
                  </Grid>

                  <ArchivosAdjuntos id_reporte={data?.id_reporte} tabla='reportes_estatus_viajes'></ArchivosAdjuntos>
                </Grid>
              </>
            )}
          </DialogContent>

        </DialogContent>
        <Divider></Divider>
        <DialogActions>
          <Button onPress={() => Approved(false)} color='danger' className='text-white' radius='full'>Cancelar</Button>
          <Button onPress={() => Approved(true)} color='success' className='text-white' radius='full'>Aprobar</Button>
          <Button onPress={onClose} radius='full'>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DetencionDetail;
