import { Button, IconButton } from 'rsuite';
import { usePayments, useWeekContext } from '../../hooks';

import AlertDialog from '../AlertDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { MRT_TableOptions } from 'material-react-table';
import MaterialTable from './MaterialTable';
import { Payment } from '../../models';
import RefreshIcon from '@mui/icons-material/Refresh';
import { isSameWeek } from '../../utils';
import { usePaymentTableColumns } from '../../hooks/usePaymentTableColumns';
import { useState } from 'react';

const PaymentTable = () => {

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { weekSelected } = useWeekContext();

  const {
    paymentsQuery: { data: payments, refetch, isFetching },
    updatePaymentMutation: { mutate: updateRegister, isPending: isSaving },
    deletePaymentMutation: { mutate: deleteRegister },
  } = usePayments();

  const columns = usePaymentTableColumns(payments || []);

  const handleSaveRegisters: MRT_TableOptions<Payment>['onEditingRowSave'] =
    async ({ values, table, row }) => {
      updateRegister({ ...values, id: Number(row.id) });
      table.setEditingRow(null);
    };

  return (
    <>
      <MaterialTable
        data={payments || []}
        columns={columns}
        initialState={{
          columnPinning: {
            right: ['mrt-row-actions'],
          },
          density: 'compact',
          pagination: { pageIndex: 0, pageSize: 50 },
          // isLoading: isFetching,
        }}
        state={{
          isLoading: isFetching,
          isSaving,
        }}
        enableCellActions={true}
        enableRowActions={true}
        enableClickToCopy={'context-menu'}
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
              disabled={!isSameWeek(weekSelected!)}
            />
            <IconButton
              circle
              icon={<DeleteIcon />}
              appearance="primary"
              size="xs"
              onClick={() => setDeleteId(Number(row.original.id))}
              color="red"
              stye={{ padding: '1px' }}
              disabled={!isSameWeek(weekSelected!)}
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
              disabled={!isSameWeek(weekSelected!)}
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

export default PaymentTable;
