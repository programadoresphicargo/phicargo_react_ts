import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_VisibilityState,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import { Box, MenuItem, Select, Tab } from '@mui/material';
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import TabList from '@mui/lab/TabList';
import React from 'react';
import { Button, Chip } from '@heroui/react';

type MaintenanceReport = {
  sucursal: string | null;
  vehicle: string | null;
  vehicle_id: number | null;
  serial_number: string | null;
  x_tipo_vehiculo: string | null;
  marca: string | null;
  model: string | null;
  model_year: number | null;
  kilometraje: number | null;
  fecha_kilometraje: string | null;
  tipo_mantenimiento: string | null;
  date: string | null;
  dias_transcurridos: number | null;
  km_ultimo_mantenimiento: number | null;
  intervalo_km: number | null;
  proximo_servicio_km: number | null;
  kilometros_restantes: number | null;
};

const MaintenanceVehicleReport = () => {

  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState<MaintenanceReport[]>([]);

  const TABS = [
    { value: '1', label: 'Tractos', prefixes: ['C-'] },
    { value: '2', label: 'Remolques', prefixes: ['PL-', 'CH-', 'DL-', 'PCE-', 'CB-', 'CS-'] },
    { value: '3', label: 'Motogeneradores', prefixes: ['MG-'] },
    { value: '4', label: 'Utilitarios', prefixes: ['U-'] },
    { value: '5', label: 'Grúas y Servi', prefixes: ['G-', 'SERVI/MC-', 'SERVI/T-'] },
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

  const columns = useMemo<MRT_ColumnDef<MaintenanceReport>[]>(
    () => [
      { accessorKey: 'sucursal', header: 'Sucursal', enableEditing: false },
      { accessorKey: 'vehicle', header: 'Vehiculo', enableEditing: false },
      { accessorKey: 'serial_number', header: 'Serie', enableEditing: false },
      {
        accessorKey: 'x_tipo_vehiculo', header: 'Tipo', enableEditing: false,
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return <Chip color={value == "carretera" ? "primary" : "success"} size='sm' className='text-white'>{value}</Chip>;
        },
      },
      { accessorKey: 'marca', header: 'Marca', enableEditing: false },
      { accessorKey: 'model', header: 'Modelo', enableEditing: false },
      { accessorKey: 'model_year', header: 'Año', enableEditing: false },
      {
        accessorKey: 'kilometraje',
        header: 'Kilometraje actual',
        enableEditing: false,
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return value?.toLocaleString('en-US');
        },
        muiTableBodyCellProps: {
          align: 'right',
        },
      },
      { accessorKey: 'fecha_kilometraje', header: 'Fecha kilometraje', enableEditing: false },
      { accessorKey: 'tipo_mantenimiento', header: 'Tipo mantenimiento', enableEditing: false },
      { accessorKey: 'date', header: 'Ultimo mantenimineto', enableEditing: false },
      { accessorKey: 'dias_transcurridos', header: 'Días transcurridos', enableEditing: false },
      {
        accessorKey: 'km_ultimo_mantenimiento',
        header: 'Km ultimo mant',
        enableEditing: false,
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return value?.toLocaleString('en-US');
        },
        muiTableBodyCellProps: {
          align: 'right',
        },
      },
      {
        accessorKey: 'intervalo',
        header: 'Intervalo',
        enableEditing: false,
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
        enableEditing: false,
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
        enableEditing: false,
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return value?.toLocaleString('en-US');
        },
        muiTableBodyCellProps: {
          align: 'right',
        },
      },
      {
        accessorKey: 'x_status_mg',
        header: 'Estado',
        Cell: ({ cell, row }) => (
          <Select
            size="small"
            value={cell.getValue<string>() ?? ''}
            onChange={async (event) => {
              const newState = event.target.value;
              const vehicle = row.original.vehicle_id;

              try {
                await odooApi.patch(`/vehicles/${vehicle}`, {
                  x_status_mg: newState,
                });

                setData((prev) =>
                  prev.map((item) =>
                    item.vehicle_id === vehicle
                      ? { ...item, x_status_mg: newState }
                      : item,
                  ),
                );
              } catch (error) {
                console.error('Error al actualizar el estado:', error);
              }
            }}
            sx={{ minWidth: 140, fontSize: 12 }}
          >
            <MenuItem value="F. electronica">F. electronica</MenuItem>
            <MenuItem value="Operativo">Operativo</MenuItem>
            <MenuItem value="F. mecanica">F. mecanica</MenuItem>
            <MenuItem value="Desarmado">Desarmado</MenuItem>
          </Select>
        ),
      }
    ], [value]);

  const [columnVisibility, setColumnVisibility] =
    useState<MRT_VisibilityState>({
      model_year: true,
      x_tipo_vehiculo: true,
      sucursal: true,
      serial_number: true,
      x_status_mg: true,
    });

  useEffect(() => {
    if (value === '3') {
      setColumnVisibility({
        model_year: false,
        x_tipo_vehiculo: false,
        sucursal: false,
        serial_number: true,
        x_status_mg: true,
      });
    } else if (value === '5') {
      setColumnVisibility({
        model_year: false,
        x_tipo_vehiculo: false,
        sucursal: false,
        serial_number: false,
        x_status_mg: false,
      });
    } else {
      setColumnVisibility({
        model_year: true,
        x_tipo_vehiculo: true,
        sucursal: true,
        serial_number: true,
        x_status_mg: false,
      });
    }
  }, [value]);

  const table = useMaterialReactTable({
    columns,
    data,
    state: { showProgressBars: isLoading, columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    editDisplayMode: "row",
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
        maxHeight: 'calc(100vh - 235px)',
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
