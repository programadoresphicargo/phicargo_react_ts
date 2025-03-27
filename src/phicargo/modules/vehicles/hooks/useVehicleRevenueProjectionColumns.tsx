import { Chip } from '@heroui/react';
import { CurrencyCell } from '@/components/ui';
import type { MRT_ColumnDef } from 'material-react-table';
import { ModalityChip } from '../../drivers/components/ui/ModalityChip';
import type { VehicleRevenueProjection } from '../models';
import { useMemo } from 'react';

export const useVehicleRevenueProjectionColumns = () => {
  const columns = useMemo<MRT_ColumnDef<VehicleRevenueProjection>[]>(() => {
    return [
      {
        accessorKey: 'name',
        header: 'UNIDAD',
        size: 4,
        Cell: ({ cell }) => {
          return (
            <Chip size="sm" color="primary">
              {cell.getValue<string>()}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'company',
        header: 'EMPRESA',
        Cell: ({ cell }) => {
          return (
            <span className="font-bold uppercase">
              {cell.getValue<string>()}
            </span>
          );
        },
      },
      {
        accessorKey: 'branch',
        header: 'SUCURSAL',
        size: 4,
        Cell: ({ cell }) => {
          return (
            <span className="font-bold uppercase">
              {cell.getValue<string>()}
            </span>
          );
        },
      },
      {
        accessorKey: 'driver',
        header: 'OPERADOR',
        Cell: ({ cell }) => {
          const value = cell.getValue<string | null>();
          return !value ? (
            <span className="text-gray-400 text-sm">SIN OPERADOR ASIGNADO</span>
          ) : (
            <span className="font-bold uppercase">
              {cell.getValue<string>()}
            </span>
          );
        },
      },
      {
        accessorKey: 'vehicleType',
        header: 'TIPO',
        size: 4,
        Cell: ({ cell }) => {
          return (
            <span className="font-bold uppercase">
              {cell.getValue<string>()}
            </span>
          );
        },
      },
      {
        accessorKey: 'configType',
        header: 'CONF.',
        size: 4,
        Cell: ({ row }) => (
          <ModalityChip
            modality={row.original.configType as typeof row.original.configType}
          />
        ),
      },
      { 
        accessorKey: 'status', 
        header: 'ESTATUS',
        size: 4
      },
      {
        accessorKey: 'monthlyTarget',
        header: 'OBJETIVO MENS',
        Cell: ({ cell }) => <CurrencyCell value={cell.getValue<number>()} />,
      },
      {
        accessorKey: 'idealDailyTarget',
        header: 'OBJETIVO DIARIO IDEAL',
        Cell: ({ cell }) => <CurrencyCell value={cell.getValue<number>()} />,
      },
      {
        accessorKey: 'workingDays',
        header: 'DÍAS OPS',
      },
      {
        accessorKey: 'operationalDays',
        header: 'DÍAS OPS REAL',
      },
      {
        accessorKey: 'dailyTarget',
        header: 'OBJETIVO DIARIO',
        Cell: ({ cell }) => <CurrencyCell value={cell.getValue<number>()} />,
      },
      {
        accessorKey: 'realMonthlyRevenue',
        header: 'INGRESO MENS REAL',
        Cell: ({ cell }) => <CurrencyCell value={cell.getValue<number>()} />,
      },
      {
        accessorKey: 'availabilityStatus',
        header: 'DISPONIBILIDAD',
      },
    ];
  }, []);

  return columns;
};

