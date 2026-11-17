import {
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { Button } from "@heroui/react";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormularioDocumentacionManiobra from './formulario';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { Documentacion } from '@/phicargo/viajes/documentacion/documentacion';
import { MRT_Localization_ES } from 'material-react-table/locales/es';

const DocumentacionManiobra = ({ id_maniobra }: { id_maniobra: number }) => {

  const [data, setData] = useState<Documentacion[]>([]);
  const [isLoading, setLoading] = useState<boolean>();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/archivos/maniobras/' + id_maniobra);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const obtenerUrlPublico = async (idOnedrive: string) => {
    try {
      const response = await odooApi.get('/onedrive/generate_link/' + idOnedrive);
      if (response.data.url) {
        window.open(response.data.url, '_blank');
      } else {
        alert('No se pudo obtener el enlace del archivo.' + response.data);
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
        Cell: ({ row }: { row: MRT_Row<Documentacion> }) => (
          <Button
            color='primary'
            onPress={() => obtenerUrlPublico(row.original.id_onedrive)}
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
    state: { showProgressBars: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    localization: MRT_Localization_ES,
    initialState: {
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 80 },
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
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button color='primary' onPress={handleClickOpen} size='sm' radius='md'>
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
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{"Envio de documentos"}</DialogTitle>
        <DialogContent>
          <FormularioDocumentacionManiobra onClose={handleClose} id_maniobra={id_maniobra}></FormularioDocumentacionManiobra>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentacionManiobra;
