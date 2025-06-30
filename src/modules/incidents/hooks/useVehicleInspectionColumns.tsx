// import { ModalityChip } from '@/modules/drivers/components/ui/ModalityChip';
// import type { Modality } from '@/modules/drivers/models';
// import { VehicleTypeChip } from '@/modules/vehicles/components/ui/VehicleTypeChip';
import { UserBasic } from '@/modules/auth/models';
import type {
  InspectionResult,
  VehicleInspection,
} from '@/modules/vehicles/models';
import { inspectionResult } from '@/modules/vehicles/utilities';
import { Chip } from '@mui/material';
import { Dayjs } from 'dayjs';
import type { MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';

export const useVehicleInspectionColumns = () => {
  const columns = useMemo<MRT_ColumnDef<VehicleInspection>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Unidad',
        Cell: ({ cell }) => (
          <span className="font-bold">{cell.getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'fleetType',
        header: 'Tipo de Unidad',
        Cell: ({ cell }) => (
          <span className="font-bold uppercase">{cell.getValue<string>()}</span>
        ),
      },
      {
        accessorFn: (row) =>
          row.driver ? row.driver.name : 'SIN OPERADOR ASIGNADO',
        header: 'Operador asignado',
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return value === 'SIN OPERADOR ASIGNADO' ? (
            <span className="text-gray-400 text-sm">
              {cell.getValue<string>()}
            </span>
          ) : (
            <span className="font-bold uppercase">
              {cell.getValue<string>()}
            </span>
          );
        },
      },
      {
        accessorFn: (row) => row.inspection?.result,
        header: 'Resultado de Inspección',
        Cell: ({ cell }) => {
          const value = cell.getValue<InspectionResult | null>();
          return value ? (
            <Chip
              label={inspectionResult.getLabel(value)}
              color={inspectionResult.getColor(value)}
              size="small"
            />
          ) : (
            <Chip label={'No Revisada'} color="default" size="small" />
          );
        },
      },
      {
        accessorFn: (row) => row.inspection?.inspectionDate,
        header: 'Fecha de Inspección',
        id: 'inspectionDate',
        Cell: ({ cell }) => {
          const value = cell.getValue<Dayjs | null>();
          return value ? (
            <span className="font-bold">{value.format('DD/MM/YYYY')}</span>
          ) : (
            <span className="text-gray-400">SIN INSPECCIÓN</span>
          );
        },
      },

      {
        accessorFn: (row) => row.inspection?.inspector,
        header: 'Inspector',
        Cell: ({ cell }) => {
          const value = cell.getValue<UserBasic | null>();
          return value ? (
            <span className="font-bold">{value.username}</span>
          ) : (
            <span className="text-gray-400">SIN INSPECCIÓN</span>
          );
        },
      },

      // {
      //   accessorFn: (row) => (row.branch ? row.branch.name : 'N/A'),
      //   header: 'Sucursal',
      //   filterVariant: 'select',
      //   filterSelectOptions: [
      //     {
      //       value: 'Veracruz (Matriz)',
      //       label: 'Veracruz (Matriz)',
      //     },
      //     {
      //       value: 'Manzanillo (Sucursal)',
      //       label: 'Manzanillo (Sucursal)',
      //     },
      //     {
      //       value: 'N/A',
      //       label: 'N/A',
      //     },
      //   ],
      //   Cell: ({ cell }) => {
      //     const value = cell.getValue<string>();
      //     return value === 'N/A' ? (
      //       <span className="text-gray-400">{cell.getValue<string>()}</span>
      //     ) : (
      //       <span className="font-bold uppercase">
      //         {cell.getValue<string>()}
      //       </span>
      //     );
      //   },
      // },

      // {
      //   accessorKey: 'vehicleType',
      //   header: 'Tipo de vehículo',
      //   filterVariant: 'select',
      //   filterSelectOptions: [
      //     {
      //       value: 'carretera',
      //       label: 'carretera',
      //     },
      //     {
      //       value: 'local',
      //       label: 'local',
      //     },
      //   ],
      //   Cell: ({ cell }) => (
      //     <VehicleTypeChip
      //       fleetType={cell.getValue<string>() || 'SIN ASIGNAR'}
      //     />
      //   ),
      // },
      // {
      //   accessorFn: (row) => row.modality || 'SIN ASIGNAR',
      //   header: 'Modalidad',
      //   filterVariant: 'select',
      //   filterSelectOptions: [
      //     {
      //       value: 'full',
      //       label: 'FULL',
      //     },
      //     {
      //       value: 'sencillo',
      //       label: 'SENCILLO',
      //     },
      //     {
      //       value: 'SIN ASIGNAR',
      //       label: 'SIN ASIGNAR',
      //     },
      //   ],
      //   Cell: ({ cell }) => {
      //     const value = cell.getValue<string>();
      //     return value === 'SIN ASIGNAR' ? (
      //       <span className="text-gray-400 text-sm">{value}</span>
      //     ) : (
      //       <ModalityChip modality={value as Modality} />
      //     );
      //   },
      // },
      // {
      //   accessorFn: (row) => (row.state ? row.state.name : 'N/A'),
      //   header: 'Estado',
      // },
    ],
    [],
  );

  return columns;
};

