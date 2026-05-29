import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Progress, Button,
} from "@heroui/react";
import { useEffect, useMemo, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import { Box, } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import odooApi from '@/api/odoo-api';
import toast from 'react-hot-toast';

type Historial = {
  fecha_evento: string;
  tipo_evento: string;
  descripcion: string;
  nombre: string;
};

type UnidadType = {
  id_unidad: number;
  x_name: string;
  historial: Historial[];
};

const Unidad = ({ id_unidad, open, handleClose }: { id_unidad: number, open: boolean, handleClose: () => void }) => {

  const [data, setData] = useState<UnidadType | null>(null);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get<UnidadType | null>('/tms_travel/unidades_equipo/id_unidad/' + id_unidad);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    if (open) fetchData();
  }, [open, id_unidad]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'fecha_evento',
        header: 'Fecha del evento',
      },
      {
        accessorKey: 'tipo_evento',
        header: 'Tipo de evento',
      },
      {
        accessorKey: 'descripcion',
        header: 'Descripción',
      },
      {
        accessorKey: 'nombre',
        header: 'Usuario que registró',
      },
    ],
    [],
  );

  const [isLoadingBaja, setLoadingBaja] = useState(false);

  const BajaUnidad = async () => {
    try {
      setLoadingBaja(true);
      let response = await odooApi.patch('/tms_travel/unidades_equipo/baja/' + id_unidad);
      if (response.data.status === 'success') {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error('Error al guardar: ' + (error?.message || JSON.stringify(error)));
    } finally {
      setLoadingBaja(false);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: data?.historial || [],
    enableGrouping: false,
    enableGlobalFilter: true,
    enableFilters: true,
    enableColumnPinning: false,
    enableStickyHeader: true,
    positionGlobalFilter: "right",
    localization: MRT_Localization_ES,
    muiSearchTextFieldProps: {
      placeholder: `Buscar`,
      sx: { minWidth: '300px' },
      variant: 'outlined',
    },
    columnResizeMode: "onEnd",
    initialState: {
      showGlobalFilter: true,
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 50 },
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
        maxHeight: 'calc(100vh - 210px)',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '12px',
      },
    },
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <h1
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          {data?.id_unidad ? `Unidad #${data.id_unidad}` : ''}
          <Button color='danger' onPress={() => BajaUnidad()} radius='full' isLoading={isLoadingBaja}>Baja</Button>
        </h1>
      </Box>
    ),
  });

  return (
    <Dialog open={open} onClose={handleClose} scroll="body" fullWidth maxWidth="xl">
      <AppBar elevation={0} sx={{
        background: 'linear-gradient(90deg, #0b2149, #002887)',
        padding: '0 16px',
        position: 'relative'
      }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {data?.x_name || 'Unidad'}
          </Typography>
          <Button autoFocus onPress={handleClose}>
            Salir
          </Button>
        </Toolbar>
      </AppBar>

      {isLoading && <Progress isIndeterminate aria-label="Cargando..." size="sm" />}

      <DialogContent sx={{ width: '100%', padding: 0 }}>
        <MaterialReactTable table={table} />
      </DialogContent>

      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default Unidad;
