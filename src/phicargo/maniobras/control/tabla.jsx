import React, { useState, useEffect, useMemo } from 'react';
import Formulariomaniobra from '../maniobras/formulario_maniobra';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { width } from '@mui/system';

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
      const response = await fetch('/phicargo/modulo_maniobras/control/tabla.php?estado_maniobra=' + estado_maniobra);
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

          let variant = 'secondary';
          let text = '';
          if (value === 'retiro') {
            variant = 'success';
            text = 'Retiro';
          } else if (value === 'ingreso') {
            variant = 'primary';
            text = 'Ingreso';
          } else if (value === 'local') {
            variant = 'danger';
            text = 'Local';
          } else {
            text = value;
          }

          return (
            <span className={`badge bg-${variant} rounded-pill`} style={{ width: '120px' }}>
              {text}
            </span>
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
      },
      {
        accessorKey: 'nombre_operador',
        header: 'Operador',
        size: 150,
      },
      {
        accessorKey: 'x_ejecutivo_viaje_bel',
        header: 'Ejecutivo',
        size: 150,
      },
      {
        accessorKey: 'ultimo_estatus',
        header: 'Ultimo estatus enviado',
        size: 150,
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return (
            <span className={`badge bg-success rounded-pill`} style={{ width: '120px' }}>
              {value}
            </span>
          );
        },
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
    state: { isLoading: isLoading2 },
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
