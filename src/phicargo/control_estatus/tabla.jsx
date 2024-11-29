import React, { useState, useEffect, useMemo } from 'react';
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Button } from '@mui/material';
import { Checkbox } from '@mui/material';

import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import UsuarioForm from './UsuarioForm';
import TabBar from './Detalle';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EstatusOperativos = ({ estado }) => {

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
      const response = await fetch('/phicargo/control_estatus/getEstatus.php');
      const jsonData = await response.json();
      setData(jsonData);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const cambiarPermiso = async (id_estatus, columna, estado) => {
    try {
      setLoading(true);
      const response = await fetch('/phicargo/control_estatus/cambiarPermiso.php', {
        method: 'POST',
        body: new URLSearchParams({
          id_estatus: id_estatus,
          columna: columna,
          estado: estado
        })
      });
      setLoading(false);
      fetchData();
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
        accessorKey: 'id_estatus',
        header: 'ID Estatus',
      },
      {
        accessorKey: 'imagen',
        header: 'Icono',
        Cell: ({ row }) => {
          const imagen = row.original.imagen;

          return (
            <img
              height={50}
              width={50}
              src={`/phicargo/img/status/${imagen}`} />
          );
        },
      },
      {
        accessorKey: 'nombre_estatus',
        header: 'Nombre Estatus',
      },
      {
        accessorKey: 'tipo',
        header: 'Tipo',
      },
      {
        accessorKey: 'monitoreo',
        header: 'Monitoreo',
        Cell: ({ row }) => {
          const id_estatus = row.original.id_estatus;
          const isChecked = row.original.monitoreo;

          const handleCheckboxClick = (event) => {
            const isCheckedNow = event.target.checked;
            cambiarPermiso(id_estatus, 'monitoreo', isCheckedNow);
          };

          return (
            <Checkbox
              checked={isChecked}
              onChange={handleCheckboxClick}
            />
          );
        },
      },
      {
        accessorKey: 'operador',
        header: 'Operador',
        Cell: ({ row }) => {
          const id_estatus = row.original.id_estatus;
          const isChecked = row.original.operador;

          const handleCheckboxClick = (event) => {
            const isCheckedNow = event.target.checked;
            cambiarPermiso(id_estatus, 'operador', isCheckedNow);
          };

          return (
            <Checkbox
              checked={isChecked}
              onChange={handleCheckboxClick}
            />
          );
        },
      },
    ],
    []
  );

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
          flexWrap: 'wrap',
        }}
      >
        <Button
          variant='contained'
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            NuevoAcceso()
          }
        >
          NUEVO ESTATUS
        </Button>
      </Box>
    ),
  });

  return (<>
    <div>
      <MaterialReactTable table={table} />
    </div >
  </>
  );

};

export default EstatusOperativos;
