import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Divider,
  Chip,
  Skeleton,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';

import { Button, Progress } from '@heroui/react';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';

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

const COLORS = {
  navy: '#0B2149',
  blue: '#174EA6',
  lightBlue: '#EEF4FF',
  background: '#F7F9FC',
  border: '#E4E9F0',
  text: '#263449',
  secondary: '#64748B',
};

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 1.5,
      p: 2,
      minWidth: 0,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 2,
      fontFamily: 'Inter',
      backgroundColor: '#FFFFFF',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        borderColor: '#B9CBE8',
        boxShadow: '0 2px 8px rgba(15, 35, 70, 0.04)',
      },
    }}
  >
    <Box
      sx={{
        width: 38,
        height: 38,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 1.5,
        color: COLORS.blue,
        backgroundColor: COLORS.lightBlue,
      }}
    >
      {icon}
    </Box>

    <Box sx={{ minWidth: 0, flex: 1, pt: 0.25 }}>
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 600,
          color: COLORS.secondary,
          fontFamily: 'Inter',
          textTransform: 'uppercase',
          letterSpacing: '0.45px',
          mb: 0.75,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 600,
          color: value ? COLORS.text : '#94A3B8',
          lineHeight: 1.6,
          overflowWrap: 'anywhere',
        }}
      >
        {value || 'No disponible'}
      </Typography>
    </Box>
  </Box>
);

const TravelNoteDetail: React.FC<Props> = ({
  id,
  open,
  handleClose,
}) => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<Note | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setData(null);

    try {
      const response = await odooApi.get(`/notes/tms_travel/${id}`);
      setData(response.data);
    } catch (error) {
      toast.error('Error al obtener el detalle de la nota.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (open) {
      fetchData();
    } else {
      setData(null);
    }
  }, [open, fetchData]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(11, 33, 73, 0.18)',
            backgroundColor: '#FFFFFF',
          },
        },
      }}
    >
      {/* ENCABEZADO */}
      <DialogTitle
        sx={{
          p: 0,
          color: '#FFFFFF',
          background: `linear-gradient(115deg, ${COLORS.navy} 0%, #153D76 100%)`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            px: { xs: 2.5, sm: 3.5 },
            py: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <StickyNote2OutlinedIcon sx={{ fontSize: 25 }} />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: 19,
                  fontWeight: 700,
                  letterSpacing: '-0.3px',
                }}
              >
                Detalle de nota
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.72)',
                }}
              >
                Información y observaciones del viaje
              </Typography>
            </Box>
          </Box>

          <IconButton
            aria-label="Cerrar"
            onClick={handleClose}
            sx={{
              color: '#FFFFFF',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.12)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* IDENTIFICADOR */}
        <Box
          sx={{
            px: { xs: 2.5, sm: 3.5 },
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
            backgroundColor: 'rgba(0,0,0,0.12)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TagOutlinedIcon sx={{ fontSize: 17, opacity: 0.8 }} />
            <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
              Folio de nota
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.4px',
            }}
          >
            NOTA-{id}
          </Typography>
        </Box>
      </DialogTitle>

      {/* BARRA DE CARGA */}
      {isLoading && (
        <Progress
          aria-label="Cargando información"
          isIndeterminate
          size="sm"
          className="w-full"
        />
      )}

      {/* CONTENIDO */}
      <DialogContent
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          backgroundColor: COLORS.background,
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Skeleton variant="rounded" height={62} />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 1.5,
              }}
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} variant="rounded" height={82} />
              ))}
            </Box>
            <Skeleton variant="rounded" height={150} />
          </Box>
        ) : data ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* RESUMEN DEL VIAJE */}
            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                flexWrap: 'wrap',
                backgroundColor: '#FFFFFF',
                border: `1px solid ${COLORS.border}`,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1.5,
                    backgroundColor: COLORS.lightBlue,
                    color: COLORS.blue,
                  }}
                >
                  <LocalShippingOutlinedIcon />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: COLORS.secondary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.45px',
                    }}
                  >
                    Viaje relacionado
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,
                      fontSize: 15,
                      fontWeight: 700,
                      color: COLORS.navy,
                    }}
                  >
                    {data.viaje || 'Sin viaje relacionado'}
                  </Typography>
                </Box>
              </Box>

              <Chip
                label="Nota de viaje"
                size="small"
                sx={{
                  borderRadius: 1.5,
                  fontWeight: 600,
                  fontSize: 11,
                  color: COLORS.blue,
                  backgroundColor: COLORS.lightBlue,
                  border: '1px solid #D8E5FA',
                }}
              />
            </Box>

            {/* DATOS GENERALES */}
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: 18,
                    borderRadius: 1,
                    backgroundColor: COLORS.blue,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: COLORS.navy,
                  }}
                >
                  Información general
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 1.5,
                }}
              >
                <InfoItem
                  icon={<PersonOutlineIcon fontSize="small" />}
                  label="Operador"
                  value={data.operador}
                />

                <InfoItem
                  icon={<DirectionsCarOutlinedIcon fontSize="small" />}
                  label="Vehículo"
                  value={data.vehiculo}
                />

                <InfoItem
                  icon={<AccountCircleOutlinedIcon fontSize="small" />}
                  label="Creado por"
                  value={data.usuario_creacion}
                />

                <InfoItem
                  icon={<CalendarTodayOutlinedIcon fontSize="small" />}
                  label="Fecha de creación"
                  value={data.fecha_creacion}
                />
              </Box>
            </Box>

            <Divider sx={{ borderColor: COLORS.border }} />

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
                <Box
                  sx={{
                    width: 4,
                    height: 18,
                    borderRadius: 1,
                    backgroundColor: COLORS.blue,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: COLORS.navy,
                  }}
                >
                  Observaciones
                </Typography>
              </Box>

              <Box
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  minHeight: 130,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 2,
                  backgroundColor: '#FFFFFF',
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 3,
                    height: '100%',
                    borderRadius: '2px 0 0 2px',
                    backgroundColor: COLORS.blue,
                  }}
                />

                <Typography
                  sx={{
                    pl: 1,
                    fontSize: 13,
                    lineHeight: 1.9,
                    fontFamily: 'Inter',
                    color: data.note ? COLORS.text : COLORS.secondary,
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {data.note || 'No hay observaciones registradas para esta nota.'}
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              py: 7,
              px: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                backgroundColor: '#E9EEF5',
                color: COLORS.secondary,
              }}
            >
              <StickyNote2OutlinedIcon sx={{ fontSize: 28 }} />
            </Box>

            <Typography sx={{ fontSize: 15, fontWeight: 700, color: COLORS.navy }}>
              Información no disponible
            </Typography>

            <Typography sx={{ fontSize: 12, color: COLORS.secondary }}>
              No fue posible mostrar el detalle de esta nota.
            </Typography>

            <Button
              size="sm"
              color="primary"
              variant="flat"
              onPress={fetchData}
            >
              Reintentar
            </Button>
          </Box>
        )}
      </DialogContent>

      {/* PIE */}
      <DialogActions
        sx={{
          px: { xs: 2.5, sm: 3.5 },
          py: 2,
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF',
          borderTop: `1px solid ${COLORS.border}`,
        }}
      >
        <Typography
          sx={{
            display: { xs: 'none', sm: 'block' },
            fontSize: 11,
            color: COLORS.secondary,
          }}
        >
          Detalle de registro operativo
        </Typography>

        <Button
          autoFocus
          color="primary"
          variant="solid"
          radius="md"
          onPress={handleClose}
          size='sm'
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TravelNoteDetail;