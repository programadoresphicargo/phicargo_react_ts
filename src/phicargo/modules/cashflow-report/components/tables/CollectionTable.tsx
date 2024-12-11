import { IconButton, Tooltip } from '@mui/material';
import {
  MRT_TableOptions,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useCollectRegisters, useWeekContext } from '../../hooks';

import AddButton from '../../../core/components/ui/AddButton';
import AlertDialog from '../AlertDialog';
import type { CollectRegister } from '../../models';
import { FaRegEdit } from 'react-icons/fa';
import RefreshIcon from '@mui/icons-material/Refresh';
import { RiDeleteRow } from "react-icons/ri";
import { isGOEWeek } from '../../utils';
import { useCollectTableColumns } from '../../hooks/useCollectTableColumns';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const CollectionTable = () => {
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { weekSelected } = useWeekContext();

  const {
    collectRegisterQuery: { data: registers, refetch, isFetching },
    updateCollectRegisterMutation: {
      mutate: updateRegister,
      isPending: isSaving,
    },
    deleteCollectRegisterMutation: { mutate: deleteRegister },
  } = useCollectRegisters();

  const columns = useCollectTableColumns(registers || []);

  const handleSaveRegisters: MRT_TableOptions<CollectRegister>['onEditingRowSave'] =
    async ({ values, table, row }) => {
      updateRegister({
        id: Number(row.id),
        updatedItem: { ...values },
      });
      table.setEditingRow(null);
    };

  const table = useMaterialReactTable<CollectRegister>({
    // DATA
    columns,
    data: registers || [],
    enableStickyHeader: true,
    enableStickyFooter: true,
    // PAGINATION, FILTERS, SORTING
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    enableDensityToggle: false,
    getRowId: (row) => row.id as unknown as string,
    editDisplayMode: 'row',
    enableEditing: true,
    onEditingRowSave: handleSaveRegisters,
    enableRowActions: true,
    positionActionsColumn: 'first',
    enableCellActions: true,
    // STATE
    state: {
      isLoading: isFetching,
      isSaving: isSaving,
    },
    initialState: {
      density: 'compact',
      pagination: { pageSize: 100, pageIndex: 0 },
      columnPinning: {
        right: ['mrt-row-actions'],
      },
    },
    // CUSTOMIZATIONS
    renderRowActions: ({ row, table }) => (
      <div className="flex items-center gap-1 py-0.5">
        <IconButton 
          color="primary" 
          aria-label="edit-action" 
          size='small'
          onClick={() => table.setEditingRow(row)}
          disabled={!isGOEWeek(weekSelected!)}
        >
          <FaRegEdit />
        </IconButton>
        <IconButton 
          color="error" 
          aria-label="delete-action" 
          size='small'
          onClick={() => setDeleteId(Number(row.id))}
          disabled={!isGOEWeek(weekSelected!)}
        >
          <RiDeleteRow />
        </IconButton>
      </div>
    ),
    renderTopToolbarCustomActions: () => (
      <div className="flex flex-row gap-2">
        <div className="flex flex-row items-center rounded-xl">
          <Tooltip arrow title="Refrescar">
            <IconButton onClick={() => refetch()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </div>
        <div className="flex flex-row items-center">
          <AddButton
            label="Añadir"
            onPress={() => navigate('/reportes/balance/collect/add')}
          />
        </div>
      </div>
    ),
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '14px',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 225px)',
      },
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />
      {/* <MaterialTable

        renderRowActions={({ row, table }) => (
          <div
            style={{
              display: 'flex',
              gap: '5px',
              alignItems: 'center',
              padding: '2px 0px',
            }}
          >
            <IconButton
              circle
              icon={<EditIcon />}
              appearance="primary"
              size="xs"
              style={{ padding: '5px' }}
              onClick={() => table.setEditingRow(row)}
              // disabled={!isGOEWeek(weekSelected!)}
            />
            <IconButton
              circle
              icon={<DeleteIcon />}
              appearance="primary"
              size="xs"
              onClick={() => setDeleteId(Number(row.original.id))}
              color="red"
              stye={{ padding: '1px' }}
              disabled={!isGOEWeek(weekSelected!)}
            />
          </div>
        )}
       
      /> */}
      {deleteId && (
        <AlertDialog
          alert="Eliminar Registro"
          description="¿Estás seguro de eliminar este registro?"
          onConfirm={() => {
            deleteRegister(deleteId);
            setDeleteId(null);
          }}
          onClose={() => setDeleteId(null)}
        />
      )}
    </>
  );
};

export default CollectionTable;
