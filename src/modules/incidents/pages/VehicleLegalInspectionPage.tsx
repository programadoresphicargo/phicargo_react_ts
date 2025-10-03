import { useBaseTable } from '@/hooks';
import { useGetVehicleInspections } from '@/modules/vehicles/hooks/queries';
import type { VehicleInspection } from '@/modules/vehicles/models';
import { MaterialReactTable } from 'material-react-table';
import { useVehicleInspectionColumns } from '../hooks/useVehicleInspectionColumns';
import { MonthSelect, YearSelect } from '@/components/inputs';
import { useState } from 'react';
import { VehicleInspectionDetailModal } from '@/modules/vehicles/components/vehicle-inspections/VehicleInspectionDetailsModal';
import InfoIcon from '@mui/icons-material/Info';
import { Box, IconButton, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { VehicleInspectionHeader } from '../components/ui/VehicleInspectionHeader';
import { LegalInspectionModal } from '@/modules/vehicles/components/vehicle-inspections/LegalInspectionModal';
import { Button } from '@heroui/react';
import { exportToCSV } from '../../../phicargo/utils/export';

const now = new Date();

const VehicleLegalInspectionPage = () => {
  const [month, setMonth] = useState<string | number>(
    new Date().getMonth() + 1,
  );
  const [year, setYear] = useState<string | number>(new Date().getFullYear());
  const [detail, setDetail] = useState<VehicleInspection | null>(null);
  const [toInspect, setToInspect] = useState<VehicleInspection | null>(null);

  const { query } = useGetVehicleInspections(month as number, year as number, 'legal');

  const columns = useVehicleInspectionColumns();

  const table = useBaseTable<VehicleInspection>({
    columns,
    data: query.data || [],
    tableId: 'vehicle-inspections-table',
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error?.message,
    refetchFn: () => query.refetch(),
    showColumnFilters: true,
    showGlobalFilter: true,
    containerHeight: 'calc(100vh - 260px)',
    enableRowActions: true,
    positionActionsColumn: 'first',
    renderRowActions: ({ row }) => {
      const value = row.original;
      return (
        <RowActions
          inspection={value}
          year={year}
          month={month}
          openDetail={setDetail}
          openInspect={setToInspect}
        />
      );
    },
    toolbarActions: (
      <div className="flex items-center gap-4">
        <MonthSelect onMonthChange={setMonth} inspectionType='legal' />
        <YearSelect onYearChange={setYear} />
        <Button color='success' className='text-white' onPress={() => exportToCSV(query.data || [], columns, "inspecciones.csv")} isDisabled>Exportar</Button>
      </div>
    ),
  });

  return (
    <>
      <VehicleInspectionHeader
        vehicleInspections={query.data || []}
        inspectionType="Legal"
      />
      <MaterialReactTable table={table} />
      {detail && (
        <VehicleInspectionDetailModal
          open={!!detail}
          onClose={() => setDetail(null)}
          vehicleInspection={detail}
          refresh={query.refetch}
        />
      )}
      {toInspect && (
        <LegalInspectionModal
          open={!!toInspect}
          onClose={() => setToInspect(null)}
          vehicleInspection={toInspect}
        />
      )}
    </>
  );
};

const RowActions = ({
  inspection,
  year,
  month,
  openDetail,
  openInspect,
}: {
  inspection: VehicleInspection;
  year: string | number;
  month: string | number;
  openDetail: (value: VehicleInspection) => void;
  openInspect: (value: VehicleInspection) => void;
}) => {
  const hasInspection = !!inspection.inspection;

  var canInspect = year === now.getFullYear() && month === now.getMonth() + 1;
  canInspect = true;

  return (
    <Box sx={{ display: 'flex' }}>
      {hasInspection && (
        <Tooltip title={'Ver revisión'}>
          <span>
            <IconButton
              size="small"
              color={'primary'}
              onClick={() => openDetail(inspection)}
            >
              <InfoIcon />
            </IconButton>
          </span>
        </Tooltip>
      )}
      {!hasInspection && canInspect && (
        <Tooltip title={'Registrar revisión'}>
          <span>
            <IconButton
              size="small"
              color={'warning'}
              onClick={() => openInspect(inspection)}
            >
              <VisibilityIcon />
            </IconButton>
          </span>
        </Tooltip>
      )}
    </Box>
  );
};

export default VehicleLegalInspectionPage;

