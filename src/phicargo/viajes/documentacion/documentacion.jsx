import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Box } from '@mui/material';
import { ViajeContext } from '../context/viajeContext';
import { Button } from '@nextui-org/button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import FormularioDocumentacion from './formulario';
const { VITE_PHIDES_API_URL } = import.meta.env;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Documentacion = ({ }) => {

  const { id_viaje, viaje, getViaje, loading, error, setIDViaje, isLoading } = useContext(ViajeContext);

  const [data, setData] = useState([]);
  const [isLoading2, setLoading] = useState();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(VITE_PHIDES_API_URL + '/viajes/documentacion/getDocumentos.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          id_viaje: id_viaje
        }),
      })
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

  const obtenerUrlPublico = async (idOnedrive) => {
    try {
      const response = await fetch(VITE_PHIDES_API_URL + '/viajes/documentacion/getLinkOnedrive.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_onedrive: idOnedrive }),
      });
      const data = await response.json();
      if (data.url) {
        window.open(data.url, '_blank');
      } else {
        alert('No se pudo obtener el enlace del archivo.');
      }
    } catch (error) {
      console.error('Error al obtener el enlace público:', error);
      alert('Hubo un error al intentar obtener el enlace.');
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'filename',
        header: 'Nombre del archivo',
      },
      {
        accessorKey: 'tipo_archivo',
        header: 'Tipo de documento',
      },
      {
        accessorKey: 'nombre_usuario',
        header: 'Usuario',
      },
      {
        accessorKey: 'id_onedrive',
        header: 'Onedrive ID',
      },
      {
        accessorKey: 'fecha_creacion',
        header: 'Fecha de subida',
      },
      {
        accessorKey: 'ver',
        header: 'Ver',
        Cell: ({ row }) => (
          <Button
            color='primary'
            onClick={() => obtenerUrlPublico(row.original.id_onedrive)}
          >
            Ver archivo
          </Button>
        ),
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
    muiTableContainerProps: {
      sx: {
        borderRadius: '8px',
        overflow: 'hidden',
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
        <Button color='primary' onClick={handleClickOpen}>
          Nuevo documento
        </Button>
      </Box>
    )
  });

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  return (
    <>
      <div className='card p-2 rounded'>
        <MaterialReactTable table={table} />
      </div>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        fullWidth="sm"
        maxWidth="sm"
      >
        <DialogTitle>{"Envio de documentos"}</DialogTitle>
        <DialogContent>
          <FormularioDocumentacion onClose={handleClose}></FormularioDocumentacion>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Documentacion;
