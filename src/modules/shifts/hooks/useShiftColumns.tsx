import { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { Shift } from '../models';
import { Chip } from "@heroui/react";
import LastTravels from './last_travels';
import IncidentsShift from './IncidentsShift';

export const useShiftColumns = () => {
  const columns = useMemo<MRT_ColumnDef<Shift>[]>(
    () => [
      {
        accessorFn: (row) => row.shift,
        header: 'Turno',
        maxSize: 50,
        Cell: ({ cell }) => (
          <span className="bg-blue-300 text-blue-900 font-semibold rounded-full w-8 h-8 m-0 flex items-center justify-center">
            {`#${cell.getValue<string>()}`}
          </span>
        ),
      },
      {
        accessorFn: (row) => row.driver.name,
        header: 'Operador',
        Cell: ({ cell }) => (
          <span className="text-sm font-semibold">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorFn: (row) => row.driver.modality || 'SIN ASIGNAR',
        header: 'Licencia',
        maxSize: 50,
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return (
            <Chip color={value === 'full' ? 'primary' : 'warning'} size="sm" className='text-white'>
              {cell.getValue<string>()}
            </Chip>
          );
        },
      },
      {
        accessorFn: (row) => row.driver.licenseType || 'SIN ASIGNAR',
        header: 'Tipo Licencia',
        maxSize: 50,
        Cell: ({ cell }) => {
          return (
            <Chip color={"default"} size="sm">
              {cell.getValue<string>()}
            </Chip>
          );
        },
      },
      {
        accessorFn: (row) => row.driver.isDangerous,
        header: 'Peligroso',
        maxSize: 50,
        Cell: ({ row }) => {
          const value = row.original.driver.isDangerous;
          return !value ? (
            <span className="text-gray-400 text-sm">
              NO
            </span>
          ) : (
            <Chip color="primary" size="sm">
              SI
            </Chip>
          );
        },
      },
      {
        accessorFn: (row) => row.vehicle.name,
        header: 'Unidad',
        Cell: ({ cell }) => (
          <span className="text-sm font-semibold text-blue-600">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorFn: (row) => row.arrivalAt.format('DD/MM/YYYY hh:mm A'),
        header: 'Llegada',
      },
      {
        accessorFn: (row) => row.phoneNumber,
        header: 'Teléfono',
        Cell: ({ cell }) => {
          const value = cell.getValue<string | null>();
          return (
            <span
              className={
                value
                  ? "text-blue-700 text-sm font-semibold"
                  : "text-gray-400 text-sm"
              }
            >
              {value || 'SIN NÚMERO'}
            </span>
          )
        }
      },
      {
        accessorFn: (row) => row.has_recent_incident,
        header: 'Incidencias recientes (últimos 15 días)',
        Cell: ({ row }) => {
          return (<IncidentsShift data={row.original}></IncidentsShift>
          );
        }
      },
      {
        accessorFn: (row) => row.travel?.routeName || 'SIN ASIGNAR',
        header: 'Viajes (últimos 15 días)',
        id: 'route',
        Cell: ({ row }) => {
          return (
            <LastTravels data={row.original}></LastTravels>
          )
        }
      },
      {
        accessorFn: (row) => row.travel?.duration || 'SIN ASIGNAR',
        header: 'Duración',
      },
      {
        accessorFn: (row) => row.comments,
        header: 'Comentarios',
      },
    ],
    [],
  );

  return {
    columns,
  };
};

