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
import { useCollectRegisters, useWeekContext } from '../../hooks';

import AddButton from '../../../core/components/ui/AddButton';
import AlertDialog from '../AlertDialog';
import type { CollectRegister } from '../../models';
import ExportExcelButton from '@/phicargo/modules/core/components/ui/ExportExcelButton';
import { FaRegEdit } from 'react-icons/fa';
import RefreshIcon from '@mui/icons-material/Refresh';
import { RiDeleteRow } from 'react-icons/ri';
import { isGOEWeek } from '../../utils';
import { useCollectTableColumns } from '../../hooks/useCollectTableColumns';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
        <AddButton
          label="Añadir"
          onPress={() => navigate('/reportes/balance/collect/add')}
        />
        <ExportExcelButton 
          label="Exportar"
          onPress={() => exportTo.exportData(registers || [])}
        />
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
        height: 'calc(100vh - 225px)',
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

export default CollectionTable;
