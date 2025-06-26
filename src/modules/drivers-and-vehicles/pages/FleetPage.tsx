import { exportToCSV } from '@/phicargo/utils/export';
import { MaterialReactTable } from 'material-react-table';
import { useFleetColumns } from '../hooks/useFleetColumns';
import { Fleet } from '@/modules/vehicles/models';
import { useFleetQueries } from '@/modules/vehicles/hooks/queries';
import { useBaseTable } from '@/hooks';
import {
  AppBar,
  Dialog,
  DialogContent,
  IconButton,
  Toolbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { FleetVehicleDetails } from '@/modules/vehicles/components/fleet/FleetVehicleDetails';

const FleetPage = () => {
  const [vehicleToView, setVehicleToView] = useState<Fleet | null>(null);

  const { getFleetQuery } = useFleetQueries();

  const columns = useFleetColumns();

  const table = useBaseTable<Fleet>({
    columns,
    data: getFleetQuery.data || [],
    tableId: 'availability-fleet-table',
    isLoading: getFleetQuery.isLoading,
    isFetching: getFleetQuery.isFetching,
    refetchFn: () => getFleetQuery.refetch(),
    exportFn: (data) => exportToCSV(data || [], columns, 'unidades.csv'),
    showColumnFilters: true,
    showGlobalFilter: true,
    containerHeight: 'calc(100vh - 165px)',
    onDoubleClickFn: (row) => {
      setVehicleToView(row.original);
    }
  });

  return (
    <>
      <MaterialReactTable table={table} />
      {vehicleToView && (
        <Dialog
          open={!!vehicleToView}
          onClose={() => setVehicleToView(null)}
          fullScreen={true}
        >
          <AppBar
            elevation={3}
            position="static"
            sx={{
              background: 'linear-gradient(90deg, #0b2149, #002887)',
              padding: '0 16px',
            }}
          >
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setVehicleToView(null)}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              {vehicleToView.name}
            </Toolbar>
          </AppBar>
          <DialogContent>
            <FleetVehicleDetails vehicle={vehicleToView} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default FleetPage;

