import { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { Shift } from '../models';
import { Chip } from "@heroui/react";
import LastTravels from './last_travels';
import IncidentsShift from './IncidentsShift';
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import dayjs from 'dayjs';

type KmData = {
  total_km: number | null;
};

export const useShiftColumns = (
  kmByKey: Record<string, KmData>
) => {
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
        header: 'Estado de la licencia',
        size: 200,
        Cell: ({ row }) => {
          const driver = row.original.driver;
          const daysLeft: number | null = driver?.daysLeft ?? null;

          let color: "default" | "success" | "warning" | "danger" = "default";
          let label = "SIN ASIGNAR";

          if (daysLeft !== null) {
            if (daysLeft < 0) {
              color = "danger";
              label = `Licencia vencida (${driver.licenseType})`;
            } else if (daysLeft < 60) {
              color = "warning";
              label = `Próxima a expirar en ${daysLeft} días (${driver.licenseType})`;
            } else {
              color = "success";
              label = `Vigente (${driver.licenseType})`;
            }
          }

          return (
            <Popover placement="right" color={color} backdrop="opaque">
              <PopoverTrigger>
                <Chip color={color} size="sm" className='text-white'>{label}</Chip>
              </PopoverTrigger>
              <PopoverContent>
                <div className="px-1 py-2">
                  <div className="text-small font-bold text-white">Expira:</div>
                  <div className="text-tiny text-white"> {driver?.licenseExpiration ? dayjs(driver.licenseExpiration).format("DD/MM/YYYY") : "SIN ASIGNAR"}</div>
                </div>
              </PopoverContent>
            </Popover>
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
            <Chip color="danger" size="sm">
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
        header: 'Kilómetros recorridos',
        id: 'km',
        Cell: ({ row }) => {
          const kmData = kmByKey[row.original.shift];
          const km = kmData?.total_km;

          return (
            <span className="text-sm font-semibold text-green-600">
              {km != null ? `${km} km` : '—'}
            </span>
          );
        },
      },
      {
        accessorFn: (row) => row.has_recent_incident,
        header: 'Incidencias recientes (últimos 30 días)',
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
    [kmByKey],
  );

  return {
    columns,
  };
};

