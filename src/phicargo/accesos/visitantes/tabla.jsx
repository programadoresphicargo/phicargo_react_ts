import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { AccesoContext } from '../context';
import AppBar from '@mui/material/AppBar';
import { Button } from '@heroui/react';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import FormEmpresa from './formulario';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import dayjs from 'dayjs';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { Box } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ListadoVisitantes = ({ open, handleClose }) => {

  const [isLoading, setLoading] = useState();
  const { formData, setVisitantes, visitantes, setAddedVisitors, AñadirVisitanteAcceso } = useContext(AccesoContext);

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
      const response = await odooApi.get('/visitantes/empresas/' + formData.id_empresa);
      setVisitantes(response.data);
    } catch (error) {
      toast.error("Error al obtener visitantes:" + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.id_empresa && open) {
      fetchVisitantes();
    }
  }, [formData.id_empresa, open]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id_visitante',
        header: 'ID Visitante',
      },
      {
        accessorKey: 'nombre_visitante',
        header: 'Nombre del visitante',
        Cell: ({ cell }) => cell.getValue()?.toUpperCase(),
      },
      {
        accessorKey: 'fecha_creacion',
        header: 'Fecha creación',
      },
    ],
    [],
  );

  const manualGrouping = ['nombre_operador'];

  const table = useMaterialReactTable({
    columns,
    data: visitantes,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    localization: MRT_Localization_ES,
    state: { showProgressBars: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    grouping: manualGrouping,
    initialState: {
      density: 'compact',
      pagination: { pageSize: 80 },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: ({ event }) => {

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
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button color='primary' onClick={handleClickOpenForm} radius='full'>Nuevo visitante</Button>
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

  const [scroll, setScroll] = React.useState('paper');

  return (<>

    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      scroll={scroll}
      maxWidth="lg"
      fullWidth
    >
      <AppBar sx={{ position: 'relative' }} elevation={0}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Registro de visitantes
          </Typography>
          <Button autoFocus color="inherit" onClick={handleClose}>
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

export default ListadoVisitantes;
