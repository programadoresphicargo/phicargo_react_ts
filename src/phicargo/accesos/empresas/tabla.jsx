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
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import FormEmpresa from './formulario';
import odooApi from '@/phicargo/modules/core/api/odoo-api';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ListadoEmpresas = ({ open, handleClose }) => {

  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState();
  const { ActualizarIDAacceso, selectVehiculos, vehiculosAñadidos, vehiculosEliminados, empresas, formData, setFormData, setEmpresas } = useContext(AccesoContext);

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
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id_empresa',
        header: 'ID Empresa',
      },
      {
        accessorKey: 'empresa',
        header: 'Nombre de la empresa',
        Cell: ({ cell }) => cell.getValue()?.toUpperCase(),
      },
    ],
    [],
  );

  const manualGrouping = ['nombre_operador'];

  const table = useMaterialReactTable({
    columns,
    data,
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
          console.log(row.original.id_empresa);
          setFormData((prevData) => ({
            ...prevData,
            ['id_empresa']: row.original.id_empresa,
            ['empresa']: row.original.empresa
          }));
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
            Registro de empresas
          </Typography>
          <Button autoFocus color="inherit" onClick={handleClose}>
            Cerrar
          </Button>
        </Toolbar>
      </AppBar>

      <Stack spacing={2} direction="row" className='m-3'>
        <Button color='primary' onClick={handleClickOpenForm}>Nueva empresa</Button>
      </Stack>
      <MaterialReactTable table={table} />
    </Dialog>

    <FormEmpresa open={openFormulario} handleClose={handleCloseForm}></FormEmpresa>

  </>
  );

};

export default ListadoEmpresas;
