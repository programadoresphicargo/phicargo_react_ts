import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Button } from '@heroui/react';
import OdometerHistory from './history';

export type Odometer = {
  id?: number,
  vehicle_id: number,
  value: number,
}

const Odometers = () => {

  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState<Odometer[]>([]);
  const [open, setOpen] = useState(false);
  const [idVehicle, setVehicle] = useState<number>(0);

  useEffect(() => {
    fetchData();
  }, [open]);

  const fetchData = async () => {
    try {
      setisLoading(true);
      const response = await odooApi.get(`/vehicles/`);
      setData(response.data);
    } catch (error) {
      toast.error('Error al enviar los datos: ' + error);
    } finally {
      setisLoading(false);
    }
  };

  const columns = useMemo<MRT_ColumnDef<Odometer>[]>(
    () => [
      { accessorKey: 'name2', header: 'Vehiculo', },
      {
        accessorKey: 'odometer',
        header: 'Kilometraje',
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return value?.toLocaleString('en-US');
        },
        muiTableBodyCellProps: {
          align: 'right',
        },
      },
      { accessorKey: 'odometer_date', header: 'Fecha de lectura', },
    ], []);

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
        maxHeight: 'calc(100vh - 240px)',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        setOpen(true);
        setVehicle(row.original.id ?? 0);
      },
      style: {
        cursor: 'pointer',
      },
    }),
    muiTableBodyCellProps: ({ row }) => {
      return {
        sx: {
          backgroundColor: row.subRows?.length
            ? '#0456cf'
            : row.index % 2 === 0
              ? '#FFFFFF'
              : '#F8F9FA',
          color: row.subRows?.length ? '#FFFFFF' : '#000000',
          fontFamily: 'Inter',
          fontWeight: 'normal',
          fontSize: '12px',
          padding: '4px 8px'
        },
      };
    },
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
          Odometros
        </h1>
        <Button onPress={() => fetchData()} className='text-white' color='primary' radius='full' size='sm'>Recargar</Button>
      </Box >
    ),
  })

  return (
    <>
      <MaterialReactTable
        table={table}
      />
      <OdometerHistory open={open} setOpen={() => setOpen(false)} id={idVehicle}></OdometerHistory>
    </>
  );
};

export default Odometers;
