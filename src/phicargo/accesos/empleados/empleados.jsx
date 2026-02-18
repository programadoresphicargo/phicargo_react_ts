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
import FormEmpresa from '../visitantes/formulario';
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

const ListadoEmpleados = ({ open, handleClose }) => {

  const [isLoading, setLoading] = useState();
  const { formData, setEmpleados, empleados, setAddedEmpleados, AñadirEmpleadoAcceso } = useContext(AccesoContext);

  const fetchEmpleados = async () => {
    try {
      setLoading(true);

      let response = await odooApi.get('/drivers/employees/');

      setEmpleados(response.data);

    } catch (error) {
      toast.error("Error al obtener visitantes: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.id_empresa && open) {
      fetchEmpleados();
    }
  }, [formData.id_empresa, open]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'empleado',
        header: 'Empleado',
        Cell: ({ cell }) => cell.getValue()?.toUpperCase(),
      },
      {
        accessorKey: 'puesto',
        header: 'Puesto',
      },
      {
        accessorKey: 'jefe',
        header: 'Jefe',
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: empleados,
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
          AñadirEmpleadoAcceso(row.original.id_empleado);
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
      <AppBar sx={{
        background: 'linear-gradient(90deg, #0b2149, #002887)',
        position: 'relative',
        padding: '0 16px'
      }} elevation={0}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Empleados Transportes Belchez (Nuevos empleados se registran desde Odoo)
          </Typography>
          <Button autoFocus color="inherit" onPress={handleClose}>
            Cerrar
          </Button>
        </Toolbar>
      </AppBar>
      <MaterialReactTable table={table} />
    </Dialog>
  </>
  );

};

export default ListadoEmpleados;
