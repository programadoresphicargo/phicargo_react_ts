import { IconButton, Tooltip } from '@mui/material';
import { MRT_Row, useMaterialReactTable } from 'material-react-table';
import { useEffect, useState } from 'react';

import AddButton from '../../core/components/ui/AddButton';
import { Button } from '@nextui-org/react';
import ExportExcelButton from '../../core/components/ui/ExportExcelButton';
import { HiQueueList } from "react-icons/hi2";
import MaterialTableBase from '../../core/components/tables/MaterialTableBase';
import { Outlet } from 'react-router-dom';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { Shift } from '../models/shift-model';
import ShiftsLayout from '../layouts/ShiftsLayout';
import { useShiftColumns } from '../hooks/useShiftColumns';
import { useShiftQueries } from '../hooks/useShiftQueries';

const ShiftsPage = () => {

  const { columns } = useShiftColumns();
  const { shiftQuery } = useShiftQueries({ branchId: 1 });
  const [data, setData] = useState<Shift[]>(shiftQuery.data || []);

  useEffect(() => {
    setData(shiftQuery.data || []);
  }, [shiftQuery.data]);

  const table = useMaterialReactTable<Shift>({
    // DATA
    columns,
    data: data,
    enableStickyHeader: true,
    autoResetPageIndex: false,
    // PAGINATION, FILTERS, SORTING
    enableRowOrdering: true,
    enableSorting: false,
    enableGrouping: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    columnFilterDisplayMode: 'subheader',
    // STATE
    initialState: {
      showColumnFilters: false,
      density: 'compact',
      pagination: { pageSize: 100, pageIndex: 0 },
    },
    state: {
      isLoading: shiftQuery.isFetching,
    },
    // CUSTOMIZATIONS
    // muiTableBodyRowProps: ({ row }) => ({
    //   onDoubleClick: () =>
    //     navigate(`/disponibilidad/operadores/detalles/${row.original.id}`),
    //   sx: { cursor: 'pointer' },
    // }),
    muiRowDragHandleProps: ({ table, row }) => ({
      disabled: row.original.locked,
      onDragEnd: () => {
        const { draggingRow, hoveredRow } = table.getState();
        
        if (hoveredRow && draggingRow) {
          data.splice(
            (hoveredRow as MRT_Row<Shift>).index,
            0,
            data.splice(draggingRow.index, 1)[0],
          );
          setData([...data]);
        }
      },
    }),
    renderTopToolbarCustomActions: () => (
      <div className='flex items-center gap-4'>
        <Tooltip arrow title="Refrescar">
          <IconButton onClick={() => shiftQuery.refetch()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
          <AddButton size='sm' label='Ingresar turno'/>
          <Button 
            size='sm'
            variant='faded'
            color='warning'
            className='font-bold'
            startContent={<HiQueueList />}
          >
            Operadores En Cola
          </Button>
          <ExportExcelButton size='sm' label='Exportar'/>
      </div>
    ),
    muiTableContainerProps: {
      sx: {
        height: 'calc(100vh - 195px)',
      },
    },
    muiTableBodyRowProps: {
      sx: {
        cursor: 'pointer',
        borderBottom: 'none',
      },
    },
    defaultColumn: {
      muiTableBodyCellProps: {
        sx: {
          padding: '2px',
        },
      }
    }
  });

  return (
    <ShiftsLayout>
      <MaterialTableBase table={table} />
      <Outlet />
    </ShiftsLayout>
  );
};

export default ShiftsPage;

