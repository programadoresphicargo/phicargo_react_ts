import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Button } from "@heroui/react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { AutocompleteInput, NumberInput } from '@/components/inputs';
import { useForm } from 'react-hook-form';
import odooApi from '@/api/odoo-api';
import { SelectItem } from '@/types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Configuraciones = {
  model_id: number | null,
  task_id: number | null,
  intervalo_km: number | null,
}

type Modelos = {
  id: number;
  modelo: string;
  marca: string;
};

type Task = {
  id: number;
  name: string;
};

export default function MaintenanceRuleForm({ open, setOpen, id }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, id: number | null }) {

  const initialForm: Configuraciones = {
    model_id: null,
    intervalo_km: null,
    task_id: null,
  }

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<Configuraciones>({
    defaultValues: initialForm,
  });

  const [modelos, setModelos] = useState<SelectItem[]>([]);
  const [task, setTask] = useState<SelectItem[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const obtenerModelos = async (): Promise<void> => {
    const response = await odooApi.get<Modelos[]>(
      `/vehicles/models/`
    );

    setModelos(
      response.data.map((registro) => ({
        key: registro.id,
        value: `${registro.marca} ${registro.modelo}`,
      }))
    );
  };

  const getTask = async (): Promise<void> => {
    const response = await odooApi.get<Task[]>(
      `/maintenance-record/tasks/`
    );

    setTask(
      response.data.map((registro) => ({
        key: registro.id,
        value: `${registro.name}`,
      }))
    );
  };

  useEffect(() => {
    obtenerModelos();
    getTask();
    if (id !== null) {
      getMantenanceRule(id);
    } else {
      reset(initialForm);
    }
  }, [open]);

  const onSubmit = async (data: Configuraciones) => {
    try {
      setLoading(true);
      const res = await odooApi.post("/maintenances/rule/", data);
      if (res.data.status === "success") {
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error: any) {
      const detail =
        error.response?.data?.detail || error.message;
      toast.error("Error: " + detail);
    } finally {
      setLoading(false);
    }
  };

  const Update = async (data: Configuraciones) => {
    try {
      setLoading(true);
      const res = await odooApi.patch(`/maintenances/rule/${id}`, data);
      if (res.data.status === "success") {
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error: any) {
      const detail =
        error.response?.data?.detail || error.message;
      toast.error("Error: " + detail);
    } finally {
      setLoading(false);
    }
  };

  const getMantenanceRule = async (id: number): Promise<void> => {
    const response = await odooApi.get<Configuraciones>(
      `/maintenances/rule/${id}`
    );

    reset(response.data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">

        <AppBar sx={{ position: 'relative', backgroundColor: '#002887', }} elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpen(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1, fontFamily: 'Inter' }} variant="h6" component="div">
              Regla
            </Typography>
            <Button autoFocus onPress={() => setOpen(false)} radius='full' size='sm'>
              Cerrar
            </Button>
            {id == null ? (
              <Button autoFocus onPress={() => handleSubmit(onSubmit)()} color='success' radius='full' className='text-white' isLoading={isLoading} size='sm'>
                Guardar
              </Button>
            ) : (
              <Button autoFocus onPress={() => handleSubmit(Update)()} color='warning' radius='full' className='text-white' isLoading={isLoading} size='sm'>
                Actualizar
              </Button>
            )}
          </Toolbar>
        </AppBar>

        <DialogContent className="max-w-4xl space-y-4">

          <AutocompleteInput
            label="Modelo"
            control={control}
            name='model_id'
            items={modelos} />

          <NumberInput
            label="Intervalo KM"
            control={control}
            name='intervalo_km' />

          <AutocompleteInput
            label="Tipo de servicio"
            control={control}
            name='task_id'
            items={task} />

        </DialogContent>
      </Dialog>
    </div >
  );
}
