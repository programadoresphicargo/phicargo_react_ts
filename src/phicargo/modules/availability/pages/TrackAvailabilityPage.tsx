import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
} from '@mui/material';
import {
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

import { VehicleWithTravelRef } from '../models/vehicle-model';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useTrackAvailabilityColumns } from '../hooks/useTrackAvailabilityColumns';
import { useVehicleQueries } from '../hooks/useVehicleQueries';

const TrackAvailabilityPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<VehicleWithTravelRef | null>(null);
  const [estado, setStatus] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    vehiclesWithTravelRefQuery: { data: vehiclesWithTravelRef, isFetching },
  } = useVehicleQueries();

  const { columns } = useTrackAvailabilityColumns();

  const handleRowClick = (row: MRT_Row<VehicleWithTravelRef>) => {
    setSelectedRow(row.original);
    setStatus(row.original.status);
    setOpenDialog(true);
  };

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(
        '/phicargo/disponibilidad/equipos/guardar_cambios.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: selectedRow?.id || '',
            estado: estado,
          }),
        },
      );

      const result = await response.json();
      if (result.success) {
        toast.success('Estado actualizado con éxito');
        setOpenDialog(false);
      } else {
        toast.error('Error al actualizar el estado');
      }
    } catch (error) {
      console.error('Error en la actualización:', error);
      toast.error('Error en la actualización');
    } finally {
      setIsUpdating(false);
    }
  };

  const table = useMaterialReactTable<VehicleWithTravelRef>({
    columns,
    data: vehiclesWithTravelRef || [],
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    initialState: {
      density: 'compact',
      pagination: { pageSize: 80, pageIndex: 0 },
    },
    state: { isLoading: isFetching },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => handleRowClick(row),
      style: {
        cursor: 'pointer',
      },
    }),
    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '14px',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
      },
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Actualizar Estado del Vehículo</DialogTitle>
        <DialogContent>
          <Select
            fullWidth
            value={estado}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="disponible">Disponible</MenuItem>
            <MenuItem value="viaje">Viaje</MenuItem>
            <MenuItem value="mantenimiento">Mantenimiento</MenuItem>
            <MenuItem value="maniobra">Maniobra</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleUpdateStatus} disabled={isUpdating}>
            {isUpdating ? <CircularProgress size={24} /> : 'Actualizar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TrackAvailabilityPage;

