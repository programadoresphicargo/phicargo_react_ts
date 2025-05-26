import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Input, Popover, PopoverContent, PopoverTrigger, User, useDisclosure } from "@heroui/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import { Avatar } from "@heroui/react";
import { Box } from '@mui/material';
import { Button } from "@heroui/react"
import { Chip } from "@heroui/react";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Image } from 'antd';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import odooApi from '@/api/odoo-api';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import NavbarAlmacen from '../Navbar';
import EPPForm from './form';
import { useAlmacen } from '../contexto/contexto';

const EPP = ({ }) => {

  const
    { eepAñadido,
      setEPPAñadido,
      eepRemovido,
      setEPPRemovdo
    } = useAlmacen();
  const [id_epp, setIDEpp] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/tms_travel/epp/');
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
        accessorKey: 'id_epp',
        header: 'ID',
      },
      {
        accessorKey: 'nombre',
        header: 'Nombre',
      },
      {
        accessorKey: 'fecha_creacion',
        header: 'Fecha creación',
      },
      {
        accessorKey: 'nombre_usuario',
        header: 'Usuario',
      },
      {
        id: 'acciones',
        header: 'Acciones',
        Cell: ({ row }) => (
          <Button
            size='sm'
            color='primary'
            onPress={() => {
              handleClickOpen();
              setIDEpp(row.original.id_epp);
            }}>
            Editar
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
    positionGlobalFilter: "right",
    localization: MRT_Localization_ES,
    muiSearchTextFieldProps: {
      placeholder: `Buscar en ${data.length} solicitud`,
      sx: { minWidth: '300px' },
      variant: 'outlined',
    },
    columnResizeMode: "onEnd",
    initialState: {
      showGlobalFilter: true,
      columnVisibility: {
        empresa: false,
      },
      density: 'compact',
      expanded: true,
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
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 210px)',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: ({ event }) => {
        setEPPAñadido(prev => [...prev, row.original]);
        handleClose();
      },
    }),
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '12px',
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
        <h1
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Equipos
        </h1>

        <Button
          className='text-white'
          startContent={<i class="bi bi-plus-lg"></i>}
          color='primary'
          isDisabled={false}
          onPress={() => {
            setIDEpp(null);
            handleClickOpen();
          }}
          size='sm'
        >Crear
        </Button>

        <Button
          className='text-white'
          startContent={<i class="bi bi-arrow-clockwise"></i>}
          color='primary'
          isDisabled={false}
          onPress={() => fetchData()}
          size='sm'
        >Actualizar tablero
        </Button>

        <Button
          color='success'
          className='text-white'
          startContent={<i class="bi bi-file-earmark-excel"></i>}
          onPress={() => exportToCSV(data, columns, "viajes_activos.csv")}
          size='sm'>
          Exportar
        </Button>

      </Box >
    ),
  });

  return (
    <>
      <MaterialReactTable
        table={table}
      />

      <EPPForm id_epp={id_epp} open={open} handleClose={handleClose}></EPPForm>
    </>
  );
};

export default EPP;
