import odooApi from '@/api/odoo-api';
import SelectFlota from '@/phicargo/maniobras/maniobras/selects_flota';
import { Flota, OptionFlota } from '@/phicargo/maniobras/maniobras/tipado';
import { Button } from '@heroui/react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Divider,
} from '@mui/material';

import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface SimpleDialogProps {
  open: boolean;
  handleClose: () => void;
  travelId: number;
  initialData?: Partial<MGForm> | null;
}

type MGForm = {
  id: number;
  x_motogenerador_1?: number | null;
  x_motogenerador_2?: number | null;
};

const AsignacionMG = ({
  open,
  handleClose,
  travelId,
  initialData,
}: SimpleDialogProps) => {

  const {
    control,
    handleSubmit,
    reset,
    watch,
  } = useForm<MGForm>({
    defaultValues: {
      id: travelId,
      x_motogenerador_1: null,
      x_motogenerador_2: null,
    },
  });

  useEffect(() => {
    if (open) {
      console.log(initialData);
      reset({
        id: travelId,
        x_motogenerador_1: initialData?.x_motogenerador_1 ?? null,
        x_motogenerador_2: initialData?.x_motogenerador_2 ?? null,
      });
    }
  }, [open, travelId, initialData, reset]);

  const [isLoading, setLoading] = useState(false);
  const [motogeneradores, setMotogeneradores] = useState<OptionFlota[]>([]);
  const [isLoadingFlota, setLoadingFlota] = useState(false);

  const mg1 = watch('x_motogenerador_1');
  const mg2 = watch('x_motogenerador_2');

  // Consultar motogeneradores
  useEffect(() => {
    if (!open) return;

    const cargarDatos = async () => {
      setLoadingFlota(true);

      try {
        const response = await odooApi.get<Flota[]>(
          '/vehicles/fleet_type/other'
        );

        const options = response.data
          .filter(item => item.name?.startsWith('MG-'))
          .map(item => ({
            key: item.id,
            label: item.name,
            x_tipo_carga: item.x_tipo_carga,
            x_modalidad: item.x_modalidad,
          }));

        setMotogeneradores(options);

      } catch (error) {
        console.error(error);
        toast.error('No fue posible cargar los motogeneradores.');
      } finally {
        setLoadingFlota(false);
      }
    };

    cargarDatos();
  }, [open]);

  const asignar_viaje = async (data: MGForm) => {
    try {
      setLoading(true);

      const res = await odooApi.post(
        '/tms_waybill/TravelGeneratorAssignment/',
        data
      );

      if (res.data.status === 'success') {
        toast.success(res.data.message);
        handleClose();
      } else {
        toast.error(res.data.message || 'No fue posible realizar la asignación.');
      }

    } catch (error: any) {
      toast.error(
        'Error: ' +
        (error.response?.data?.detail || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const renderSelector = (
    name: 'x_motogenerador_1' | 'x_motogenerador_2',
    label: string,
    description: string,
    excludedId: number | null | undefined,
  ) => (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        border: '1px solid',
        borderColor: '#E2E8F0',
        borderRadius: 2,
        p: 2,
        bgcolor: '#FFFFFF',
      }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 2,
            bgcolor: '#FFF3E0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#E58A00',
          }}
        >
          ⚡
        </Box>

        <Box>
          <Typography fontWeight={700} fontSize={13}>
            {label}
          </Typography>
          <Typography color="text.secondary" fontSize={11}>
            {description}
          </Typography>
        </Box>
      </Box>

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <SelectFlota
            id={name}
            label="Seleccionar motogenerador"
            name={name}
            onChange={(val: number | null) => field.onChange(val)}
            value={field.value ?? undefined}
            isLoading={isLoadingFlota}
            options={motogeneradores.filter(
              item => item.key !== excludedId
            )}
          />
        )}
      />
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      {/* Encabezado */}
      <DialogTitle sx={{ pb: 2 }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              bgcolor: '#FFF3E0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 21,
            }}
          >
            ⚡
          </Box>

          <Box flex={1}>
            <Typography fontWeight={700} fontSize={17}>
              Asignación de motogeneradores
            </Typography>

            <Typography color="text.secondary" fontSize={12}>
              Configura los equipos asociados al viaje.
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 3 }}>
        <Box display="flex" gap={2}>
          {renderSelector(
            'x_motogenerador_1',
            'Motogenerador 1',
            'Primer equipo',
            mg2
          )}

          {renderSelector(
            'x_motogenerador_2',
            'Motogenerador 2',
            'Segundo equipo',
            mg1
          )}
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          variant="flat"
          color="default"
          size="sm"
          onPress={handleClose}
          isDisabled={isLoading}
        >
          Cancelar
        </Button>

        <Button
          color="success"
          size="sm"
          className="text-white"
          onPress={() => handleSubmit(asignar_viaje)()}
          isLoading={isLoading}
          isDisabled={isLoadingFlota}
        >
          Guardar asignación
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AsignacionMG;