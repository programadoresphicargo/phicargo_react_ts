import { Chip } from '@heroui/react';
import type { MRT_ColumnDef } from 'material-react-table';
import type { VehicleRevenueProjection } from '../models';
import { formatCurrency } from '../../cashflow-report/utils';
import { useMemo } from 'react';

export const useVehicleRevenueProjectionColumns = () => {
  const columns = useMemo<MRT_ColumnDef<VehicleRevenueProjection>[]>(() => {
    return [
      {
        accessorKey: 'name',
        header: 'Unidad',
        Cell: ({ cell }) => {
          return (
            <Chip size="sm" color="primary">
              {cell.getValue<string>()}
            </Chip>
          );
        },
      },
      { accessorKey: 'company', header: 'Empresa' },
      { accessorKey: 'branch', header: 'Sucursal' },
      {
        accessorKey: 'driver',
        header: 'Operador',
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
      { accessorKey: 'vehicleType', header: 'Tipo' },
      { accessorKey: 'configType', header: 'Configuración' },
      { accessorKey: 'status', header: 'Estatus' },
      {
        accessorKey: 'monthlyTarget',
        header: 'Objetivo mensual',
        Cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
      },
      {
        accessorKey: 'idealDailyTarget',
        header: 'Objetivo diario ideal',
        Cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
      },
      {
        accessorKey: 'operationalDays',
        header: 'Días operativos',
      },
      {
        accessorKey: 'dailyTarget',
        header: 'Objetivo diario',
        Cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
      },
      {
        accessorKey: 'realMonthlyRevenue',
        header: 'Ingreso mensual real',
        Cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
      },
      {
        accessorKey: 'availabilityStatus',
        header: 'Estatus de disponibilidad',
      },
    ];
  }, []);

  return columns;
};

