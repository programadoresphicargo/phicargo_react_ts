import odooApi from '@/api/odoo-api';
import SelectFlota from '@/phicargo/maniobras/maniobras/selects_flota';
import { Flota, OptionFlota } from '@/phicargo/maniobras/maniobras/tipado';
import { Button } from '@heroui/react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface SimpleDialogProps {
  open: boolean;
  handleClose: () => void;
}

type MGForm = {
  motogenerador1_id?: number | null;
  motogenerador2_id?: number | null;
};

const AsignacionMG = ({ open, handleClose }: SimpleDialogProps) => {

  const {
    control,
    handleSubmit,
  } = useForm<MGForm>({
    defaultValues: {
      motogenerador1_id: null,
      motogenerador2_id: null,
    },
  });

  const [motogeneradores, setMotogeneradores] = useState<OptionFlota[]>([]);
  const [isLoadingFlota, setLoadingFlota] = useState<boolean>(false);

  const getFlotaByTipo = async (tipo: string): Promise<OptionFlota[]> => {
    const response = await odooApi.get<Flota[]>(`/vehicles/fleet_type/${tipo}`);

    return response.data
      .filter(item => item.name?.startsWith('MG-'))
      .map(item => ({
        key: item.id,
        label: item.name,
        x_tipo_carga: item.x_tipo_carga,
        x_modalidad: item.x_modalidad,
      }));
  };

  useEffect(() => {
    const cargarDatos = async () => {
      setLoadingFlota(true);

      try {
        const [motogeneradores] = await Promise.all([
          getFlotaByTipo("other")
        ]);
        setMotogeneradores(motogeneradores)
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingFlota(false);
      }
    };

    cargarDatos();
  }, []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Asignación de motogenerador</DialogTitle>

      <DialogContent>

        <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Controller
              control={control}
              name="motogenerador1_id"
              render={({ field }) => (
                <SelectFlota
                  id="motogenerador1_id"
                  label="Motogenerador 1"
                  name="motogenerador1_id"
                  onChange={(val: number | null) => field.onChange(val)}
                  value={field.value ?? undefined}
                  isLoading={isLoadingFlota}
                  options={motogeneradores}
                />
              )}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <Controller
              control={control}
              name="motogenerador2_id"
              render={({ field }) => (
                <SelectFlota
                  id="motogenerador2_id"
                  label="Motogenerador 2"
                  name="motogenerador2_id"
                  onChange={(val: number | null) => field.onChange(val)}
                  value={field.value ?? undefined}
                  isLoading={isLoadingFlota}
                  options={motogeneradores}
                />
              )}
            />
          </div>
        </div>

      </DialogContent>

      <DialogActions>
        <Button onPress={() => handleSubmit} color="primary" size='sm'>
          Cerrar
        </Button>
        <Button onPress={handleClose} color="success" size='sm' className='text-white'>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AsignacionMG;