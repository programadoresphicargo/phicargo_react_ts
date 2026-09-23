import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Button } from '@heroui/react';
import MaintenanceForm, { Task } from './maintenances/maintenance_form';
import { SelectItem } from '@/types';
import { AutocompleteInput } from '@/components/inputs';
import { useForm } from 'react-hook-form';

type Configuraciones = {
  task_id: number | null,
}

const MaintenanceVehicleReport = () => {

  const initialForm: Configuraciones = {
    task_id: null,
  }

  const {
    control,
    watch
  } = useForm<Configuraciones>({
    defaultValues: initialForm,
  });

  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const taskId = watch('task_id');

  useEffect(() => {
    fetchData();
  }, [taskId]);

  const fetchData = async () => {
    if (taskId == null) return;
    try {
      setisLoading(true);
      const response = await odooApi.get(`/maintenances/report/${taskId}`);
      setData(response.data);
    } catch (error) {
      toast.error('Error al enviar los datos: ' + error);
    } finally {
      setisLoading(false);
    }
  };

  const columns = useMemo<MRT_ColumnDef<Configuraciones>[]>(
    () => [
      { accessorKey: 'vehicle', header: 'Vehiculo', },
      { accessorKey: 'marca', header: 'Marca', },
      { accessorKey: 'model', header: 'Modelo', },
      {
        accessorKey: 'kilometraje',
        header: 'Kilometraje actual',
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return value?.toLocaleString('en-US');
        },
        muiTableBodyCellProps: {
          align: 'right',
        },
      },
      { accessorKey: 'date', header: 'Ultimo mantenimineto', },
      {
        accessorKey: 'km_ultimo_mantenimiento',
        header: 'Km ultimo mant',
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return value?.toLocaleString('en-US');
        },
        muiTableBodyCellProps: {
          align: 'right',
        },
      },
      {
        accessorKey: 'intervalo_km',
        header: 'Intervalo',
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return value?.toLocaleString('en-US');
        },
        muiTableBodyCellProps: {
          align: 'right',
        },
      },
      {
        accessorKey: 'proximo_servicio_km',
        header: 'Proximo servicio',
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return value?.toLocaleString('en-US');
        },
        muiTableBodyCellProps: {
          align: 'right',
        },
      },
      {
        accessorKey: 'kilometros_restantes',
        header: 'Km restantes',
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return value?.toLocaleString('en-US');
        },
        muiTableBodyCellProps: {
          align: 'right',
        },
      },
    ], []);

  const [task, setTask] = useState<SelectItem[]>([]);

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

  const table = useMaterialReactTable({
    columns,
    data,
    state: { showProgressBars: isLoading },
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    localization: MRT_Localization_ES,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 80 },
      showColumnFilters: true,
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '14px',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 250px)',
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row.subRows?.length ? '#0456cf' : '#FFFFFF',
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '12px',
        padding: '4px 8px',
        color: row.subRows?.length ? '#FFFFFF' : '#000000',
      },
    }),
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'nowrap',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <h1
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Vehiculos
        </h1>
        <AutocompleteInput
          label="Tipo de servicio"
          control={control}
          name='task_id'
          items={task}
          rules={{ required: "Campo obligatorio" }} />
        <Button onPress={() => fetchData()} className='text-white' color='primary' radius='full' size='sm'>Recargar</Button>
      </Box >
    ),
  })

  return (
    <>
      <MaterialReactTable
        table={table}
      />
      <MaintenanceForm open={open} setOpen={() => setOpen(false)}></MaintenanceForm>
    </>
  );
};

export default MaintenanceVehicleReport;
