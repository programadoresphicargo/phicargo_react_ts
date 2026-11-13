import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@heroui/react';
import odooApi from '@/api/odoo-api';
import Box from '@mui/material/Box';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { Permission } from '.';


const UsersDetailControlPage = ({ open, handleClose, permission }: { open: boolean, handleClose: () => void, permission: Permission }) => {

  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      { accessorKey: 'nombre', header: 'Usuario' },
      { accessorKey: 'granted_at', header: 'Fecha creación' },
    ],
    [],
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get(`/users-management/permissions/${permission.id}/users`);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [permission]);

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    autoResetPageIndex: false,
    state: {
      showProgressBars: isLoading
    },
    enablePagination: true,
    enableColumnPinning: true,
    enableStickyHeader: true,
    positionGlobalFilter: "right",
    localization: MRT_Localization_ES,
    muiSearchTextFieldProps: {
      sx: { minWidth: '300px' },
      variant: 'outlined',
    },
    columnResizeMode: "onEnd",
    initialState: {
      showGlobalFilter: true,
      density: 'compact',
      showColumnFilters: true,
      pagination: { pageIndex: 0, pageSize: 100 }
    },
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
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 180px)',
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row.subRows?.length
          ? '#0456cf'
          : row.index % 2 === 0
            ? '#FFFFFF'
            : '#F8F9FA',

        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '12px',
        padding: '4px 8px',

        color: row.subRows?.length
          ? '#FFFFFF'
          : '#000000',
      }
    }),
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <h1>{permission.name}</h1>
        <Button
          radius='md'
          size='sm'
          className='text-white'
          startContent={<i className="bi bi-arrow-clockwise"></i>}
          color='secondary'
          onPress={() => fetchData()}
        >Actualizar
        </Button>
      </Box >
    ),
  });


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      fullWidth
    >
      <DialogContent>
        <MaterialReactTable table={table} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus size='sm'>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsersDetailControlPage;

