import {
  MRT_Cell,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { Button, Checkbox } from "@heroui/react";
import FormularioCorreoGeneral from './form';
import odooApi from '@/api/odoo-api';
import CustomNavbar from '@/pages/CustomNavbar';
import { CorreoCliente } from '../viajes/correos/correos_electronicos';

const CorreosElectronicos = () => {

  const [open, setOpen] = React.useState(false);
  const [id_correo, setIDCorreo] = useState<number | null>(null);

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
      const response = await odooApi.get('/correos/');
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
        accessorKey: 'id_correo',
        header: 'ID Correo',
      },
      {
        accessorKey: 'cliente_name',
        header: 'Cliente',
      },
      {
        accessorKey: 'correo',
        header: 'Correo Electronico',
      },
      {
        accessorKey: 'tipo',
        header: 'Tipo',
      },
      {
        accessorKey: 'activo',
        header: 'Activo',
        Cell: ({ cell }: { cell: MRT_Cell<CorreoCliente> }) => (
          <Checkbox isSelected={cell.getValue<boolean>() ? true : false}></Checkbox>
        ),
      },
      {
        accessorKey: 'nombre',
        header: 'Usuario creación',
      },
      {
        accessorKey: 'fecha_creacion',
        header: 'Fecha creación',
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
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        if (row.subRows?.length) {
        } else {
          handleClickOpen();
          setIDCorreo(row.original.id_correo);
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
        fontSize: '12px',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 200px)',
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
        Correos electronicos
        <Button
          radius='full'
          color='primary'
          onPress={() => fetchData()}
        >Recargar</Button>
      </Box>
    ),
  });

  return (<>
    <CustomNavbar></CustomNavbar>
    <MaterialReactTable table={table} />
    <FormularioCorreoGeneral open={open} handleClose={handleClose} id_correo={id_correo} />
  </>
  );
};

export default CorreosElectronicos;
