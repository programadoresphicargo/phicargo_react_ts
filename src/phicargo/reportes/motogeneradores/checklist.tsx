import {
  MRT_ColumnDef,
  MRT_ExpandAllButton,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Button } from '@heroui/react';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { exportToCSV } from '../../utils/export';
import odooApi from '@/api/odoo-api';
import { Stack } from '@mui/material';
import ChecklistPatio from './checklist_form';
import { OpenArchive } from '@/phicargo/utils/functions';

type TravelMotogenerator = {
  id: number;
  travel_id: number;
  vehicle_id: number;
  vehicle: string;
  position: number;
  state:
  | 'pending'
  | 'in_checklist'
  | 'completed'
  | 'validated'
  | 'rejected'
  | 'released'
  | 'replaced';
  date_order?: string;
  checklist_id?: string;
};

const ChecklistTableMG = ({ }) => {

  const [selectedTravel, setSelectedTravel] = useState<any>(null);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTravel(null);
  };

  const handleSuccess = () => {
    setOpen(false);
    setSelectedTravel(null);
    fetchData();
  };

  const [data, setData] = useState<TravelMotogenerator[]>([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/travel_motogenerators/');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: MRT_ColumnDef<TravelMotogenerator>[] = [
    {
      accessorKey: 'id',
      header: 'Solicitud',
    },
    {
      accessorKey: 'vehicle',
      header: 'Motogenerador',
    },
    {
      accessorKey: 'assigned_at',
      header: 'Solicitado',
    },
    {
      accessorKey: 'state',
      header: 'Estado',
      Cell: ({ cell }) => {
        const states: Record<string, string> = {
          pending_checklist: 'Pendiente de checklist',
          in_checklist: 'En checklist',
          checklist_completed: 'Checklist realizado',
          validated: 'Validado',
          rejected: 'Rechazado',
          released: 'Liberado',
          replaced: 'Reemplazado',
        };

        return states[cell.getValue<string>()] ?? cell.getValue<string>();
      },
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: {
      showProgressBars: isLoading,
    },
    groupedColumnMode: "remove",
    enableColumnPinning: true,
    enableStickyHeader: true,
    positionToolbarAlertBanner: "bottom",
    localization: MRT_Localization_ES,
    columnResizeMode: "onEnd",
    initialState: {
      expanded: true,
      density: 'compact',
      showColumnFilters: true,
      pagination: { pageIndex: 0, pageSize: 80 },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    displayColumnDefOptions: {
      'mrt-row-expand': {
        Header: () => (
          <Stack direction="row" alignItems="center">
            <MRT_ExpandAllButton table={table} />
            <Box>Grupos</Box>
          </Stack>
        ),
        GroupedCell: ({ row, table }) => {
          const { grouping } = table.getState();

          return grouping.map((col) => {
            const value = row.getValue<string>(col);

            return (
              <span key={col}>
                <strong>{value}</strong>{' '}
              </span>
            );
          });
        },
      },
    },
    muiTableBodyRowProps: ({ row }) => {
      const isGrouped = row.getIsGrouped();

      return {
        onClick: () => {
          if (isGrouped) return;

          const selection = window.getSelection()?.toString();
          if (selection) return;
          if (row.original.state == "pending") {
            setSelectedTravel(row.original);
            handleClickOpen();
          } else if (row.original.state == "completed") {
            OpenArchive(`/checklist/export_mg/${row.original.checklist_id}`);
          }
        },
        style: {
          color: '#ffcccc',
          cursor: 'pointer',
        },
      };
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 200px)',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '14px',
      },
    },
    muiTopToolbarProps: {
      sx: {
        background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
        color: 'white',
        '& .MuiSvgIcon-root': {
          color: 'white',   // 🎨 iconos en blanco
        },
        '& .MuiButton-root': {
          color: 'white',   // texto de botones en blanco
        },
        '& .MuiInputBase-root': {
          color: 'white',   // texto del buscador
        },
        '& .MuiInputBase-root .MuiSvgIcon-root': {
          color: 'white',   // icono de lupa en blanco
        },
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row.subRows?.length
          ? '#0456cf'
          : row.index % 2 === 0
            ? '#FFFFFF'
            : '#F8F9FA',
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '12px',
        padding: '2px 8px',
        color: row.subRows?.length ? '#FFFFFF' : '#000000',
      },
    }),
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          alignItems: 'center',
        }}
      >
        <h1
          className="font-semibold lg:text-2xl"
        >
          Solicitudes de checklist
        </h1>
        <Button color='primary' startContent={<i className="bi bi-arrow-clockwise"></i>} onPress={() => fetchData()} radius='md' size='sm'>Actualizar</Button>
        <Button color='success' size='sm' className='text-white' startContent={<i className="bi bi-file-earmark-excel"></i>} onPress={() => exportToCSV(data, columns, "programacion_viajes.csv")} radius='md'>Exportar</Button>
      </Box >
    ),
  });

  return (
    <>
      <MaterialReactTable table={table} />
      {selectedTravel && (
        <ChecklistPatio
          open={open}
          onClose={handleClose}
          onSuccess={handleSuccess}
          solicitud_id={selectedTravel.id}
          vehicle_id={selectedTravel.vehicle_id}
        />
      )}
    </>
  );
};

export default ChecklistTableMG;
