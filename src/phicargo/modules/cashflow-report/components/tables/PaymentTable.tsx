import {
  ExportConfig,
  ExportToExcel,
} from '@/phicargo/modules/core/utilities/export-to-excel';
import { IconButton, Tooltip } from '@mui/material';
import {
  MRT_TableOptions,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { usePayments, useWeekContext } from '../../hooks';

import { AddButton } from '@/components/ui';
import AlertDialog from '../AlertDialog';
import ExportExcelButton from '@/components/ui/buttons/ExportExcelButton';
import { FaRegEdit } from 'react-icons/fa';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Payment } from '../../models';
import RefreshIcon from '@mui/icons-material/Refresh';
import { RiDeleteRow } from 'react-icons/ri';
import { isGOEWeek } from '../../utils';
import { useNavigate } from 'react-router-dom';
import { usePaymentTableColumns } from '../../hooks/usePaymentTableColumns';
import { useState } from 'react';

const PaymentTable = () => {
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { weekSelected } = useWeekContext();

  const {
    paymentsQuery: { data: payments, refetch, isFetching, isLoading },
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
    localization: MRT_Localization_ES,
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
      isLoading: isLoading,
      showProgressBars: isFetching,
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
            <IconButton onClick={() => refetch()} size="small">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </div>
        <AddButton
          label="Añadir"
          onClick={() => navigate('/reportes/balance/payment/add')}
        />
        <ExportExcelButton
          size="small"
          onClick={() => exportTo.exportData(payments || [])}
        />
      </div>
    ),
    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '12px',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '12px',
        padding: '0 2px',
        margin: '0',
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableContainerProps: {
      sx: {
        height: 'calc(100vh - 210px)',
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
