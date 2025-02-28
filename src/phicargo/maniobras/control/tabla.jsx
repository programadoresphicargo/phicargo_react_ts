import React, { useState, useEffect, useMemo } from 'react';
import Formulariomaniobra from '../maniobras/formulario_maniobra';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Box } from '@mui/material';
import { Chip, Button } from "@heroui/react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { width } from '@mui/system';
import EstatusDropdownManiobra from '../reportes_estatus/resumen_estatus';
const { VITE_PHIDES_API_URL } = import.meta.env;

const Maniobras = ({ estado_maniobra }) => {

  const [grouping, setGrouping] = useState([]);

  useEffect(() => {
    console.log('Agrupación actual:', grouping);
    // Aquí puedes realizar cualquier acción adicional cuando cambia la agrupación
  }, [grouping]);

  const handleGroupChange = (event) => {
    const value = event.target.value;
    setGrouping(value); // value es un array de strings
  };

  const [data, setData] = useState([]);

  const [isLoading2, setLoading] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [id_maniobra, setIdmaniobra] = useState('');
  const [id_cp, setIdcp] = useState('');
  const [idCliente, setClienteID] = useState('');

  const handleShowModal = (id_maniobra, id_cp) => {
    setModalShow(true);
    setIdmaniobra(id_maniobra);
    setIdcp(id_cp);
  };

  const handleCloseModal = () => {
    setModalShow(false);
    fetchData();
  };


  const fetchData = async () => {

    try {
      setLoading(true);
      const response = await fetch(VITE_PHIDES_API_URL + '/modulo_maniobras/control/tabla.php?estado_maniobra=' + estado_maniobra);
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
        accessorKey: 'id_maniobra',
        header: 'ID Maniobra',
        size: 50,
      },
      {
        accessorKey: 'sucursal',
        header: 'Sucursal',
      },
      {
        accessorKey: 'inicio_programado',
        header: 'Inicio programado',
        size: 150,
        Cell: ({ cell }) => {
          const rawDate = cell.getValue();
          const date = new Date(rawDate);

          if (isNaN(date.getTime())) {
            return "Fecha no válida";
          }

          const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          };

          const formattedDate = date.toLocaleString('es-ES', options);
          return formattedDate;
        },
      },
      {
        accessorKey: 'tipo_maniobra',
        header: 'Tipo de maniobra',
        Cell: ({ cell }) => {
          const value = cell.getValue();

          let variant = 'default';
          if (value === 'retiro') {
            variant = 'success';
          } else if (value === 'ingreso') {
            variant = 'primary';
          } else if (value === 'local') {
            variant = 'danger';
          }

          return (
            <Chip color={variant} className="text-white">
              {value}
            </Chip>
          );
        },

      },
      {
        accessorKey: 'terminal',
        header: 'Terminal',
      },
      {
        accessorKey: 'unidad',
        header: 'Unidad',
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return (
            <Chip color='primary'>
              {value}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'nombre_operador',
        header: 'Operador',
        size: 150,
      },
      {
        accessorKey: 'ultimo_estatus',
        header: 'Último estatus enviado',
        size: 300,
        Cell: ({ cell }) => (
          <EstatusDropdownManiobra
            id_maniobra={cell.row.original.id_maniobra}
            ultimo_estatus={cell.getValue() || ''}
          />
        ),
      },
      {
        accessorKey: 'fecha_activacion',
        header: 'Fecha de inicio',
        size: 150,
      },
      {
        accessorKey: 'fecha_finalizada',
        header: 'Fecha finalizada',
        size: 150,
      },
      {
        accessorKey: 'x_ejecutivo_viaje_bel',
        header: 'Ejecutivo',
        size: 150,
      },
      {
        accessorKey: 'cartas_porte',
        header: 'Cartas porte',
        size: 150,
      },
      {
        accessorKey: 'contenedores_ids',
        header: 'Contenedor',
        size: 150,
      },
      {
        accessorKey: 'nombre_cliente',
        header: 'Cliente',
        size: 150,
      },
    ],
    [],
  );

  const manualGrouping = ['nombre_operador'];

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { showProgressBars: isLoading2 },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    grouping: manualGrouping,
    initialState: {
      density: 'compact',
      showColumnFilters: true,
      pagination: { pageSize: 80 },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 240px)',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: ({ event }) => {

        if (row.subRows?.length) {
        } else {
          handleShowModal(row.original.id_maniobra, row.original.id);
          setClienteID(row.original.id_cliente);
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

    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          alignItems: 'center',
        }}
      >
        <Button color="primary" size='sm' isLoading={isLoading2} onPress={() => fetchData()}>Refrescar</Button>
      </Box >
    ),
  });

  return (
    <div>
      <Formulariomaniobra
        show={modalShow}
        handleClose={handleCloseModal}
        id_maniobra={id_maniobra}
        id_cp={id_cp}
        id_cliente={idCliente}
        form_deshabilitado={true}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="table-striped">
          <MaterialReactTable table={table} />
        </div>
      </LocalizationProvider>
    </div >
  );

};

export default Maniobras;
