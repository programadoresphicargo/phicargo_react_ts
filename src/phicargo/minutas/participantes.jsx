import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';

import { Box } from '@mui/material';
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { Checkbox } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import odooApi from '@/api/odoo-api';
import MinutaForm from './form';
import AñadirParticipantes from './list_empleados';
import { useMinutas } from './context';
const { VITE_ODOO_API_URL } = import.meta.env;

const ParticipantesMinutas = ({ estado }) => {

  const [open, setOpen] = React.useState(false);
  const { selectedRows, setSelectedRows, isEditing, setIsEditing } = useMinutas();
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
      const response = await odooApi.get('/drivers/employees/');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'empleado',
        header: 'Empleado',
      },
      {
        accessorKey: 'puesto',
        header: 'Puesto',
      },
      {
        id: 'acciones',
        header: 'Acciones',
        Cell: ({ row }) => (
          <Button
            size='sm'
            isDisabled={!isEditing}
            color='danger'
            onPress={() => handleEliminar(row.original)}
            radius='full'
          >
            ❌ Eliminar
          </Button>
        ),
      },
    ],
    [isEditing]
  );

  const handleEliminar = (rowToDelete) => {
    const nuevos = selectedRows.filter((r) => r.empleado !== rowToDelete.empleado);
    setSelectedRows(nuevos);
  };

  const table = useMaterialReactTable({
    columns,
    data: selectedRows,
    getRowId: (row) => row.id,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { showProgressBars: isLoading2 },
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
        maxHeight: 'calc(100vh - 210px)',
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
        <AñadirParticipantes></AñadirParticipantes>
      </Box>
    ),
  });

  return (<>
    <div>
      <Card>
        <CardHeader
          style={{
            background: 'linear-gradient(90deg, #0b2149, #002887)',
            color: 'white',
            fontWeight: 'bold'
          }}>
          Participantes
        </CardHeader>
        <CardBody>
          <MaterialReactTable table={table} />
        </CardBody>
      </Card>
    </div >
  </>
  );

};

export default ParticipantesMinutas;
