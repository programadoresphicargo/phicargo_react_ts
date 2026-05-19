import {
  MRT_Cell,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useAcceso } from '../context';
import AppBar from '@mui/material/AppBar';
import { Button } from '@heroui/react';
import Dialog from '@mui/material/Dialog';
import FormEmpresa from './form';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { Box } from '@mui/material';

type Props = {
  open: boolean;
  handleClose: () => void;
  id_empresa: number;
};

const ListadoVisitantes: React.FC<Props> = ({ open, handleClose, id_empresa }) => {

  const [isLoading, setLoading] = useState(false);
  const { AñadirVisitanteAcceso, visitantesDisponibles, setVisitantesDisponibles } = useAcceso();
  const [openFormulario, setOpenForm] = useState(false);

  const handleClickOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    fetchVisitantes();
    setOpenForm(false);
  };

  const fetchVisitantes = async () => {
    try {
      setLoading(true);
      let response = await odooApi.get('/visitantes/empresas/' + id_empresa);
      setVisitantesDisponibles(response.data);
    } catch (error: any) {
      toast.error("Error al obtener visitantes: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id_empresa && open) {
      fetchVisitantes();
    }
  }, [id_empresa, open]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'nombre_visitante',
        header: 'Nombre del visitante',
        Cell: ({ cell }: { cell: MRT_Cell<any> }) => cell.getValue<string>()?.toUpperCase(),
      },
      {
        accessorKey: 'fecha_creacion',
        header: 'Fecha creación',
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: visitantesDisponibles,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    localization: MRT_Localization_ES,
    state: { showProgressBars: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 80 },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        if (row.subRows?.length) {
        } else {
          AñadirVisitanteAcceso(row.original.id_visitante);
          handleClose();
        }
      },
      style: {
        cursor: 'pointer',
      },
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
        <Button color='primary' onPress={handleClickOpenForm} radius='full'>Nuevo visitante</Button>
      </Box >
    ),
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 300px)',
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
  });

  return (<>

    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
    >
      <AppBar sx={{
        background: 'linear-gradient(90deg, #0b2149, #002887)',
        position: 'relative',
        padding: '0 16px'
      }} elevation={0}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Registro de visitantes
          </Typography>
          <Button autoFocus onPress={handleClose}>
            Cerrar
          </Button>
        </Toolbar>
      </AppBar>
      <MaterialReactTable table={table} />
    </Dialog>

    <FormEmpresa
      open={openFormulario}
      handleClose={handleCloseForm}
      id_empresa={id_empresa} />
  </>
  );

};

export default ListadoVisitantes;
