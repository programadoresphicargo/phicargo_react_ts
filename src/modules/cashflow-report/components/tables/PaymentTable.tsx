import { ExportConfig, ExportToExcel } from '@/utilities';
import { MRT_TableOptions, MaterialReactTable } from 'material-react-table';
import { usePayments, useWeekContext } from '../../hooks';

import { AddButton } from '@/components/ui';
import { AlertDialog } from '@/components';
import { FaRegEdit } from 'react-icons/fa';
import { IconButton } from '@mui/material';
import NewPaymentForm from '../NewPaymentForm';
import type { Payment } from '../../models';
import { RiDeleteRow } from 'react-icons/ri';
import { isGOEWeek } from '../../utils';
import { useBaseTable } from '@/hooks';
import { usePaymentTableColumns } from '../../hooks/usePaymentTableColumns';
import { useState } from 'react';

const PaymentTable = () => {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openAdd, setOpenAdd] = useState(false);

  const { weekSelected } = useWeekContext();

  const {
    paymentsQuery: { data: payments, refetch, isFetching, isLoading },
    updatePaymentMutation: { mutate: updateRegister },
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

  const table = useBaseTable<Payment>({
    columns,
    data: payments || [],
    tableId: 'payment-registers',
    isLoading,
    isFetching,
    refetchFn: refetch,
    exportFn: () => exportTo.exportData(payments || []),
    containerHeight: 'calc(100vh - 210px)',
    enableStickyFooter: true,
    enableRowActions: true,
    positionActionsColumn: 'first',
    stickyRightActions: true,
    editDisplayMode: 'row',
    enableEditing: true,
    onEditingRowSave: handleSaveRegisters,
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
    toolbarActions: (
      <>
        <AddButton label="Añadir" onClick={() => setOpenAdd(true)} />
      </>
    ),
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <NewPaymentForm open={openAdd} onClose={() => setOpenAdd(false)} />
      {deleteId && (
        <AlertDialog
          open={Boolean(deleteId)}
          title="Eliminar Registro"
          message="¿Estás seguro de eliminar este registro?"
          severity="danger"
          onConfirm={() => {
            deleteRegister(deleteId);
            setDeleteId(null);
          }}
          onOpenChange={() => setDeleteId(null)}
        />
      )}
    </>
  );
};

export default PaymentTable;

const exportConf: ExportConfig<Payment> = {
  fileName: 'Cuantas por Pagar',
  withDate: true,
  columns: [
    { accessorFn: (data) => data.providerName, header: 'Proveedor' },
    { accessorFn: (data) => data.totalConfirmed, header: 'Confirmado' },
    { accessorFn: (data) => data.monday.amount, header: 'Lunes Proyección' },
    { accessorFn: (data) => data.tuesday.amount, header: 'Martes Proyección' },
    {
      accessorFn: (data) => data.wednesday.amount,
      header: 'Miercoles Proyección',
    },
    { accessorFn: (data) => data.thursday.amount, header: 'Jueves Proyección' },
    { accessorFn: (data) => data.friday.amount, header: 'Viernes Proyección' },
    { accessorFn: (data) => data.saturday.amount, header: 'Sabado Proyección' },
    {
      accessorFn: (data) => data.monday.realAmount,
      header: 'Lunes Confirmado',
    },
    {
      accessorFn: (data) => data.tuesday.realAmount,
      header: 'Martes Confirmado',
    },
    {
      accessorFn: (data) => data.wednesday.realAmount,
      header: 'Miercoles Confirmado',
    },
    {
      accessorFn: (data) => data.thursday.realAmount,
      header: 'Jueves Confirmado',
    },
    {
      accessorFn: (data) => data.friday.realAmount,
      header: 'Viernes Confirmado',
    },
    {
      accessorFn: (data) => data.saturday.realAmount,
      header: 'Sabado Confirmado',
    },
    { accessorFn: (data) => data.observations, header: 'Comentarios' },
  ],
};

const exportTo = new ExportToExcel(exportConf);

