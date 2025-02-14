import { IconButton, Tooltip } from '@mui/material';
import {
  MRT_ColumnDef,
  MRT_GroupingState,
  useMaterialReactTable,
} from 'material-react-table';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';

import { Incidence } from '../models/driver-incidence-model';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import MaterialTableBase from '../../core/components/tables/MaterialTableBase';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useIncidenceQueries } from '../hooks/useIncidenceQueries';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const columns: MRT_ColumnDef<Incidence>[] = [
  {
    accessorFn: (row) => row.driver.name,
    header: 'Operador',
    id: 'driver',
  },
  {
    accessorFn: (row) => row.incidence,
    header: 'Incidencia',
  },
  {
    accessorFn: (row) => row.comments,
    header: 'Comentarios',
  },
  {
    accessorFn: (row) => row.createdAt.format('DD/MM/YYYY hh:mm A'),
    header: 'Fecha',
  },
  {
    accessorFn: (row) => row.user.username,
    header: 'Registrado por',
  },
];

const IncidencesList = () => {
  const navigate = useNavigate();

  const { incidencesQuery } = useIncidenceQueries();
  const [grouping, setGrouping] = useState<MRT_GroupingState>(['driver']);

  const onClose = () => {
    navigate('/turnos');
  };

  const table = useMaterialReactTable<Incidence>({
    // DATA
    columns,
    data: incidencesQuery.data || [],
    enableStickyHeader: true,
    autoResetPageIndex: false,
    localization: MRT_Localization_ES,
    // PAGINATION, FILTERS, SORTING
    enableSorting: false,
    enableGrouping: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    columnFilterDisplayMode: 'subheader',
    getRowId: (row) => String(row.id),
    onGroupingChange: setGrouping,
    // STATE
    initialState: {
      showColumnFilters: false,
      density: 'compact',
      pagination: { pageSize: 100, pageIndex: 0 },
      grouping: ['driver'],
    },
    state: {
      isLoading: incidencesQuery.isFetching,
      grouping,
    },
    // CUSTOMIZATIONS
    renderTopToolbarCustomActions: () => (
      <div className="flex items-center gap-4">
        <Tooltip arrow title="Refrescar">
          <IconButton onClick={() => incidencesQuery.refetch()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </div>
    ),
    muiTableContainerProps: {
      sx: {
        height: 'calc(100vh - 240px)',
      },
    },
    defaultColumn: {
      muiTableBodyCellProps: {
        sx: {
          padding: '2px',
        },
      },
    },
  });

  return (
    <Modal
      isOpen={true}
      size="full"
      onOpenChange={onClose}
      isDismissable={false}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex items-center justify-center bg-[#dadfeb] pb-2">
              <h3 className="font-bold text-xl text-center text-gray-800 uppercase">
                Conteo de Incidencias
              </h3>
            </ModalHeader>
            <ModalBody className="p-0">
              <MaterialTableBase table={table} />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default IncidencesList;

