import { type ExportConfig, ExportToExcel } from '@/utilities';
import { IconButton } from '@mui/material';
import { MRT_TableOptions, MaterialReactTable } from 'material-react-table';
import { useCollectRegisters, useWeekContext } from '../../hooks';

import { AddButton } from '@/components/ui';
import type { CollectRegister } from '../../models';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteRow } from 'react-icons/ri';
import { isGOEWeek } from '../../utils';
import { useCollectTableColumns } from '../../hooks/useCollectTableColumns';
import { useState } from 'react';
import { useBaseTable } from '@/hooks';
import NewCollectForm from '../NewCollectForm';
import { AlertDialog } from '@/components';

const CollectionTable = () => {
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [openAdd, setOpenAdd] = useState(false);

  const { weekSelected } = useWeekContext();

  const {
    collectRegisterQuery: { data: registers, refetch, isFetching, isLoading },
    updateCollectRegisterMutation: { mutate: updateRegister },
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

  const table = useBaseTable<CollectRegister>({
    columns,
    data: registers || [],
    tableId: 'collect-registers',
    isLoading,
    isFetching,
    refetchFn: refetch,
    exportFn: () => exportTo.exportData(registers || []),
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
          // disabled={!isGOEWeek(weekSelected!)}
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
      <NewCollectForm open={openAdd} onClose={() => setOpenAdd(false)} />
      {deleteId && (
        <AlertDialog
          open={Boolean(deleteId)}
          title="Eliminar Registro"
          message="¿Estás seguro de eliminar este registro?"
          severity='danger'
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

export default CollectionTable;

const exportConf: ExportConfig<CollectRegister> = {
  fileName: 'Cobranza',
  withDate: true,
  columns: [
    { accessorFn: (data) => data.clientName, header: 'Cliente' },
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

