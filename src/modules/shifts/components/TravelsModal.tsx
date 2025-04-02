import { IconButton, Tooltip } from '@mui/material';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table';
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";

import RefreshIcon from '@mui/icons-material/Refresh';
import type { Travel } from '../models/travels-models';
import { FaSearchLocation } from 'react-icons/fa';
import { GiPathDistance } from 'react-icons/gi';
import { TbTruckReturn } from 'react-icons/tb';

const columns: MRT_ColumnDef<Travel>[] = [
  {
    accessorFn: (row) => row.branch,
    header: 'Sucursal Origen',
    id: 'branch',
    Cell: ({ cell }) => (
      <span className="font-bold uppercase">{cell.getValue<string>()}</span>
    ),
  },
  {
    accessorFn: (row) => row.vehicle,
    header: 'Unidad',
    id: 'vehicle',
    Cell: ({ cell }) => (
      <span className="bg-blue-500 p-2 rounded-lg text-white">
        {cell.getValue<string>()}
      </span>
    ),
  },
  {
    accessorFn: (row) => row.driver,
    header: 'Operador',
    id: 'driver',
  },
  {
    accessorFn: (row) => row.name,
    header: 'Viaje',
    id: 'travelName',
  },
  {
    accessorFn: (row) => row.status,
    header: 'Estatus Viaje',
    id: 'travelStatus',
  },
  {
    accessorFn: (row) => row.operativeStatus,
    header: 'Estatus Operativo',
    id: 'travelOperativeStatus',
  },
  {
    header: 'Ubicación',
    id: 'location',
    Cell: ({ row }) => {
      const lat = row.original.latitude;
      const lon = row.original.longitude;

      if (!lat || !lon) {
        return (
          <span className="text-gray-500">Coordenadas no disponibles</span>
        );
      }

      return (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 font-bold underline flex items-center space-x-2"
        >
          <FaSearchLocation />
          <span className="truncate">{`${lat.toFixed(4)}, ${lon.toFixed(
            4,
          )}`}</span>
        </a>
      );
    },
  },

  {
    accessorFn: (row) => row.distanceToBranch,
    header: 'Distancia a Sucursal',
    id: 'distanceToBranch',
    Cell: ({ cell }) => {
      if (!cell.getValue<number>()) {
        return <span className="text-gray-500">No disponible</span>;
      }

      return (
        <div className="text-blue-700 font-bold flex items-center space-x-2">
          <GiPathDistance />
          <span className="truncate">{`${cell
            .getValue<number>()
            ?.toFixed(2)} KM`}</span>
        </div>
      );
    },
  },
];

interface Props {
  title: string;
  message?: string;
  data: Travel[];
  isLoading: boolean;
  refetch: () => void;
  onClose: () => void;
}

export const TravelsModal = (props: Props) => {
  const table = useMaterialReactTable<Travel>({
    // DATA
    columns,
    data: props.data || [],
    enableStickyHeader: true,
    autoResetPageIndex: false,
    // PAGINATION, FILTERS, SORTING
    enableSorting: false,
    enableGrouping: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    columnFilterDisplayMode: 'subheader',
    getRowId: (row) => String(row.id),
    // STATE
    initialState: {
      showColumnFilters: false,
      density: 'compact',
      pagination: { pageSize: 100, pageIndex: 0 },
    },
    state: {
      isLoading: props.isLoading,
    },
    // CUSTOMIZATIONS
    renderTopToolbarCustomActions: () => (
      <div className="flex items-center gap-4">
        <Tooltip arrow title="Refrescar">
          <IconButton onClick={() => props.refetch()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        {props.message && (
          <div className="flex items-center gap-2 px-3 py-1 border border-blue-200 bg-blue-50 rounded-lg shadow-sm">
            <TbTruckReturn className="text-blue-500" />
            <p className="text-gray-700">{props.message}</p>
          </div>
        )}
      </div>
    ),
    muiTableContainerProps: {
      sx: {
        height: 'calc(100vh - 300px)',
      },
    },
  });

  return (
    <Modal
      isOpen={true}
      size="5xl"
      onOpenChange={props.onClose}
      isDismissable={false}
      classNames={{
        base: 'w-[80%] max-w-[90%] overflow-hidden',
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex items-center justify-center bg-[#dadfeb] pb-2">
              <h3 className="font-bold text-xl text-center text-gray-800 uppercase">
                {props.title}
              </h3>
            </ModalHeader>
            <ModalBody className="p-0">
              <MaterialReactTable table={table} />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

