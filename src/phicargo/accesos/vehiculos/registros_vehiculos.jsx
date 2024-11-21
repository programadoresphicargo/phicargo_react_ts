import React, { useState, useEffect, useContext, useMemo } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import VehiculoForm from './vehiculoForm';
import Box from '@mui/material/Box';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { DialogContent } from '@mui/material';
import { AccesoContext } from '../context';


const RegistroVehiculos = ({ onClose }) => {
  const { AñadirVehiculo } = useContext(AccesoContext);

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
      const response = await fetch('/phicargo/accesos/vehiculos/getVehiculos.php');
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
        <Button onClick={() => {
          AñadirVehiculo(row.original.id_vehiculo);
          onClose();
        }} variant="contained">
          Añadir
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

      <button className="btn btn-success" onClick={NuevoVehiculo}>Nuevo vehiculo</button>
      <MaterialReactTable table={table} />
  </>
  );

};

export default RegistroVehiculos;
