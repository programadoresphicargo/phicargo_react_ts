import {
  MRT_Cell,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import { Button } from '@heroui/react';
import Dialog from '@mui/material/Dialog';
import FormEmpresa from './form';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import odooApi from '@/api/odoo-api';
import { Box } from '@mui/material';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Empresa } from '../types/types';
import { UseFormSetValue } from 'react-hook-form';
import { Acceso } from '../form';

type Props = {
  open: boolean,
  handleClose: () => void;
  setValue: UseFormSetValue<Acceso>;
};

const ListadoEmpresas: React.FC<Props> = ({
  open,
  handleClose,
  setValue
}) => {

  const [data, setData] = useState<Empresa[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [openFormulario, setOpenForm] = useState(false);

  const handleClickOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    fetchData();
    setOpenForm(false);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/empresas_visitantes/');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'empresa',
        header: 'Nombre de la empresa',
        Cell: ({ cell }: { cell: MRT_Cell<Empresa> }) => cell.getValue<string>()?.toUpperCase(),
      },
      {
        accessorKey: 'fecha_creacion',
        header: 'Creación',
        Cell: ({ cell }: { cell: MRT_Cell<Empresa> }) => cell.getValue<string>()?.toUpperCase(),
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    localization: MRT_Localization_ES,
    state: { showProgressBars: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      showColumnFilters: true,
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
          setValue("id_empresa", row.original.id_empresa);
          setValue("empresa", row.original.empresa);
          handleClose();
        }
      },
      style: {
        cursor: 'pointer',
      },
    }),
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
        maxHeight: 'calc(100vh - 300px)',
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
        <Button color='primary' onPress={handleClickOpenForm} radius='full'>Nueva</Button>
      </Box>
    ),
  });

  return (<>

    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
    >
      <AppBar
        sx={{
          background: 'linear-gradient(90deg, #0b2149, #002887)',
          position: 'relative',
          padding: '0 16px'
        }}
        elevation={0}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Registro de empresas
          </Typography>
          <Button autoFocus onClick={handleClose}>
            Cerrar
          </Button>
        </Toolbar>
      </AppBar>
      <MaterialReactTable table={table} />
    </Dialog>

    <FormEmpresa open={openFormulario} handleClose={handleCloseForm}></FormEmpresa>

  </>
  );

};

export default ListadoEmpresas;
