import { Button, DatePicker, Link, NumberInput } from "@heroui/react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormularioDocumentacion from './formulario';
import Slide from '@mui/material/Slide';
import { ViajeContext } from '../context/viajeContext';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { InputNumber } from "rsuite";
import { now, getLocalTimeZone } from "@internationalized/date";
import FormularioCorte from "./corte_estadias";
import OneDriveViewer from "./viewer";
import { MRT_Localization_ES } from 'material-react-table/locales/es';

const apiUrl = import.meta.env.VITE_ODOO_API_URL;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Documentacion = ({ }) => {

  const { id_viaje, viaje, getViaje, loading, error, setIDViaje, isLoading } = useContext(ViajeContext);

  const [data, setData] = useState([]);
  const [isLoading2, setLoading] = useState();
  const [idOnedrive, setOnedrive] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/archivos/get_archivos/tms_travel/' + id_viaje);
      setData(response.data);
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
      const response = await odooApi.get('/onedrive/generate_link/' + idOnedrive);
      if (response.data.url) {
        window.open(response.data.url, '_blank');
      } else {
        toast.error('No se pudo obtener el enlace del archivo.' + response.data);
      }
    } catch (error) {
      console.error('Error al obtener el enlace público:', error);
      toast.error('Hubo un error al intentar obtener el enlace.');
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
            onPress={() => obtenerUrlPublico(row.original.id_onedrive)}
          >
            Ver archivo
          </Button>
        ),
      },
      {
        accessorKey: 'visualizar',
        header: 'Visualizar',
        Cell: ({ row }) => (
          <Button
            color='danger'
            onPress={() => handleClickOpenV(row.original.id_onedrive)}
          >
            Visualizar
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
    localization: MRT_Localization_ES,
    initialState: {
      showColumnFilters: true,
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

        <Button color='primary' onPress={handleClickOpen}>
          Nuevo documento
        </Button>

        <Button
          showAnchorIcon
          as={Link}
          isExternal={true}
          color="danger"
          href={`${apiUrl}/tms_travel/checklist/pdf/` + id_viaje}
          variant="solid"
        >
          Checklist de viaje
        </Button>

        <Button
          showAnchorIcon
          as={Link}
          isExternal={true}
          className="text-white"
          color="warning"
          href={`${apiUrl}/tms_travel/checklist/18puntos/pdf/` + id_viaje}
          variant="solid"
        >
          Inspección vigilancia
        </Button>

        <Button
          showAnchorIcon
          as={Link}
          isExternal={true}
          color="secondary"
          href={`${apiUrl}/tms_travel/revision_ocular/bitacoras/pdf/` + id_viaje}
          variant="solid"
        >
          Revision ocular
        </Button>

        <Button
          showAnchorIcon
          as={Link}
          isExternal={true}
          color="success"
          className='text-white'
          href={`${apiUrl}/tms_travel/horas_servicio/pdf/` + id_viaje}
          variant="solid"
        >
          Horas de servicio
        </Button>

        <Button
          showAnchorIcon
          color="danger"
          className='text-white'
          variant="solid"
          onPress={() => setOpenCorte(true)}
        >
          Corte parcial estadías
        </Button>

      </Box >
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

  const [openCorte, setOpenCorte] = React.useState(false);

  const handleClickOpenCorte = () => {
    setOpenCorte(true);
  };

  const handleCloseCorte = () => {
    setOpenCorte(false);
  };

  const [openV, setOpenV] = React.useState(false);

  const handleClickOpenV = async (id_onedrive) => {
    setOnedrive(id_onedrive);
    setOpenV(true);
  };

  const handleCloseV = () => {
    setOpenV(false);
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

      <OneDriveViewer
        open={openV} onClose={handleCloseV} id_onedrive={idOnedrive}>
      </OneDriveViewer>

      <FormularioCorte opened={openCorte} onClose={handleCloseCorte}></FormularioCorte>
    </>
  );
};

export default Documentacion;
