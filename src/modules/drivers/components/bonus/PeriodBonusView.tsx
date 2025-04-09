import { AppBar, Box, Dialog, Toolbar, Typography } from '@mui/material';
import { Button, MuiSaveButton, RefreshButton } from '@/components/ui';
import { ExportConfig, ExportToExcel, getMonthName } from '@/utilities';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useState } from 'react';

import type { DriverBonus } from '../../models';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ExportExcelButton from '@/components/ui/buttons/ExportExcelButton';
import { MuiTransition } from '@/components';
import { useAuthContext } from '@/modules/auth/hooks';
import { useDriverBonusColumns } from '../../hooks/useDriverBonusColumns';
import { useGetDriverBonusQuery } from '../../hooks/queries';
import { useUpdateDriverBonusMutation } from '../../hooks/mutations';

interface Props {
  open: boolean;
  onClose: () => void;
  month: number;
  year: number;
}

export const PeriodBonusView = ({ open, onClose, month, year }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [records, setRecords] = useState<DriverBonus[]>([]);

  const { session } = useAuthContext();

  const { updateDriverBonusMutation } = useUpdateDriverBonusMutation(
    month,
    year,
  );
  const { driverBonusQuery } = useGetDriverBonusQuery(month, year);
  const columns = useDriverBonusColumns(
    session?.user.permissions || [],
    isEditing,
    records,
    setRecords,
  );

  useEffect(() => {
    setRecords(driverBonusQuery.data || []);
  }, [driverBonusQuery.data]);

  const onSaveEditing = async () => {
    const columnVisibility = getColumnVisibility(
      session?.user.permissions || [],
    );

    const filteredData = records.map((row) => {
      return Object.keys(row)
        .filter((key) => columnVisibility[key as keyof DriverBonus] !== false)
        .reduce<DriverBonus>((obj, key) => {
          // @ts-expect-error no se puede inferir el tipo
          obj[key] = row[key];
          return obj;
        }, {} as DriverBonus);
    });

    updateDriverBonusMutation.mutate(filteredData, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const table = useMaterialReactTable<DriverBonus>({
    columns: columns,
    data: records,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: {
      isLoading: driverBonusQuery.isLoading,
      showProgressBars: driverBonusQuery.isFetching,
    },
    initialState: {
      density: 'compact',
      pagination: { pageSize: 100, pageIndex: 0 },
    },
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
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 193px)',
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <RefreshButton onRefresh={driverBonusQuery.refetch} />
        <Button
          onClick={() => setIsEditing(!isEditing)}
          color={isEditing ? 'error' : 'primary'}
          variant="outlined"
          startIcon={<EditNoteIcon />}
        >
          {isEditing ? 'Cancelar Edición' : 'Editar'}
        </Button>
        {isEditing && (
          <MuiSaveButton
            variant="contained"
            color="success"
            onClick={onSaveEditing}
            className="text-white"
            loading={updateDriverBonusMutation.isPending}
          />
        )}
        <ExportExcelButton 
          onClick={() => toExcel.exportData(records)}
        />
      </Box>
    ),
  });

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      slots={{
        transition: MuiTransition,
      }}
    >
      <AppBar
        elevation={0}
        sx={{
          position: 'relative',
          background: 'linear-gradient(90deg, #0b2149, #002887)',
          padding: '0 16px',
        }}
      >
        <Toolbar>
          <Typography sx={{ fontSize: '20px', textTransform: 'uppercase', flex: 1 }} variant='h3'>
            Registro de bonos {getMonthName(month)} {year}
          </Typography>
          <Button autoFocus color="inherit" onClick={onClose}>
            Cerrar
          </Button>
        </Toolbar>
      </AppBar>
      <Box>
        <MaterialReactTable table={table} />
      </Box>
    </Dialog>
  );
};

const getColumnVisibility = (
  permissions: number[],
): Record<keyof DriverBonus, boolean> => ({
  excellence: permissions.includes(12),
  productivity: permissions.includes(12),
  operation: permissions.includes(12),
  roadSafety: permissions.includes(9),
  vehicleCare: permissions.includes(10),
  performance: permissions.includes(10),
  score: permissions.includes(10),
  id: true,
  driver: true,
  month: true,
  year: true,
  distance: true,
  createdAt: true,
});

const exportConf: ExportConfig<DriverBonus> = {
  fileName: 'Bonos Operadores',
  withDate: true,
  sheetName: 'Bonos Operadores',
  columns: [
    { accessorFn: (data) => data.driver, header: 'OPERADOR' },
    { accessorFn: (data) => data.distance, header: 'KM RECORRIDOS' },
    { accessorFn: (data) => data.excellence, header: 'EXCELENCIA' },
    { accessorFn: (data) => data.productivity, header: 'PRODUCTIVIDAD' },
    { accessorFn: (data) => data.operation, header: 'OPERACIÓN' },
    { accessorFn: (data) => data.roadSafety, header: 'SEGURIDAD VIAL' },
    { accessorFn: (data) => data.vehicleCare, header: 'CUIDADO UNIDAD' },
    { accessorFn: (data) => data.performance, header: 'RENDIMIENTO' },
    { accessorFn: (data) => data.score, header: 'CALIFICACIÓN' },
  ],
};

const toExcel = new ExportToExcel(exportConf);
