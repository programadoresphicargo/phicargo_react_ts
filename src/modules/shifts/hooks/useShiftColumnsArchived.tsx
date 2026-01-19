import { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { Shift } from '../models';
import { Chip } from "@heroui/react";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import dayjs from 'dayjs';

export const useShiftColumnsArchived = () => {
  const columns = useMemo<MRT_ColumnDef<Shift>[]>(
    () => [
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
        accessorFn: (row) => row.comments,
        header: 'Comentarios',
      },
      {
        accessorFn: (row) => row.cp_assigned,
        header: 'Viaje programado',
      },
      {
        accessorFn: (row) => row.archivedReason,
        header: 'Motivo',
      },
      {
        accessorFn: (row) => row.archivedDate?.format('DD/MM/YYYY hh:mm A'),
        header: 'Archivado',
      },
    ],
    [],
  );

  return {
    columns,
  };
};

