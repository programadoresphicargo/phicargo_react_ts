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
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return value === 'N/A' 
            ? <span className='text-gray-400 text-sm'>{cell.getValue<string>()}</span>
            : <span className='font-bold uppercase'>{cell.getValue<string>()}</span>
        }
      },
      {
        accessorFn: (row) => (row.branch ? row.branch.name : 'N/A'),
        header: 'Sucursal',
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return value === 'N/A' 
            ? <span className='text-gray-400 text-sm'>{cell.getValue<string>()}</span>
            : <span className='font-bold uppercase'>{cell.getValue<string>()}</span>
        }
      },
      { 
        accessorKey: 'name', 
        header: 'Unidad',
        Cell: ({ cell }) => (
          <span className='font-bold text-medium'>{cell.getValue<string>()}</span>
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
        Cell: ({ cell }) => (
          <VehicleTypeChip fleetType={cell.getValue<string>() || 'SIN ASIGNAR'} />
        )
      },
      { 
        accessorKey: 'loadType', 
        header: 'Tipo de carga',
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return !value
            ? <span className='text-gray-400 text-sm'>{'SIN ASIGNAR'}</span>
            : <span className='font-bold uppercase'>{cell.getValue<string>()}</span>
        } 
      },
      {
        accessorKey: 'modality',
        header: 'Modalidad',
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return !value
            ? <span className='text-gray-400 text-sm'>{'SIN ASIGNAR'}</span>
            : <ModalityChip modality={cell.getValue<Modality>()} />
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

