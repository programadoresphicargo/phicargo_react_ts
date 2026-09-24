import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Button } from "@heroui/react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import odooApi from '@/api/odoo-api';
import { useEffect, useMemo, useState } from 'react';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box } from '@mui/material';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import OdometerForm from './form';
import { Odometer } from './odometers';

export type Task = {
  id: number;
  name: string;
};

export default function OdometerHistory({ open, setOpen, id }: {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  id: number | null,
}) {

  const [data, setData] = useState<Odometer[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState(false);

  const getOdometers = async (id: number): Promise<void> => {
    setLoading(true);
    const response = await odooApi.get<Odometer[]>(
      `/vehicles/odometers/${id}`
    );
    setData(response.data);
    setLoading(false);
  };

  useEffect(() => {
    if (id !== null) {
      getOdometers(id);
    }
  }, [open, openForm]);

  const columns = useMemo<MRT_ColumnDef<Odometer>[]>(
    () => [
      { accessorKey: 'vehicle', header: 'Vehiculo', },
      {
        accessorKey: 'current_odometer',
        header: 'Kilometraje',
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return value?.toLocaleString('en-US');
        },
        muiTableBodyCellProps: {
          align: 'right',
        },
      },
      { accessorKey: 'date', header: 'Fecha de lectura', },
    ], []);

  const table = useMaterialReactTable({
    columns,
    data,
    state: { showProgressBars: isLoading },
    enableGrouping: true,
    enableGlobalFilter: true,
    enableStickyHeader: true,
    enableFilters: true,
    localization: MRT_Localization_ES,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 80 },
      showColumnFilters: true,
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
        maxHeight: 'calc(100vh - 240px)',
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row.subRows?.length ? '#0456cf' : '#FFFFFF',
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '12px',
        padding: '4px 8px',
        color: row.subRows?.length ? '#FFFFFF' : '#000000',
      },
    }),
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'nowrap',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <h1
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Odometros
        </h1>
        <Button onPress={() => setOpenForm(true)} color='success' className='text-white' radius='full' size='sm'>Nuevo</Button>
      </Box >
    ),
  })

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullScreen>

      <AppBar sx={{ position: 'relative', backgroundColor: '#002887' }} elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setOpen(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1, fontFamily: 'Inter' }} variant="h6" component="div">
            Registro de odometro
          </Typography>
          <Button autoFocus onPress={() => setOpen(false)} radius='full' size='sm'>
            Cerrar
          </Button>
        </Toolbar>
      </AppBar>

      <DialogContent sx={{ padding: "0px 0px 0px 0px" }}>
        <MaterialReactTable
          table={table}
        />
        {id && (
          <OdometerForm open={openForm} setOpen={() => setOpenForm(false)} vehicle_id={id}></OdometerForm>
        )}
      </DialogContent>
    </Dialog >
  );
}
