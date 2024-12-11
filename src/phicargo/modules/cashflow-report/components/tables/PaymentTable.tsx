import { IconButton, Tooltip } from '@mui/material';
import {
  MRT_TableOptions,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { usePayments, useWeekContext } from '../../hooks';

import AddButton from '../../../core/components/ui/AddButton';
import AlertDialog from '../AlertDialog';
import { FaRegEdit } from 'react-icons/fa';
import { Payment } from '../../models';
import RefreshIcon from '@mui/icons-material/Refresh';
import { RiDeleteRow } from "react-icons/ri";
import { isGOEWeek } from '../../utils';
import { useNavigate } from 'react-router-dom';
import { usePaymentTableColumns } from '../../hooks/usePaymentTableColumns';
import { useState } from 'react';

const PaymentTable = () => {
  const navigate = useNavigate();
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
      // updateRegister({ ...values, id: Number(row.id) });
      updateRegister({
        id: Number(row.id),
        updatedItem: { ...values },
      });
      table.setEditingRow(null);
    };

  const table = useMaterialReactTable<Payment>({
    // DATA
    columns,
    data: payments || [],
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
          size="small"
          onClick={() => table.setEditingRow(row)}
          disabled={!isGOEWeek(weekSelected!)}
        >
          <FaRegEdit />
        </IconButton>
        <IconButton
          color="error"
          aria-label="delete-action"
          size="small"
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
            onPress={() => navigate('/reportes/balance/payment/add')}
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
