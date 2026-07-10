
import odooApi from '@/api/odoo-api';
import { useAuthContext } from '@/modules/auth/hooks';
import ArchivosAdjuntos from '@/phicargo/viajes/estatus/archivos_adjuntos';
import { Button, Chip } from '@heroui/react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

interface DetencionDetailProps {
  open: boolean;
  onClose: () => void;
  id_detencion: number;
}

const DetencionDetail = ({ open, onClose, id_detencion }: DetencionDetailProps) => {

  const [data, setData] = useState<any>({});
  const [isLoading, setLoading] = useState(false);
  const { session } = useAuthContext();

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

  const confirmApproved = async (approved: boolean) => {
    const result = await Swal.fire({
      title: approved ? "¿Aprobar detención?" : "¿Rechazar detención?",
      text: approved
        ? "La detención será aprobada."
        : "La detención será rechazada.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: approved ? "Sí, aprobar" : "Sí, rechazar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: approved ? "#16a34a" : "#dc2626",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);

      await odooApi.patch(
        `/tms_travel/reportes_estatus_viajes/travel_detentions/approved/${id_detencion}`,
        {},
        {
          params: {
            approved,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: approved ? "Detención aprobada" : "Detención rechazada",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchData(); // Recargar información si es necesario
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Ocurrió un error",
        text:
          error.response?.data?.message ??
          error.message ??
          "No fue posible realizar la acción.",
      });
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
          <Chip
            color={data.approved === null ? "default" : data?.approved ? "success" : "danger"}
            className='text-white'>
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
          {data.approved == null && session?.user?.permissions?.includes(580) && (
            <>
              <Button
                onPress={() => confirmApproved(false)}
                color="danger"
                className="text-white"
                radius="full"
              >
                Rechazar
              </Button>

              <Button
                onPress={() => confirmApproved(true)}
                color="success"
                className="text-white"
                radius="full"
              >
                Aprobar
              </Button>
            </>
          )}
          <Button onPress={onClose} radius='full'>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DetencionDetail;
