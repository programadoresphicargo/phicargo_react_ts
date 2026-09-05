import * as React from 'react';
import { useEffect, useState } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';

import { Button, Progress } from '@heroui/react';

import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';

type Props = {
  id: number;
  open: boolean;
  handleClose: () => void;
};

export type Note = {
  id_folio: number;
  id: number;
  operador: string;
  viaje: string;
  fecha_creacion: string;
  vehiculo: string;
  usuario_creacion_nota: string;
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
      const response = await odooApi.get(`/notes/costos_extras/${id}`);
      setData(response.data);
    } catch (error) {
      toast.error('Error al obtener los datos: ' + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [id, open]);

  const InfoItem = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value?: string;
  }) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        p: 1.5,
        borderRadius: 2,
        backgroundColor: 'grey.50',
        border: '1px solid',
        borderColor: 'grey.200',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          borderRadius: '50%',
          backgroundColor: 'primary.50',
          color: 'primary.main',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            mb: 0.3,
          }}
        >
          {label}
        </Typography>

        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            wordBreak: 'break-word',
          }}
        >
          {value || '—'}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle
        sx={{
          px: 3,
          py: 2.5,
          backgroundColor: 'grey.50',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: 2,
              backgroundColor: 'primary.main',
              color: 'white',
            }}
          >
            <StickyNote2OutlinedIcon />
          </Box>

          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
            >
              Detalle de nota
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Nota #{id}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 12,
          top: 12,
          color: 'grey.500',
          '&:hover': {
            backgroundColor: 'grey.200',
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* LOADING */}
      {isLoading && (
        <Progress
          isIndeterminate
          size="sm"
        />
      )}

      <DialogContent
        sx={{
          px: 3,
          py: 3,
        }}
      >
        {data && (
          <>
            {/* RESUMEN */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3,
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={700}
              >
                Información del viaje
              </Typography>

              <Chip
                icon={<LocalShippingOutlinedIcon />}
                label={data.viaje || 'Sin viaje'}
                size="medium"
                color="primary"
                variant="filled"
              />
            </Box>

            {/* INFORMACIÓN */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: '1fr 1fr',
                },
                gap: 1.5,
              }}
            >
              <InfoItem
                icon={<LocalShippingOutlinedIcon fontSize="small" />}
                label="Folio"
                value={data.id_folio.toString()}
              />

              <InfoItem
                icon={<AccountCircleOutlinedIcon fontSize="small" />}
                label="Creado por"
                value={data.usuario_creacion_nota}
              />

              <InfoItem
                icon={<CalendarTodayOutlinedIcon fontSize="small" />}
                label="Fecha de creación"
                value={data.fecha_creacion}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* NOTA */}
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 1.5,
                }}
              >
                <StickyNote2OutlinedIcon
                  fontSize="small"
                  color="primary"
                />

                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                >
                  Nota
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'grey.50',
                  border: '1px solid',
                  borderColor: 'grey.200',
                  minHeight: 100,
                }}
              >
                <Typography
                  variant="body2"
                  color={
                    data.note
                      ? 'text.primary'
                      : 'text.secondary'
                  }
                  sx={{
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.7,
                  }}
                >
                  {data.note || 'No hay ninguna nota registrada.'}
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          backgroundColor: 'grey.50',
          borderTop: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Button
          autoFocus
          onPress={handleClose}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TravelNoteDetail;