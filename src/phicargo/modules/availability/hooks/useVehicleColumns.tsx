import type { MRT_ColumnDef } from 'material-react-table';
import { Modality } from '../models/driver-model';
import ModalityChip from '../components/ui/ModalityChip';
import type { Vehicle } from '../models/vehicle-model';
import VehicleTypeChip from '../components/ui/VehicleTypeChip';
import { useMemo } from 'react';

export const useVehicleColumns = () => {
  const columns = useMemo<MRT_ColumnDef<Vehicle>[]>(
    () => [
      {
        accessorFn: (row) => (row.company ? row.company.name : 'N/A'),
        header: 'Empresa',
        filterVariant: 'select',
        filterSelectOptions: [
          {
            value: 'TRANSPORTES BELCHEZ',
            label: 'TRANSPORTES BELCHEZ',
          },
          {
            value: 'PHI-CARGO',
            label: 'PHI-CARGO',
          },
          {
            value: 'N/A',
            label: 'N/A',
          }
        ],
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return value === 'N/A' 
            ? <span className='text-gray-400'>{cell.getValue<string>()}</span>
            : <span className='font-bold uppercase'>{cell.getValue<string>()}</span>
        }
      },
      {
        accessorFn: (row) => (row.branch ? row.branch.name : 'N/A'),
        header: 'Sucursal',
        filterVariant: 'select',
        filterSelectOptions: [
          {
            value: 'Veracruz (Matriz)',
            label: 'Veracruz (Matriz)',
          },
          {
            value: 'Manzanillo (Sucursal)',
            label: 'Manzanillo (Sucursal)',
          },
          {
            value: 'N/A',
            label: 'N/A',
          }
        ],
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return value === 'N/A' 
            ? <span className='text-gray-400'>{cell.getValue<string>()}</span>
            : <span className='font-bold uppercase'>{cell.getValue<string>()}</span>
        }
      },
      { 
        accessorKey: 'name', 
        header: 'Unidad',
        Cell: ({ cell }) => (
          <span className='font-bold'>{cell.getValue<string>()}</span>
        )  
      },
      {
        accessorFn: (row) =>
          row.driver ? row.driver.name : 'SIN OPERADOR ASIGNADO',
        header: 'Operador asignado',
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return value === 'SIN OPERADOR ASIGNADO' 
            ? <span className='text-gray-400 text-sm'>{cell.getValue<string>()}</span>
            : <span className='font-bold uppercase'>{cell.getValue<string>()}</span>
        }
      },
      {
        accessorKey: 'vehicleType',
        header: 'Tipo de vehículo',
        filterVariant: 'select',
        filterSelectOptions: [
          {
            value: 'carretera',
            label: 'carretera',
          },
          {
            value: 'local',
            label: 'local',
          },
        ],
        Cell: ({ cell }) => (
          <VehicleTypeChip fleetType={cell.getValue<string>() || 'SIN ASIGNAR'} />
        )
      },
      { 
        accessorFn: (row) => (row.loadType || 'SIN ASIGNAR'),
        header: 'Tipo de carga',
        filterVariant: 'select',
        filterSelectOptions: [
          {
            value: 'imo',
            label: 'IMO',
          },
          {
            value: 'general',
            label: 'GENERAL',
          },
          {
            value: 'SIN ASIGNAR',
            label: 'SIN ASIGNAR',
          },
        ],
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return value === 'SIN ASIGNAR'
            ? <span className='text-gray-400 text-sm'>{value}</span>
            : <span className='font-bold uppercase'>{value}</span>
        } 
      },
      {
        accessorFn: (row) => (row.modality || 'SIN ASIGNAR'),
        header: 'Modalidad',
        filterVariant: 'select',
        filterSelectOptions: [
          {
            value: 'full',
            label: 'FULL',
          },
          {
            value: 'sencillo',
            label: 'SENCILLO',
          },
          {
            value: 'SIN ASIGNAR',
            label: 'SIN ASIGNAR',
          },
        ],
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return value === 'SIN ASIGNAR'
            ? <span className='text-gray-400 text-sm'>{value}</span>
            : <ModalityChip modality={value as Modality} />
        } 
      },
      {
        accessorFn: (row) => (row.state ? row.state.name : 'N/A'),
        header: 'Estado',
      },
    ],
    [],
  );

  return {
    columns,
  };
};

