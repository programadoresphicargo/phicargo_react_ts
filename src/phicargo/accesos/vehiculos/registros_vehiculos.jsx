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
import { MRT_Localization_ES } from 'material-react-table/locales/es';

const RegistroVehiculos = ({ onClose }) => {
  const { AñadirVehiculo, formData } = useContext(AccesoContext);

  const [open, setOpen] = React.useState(false);
  const [VehicleID, setVehicleID] = React.useState(0);

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const NuevoVehiculo = () => {
    setOpen(true);
    setVehicleID(null);
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

  useEffect(() => {
    fetchData();
  }, []);

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
      {
        accessorKey: 'nombre',
        header: 'Registro',
      },
      {
        accessorKey: 'fecha_creacion',
        header: 'Fecha',
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
        <Button
          color="secondary"
          size='sm'
          onPress={() => {
            NuevoVehiculo();
            setVehicleID(row.original.id_vehiculo);
          }}>
          Editar
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
        <h2
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Registro de vehículos
        </h2>
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
        <VehiculoForm onClose={handleClose} id_vehiculo={VehicleID}></VehiculoForm>
      </DialogContent>
    </Dialog>
    <MaterialReactTable table={table} />
  </>
  );

};

export default RegistroVehiculos;
