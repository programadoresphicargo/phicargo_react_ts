import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { Box } from '@mui/material';
import { Button } from "@heroui/react";
import ContenedoresCambio from './cartas_porte';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormularioDocumentacion from './formulario';
import Slide from '@mui/material/Slide';
import { ViajeContext } from '../context/viajeContext';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const IndexCambioEquipo = ({ }) => {

  const { id_viaje } = useContext(ViajeContext);
  const [data, setSelectedItems] = useState([]);
  const [isLoading, setLoading] = useState([]);

  const [formData, setFormData] = useState({
    vehicle_id: '',
    trailer1_id: '',
    trailer2_id: '',
    dolly_id: '',
    x_motogenerador_1: '',
    x_motogenerador_2: ''
  });

  const handleDelete = (id) => {
    setSelectedItems((prevData) => prevData.filter((item) => item.id !== id));
  };

  const columns = useMemo(
    () => [
      { accessorKey: 'id_cp', header: 'ID' },
      { accessorKey: 'contenedor', header: 'Contenedor' },
      {
        id: 'actions',
        header: 'Acciones',
        Cell: ({ row }) => (
          <button
            onClick={() => handleDelete(row.original.id)}
            style={{ color: 'red', cursor: 'pointer' }}
          >
            Eliminar
          </button>
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
          + Añadir contenedor
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
  };

  const registrar_cambio = async () => {
    console.log(formData);
    console.log(data);

    setLoading(true);
    const Data = new FormData();
    Data.append('id_viaje', id_viaje);
    Data.append('equipos', JSON.stringify(formData));
    Data.append('contenedores', JSON.stringify(data));

    try {
      const response = await fetch('/viajes/cambios/guardar.php', {
        method: 'POST',
        body: Data,
      });

      const data = await response.body;
      setLoading(false);
      toast.success(data.message);
    } catch (error) {
      setLoading(false);
      toast.error('Error en la solicitud de subida');
    }

  };

  useEffect(() => {
    if (id_viaje) {
      axios.get(`/viajes/cambios/getEquipo.php?id_viaje=${id_viaje}`)
        .then((response) => {
          const data = response.data[0];
          setFormData({
            vehicle_id: data.vehicle_id || '',
            trailer1_id: data.trailer1_id || '',
            trailer2_id: data.trailer2_id || '',
            dolly_id: data.dolly_id || '',
            motogenerador_1: data.motogenerador_1 || '',
            motogenerador_2: data.motogenerador_2 || '',
          });
        })
        .catch((error) => {
          toast.error('Error al obtener datos de maniobra:' + error);
        });

      axios.get(`/viajes/cambios/getCartas.php?id_viaje=${id_viaje}`)
        .then((response) => {
          const data = response.data;
          setSelectedItems(data);
        })
        .catch((error) => {
          toast.error('Error al obtener datos de maniobra:' + error);
        });

    } else {
      setFormData({
        vehicle_id: '',
        trailer1_id: '',
        trailer2_id: '',
        dolly_id: '',
        motogenerador_1: '',
        motogenerador_2: '',
      });
    }
  }, [id_viaje]);

  return (
    <>
      <Button color='primary' onClick={registrar_cambio}>Guardar</Button>
      <div className='row mt-3'>
        <div className='col-6'>
          <div className='card p-2 rounded'>
            <FormularioDocumentacion formData={formData} setFormData={setFormData}></FormularioDocumentacion>
          </div>
        </div>
        <div className='col-6'>
          <div className='card p-2 rounded'>
            <MaterialReactTable table={table} />
          </div>
        </div>
      </div>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        maxWidth={"lg"}
      >
        <DialogTitle>{"Contenedores"}</DialogTitle>
        <DialogContent>
          <ContenedoresCambio setSelectedItems={setSelectedItems} onClose={handleClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default IndexCambioEquipo;
