import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import { Box, Tab } from '@mui/material';
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import TabList from '@mui/lab/TabList';
import React from 'react';
import { Button, Chip } from '@heroui/react';

type Configuraciones = {
  task_id: number | null,
}

const MaintenanceVehicleReport = () => {

  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState([]);

  const TABS = [
    { value: '1', label: 'Tractos', prefixes: ['C-'] },
    { value: '2', label: 'Remolques', prefixes: ['PL-', 'CH-', 'DL-', 'PCE-', 'CB-', 'CS-'] },
    { value: '3', label: 'Motogeneradores', prefixes: ['MG-'] },
    { value: '4', label: 'Utilitarios', prefixes: ['U-'] },
    { value: '5', label: 'Grúas', prefixes: ['G-'] },
    { value: '6', label: 'Servi', prefixes: ['SERVI/MC-', 'SERVI/T-'] },
  ];

  const [value, setValue] = React.useState('1');

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetchData();
  }, [value]);

  const fetchData = async () => {
    try {
      setisLoading(true);

      const selectedTab = TABS.find(
        (tab) => tab.value === value
      );

      if (!selectedTab) return;

      const response = await odooApi.post('/maintenances/report/', {
        prefixes: selectedTab.prefixes,
      });

      setData(response.data);
    } catch (error) {
      toast.error('Error al consultar el reporte: ' + error);
    } finally {
      setisLoading(false);
    }
  };

  const columns = useMemo<MRT_ColumnDef<Configuraciones>[]>(
    () => [
      { accessorKey: 'sucursal', header: 'Sucursal', },
      { accessorKey: 'vehicle', header: 'Vehiculo', },
      { accessorKey: 'serial_number', header: 'Serie', },
      {
        accessorKey: 'x_tipo_vehiculo', header: 'Tipo',
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return <Chip color={value == "carretera" ? "primary" : "success"} size='sm' className='text-white'>{value.toUpperCase()}</Chip>;
        },
      },
      { accessorKey: 'marca', header: 'Marca', },
      { accessorKey: 'model', header: 'Modelo', },
      { accessorKey: 'model_year', header: 'Año', },
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
      { accessorKey: 'fecha_kilometraje', header: 'Fecha kilometraje', },
      { accessorKey: 'tipo_mantenimiento', header: 'Tipo mantenimiento', },
      { accessorKey: 'date', header: 'Ultimo mantenimineto', },
      { accessorKey: 'dias_transcurridos', header: 'Días transcurridos', },
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
        maxHeight: 'calc(100vh - 290px)',
      },
    },
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
          {TABS.find((tab) => tab.value === value)?.label}
        </h1>
        <Button
          onPress={fetchData}
          isLoading={isLoading}
          isDisabled={isLoading}
          color="primary"
          radius="md"
          size="sm"
        >
          Recargar
        </Button>
      </Box >
    ),
  })

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box
          sx={{
            borderColor: 'divider',
            backgroundColor: '#002887',
            color: 'white',
          }}
        >
          <TabList
            onChange={handleChange}
            aria-label="Tipos de vehículos"
            textColor="inherit"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'white',
                height: '3px',
              },
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
                sx={{ fontFamily: 'Inter' }}
              />
            ))}
          </TabList>
        </Box>

        <TabPanel value={value} sx={{ padding: 0, margin: 0 }}>
          <MaterialReactTable table={table} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default MaintenanceVehicleReport;
