import React, { useCallback, useState } from 'react';

// ================================
// Hook: useRowDraft
// ================================
export function useRowDraft() {
  const [editingRow, setEditingRow] = useState(null);
  const [draft, setDraft] = useState(null);

  const startEditing = useCallback((row, table) => {
    setEditingRow(row);
    setDraft({ ...row.original }); // snapshot completo
    table.setEditingRow(row);
  }, []);

  const updateDraft = useCallback((patch) => {
    setDraft(prev => ({ ...prev, ...patch }));
  }, []);

  const stopEditing = useCallback((table) => {
    setEditingRow(null);
    setDraft(null);
    table.setEditingRow(null);
  }, []);

  return {
    editingRow,
    draft,
    startEditing,
    updateDraft,
    stopEditing,
  };
}

// ================================
// Ejemplo de uso con MaterialReactTable
// ================================
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Button, Chip, CircularProgress } from '@heroui/react';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Box from '@mui/material/Box';
import { exportDB } from 'dexie-export-import';

export default function TablaContenedores({ data, setData, isLoading, inventarioDB, opcionesRemolques, opcionesDolly, sincronizar, isOnline }) {
  const {
    editingRow,
    draft,
    startEditing,
    updateDraft,
    stopEditing,
  } = useRowDraft();

  async function exportInventarioDB() {
    const blob = await exportDB(inventarioDB, {
      prettyJson: true,
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventarioDB_${new Date().toISOString()}.json`;
    a.click();

    URL.revokeObjectURL(url);
  }

  async function importInventarioDB(file) {
    await importDB(file, {
      overwriteValues: true,
    });
  }

  const table = useMaterialReactTable({
    data,
    editDisplayMode: 'row',
    enableEditing: true,
    localization: MRT_Localization_ES,

    positionActionsColumn: "last",

    enableGrouping: true,
    enableGlobalFilter: true,
    enableColumnPinning: true,
    enableStickyHeader: true,

    state: { showProgressBars: isLoading },

    initialState: {
      showColumnFilters: true,
      density: 'compact',
      pagination: { pageSize: 80 },
      showGlobalFilter: false,
      columnPinning: { left: ['x_reference'] },
    },

    muiSearchTextFieldProps: {
      placeholder: `Buscador global`,
      sx: { minWidth: '300px' },
      variant: 'outlined',
    },

    columns: [
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
              <i className="bi bi-check-lg"></i>
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
        Edit: () => {
          const [localValue, setLocalValue] = React.useState(
            draft?.sellos ?? ''
          );

          // sincroniza si cambia de fila
          React.useEffect(() => {
            setLocalValue(draft?.sellos ?? '');
          }, [draft?.sellos]);

          return (
            <TextField
              size="small"
              fullWidth
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onBlur={() => {
                updateDraft({ sellos: localValue });
              }}
            />
          );
        },
      },
      {
        accessorKey: 'name_remolque',
        header: 'Remolque',
        Edit: ({ row }) => (
          <Autocomplete
            size='small'
            options={opcionesRemolques}
            getOptionLabel={(o) => o.name2}
            value={opcionesRemolques.find(o => o.id === draft?.remolque_id) || null}
            onChange={(_, newValue) => {
              updateDraft({
                remolque_id: newValue?.id || null,
                name_remolque: newValue?.name2 || null,
              });
            }}
            renderInput={(params) => <TextField {...params} label="Remolque" />}
          />
        ),
      },
      {
        accessorKey: 'name_dolly',
        header: 'Dolly',
        Edit: ({ row }) => (
          <Autocomplete
            size='small'
            options={opcionesDolly}
            getOptionLabel={(o) => o.name2}
            value={opcionesDolly.find(o => o.id === draft?.dolly_id) || null}
            onChange={(_, newValue) => {
              updateDraft({
                dolly_id: newValue?.id || null,
                name_dolly: newValue?.name2 || null,
              });
            }}
            renderInput={(params) => <TextField {...params} label="Dolly" />}
          />
        ),
      },
      {
        accessorKey: 'observaciones',
        header: 'Observaciones',
        Edit: () => {
          const [localValue, setLocalValue] = React.useState(
            draft?.observaciones ?? ''
          );

          // sincroniza si cambia de fila
          React.useEffect(() => {
            setLocalValue(draft?.observaciones ?? '');
          }, [draft?.observaciones]);

          return (
            <TextField
              size="small"
              fullWidth
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onBlur={() => {
                updateDraft({ observaciones: localValue });
              }}
            />
          );
        },
      },
      {
        accessorKey: 'pending_sync',
        header: 'Enviado',
        enableEditing: false,
        Cell: ({ cell }) => {
          const value = cell.getValue();

          return (
            <>
              {isLoading && value ? (
                <CircularProgress size="sm" />
              ) : (
                <Chip
                  size="sm"
                  className="text-white"
                  color={value ? "warning" : "success"}
                >
                  {value ? 'Pendiente' : 'Enviado'}
                </Chip>
              )}
            </>
          );
        },
      },
      {
        accessorKey: 'version',
        header: 'version',
        enableEditing: false,
      },
      {
        accessorKey: 'updated_at',
        header: 'updated_at',
        enableEditing: false,
      },
      {
        accessorKey: 'sync_action',
        header: 'sync_action',
        enableEditing: false,
      },
    ],

    renderRowActions: ({ row }) => (
      <Button onPress={() => startEditing(row, table)} size='sm' color='success' className='text-white' radius='full'>Editar</Button>
    ),

    onEditingRowSave: async () => {
      if (!draft) return;

      const syncAction = draft.id_checklist == null ? 'create' : 'update';
      const rowToSave = {
        ...draft,
        pending_sync: true,
        sync_action: syncAction,
        updated_at: new Date().toISOString(),
        version: draft.version || 1,
      };

      await inventarioDB.contenedores.put(rowToSave);
      const localData = await inventarioDB.contenedores.toArray();
      setData(localData);

      stopEditing(table);
    },

    onEditingRowCancel: () => stopEditing(table),

    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '14px',
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 195px)',
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
        <Button onPress={() => sincronizar()} color='success' radius='full' className='text-white' isDisabled={editingRow !== null}>Sincronizar</Button>
        <Button onPress={() => exportInventarioDB()} radius='full' color='warning' className='text-white'>Exportar DB</Button>
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

  return <MaterialReactTable table={table} />;
}
