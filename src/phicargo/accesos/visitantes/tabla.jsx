import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useContext, useEffect, useMemo, useState } from 'react';

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
    setLoading(true);
    const response = await odooApi.get('/visitantes/by_id_empresa/' + formData.id_empresa);
    setVisitantes(response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchVisitantes();
  }, [formData.id_empresa]);

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
    state: { isLoading: isLoading },
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

  const [scroll, setScroll] = React.useState('body');

  return (<>

    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      scroll={scroll}
      fullWidth
      maxWidth="md"
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

      <Stack spacing={2} direction="row" className='mb-3'>
        <Button color='primary' onClick={handleClickOpenForm}>Nuevo visitante</Button>
      </Stack>
      <MaterialReactTable table={table} />
    </Dialog>

    <FormEmpresa open={openFormulario} handleClose={handleCloseForm}></FormEmpresa>

  </>
  );

};

export default ListadoVisitantes;
