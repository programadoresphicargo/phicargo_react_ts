import { Button, Chip, Select, SelectItem } from "@heroui/react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Example2 from '../maniobras/modal';
import { ManiobraProvider } from '../context/viajeContext';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { ThemeProvider } from '@mui/material/styles';
import customFontTheme from '../../../theme';
import { exportToCSV } from '../../utils/export';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { DateRangePicker } from 'rsuite';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import CustomNavbar from "@/pages/CustomNavbar";
import { pages } from '../pages';
import RegistroManiobrasCP from "../maniobras/modal";
import FormularioContenedor from "./contenedor";
import { Autocomplete } from "@mui/material";
import { TextField } from "@mui/material";
import { inventarioDB } from "@/db/inventarioDB/inventarioDB";

const InventarioContenedores = () => {

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [editingRow, setEditingRow] = useState(null);
  const [trailers, setTrailers] = useState([]);
  const [dollies, setDollies] = useState([]);
  const [LoadingSincronizar, setLoadingSincronizar] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const loadFleet = async () => {
      try {
        if (navigator.onLine) {
          const [resTrailers, resDollies] = await Promise.all([
            odooApi.get('/vehicles/fleet_type/trailer'),
            odooApi.get('/vehicles/fleet_type/dolly'),
          ]);

          setTrailers(resTrailers.data);
          setDollies(resDollies.data);

          // Guardar en IndexedDB
          await inventarioDB.trailers.bulkPut(resTrailers.data);
          await inventarioDB.dollies.bulkPut(resDollies.data);
        } else {
          // Offline → leer de IndexedDB
          const localTrailers = await inventarioDB.trailers.toArray();
          const localDollies = await inventarioDB.dollies.toArray();

          setTrailers(localTrailers);
          setDollies(localDollies);
        }
      } catch (e) {
        toast.error("Error al cargar flota");
      }
    };

    loadFleet();
  }, []);

  const [isLoading, setLoading] = useState(false);

  const [modalShow, setModalShow] = useState(false);
  const [dataCP, setDataCP] = useState({});

  const handleShowModal = (data) => {
    setModalShow(true);
    setDataCP(data);
  };

  const handleCloseModal = () => {
    setModalShow(false);
    fetchData();
    setDataCP({});
  }

  const [data, setData] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await odooApi.get('/tms_waybill/inventario_contenedores');

      const localMap = new Map(
        (await inventarioDB.contenedores.toArray())
          .map(r => [r.id, r])
      );

      const rows = response.data.map(r => ({
        ...r,
        pending_sync: localMap.get(r.id)?.pending_sync ?? false,
        sync_action: localMap.get(r.id)?.sync_action ?? null,
        updated_at: new Date().toISOString(),
      }));

      // guardar en IndexedDB
      await inventarioDB.contenedores.bulkPut(rows);

      // siempre renderizar desde DB local
      const localData = await inventarioDB.contenedores.toArray();
      setData(localData);

    } catch (error) {
      toast.error('Error al obtener los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      if (navigator.onLine) {
        await fetchData();
      } else {
        const localData = await inventarioDB.contenedores.toArray();
        setData(localData);
      }
    };

    load();
  }, []);

  const syncOfflineData = async () => {
    if (!navigator.onLine) return;

    const pendientes = await inventarioDB.contenedores
      .filter(row =>
        row.pending_sync === true &&
        (row.sync_action === 'create' || row.sync_action === 'update')
      )
      .toArray();

    for (const row of pendientes) {
      try {
        if (row.sync_action === 'create') {
          const res = await odooApi.post(
            '/tms_waybill/control_contenedores/',
            row
          );

          // Backend devuelve id_checklist
          await inventarioDB.contenedores.update(row.id, {
            id_checklist: res.data.id_checklist,
            pending_sync: false,
            sync_action: null,
          });
        }

        if (row.sync_action === 'update') {
          await odooApi.patch(
            `/tms_waybill/control_contenedores/${row.id_checklist}`,
            row
          );

          await inventarioDB.contenedores.update(row.id, {
            pending_sync: false,
            sync_action: null,
          });
        }
      } catch (e) {
        console.error('Error sync:', row.id);
      }
    }

    // refrescar UI
    const localData = await inventarioDB.contenedores.toArray();
    setData(localData);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableEditing: false,
      },
      {
        accessorKey: 'id_cp',
        header: 'ID CP',
        enableEditing: false,
      },
      {
        accessorKey: 'id_checklist',
        header: 'ID Checklist',
        enableEditing: false,
      },
      {
        accessorKey: 'sucursal',
        header: 'Sucursal',
        enableEditing: false,
      },
      {
        accessorKey: 'date_order',
        header: 'Fecha',
        enableEditing: false,
      },
      {
        accessorKey: 'x_modo_bel',
        header: 'Modo',
        enableEditing: false,
      },
      {
        accessorKey: 'x_reference',
        header: 'Contenedor',
        enableEditing: false,
        muiTableBodyCellProps: {
          sx: {
            maxWidth: '180px',
            fontFamily: 'Inter',
          },
        },
      },
      {
        accessorKey: 'x_medida_bel',
        header: 'Medida',
        enableEditing: false,
      },
      {
        accessorKey: 'x_tipo2_bel',
        header: 'Tipo',
        enableEditing: false,
      },
      {
        accessorKey: 'x_status_bel',
        header: 'Estatus',
        enableEditing: false,
        size: 150,
        Cell: ({ cell }) => {
          const value = cell.getValue();

          let variant = 'secondary';
          let text = '';

          const mappings = {
            sm: { variant: 'secondary', text: 'SIN MANIOBRA' },
            EI: { variant: 'warning', text: 'EN PROCESO DE INGRESO' },
            pm: { variant: 'primary', text: 'PATIO MÉXICO' },
            Ing: { variant: 'success', text: 'INGRESADO' },
            'No Ing': { variant: 'danger', text: 'NO INGRESADO' },
            ru: { variant: 'info', text: 'REUTILIZADO' },
            can: { variant: 'error', text: 'CANCELADO' },
            P: { variant: 'primary', text: 'EN PATIO' },
            T: { variant: 'warning', text: 'EN TERRAPORTS' },
            V: { variant: 'success', text: 'EN VIAJE' },
          };

          if (mappings[value]) {
            variant = mappings[value].variant;
            text = mappings[value].text;
          } else {
            variant = 'danger';
            text = value || 'DESCONOCIDO';
          }

          return (
            value !== null ? (
              <Chip color={variant} size='sm' className="text-white">
                {text}
              </Chip>) : null
          );
        },
      },
      {
        accessorKey: 'dangerous_cargo',
        header: 'Peligroso',
        enableEditing: false,
        Cell: ({ cell }) => {
          const value = cell.getValue();

          if (value !== true) return null;

          return (
            <Chip size="sm" className="text-white" color="success">
              <i class="bi bi-check-lg"></i>
            </Chip>
          );
        },
      },
      {
        accessorKey: 'fecha_llegada',
        header: 'Fecha llegada',
        enableEditing: false,
      },
      {
        accessorKey: 'dias_patio',
        header: 'Días en patio',
        enableEditing: false,
      },
      {
        accessorKey: 'sellos',
        header: 'Sellos',
      },
      {
        accessorKey: 'name_remolque',
        header: 'Remolque',
        muiEditTextFieldProps: {
          select: true,
          label: "Remolque",
        },
        Edit: ({ row, cell }) => (
          <Autocomplete
            options={trailers}
            getOptionLabel={(opt) => opt.name}
            value={
              trailers.find(t => t.name === cell.getValue()) || null
            }
            onChange={(_, newValue) => {
              row._valuesCache.name_remolque = newValue?.name || null;
              row._valuesCache.remolque_id = newValue?.id || null;
            }}
            renderInput={(params) => (
              <TextField {...params} label="Remolque" />
            )}
          />
        ),
      },
      {
        accessorKey: 'name_dolly',
        header: 'Dolly',
        enableEditing: true,

        Edit: ({ row, cell }) => (
          <Autocomplete
            options={dollies}
            getOptionLabel={(opt) => opt.name}
            value={
              dollies.find(d => d.name === cell.getValue()) || null
            }
            onChange={(_, newValue) => {
              row._valuesCache.name_dolly = newValue?.name || null;
              row._valuesCache.dolly_id = newValue?.id || null;
            }}
            renderInput={(params) => (
              <TextField {...params} label="Dolly" />
            )}
          />
        ),
      },
      {
        accessorKey: 'observaciones',
        header: 'Observaciones',
      },
      {
        accessorKey: 'pending_sync',
        header: 'Sync',
        enableEditing: false,
        Cell: ({ cell }) =>
          cell.getValue() ? (
            <Chip color="warning" size="sm" className="text-white">Pendiente</Chip>
          ) : (
            <Chip color="success" size="sm" className="text-white">OK</Chip>
          ),
      }
    ],
    [trailers, dollies],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableEditing: true,
    editDisplayMode: "row",
    positionActionsColumn: "last",
    onEditingRowSave: async ({ values, table }) => {
      table.setEditingRow(null);
      setEditingRow(null);

      const syncAction = values.id_checklist == null
        ? 'create'
        : 'update';

      const rowToSave = {
        ...values,
        pending_sync: true,
        sync_action: syncAction,
        updated_at: new Date().toISOString(),
      };

      // Guardar en IndexedDB
      await inventarioDB.contenedores.put(rowToSave);

      // Actualizar UI desde DB local
      const localData = await inventarioDB.contenedores.toArray();
      setData(localData);

      toast.info(
        syncAction === 'create'
          ? 'Registro guardado offline (nuevo)'
          : 'Cambios guardados offline'
      );
    },
    onEditingRowCancel: () => {
      setEditingRow(null);
    },
    enableGrouping: true,
    enableGlobalFilter: true,
    enableColumnPinning: true,
    enableStickyHeader: true,
    localization: MRT_Localization_ES,
    positionToolbarAlertBanner: 'none',
    positionGlobalFilter: "right",
    muiSearchTextFieldProps: {
      placeholder: `Buscador global`,
      sx: { minWidth: '300px' },
      variant: 'outlined',
    },
    initialState: {
      showColumnFilters: true,
      density: 'compact',
      pagination: { pageSize: 80 },
      showGlobalFilter: false,
      columnPinning: { left: ['x_reference'] },
    },
    state: { showProgressBars: isLoading, editingRow },
    muiCircularProgressProps: {
      color: 'primary',
      thickness: 5,
      size: 45,
    },
    muiSkeletonProps: {
      animation: 'pulse',
      height: 28,
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
        maxHeight: 'calc(100vh - 230px)',
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row.subRows?.length ? '#1184e8' : '#FFFFFF',
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
        color: row.subRows?.length ? '#FFFFFF' : '#000000',
      },
    }),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '8px' }}>
        <Button
          size="sm"
          color="primary"
          radius="full"
          isDisabled={editingRow && editingRow.id !== row.id}
          onPress={() => {
            if (editingRow && editingRow.id !== row.id) {
              toast.warning(
                'Tienes cambios sin guardar. Guarda o cancela antes de editar otro registro.'
              );
              return;
            }

            table.setEditingRow(row);
            setEditingRow(row);
          }}
        >
          <i className="bi bi-pencil" />
        </Button>
      </Box>
    ),
    muiTableBodyRowProps: ({ row }) => ({
      onDoubleClick: () => {
        if (editingRow && editingRow.id !== row.id) {
          toast.warning(
            'Tienes cambios sin guardar. Guarda o cancela antes de editar otro registro.'
          );
          return;
        }

        table.setEditingRow(row);
        setEditingRow(row);
      },
      sx: {
        backgroundColor: row.original.pending_sync
          ? '#FFF7E6'   // amarillo suave
          : 'inherit',
        borderLeft: row.original.pending_sync
          ? '4px solid #f59e0b'
          : 'none',
      },
    }),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          alignItems: 'center',
        }}
      >
        <h1
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Inventario contenedores
        </h1>
        <Button
          color='success'
          fullWidth
          className='text-white'
          startContent={<i class="bi bi-file-earmark-excel"></i>}
          onPress={() => exportToCSV(data, columns, "contenedores.csv")}
          radius="full"
        >Exportar
        </Button>
        <Button
          color='danger'
          fullWidth
          className='text-white'
          startContent={<i class="bi bi-arrow-clockwise"></i>}
          onPress={() => fetchData()}
          radius="full"
        >Recargar
        </Button>
        <Button
          color='success'
          fullWidth
          className='text-white'
          startContent={<i class="bi bi-arrow-clockwise"></i>}
          onPress={() => syncOfflineData()}
          radius="full"
        >Sincronizar cambios
        </Button>
        <Chip
          size="sm"
          color={isOnline ? "success" : "warning"}
          className="text-white"
        >
          {isOnline ? "TRABAJANDO: ONLINE" : "TRABAJANDO: OFFLINE"}
        </Chip>
      </Box>
    ),
  });

  return (
    <div>
      <CustomNavbar pages={pages}></CustomNavbar>
      <MaterialReactTable table={table} />
    </div >
  );
};

export default InventarioContenedores;
