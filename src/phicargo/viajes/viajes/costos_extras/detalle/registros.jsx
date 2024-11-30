import React, { useState, useEffect, useMemo, useContext } from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { Box, Card, Grid } from '@mui/material';
import { Button } from '@nextui-org/button';
import NavbarViajes from '../../../navbar';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import CostosExtras from '../costos_extras/registros';
import { CostosExtrasContext } from '../context/estadiasContext';
import Stack from '@mui/material/Stack';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DetalleCE = ({ }) => {
  const { costosExtras, actualizarCE } = useContext(CostosExtrasContext);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Función para calcular la suma de los costos
  const calcularSumaCostos = () => {
    return costosExtras.reduce((total, row) => total + (Number(row.costo) || 0), 0);
  };

  const handleCellEdit = (row, columnId, value) => {
    const updatedData = costosExtras.map((rowData) =>
      rowData.id_costo === row.id_costo
        ? { ...rowData, [columnId]: value }
        : rowData
    );
    actualizarCE(updatedData);
  };

  const handleDelete = (id) => {
    const updatedData = costosExtras.filter((row) => row.id_costo !== id);
    actualizarCE(updatedData);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id_costo',
        header: 'Carta porte',
      },
      {
        accessorKey: 'descripcion',
        header: 'Descripción',
      },
      {
        accessorKey: 'costo',
        header: 'Costo',
        Cell: ({ cell, row }) => (
          <input
            type="number"
            defaultValue={cell.getValue()}
            onBlur={(e) => handleCellEdit(row.original, 'costo', Number(e.target.value))}
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
            }}
          />
        ),
      },
      {
        accessorKey: 'comentarios',
        header: 'Comentarios',
        Cell: ({ cell, row }) => (
          <input
            type="text"
            defaultValue={cell.getValue() || ''}
            onBlur={(e) => handleCellEdit(row.original, 'comentarios', e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
            }}
          />
        ),
      },
      {
        id: 'acciones',
        header: 'Acciones',
        Cell: ({ row }) => (
          <button
            className="btn btn-danger btn-xs"
            onClick={() => handleDelete(row.original.id_costo)}
          >
            Eliminar
          </button>
        ),
      },
    ],
    [costosExtras]
  );

  const table = useMaterialReactTable({
    columns,
    data: costosExtras,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      showColumnFilters: true,
      pagination: { pageSize: 80 },
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
    muiTableBodyCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
      },
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div>
          <h1 className='text-primary'>Registro de estadias</h1>
          <Button color='primary' onClick={handleClickOpen}>
            Añadir costo extra
          </Button>
        </div>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            fontSize: '16px',
            alignSelf: 'center',
            marginRight: '20px',
          }}
        >
          Suma total de costos: ${calcularSumaCostos().toFixed(2)}
        </Typography>
      </Box>
    ),
  });

  return (
    <>
      <div className='bg-soft-secondary p-5'>
        <div className='mt-5 mb-5'>
          <h1 className='text-primary'>CPV-11003</h1>
          <h3>PANALPINA TRANSPORTES MUNDIALES SA DE CV</h3>
          <Stack spacing={1} direction="row" className='mt-5'>
            <Button color='primary'>Guardar</Button>
            <Button color='success' className='text-white'>Confirmar</Button>
            <Button color='danger'>Cancelar</Button>
            <Button color='danger' className='text-white'>Exportar</Button>
          </Stack>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Card>
              <MaterialReactTable table={table} />
            </Card>
          </Grid>
        </Grid>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        fullWidth={true}
        maxWidth={"lg"}
      >
        <AppBar sx={{ position: 'relative', backgroundColor: 'white' }} elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              color="black"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1, color: 'black' }} variant="h6" component="div">
            </Typography>
            <Button autoFocus color="primary" onClick={handleClose}>
              Cerrar
            </Button>
          </Toolbar>
        </AppBar>
        <CostosExtras onClose={handleClose}></CostosExtras>
      </Dialog>
    </>
  );
};

export default DetalleCE;
