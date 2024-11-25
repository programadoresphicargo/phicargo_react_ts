import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Example2 from '../maniobras/modal';
import ManiobrasNavBar from '../Navbar';
import MonthSelector from '../../../mes';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { ThemeProvider } from '@mui/material/styles';
import customFontTheme from '../../../theme';
const { VITE_PHIDES_API_URL } = import.meta.env;

const CartasPorte = () => {

  const [selectedTab, setSelectedTab] = useState('carta');

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    fetchData(selectedMonth, newValue);
  };

  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [isLoading2, setLoading] = useState();

  const handleChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const [modalShow, setModalShow] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [x_reference, setXreferenceContent] = useState('');
  const [partner_id, setPartenerid] = useState('');

  const handleShowModal = (id_cp, x_reference, partner_id) => {
    setModalContent(id_cp);
    setXreferenceContent(x_reference);
    setModalShow(true);
    setPartenerid(partner_id);
  };

  const handleCloseModal = () => setModalShow(false);

  const [data, setData] = useState([]); // Estado para almacenar los datos

  const fetchData = async (month, selectedTab) => {
    if (!month || selectedTab === undefined) return;
    setLoading(true);
    try {

      const response = await fetch('/phicargo/modulo_maniobras/programacion/get_registros.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ month, selectedTab }), 
      });

      const jsonData = await response.json();
      console.log('Datos recibidos:', jsonData);
      setData(jsonData);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    } finally {
      setLoading(false); // Mueve esto aquí
    }
  };

  useEffect(() => {
    fetchData(selectedMonth, selectedTab);
  }, [selectedMonth, selectedTab]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'store_id',
        header: 'Sucursal',
        Cell: ({ cell }) => {
          const partnerData = cell.getValue();
          return partnerData[1];
        }
      },
      {
        accessorKey: 'date_order',
        header: 'Fecha',
        size: 150,
      },
      {
        accessorKey: 'name',
        header: 'Carta porte',
      },
      {
        accessorKey: 'partner_id',
        header: 'Cliente',
        Cell: ({ cell }) => {
          const partnerData = cell.getValue();
          return partnerData[1];
        }
      },
      {
        accessorKey: 'x_ejecutivo_viaje_bel',
        header: 'Ejecutivo de viaje',
        size: 150,
      },
      {
        accessorKey: 'x_reference',
        header: 'Contenedor',
        size: 150,
      },
      {
        accessorKey: 'x_status_bel',
        header: 'Estatus',
        size: 150,
        Cell: ({ cell }) => {
          const value = cell.getValue();

          let variant = 'secondary';
          let text = '';
          if (value === 'Ing') {
            variant = 'success';
            text = 'Ingresado';
          } else if (value === 'P') {
            variant = 'primary';
            text = 'Patio';
          } else if (value === 'local') {
            variant = 'danger';
            text = 'Local';
          } else {
            variant = 'danger';
            text = value;
          }

          return (
            <span className={`badge bg-${variant} rounded-pill`} style={{ width: '100px' }}>
              {text}
            </span>
          );
        },
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: false,
    enableFilters: true,
    initialState: {
      showColumnFilters: true,
      grouping: ['store_id'],
      density: 'compact',
      pagination: { pageSize: 80 },
      showGlobalFilter: false,
    },
    state: { isLoading: isLoading2 },
    muiCircularProgressProps: {
      color: 'primary',
      thickness: 5,
      size: 45,
    },
    muiSkeletonProps: {
      animation: 'pulse',
      height: 28,
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        if (row.subRows?.length) {
        } else {
          handleShowModal(row.original.id, row.original.x_reference, row.original.partner_id[0]);
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
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row.subRows?.length ? '#1184e8' : '#FFFFFF',
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
        color: row.subRows?.length ? '#FFFFFF' : '#000000',
      },
    }),
  });

  return (
    <div>
      <h1>Maniobras</h1>
      <ManiobrasNavBar />
      <Box display="flex" alignItems="center" m={2}>
        <Box sx={{ flexGrow: 1, mr: 2 }}>
          <MonthSelector
            selectedMonth={selectedMonth}
            handleChange={handleChange}
          />
        </Box>
        <Box sx={{ flexGrow: 1, mr: 2 }}>
          <Tabs value={selectedTab} onChange={handleTabChange} aria-label="Tabs">
            <Tab value="carta" label="Carta porte" />
            <Tab value="solicitud" label="Solicitudes de transporte" />
          </Tabs>
        </Box>
      </Box>
      <Example2
        show={modalShow}
        handleClose={handleCloseModal}
        id_cp={modalContent}
        x_reference={x_reference}
        id_cliente={partner_id} />
      <ThemeProvider theme={customFontTheme}>
        {/* Agrega una key basada en selectedTab para forzar la reconstrucción */}
        <MaterialReactTable key={selectedTab} table={table} />
      </ThemeProvider>
    </div >
  );
};

export default CartasPorte;
