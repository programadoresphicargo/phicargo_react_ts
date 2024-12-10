import { Button, IconButton } from 'rsuite';
import { useCollectRegisters, useWeekContext } from '../../hooks';

import AlertDialog from '../AlertDialog';
import { CollectRegister } from '../../models';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { MRT_TableOptions } from 'material-react-table';
import MaterialTable from './MaterialTable';
import RefreshIcon from '@mui/icons-material/Refresh';
import { isGOEWeek } from '../../utils';
import { useCollectTableColumns } from '../../hooks/useCollectTableColumns';
import { useState } from 'react';

const CollectionTable = () => {
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
      // updateRegister({ ...values, id: Number(row.id) });
      updateRegister(
        {
          id: Number(row.id),
          updatedItem: { ...values },
        }
      )
      table.setEditingRow(null);
    };

  return (
    <>
      <MaterialTable
        data={registers || []}
        columns={columns}
        initialState={{
          columnPinning: {
            right: ['mrt-row-actions'],
          },
          density: 'compact',
          pagination: { pageIndex: 0, pageSize: 50 },
        }}
        state={{
          isLoading: isFetching,
          isSaving,
        }}
        enableCellActions={true}
        enableRowActions={true}
        editDisplayMode={'row'}
        enableEditing={true}
        getRowId={(row) => row.id as unknown as string}
        onEditingRowSave={handleSaveRegisters}
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
        renderTopToolbarCustomActions={() => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <IconButton
              appearance="primary"
              icon={<RefreshIcon />}
              style={{ padding: '7px' }}
              onClick={() => refetch()}
            />
            <Button
              appearance="primary"
              // onClick={createFn}
              // disabled={!isGOEWeek(weekSelected!)}
            >
              Crear Nuevo Registro
            </Button>
          </div>
        )}
      />
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
