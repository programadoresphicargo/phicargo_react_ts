
import odooApi from '@/api/odoo-api';
import SelectFlota from '@/phicargo/maniobras/maniobras/selects_flota';
import { Flota, OptionFlota } from '@/phicargo/maniobras/maniobras/tipado';

import { Accordion, AccordionItem, Button } from '@heroui/react';

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

interface Props {
  open: boolean;
  handleClose: () => void;
  travelId: number;
  waybillId: number;
  initialData?: Partial<MGForm> | null;
}

type MGForm = {
  id: number;

  // Asignación al viaje
  x_motogenerador_1: number | null;
  x_motogenerador_2: number | null;

  // Asignación a la maniobra
  motogenerador_1: number | null;
  motogenerador_2: number | null;
};

type SelectorName =
  | 'x_motogenerador_1'
  | 'x_motogenerador_2'
  | 'motogenerador_1'
  | 'motogenerador_2';

const DEFAULT_VALUES: MGForm = {
  id: 0,
  x_motogenerador_1: null,
  x_motogenerador_2: null,
  motogenerador_1: null,
  motogenerador_2: null,
};

const AsignacionMG = ({
  open,
  handleClose,
  travelId,
  waybillId,
  initialData,
}: Props) => {

  // =====================================================
  // FORMULARIO
  // =====================================================

  const {
    control,
    handleSubmit,
    reset,
    watch,
  } = useForm<MGForm>({
    defaultValues: DEFAULT_VALUES,
  });

  // =====================================================
  // ESTADOS
  // =====================================================

  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingFlota, setIsLoadingFlota] = useState(false);
  const [isCreatingManiobra, setIsCreatingManiobra] = useState(false);

  const [motogeneradores, setMotogeneradores] = useState<OptionFlota[]>([]);
  const [maniobraId, setManiobraId] = useState<number | null>(null);

  // Valores seleccionados para el viaje
  const viajeMG1 = watch('x_motogenerador_1');
  const viajeMG2 = watch('x_motogenerador_2');

  // Valores seleccionados para la maniobra
  const maniobraMG1 = watch('motogenerador_1');
  const maniobraMG2 = watch('motogenerador_2');

  // =====================================================
  // CARGAR INFORMACIÓN INICIAL
  // =====================================================

  useEffect(() => {
    if (!open) return;

    let active = true;

    reset({
      ...DEFAULT_VALUES,
      id: travelId,
      x_motogenerador_1: initialData?.x_motogenerador_1 ?? null,
      x_motogenerador_2: initialData?.x_motogenerador_2 ?? null,
      motogenerador_1: null,
      motogenerador_2: null,
    });

    setManiobraId(null);

    // Consultar flota
    const cargarFlota = async () => {
      setIsLoadingFlota(true);

      try {
        const response = await odooApi.get<Flota[]>(
          '/vehicles/fleet_type/other'
        );

        if (!active) return;

        const options: OptionFlota[] = response.data
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
        if (active) {
          toast.error('No fue posible cargar los motogeneradores.');
        }
      } finally {
        if (active) setIsLoadingFlota(false);
      }
    };

    // Crear maniobra de retiro
    const crearManiobra = async () => {
      if (!travelId) return;

      setIsCreatingManiobra(true);

      try {
        const response = await odooApi.post(
          `/maniobras/create_refrigerados/${travelId}`
        );

        const id = response.data?.data?.id_maniobra;

        if (!id) {
          throw new Error('No se recibió el ID de la maniobra.');
        }

        if (active) {
          setManiobraId(Number(id));
          reset({
            ...DEFAULT_VALUES,
            id: travelId,
            x_motogenerador_1: initialData?.x_motogenerador_1 ?? null,
            x_motogenerador_2: initialData?.x_motogenerador_2 ?? null,
            motogenerador_1: response.data?.data?.motogenerador_1 ?? null,
            motogenerador_2: response.data?.data?.motogenerador_2 ?? null,
          });
        }

      } catch (error) {
        console.error(error);

        if (active) {
          toast.error('No fue posible crear la maniobra de retiro.');
        }
      } finally {
        if (active) setIsCreatingManiobra(false);
      }
    };

    cargarFlota();
    crearManiobra();

    return () => {
      active = false;
    };

  }, [open, travelId, waybillId, initialData, reset]);

  // =====================================================
  // ASIGNAR MOTOGENERADORES AL VIAJE
  // =====================================================

  const asignarViaje = async (data: MGForm) => {
    try {
      setIsSaving(true);

      const response = await odooApi.post(
        '/tms_waybill/TravelGeneratorAssignment/',
        {
          id: travelId,
          x_motogenerador_1: data.x_motogenerador_1,
          x_motogenerador_2: data.x_motogenerador_2,
        }
      );

      if (response.data.status === 'success') {
        toast.success(response.data.message);
        handleClose();
      } else {
        toast.error(
          response.data.message || 'No fue posible asignar los motogeneradores.'
        );
      }

    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.detail || error.message || 'Error al asignar el viaje.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // =====================================================
  // ASIGNAR MOTOGENERADORES A LA MANIOBRA
  // =====================================================

  const asignarManiobra = async (data: MGForm) => {
    if (!maniobraId) {
      toast.error('No se ha generado la maniobra de retiro.');
      return;
    }

    try {
      setIsSaving(true);

      const response = await odooApi.put(
        `/maniobras/equipo/${maniobraId}`,
        {
          motogenerador_1: data.motogenerador_1,
          motogenerador_2: data.motogenerador_2,
        }
      );

      if (response.data.status === 'success') {
        toast.success(response.data.message);
        handleClose();
      } else {
        toast.error(
          response.data.message || 'No fue posible asignar los motogeneradores.'
        );
      }

    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.detail || error.message || 'Error al asignar la maniobra.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // =====================================================
  // SELECTOR REUTILIZABLE
  // =====================================================

  const renderSelector = (
    name: SelectorName,
    label: string,
    description: string,
    excludedId: number | null
  ) => (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        border: '1px solid #E2E8F0',
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
            onChange={(value: number | null) => field.onChange(value)}
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

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Dialog
      open={open}
      onClose={isSaving ? undefined : handleClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
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
              Configura los equipos asociados al viaje y a la maniobra.
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 3 }}>
        <Accordion variant="shadow">

          {/* MANIOBRA */}

          <AccordionItem
            key="maniobra"
            aria-label="Maniobra de retiro"
            title="Maniobra retiro"
          >
            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">

              {renderSelector(
                'motogenerador_1',
                'Motogenerador 1',
                'Primer equipo',
                maniobraMG2
              )}

              {renderSelector(
                'motogenerador_2',
                'Motogenerador 2',
                'Segundo equipo',
                maniobraMG1
              )}

              <Button
                color="warning"
                size="sm"
                className="text-white"
                onPress={() => handleSubmit(asignarManiobra)()}
                isLoading={isSaving}
                isDisabled={
                  isLoadingFlota ||
                  isCreatingManiobra ||
                  !maniobraId ||
                  isSaving
                }
              >
                Guardar asignación
              </Button>

            </Box>
          </AccordionItem>

          {/* VIAJE */}

          <AccordionItem
            key="viaje"
            aria-label="Asignación al viaje"
            title="Viaje"
          >
            <Box display="flex" gap={2} flexWrap="wrap">

              {renderSelector(
                'x_motogenerador_1',
                'Motogenerador 1',
                'Primer equipo',
                viajeMG2
              )}

              {renderSelector(
                'x_motogenerador_2',
                'Motogenerador 2',
                'Segundo equipo',
                viajeMG1
              )}

            </Box>

            <Box display="flex" justifyContent="flex-end" pt={2}>
              <Button
                color="success"
                size="sm"
                className="text-white"
                onPress={() => handleSubmit(asignarViaje)()}
                isLoading={isSaving}
                isDisabled={isLoadingFlota || isSaving}
              >
                Guardar asignación
              </Button>
            </Box>
          </AccordionItem>

        </Accordion>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          variant="flat"
          color="default"
          size="sm"
          onPress={handleClose}
          isDisabled={isSaving}
        >
          Cancelar
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default AsignacionMG;
