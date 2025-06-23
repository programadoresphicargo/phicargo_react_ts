import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import { AccesoContext } from '../context';
import Box from '@mui/material/Box';
import { Button } from "@heroui/react";
import Dialog from '@mui/material/Dialog';
import { DialogContent } from '@mui/material';
import VehiculoForm from './vehiculoForm';
import odooApi from '@/api/odoo-api';

const RegistroVehiculos = ({ onClose }) => {
  const { AñadirVehiculo, formData } = useContext(AccesoContext);

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const NuevoVehiculo = () => {
    setOpen(true);
  };

  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/vehiculos_visitantes/');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const fetchDataVehiculo = async (id_vehiculo) => {
    try {
      setLoading(true);
      const response = await odooApi.get('/vehiculos_visitantes/' + id_vehiculo);
      setDataVehicle(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [dataVehicle, setDataVehicle] = useState({});

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id_vehiculo',
        header: 'ID Vehiculo',
      },
      {
        accessorKey: 'marca',
        header: 'Marca',
      },
      {
        accessorKey: 'modelo',
        header: 'Modelo',
      },
      {
        accessorKey: 'placas',
        header: 'Placas',
      },
      {
        accessorKey: 'color',
        header: 'Color',
      },
      {
        accessorKey: 'contenedor1',
        header: 'Contenedor 1',
      },
      {
        accessorKey: 'contenedor2',
        header: 'Contenedor 2',
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
    state: { isLoading: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    positionActionsColumn: 'last',
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
    enableRowActions: true,
    renderRowActions: ({ row }) => (
      <Box>
        <Button
          color="primary"
          size='sm'
          onPress={() => {
            AñadirVehiculo(row.original.id_vehiculo);
            onClose();
          }}>
          Seleccionar
        </Button>
      </Box >
    ),
    muiTableBodyRowProps: ({ row }) => ({
      onClick: ({ event }) => {
        if (row.subRows?.length) {
        } else {
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
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 250px)',
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
        <Button color='primary' onPress={NuevoVehiculo}>Nuevo vehiculo</Button>
      </Box>
    ),
  });

  return (<>

    <Dialog
      fullWidth="md"
      maxWidth="md"
      open={open}
      onClose={handleClose}
    >
      <DialogContent>
        <VehiculoForm onClose={handleClose}></VehiculoForm>
      </DialogContent>
    </Dialog>
    <MaterialReactTable table={table} />
  </>
  );

};

export default RegistroVehiculos;
