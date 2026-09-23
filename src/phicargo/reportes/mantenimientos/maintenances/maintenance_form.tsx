import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Button } from "@heroui/react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { AutocompleteInput, DatePickerInput, NumberInput, TextareaInput, VehicleSearchInput } from '@/components/inputs';
import { useForm } from 'react-hook-form';
import odooApi from '@/api/odoo-api';
import { SelectItem } from '@/types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import dayjs, { Dayjs } from 'dayjs';

type Configuraciones = {
  vehicle_id: number | null,
  task_id: number | null,
  mileage: number | null,
  observaciones: string,
  date: Dayjs | null,
}

export type Task = {
  id: number;
  name: string;
};

export default function MaintenanceForm({ open, setOpen }: {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}) {

  const initialForm: Configuraciones = {
    vehicle_id: null,
    mileage: null,
    task_id: null,
    observaciones: "",
    date: dayjs(),
  }

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue
  } = useForm<Configuraciones>({
    defaultValues: initialForm,
  });

  const [task, setTask] = useState<SelectItem[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

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
    getTask();
  }, [open]);

  const onSubmit = async (data: Configuraciones) => {
    try {
      setLoading(true);
      const res = await odooApi.post("/maintenances/", data);
      if (res.data.status === "success") {
        toast.success(res.data.message);
        reset(initialForm);
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

  const vehicleId = watch('vehicle_id');

  useEffect(() => {
    if (!vehicleId) {
      setValue("mileage", null);
      return;
    }

    const loadMileage = async () => {
      try {
        const response = await odooApi.get(
          `/vehicles/${vehicleId}`
        );

        setValue(
          "mileage",
          response.data.odometer,
          {
            shouldValidate: true,
            shouldDirty: false
          }
        );
      } catch (error) {
        setValue("mileage", null);
      }
    };

    loadMileage();
  }, [vehicleId, setValue]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">

      <AppBar sx={{ position: 'relative' }} elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setOpen(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Registro de Mantenimineto
          </Typography>
          <Button autoFocus onPress={() => setOpen(false)} radius='full' size='sm'>
            Cerrar
          </Button>
          <Button autoFocus onPress={() => handleSubmit(onSubmit)()} color='success' radius='full' className='text-white' isLoading={isLoading} size='sm'>
            Guardar
          </Button>
        </Toolbar>
      </AppBar>

      <DialogContent className="max-w-4xl space-y-4">

        <VehicleSearchInput
          control={control}
          name="vehicle_id"
          vehicleId={vehicleId}
          required
        />

        <DatePickerInput
          control={control}
          name="date"
          label="Fecha de Ingreso"
          initialValue={dayjs()}
          rules={{ required: "Campo obligatorio" }}
        />

        <NumberInput
          label="Kilometraje"
          control={control}
          name='mileage'
          rules={{ required: "Campo obligatorio" }} />

        <AutocompleteInput
          label="Tipo de mantenimiento"
          control={control}
          name='task_id'
          items={task}
          rules={{ required: "Campo obligatorio" }} />

        <TextareaInput control={control} name='observaciones' label="Observaciones"></TextareaInput>

      </DialogContent>
    </Dialog>
  );
}
