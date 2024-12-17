import React, { useState, useEffect, useMemo, useContext } from 'react';
import dayjs from 'dayjs';
import { Button } from '@nextui-org/button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import { AccesoContext } from '../context';
import { toast } from 'react-toastify';
import axios from 'axios';
const { VITE_PHIDES_API_URL } = import.meta.env;
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import FormEmpresa from './formulario';

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
    const response = await fetch(VITE_PHIDES_API_URL + '/accesos/visitantes/getVisitantes.php?id_empresa=' + formData.id_empresa);
    const jsonData = await response.json();
    setVisitantes(jsonData);
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
          console.log(row.original.id_visitante);
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
