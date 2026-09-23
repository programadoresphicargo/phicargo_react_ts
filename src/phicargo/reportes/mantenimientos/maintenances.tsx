import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Button } from '@heroui/react';
import MaintenanceForm from './maintenances/maintenance_form';

const Maintenances = () => {

  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [open]);

  const fetchData = async () => {
    try {
      setisLoading(true);
      const response = await odooApi.get(`/maintenances/`);
      setData(response.data);
    } catch (error) {
      toast.error('Error al enviar los datos: ' + error);
    } finally {
      setisLoading(false);
    }
  };

  const columns = [
    { accessorKey: 'vehicle', header: 'Vehiculo', },
    { accessorKey: 'mileage', header: 'Kilometraje', },
    { accessorKey: 'date', header: 'Fecha', },
    { accessorKey: 'tipo_mantenimiento', header: 'Tipo' },
    { accessorKey: 'usuario_creacion', header: 'Creación' },
  ];

  const table = useMaterialReactTable({
    columns,
    data,
    state: { showProgressBars: isLoading },
    enableGrouping: true,
    enableGlobalFilter: true,
    enableStickyHeader: true,
    enableFilters: true,
    localization: MRT_Localization_ES,
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
        maxHeight: 'calc(100vh - 270px)',
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
          Mantenimientos
        </h1>
        <Button onPress={() => setOpen(true)} className='text-white' color='success' radius='full' size='sm'>Nuevo</Button>
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

export default Maintenances;
