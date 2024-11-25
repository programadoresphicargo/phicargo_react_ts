import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';

import AccesoCompo from './AccesoCompo';
import AccesoForm from './formulario';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Slide from '@mui/material/Slide';
import { TextField } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { width } from '@mui/system';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Maniobras = ({ estado_maniobra }) => {

  const [open, setOpen] = React.useState(false);
  const [id_acceso, setIDAcceso] = useState(0);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const NuevoAcceso = () => {
    setOpen(true);
    setIDAcceso(null);
  };

  const [data, setData] = useState([]);
  const [isLoading2, setLoading] = useState();

  const fetchData = async () => {

    try {
      setLoading(true);
      const response = await fetch('/phicargo/accesos/accesos/getAccesos.php?estado_acceso=' + estado_maniobra);
      const jsonData = await response.json();
      setData(jsonData);
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
        accessorKey: 'id_acceso',
        header: 'ID Acceso',
      },
      {
        accessorKey: 'nombre_empresa',
        header: 'Empresa visitante',
        Cell: ({ cell }) => cell.getValue()?.toUpperCase(),
      },
      {
        accessorKey: 'tipo_movimiento',
        header: 'Tipo de movimiento',
        Cell: ({ cell }) => {
          const tipoMovimiento = cell.getValue();
          let badgeClass = 'badge rounded-pill ';

          if (tipoMovimiento === 'entrada') {
            badgeClass += 'bg-success';
          } else if (tipoMovimiento === 'salida') {
            badgeClass += 'bg-danger';
          } else {
            badgeClass += 'bg-primary';
          }

          return (
            <span className={badgeClass} style={{ width: '130px' }}>
              {tipoMovimiento.charAt(0).toUpperCase() + tipoMovimiento.slice(1)}
            </span>
          );
        },
      },
      {
        accessorKey: 'fecha_entrada',
        header: 'Fecha de entrada',
        Cell: ({ cell }) => {
          const fechaOriginal = cell.getValue();
          const fechaValida = dayjs(fechaOriginal, 'YYYY-MM-DD HH:mm:ss', true).isValid();
          return fechaValida
            ? dayjs(fechaOriginal).format('DD/MM/YYYY hh:mm A')
            : 'Fecha inválida';
        },
      },
      {
        accessorKey: 'nombre',
        header: 'Solicitado por',
      },
      {
        accessorKey: 'empresa_visitada',
        header: 'Empresa visitada',
      },
      {
        accessorKey: 'estado_acceso',
        header: 'Estado del acceso',
        Cell: ({ cell }) => {
          const tipoMovimiento = cell.getValue();
          let badgeClass = 'badge rounded-pill ';

          if (tipoMovimiento === 'espera') {
            badgeClass += 'bg-secondary';
          } else if (tipoMovimiento === 'validado') {
            badgeClass += 'bg-success';
          } else {
            badgeClass += 'bg-primary';
          }

          const displayText = tipoMovimiento === 'espera' ? 'En espera de validación' : tipoMovimiento.charAt(0).toUpperCase() + tipoMovimiento.slice(1);

          return (
            <span className={badgeClass} style={{ width: '130px' }}>
              {displayText}
            </span>
          );
        },
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
    state: { isLoading: isLoading2 },
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
          handleClickOpen();
          setIDAcceso(row.original.id_acceso);
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

  return (<>

    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }} elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Acceso
          </Typography>
          <Button autoFocus color="inherit" onClick={handleClose}>
            Cerrar
          </Button>
        </Toolbar>
      </AppBar>
      <AccesoCompo>
        <AccesoForm id_acceso={id_acceso} onClose={handleClose}
        />
      </AccesoCompo>
    </Dialog>

    <div>
      <button className="btn btn-success" onClick={NuevoAcceso}>Nuevo registro</button>

      <div className="table-striped">
        <MaterialReactTable table={table} />
      </div>
    </div >
  </>
  );

};

export default Maniobras;
